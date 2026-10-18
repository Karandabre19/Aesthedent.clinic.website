import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { buildContentManifest } from '../scripts/content-sync-lib.mjs';
const require = createRequire(import.meta.url);
const { parse, evaluate } = require('groq-js');
const { presentationPageNames, presentationSpecs } = require('../sanity/lib/presentation-definitions.ts');
const { resolvePresentationPage } = require('../sanity/lib/presentation-mapping.ts');
const { navigationDefaults, publicRoutes } = require('../sanity/lib/navigation-data.ts');
const { resolveNavigation } = require('../sanity/lib/navigation-mapping.ts');
const { resolveSeoInventory, resolveSeoMetadata, canonicalProblem } = require('../sanity/lib/seo-mapping.ts');
const { schemaTypes } = require('../sanity/schemaTypes/index.ts');
const { clinicAvailability } = require('../sanity/schemaTypes/clinic-availability.ts');
const { availabilityContent, availabilitySnapshot, resolveAvailability } = require('../sanity/lib/availability-mapping.ts');
const { availabilityClosuresJsonLd, formatAvailability, getAvailabilityStatus } = require('../lib/clinic-availability.ts');
const manifest = buildContentManifest();
function execute(file, dependencies = {}) {
  const filename = new URL('../' + file, import.meta.url), localRequire = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)(id => id === 'server-only' ? {} : dependencies[id] ?? localRequire(id), exports);
  return exports;
}
const { presentationPageQuery } = execute('sanity/lib/presentation-pages.ts', { './content-reader': {} });
const { navigationQuery } = execute('sanity/lib/navigation.ts', { './content-reader': {}, './services': { getServices: async () => [] } });
const { seoQuery } = execute('sanity/lib/seo.ts', { './content-reader': {}, './insights': {}, 'next/headers': {} });
const groq = async (query, dataset, params = {}) => (await evaluate(parse(query), { dataset, params })).get();

test('actual Services page initializes its icon map and renders every existing treatment', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server'), { JSDOM } = require('jsdom');
  const { services } = require('../lib/services.js');
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const { default: ServicesPage } = execute('app/services/ServicesClient.js', {
    '@/components/insights/EditorialImage': wrapper,
    '@/components/ui/button': { Button: wrapper },
    '@/components/layout/PageWrapper': wrapper,
    '@/components/ui/SectionHeading': wrapper,
    '@/components/ui/AnimatedSection': wrapper,
    '@/lib/services': { services },
  });
  const document = new JSDOM(renderToStaticMarkup(React.createElement(ServicesPage))).window.document;
  for (const service of services) assert.ok([...document.querySelectorAll('button')].some(button => button.textContent.includes(service.title)), service.slug);
  assert.ok(document.querySelector('svg.lucide'), 'treatment icons remain rendered');
});

test('production Tailwind scanning retains the TypeScript intake form accessibility and mobile layout utilities', async () => {
  const postcss = require('postcss'), tailwind = require('tailwindcss');
  const { css } = await postcss([tailwind(require('../tailwind.config.js'))]).process('@tailwind utilities;', { from: undefined });
  assert.match(css, /\.sr-only\s*\{[^}]*position:\s*absolute/s);
  assert.match(css, /\.flex-col-reverse\s*\{[^}]*flex-direction:\s*column-reverse/s);
});

test('five fixed presentation documents cover every declared field, query and independent section fallback', async () => {
  for (const name of presentationPageNames) {
    const candidate = manifest.documents.find(d => d.identity === name).content, doc = { ...candidate, _id: name };
    const result = await groq(presentationPageQuery, [doc, { ...doc, _id: 'drafts.' + name }, { ...doc, _id: 'versions.release.' + name }], { name });
    const mapped = resolvePresentationPage(result, name); assert.equal(mapped.status, 'sanity');
    for (const section of presentationSpecs(name)) for (const key of Object.keys(section.fields)) assert.equal(mapped.value[section.name][key], candidate[section.name][key], `${name}.${section.name}.${key}`);
    assert.deepEqual(resolvePresentationPage([], name).value, {});
    for (const invalid of [null, [doc, doc], [{ ...doc, _id: 'drafts.' + name }], [{ ...doc, _id: 'other' }]]) assert.deepEqual(resolvePresentationPage(invalid, name).value, {});
    const bad = { ...doc, hero: { heading: '<script>bad</script>' } };
    assert.equal(resolvePresentationPage([bad], name).value.hero, undefined);
    assert.equal(resolvePresentationPage([bad], name).value.closing.heading, doc.closing.heading);
    assert.ok(schemaTypes.find(t => t.name === name));
  }
});

test('navigation preserves fixed identities, supports order/visibility/routes, and rejects ambiguous or empty menus', async () => {
  const doc = { _id: 'navigation', _type: 'navigation', ...structuredClone(navigationDefaults) };
  assert.deepEqual(resolveNavigation(await groq(navigationQuery, [doc, { ...doc, _id: 'drafts.navigation' }])).value, navigationDefaults);
  const changed = structuredClone(doc); changed.header.reverse(); changed.header[0].label = 'Reach us'; changed.header[0].visible = false;
  changed.footerQuick[0].route = '/insights';
  const mapped = resolveNavigation([changed]); assert.equal(mapped.status, 'sanity'); assert.equal(mapped.value.header[0].label, 'Reach us'); assert.equal(mapped.value.header[0].visible, false); assert.equal(mapped.value.footerQuick[0].route, '/insights');
  const mutations = [d => d.header.pop(), d => d.header.forEach(i => i.visible = false), d => d.header[0].route = 'https://evil.example', d => d.treatments[0].route = '/about', d => d.header[0].key = d.header[1].key, d => d.footerQuick[1].route = d.footerQuick[0].route];
  for (const mutate of mutations) { const invalid = structuredClone(doc); mutate(invalid); assert.equal(resolveNavigation([invalid]).status, 'invalid'); assert.deepEqual(resolveNavigation([invalid]).value, navigationDefaults); }
  assert.deepEqual(resolveNavigation([]).value, navigationDefaults); assert.deepEqual(resolveNavigation([doc, doc]).value, navigationDefaults);
});

test('complete route metadata uses self canonical, complete social fields/images and keeps nofollow in sitemap', () => {
  for (const route of publicRoutes) {
    const result = resolveSeoMetadata(route, { title: 'Existing route title', description: 'Existing description' });
    assert.equal(result.metadata.alternates.canonical, route); assert.equal(result.metadata.openGraph.url, 'https://www.aesthedentpune.com' + route);
    assert.ok(result.metadata.openGraph.images); if (route !== '/') assert.match(result.metadata.twitter.title, /Existing route title/); else assert.ok(result.metadata.twitter.title); assert.equal(result.indexable, true);
    const nofollow = resolveSeoMetadata(route, {}, {}, { follow: false, visibilityReason: 'Local fixture only' });
    assert.equal(nofollow.indexable, true); assert.equal(nofollow.metadata.robots.follow, false);
    const noindex = resolveSeoMetadata(route, {}, {}, { index: false, visibilityReason: 'Local fixture only' });
    assert.equal(noindex.indexable, false); assert.equal(noindex.metadata.robots.index, false);
  }
});

test('canonical route picker rejects external, chained, cyclic and nonindexable targets without losing page content', () => {
  const cross = { canonicalRoute: '/about', visibilityReason: 'Local duplicate-content fixture' };
  assert.equal(canonicalProblem('/contact', cross, {}), undefined);
  assert.equal(resolveSeoMetadata('/contact', {}, {}, cross).indexable, false);
  assert.ok(canonicalProblem('/contact', cross, { '/about': { index: false } }));
  assert.ok(canonicalProblem('/contact', cross, { '/about': { canonicalRoute: '/doctor' } }));
  assert.ok(canonicalProblem('/contact', cross, { '/about': { canonicalRoute: '/contact' } }));
  assert.ok(canonicalProblem('/contact', { ...cross, index: false }));
  assert.ok(canonicalProblem('/contact', { canonicalRoute: '/about' }));
  assert.ok(canonicalProblem('/contact', { canonicalRoute: 'https://evil.example' }));
  const cycle = resolveSeoInventory([{ _id: 'aboutPage', _type: 'aboutPage', seo: { canonicalRoute: '/contact', visibilityReason: 'Local fixture' } }, { _id: 'contactPage', _type: 'contactPage', seo: cross }]);
  assert.deepEqual(cycle.value.pages, {});
  const fallback = resolveSeoMetadata('/contact', { title: 'Original page' }, {}, cross, { '/about': { index: false } });
  assert.equal(fallback.metadata.title, 'Original page'); assert.equal(fallback.metadata.alternates.canonical, '/contact');
});

test('SEO inventory filters drafts, duplicates, invalid controls and shared visibility; actual GROQ dereferences native media', async () => {
  const doc = { _id: 'contactPage', _type: 'contactPage', seo: { metaTitle: 'Contact override', ogTitle: 'Sharing title', structuredData: false } };
  const data = await groq(seoQuery, [doc, { ...doc, _id: 'drafts.contactPage' }, { _id: 'seoSettings', _type: 'seoSettings', defaults: { metaTitle: 'Shared default', index: false, follow: false, visibilityReason: 'Ignore unsafe shared visibility' } }]);
  const state = resolveSeoInventory(data).value; assert.equal(state.defaults.index, undefined); assert.equal(state.defaults.follow, undefined);
  const mapped = resolveSeoMetadata('/contact', { title: 'Original', description: 'Route description' }, state.defaults, state.pages['/contact']);
  assert.equal(mapped.metadata.title, 'Contact override'); assert.equal(mapped.metadata.openGraph.title, 'Sharing title'); assert.equal(mapped.structuredData, false); assert.equal(mapped.metadata.description, 'Route description');
  assert.equal(resolveSeoInventory([doc, doc]).status, 'ambiguous');
  assert.deepEqual(resolveSeoInventory([{ ...doc, seo: { canonicalRoute: 'https://elsewhere.example' } }]).value.pages['/contact'], {});
  const home = resolveSeoMetadata('/', {}, { metaTitle: 'Default title', metaDescription: 'Default description', ogTitle: 'Default OG', twitterTitle: 'Default Twitter' });
  assert.deepEqual(home.metadata.title, { absolute: 'Default title' }); assert.equal(home.metadata.openGraph.title, 'Default OG'); assert.equal(home.metadata.twitter.title, 'Default Twitter');
});

test('authenticated draft reads are server-only/no-store, public reads retain ISR, sitemap can force published perspective', async () => {
  const old = { ...process.env }; let preview = true, calls = [], config;
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'; process.env.SANITY_API_READ_TOKEN = 'LOCAL-TEST-ONLY';
    const sdk = options => ({ withConfig: next => sdk({ ...options, ...next }), fetch: async (query, params, options2) => { calls.push({ ...options, options: options2 }); return []; } });
    const client = execute('sanity/lib/client.ts', { 'next/headers': { draftMode: async () => ({ isEnabled: preview }) }, 'next-sanity': { createClient: options => { config = options; return sdk(options); } } });
    const reader = execute('sanity/lib/content-reader.ts', { './client': client });
    const resolve = input => ({ value: input, status: 'missing' });
    await reader.readPublishedContent('query', {}, 'fixture', resolve); assert.equal(calls.at(-1).perspective, 'drafts'); assert.equal(calls.at(-1).token, 'LOCAL-TEST-ONLY'); assert.deepEqual(calls.at(-1).options, { cache: 'no-store' });
    await reader.readPublishedContent('query', {}, 'fixture', resolve, true); assert.equal(calls.at(-1).perspective, 'published'); assert.equal(calls.at(-1).token, undefined); assert.equal(calls.at(-1).options.next.revalidate, 60);
    preview = false; await reader.readPublishedContent('query', {}, 'fixture', resolve); assert.equal(config.token, undefined); assert.equal(calls.at(-1).perspective, 'published');
    delete process.env.SANITY_API_READ_TOKEN; preview = true; assert.equal((await client.getContentClient()).client, null);
  } finally { for (const key of Object.keys(process.env)) if (!(key in old)) delete process.env[key]; Object.assign(process.env, old); }
});

test('preview enable fails closed before configuration, validates secret through installed API, and exit requires same origin', async () => {
  const original = process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED, token = process.env.SANITY_API_READ_TOKEN;
  let validated = false, enabled = false, disabled = false;
  try {
    const handler = execute('app/api/draft-mode/enable/route.ts', { '../../../../sanity/lib/client': { getSanityClient: () => ({ withConfig: () => ({}) }) }, 'next-sanity/draft-mode': { defineEnableDraftMode: () => ({ GET: async () => { validated = true; return new Response('invalid secret', { status: 401 }); } }) } });
    delete process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED; assert.equal((await handler.GET(new Request('http://localhost/api/draft-mode/enable'))).status, 503); assert.equal(validated, false);
    process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED = 'true'; process.env.SANITY_API_READ_TOKEN = 'LOCAL-TEST-ONLY'; assert.equal((await handler.GET(new Request('http://localhost/api/draft-mode/enable'))).status, 401); assert.equal(validated, true); assert.equal(enabled, false);
    const exit = execute('app/api/draft-mode/disable/route.ts', { 'next/headers': { draftMode: async () => ({ disable: () => { disabled = true; } }) } });
    assert.equal((await exit.POST(new Request('http://localhost/api/draft-mode/disable', { method: 'POST', headers: { origin: 'https://elsewhere.example' } }))).status, 403); assert.equal(disabled, false);
    assert.equal((await exit.POST(new Request('http://localhost/api/draft-mode/disable', { method: 'POST', headers: { origin: 'http://localhost' } }))).status, 303); assert.equal(disabled, true);
  } finally { if (original === undefined) delete process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED; else process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED = original; if (token === undefined) delete process.env.SANITY_API_READ_TOKEN; else process.env.SANITY_API_READ_TOKEN = token; }
});


test('absolute route titles retain Next template semantics when CMS overrides are absent', () => {
  const base = { title: { absolute: 'Experience | Aesthedent' }, description: 'Existing description' };
  const result = resolveSeoMetadata('/aesthedent-experience', base);
  assert.deepEqual(result.metadata.title, base.title);
  assert.equal(result.metadata.openGraph.title, 'Experience | Aesthedent');
});

test('actual desktop header and footer render approved menu changes while operational destinations remain fixed', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server'), { JSDOM } = require('jsdom');
  const changed = structuredClone(navigationDefaults); changed.header.find(i => i.key === 'about').label = 'Clinic story'; changed.header.reverse(); changed.header.find(i => i.key === 'insights').visible = false;
  changed.footerQuick[0].label = 'Start here'; changed.footerQuick[0].route = '/insights'; changed.footerQuick.reverse();
  let availability = null;
  const dependencies = { './NavigationProvider': { useNavigation: () => changed }, 'next/navigation': { usePathname: () => '/about' }, '@/lib/services': require('../lib/services.js'), '@/components/layout/ClinicAvailabilityProvider': { useClinicAvailability: () => availability }, '@/lib/clinic-availability': require('../lib/clinic-availability.ts') };
  const Header = execute('components/layout/Navbar.js', dependencies).default, Footer = execute('components/layout/Footer.js', dependencies).default;
  const render = Component => new JSDOM(renderToStaticMarkup(React.createElement(Component))).window.document;
  const header = render(Header), footer = render(Footer);
  const links = d => [...d.querySelectorAll('a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  assert.ok(links(header).some(a => a.text === 'Clinic story' && a.href === '/about'));
  assert.ok(!links(header).some(a => a.text === 'Insights'));
  assert.ok(links(footer).some(a => a.text === 'Start here' && a.href === '/insights'));
  for (const d of [header, footer]) { assert.ok(links(d).some(a => a.href === 'tel:+919309816336')); assert.ok(links(d).some(a => a.href?.startsWith('https://api.whatsapp.com/send?phone=919309816336'))); }
  availability = resolveAvailability([hoursFixture()]).value;
  assert.ok(render(Footer).body.textContent.includes(formatAvailability(availability)), 'the real footer consumes the mapped published schedule');
});

test('actual treatment metadata handler consumes advanced SEO while retaining the existing title and copy', async () => {
  const { services } = require('../lib/services.js'); const service = services[0]; let seen;
  const module = execute('app/services/[slug]/page.js', {
    '@/sanity/lib/seo': { getPageSeo: async (route, base) => { seen = { route, base }; return resolveSeoMetadata(route, base, {}, { ogTitle: 'Local sharing fixture', follow: false, visibilityReason: 'Local fixture only' }); } },
    '@/sanity/lib/presentation-pages': {}, 'next/navigation': {}, '@/lib/services': require('../lib/services.js'), '@/components/seo/JsonLd': {}, '@/lib/schema': require('../lib/schema.js'), '@/sanity/lib/services': { getServices: async () => services }, './ServiceDetailClient': {},
  });
  const metadata = await module.generateMetadata({ params: Promise.resolve({ slug: service.slug }) });
  assert.equal(seen.route, '/services/' + service.slug); assert.equal(metadata.title, `${service.title} in ${service.locality}`);
  assert.equal(metadata.description, service.shortDesc); assert.equal(metadata.openGraph.title, 'Local sharing fixture'); assert.ok(metadata.openGraph.images); assert.equal(metadata.robots.follow, false);
});

test('presentation page fields show explicit Studio labels and the text an empty field keeps', () => {
  const { createSchema } = require('sanity');
  const { presentationDefaults } = require('../sanity/lib/presentation-definitions.ts');
  const compiled = createSchema({ name: 'labels', types: schemaTypes });
  const evidence = Object.fromEntries(manifest.fieldEvidence.map(e => [`${e.document}.${e.path}`, e.value]));
  const descriptions = new Set();

  for (const name of presentationPageNames) for (const section of presentationSpecs(name)) for (const [key, spec] of Object.entries(section.fields)) {
    const field = compiled.get(name).fields.find(f => f.name === section.name).type.fields.find(f => f.name === key);
    const id = `${name}.${section.name}.${key}`, current = presentationDefaults[id];

    assert.equal(field.type.title ?? field.title, spec.title, id);
    assert.doesNotMatch(spec.title, /^(Heading|Intro|Eyebrow|[A-Z][a-z]+ Label)$/, id);
    assert.ok(current && evidence[id]?.startsWith(current.replace(/…$/, '')), `${id} default matches the website source`);
    assert.ok((field.type.description ?? field.description).includes(current), id);
    descriptions.add(spec.description);
  }
  assert.equal(descriptions.size, Object.keys(presentationDefaults).length, 'every field has its own description');
});

function hoursFixture() {
  const doc = { ...clinicAvailability.initialValue(), _id: 'clinicAvailability', _type: 'clinicAvailability',  confirmationNote: 'Test-only clinic confirmation fixture', confirmedAt: '2026-10-18T06:00:00.000Z' }
  doc.confirmedSnapshot = availabilitySnapshot(doc)
  return doc
}

test('hours form prefills all seven current website days without approval or invented confirmation', () => {
  assert.equal(schemaTypes.find(type => type.name === 'clinicAvailability').components?.input, undefined, 'hours form uses the standard editor without the unrelated page-content notice')
  assert.equal(typeof schemaTypes.find(type => type.name === 'homePage').components?.input, 'function', 'other content forms keep their existing editorial notice')
  const initial = clinicAvailability.initialValue()
  assert.equal(initial.weeklyHours.length, 7)
  assert.ok(initial.weeklyHours.every(row => row._type === 'clinicAvailabilityDay' && row._key === row.day), 'native Sanity array members carry their declared type and stable keys')
  assert.equal(initial.weeklyHours.find(row => row.day === 'mon').close, '20:00')
  assert.equal(initial.weeklyHours.find(row => row.day === 'wed').closed, true)
  assert.equal(initial.confirmedAt, undefined)
  assert.equal(initial.confirmedSnapshot, undefined)
  assert.equal(availabilitySnapshot(initial), null)
})

test('availability validates clock ranges, dates, weekday identity and renewed confirmation', () => {
  const doc = hoursFixture()
  assert.equal(resolveAvailability([doc]).status, 'sanity')
  for (const input of [null, [], [doc, doc], [{ ...doc, _id: 'drafts.clinicAvailability' }], [{ ...doc, _id: 'versions.release.clinicAvailability' }], [{ ...doc, timezone: 'UTC' }], [{ ...doc, confirmedAt: null }], [{ ...doc, confirmedSnapshot: 'stale' }]]) assert.equal(resolveAvailability(input).value, null)
  for (const mutate of [
    value => { value.weeklyHours[0].open = '24:00' },
    value => { value.weeklyHours[0].close = value.weeklyHours[0].open },
    value => { value.weeklyHours[0].close = '09:00' },
    value => { value.weeklyHours[1].day = value.weeklyHours[0].day },
    value => { value.weeklyHours.pop() },
    value => { value.weeklyHours.forEach(row => row.closed = true) },
    value => { value.closures = [{ date: '2026-02-30', reason: 'Invalid date fixture' }] },
    value => { value.closures = [{ date: '2026-10-20', reason: 'One' }, { date: '2026-10-20', reason: 'Duplicate' }] },
  ]) {
    const invalid = structuredClone(doc); mutate(invalid)
    assert.equal(availabilityContent.safeParse(invalid).success, false)
    assert.equal(resolveAvailability([invalid]).value, null)
  }
  const changed = structuredClone(doc); changed.weeklyHours[0].close = '17:00'
  assert.equal(resolveAvailability([changed]).value, null, 'old confirmation never approves edited hours')
  changed.confirmedSnapshot = availabilitySnapshot(changed)
  assert.equal(resolveAvailability([changed]).status, 'sanity')
})

test('open indicator uses IST boundaries, weekly closures and extended holidays from the same schedule', () => {
  const doc = hoursFixture(), schedule = resolveAvailability([doc]).value
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T04:29:59Z'), schedule).state, 'closed_today')
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T04:30:00Z'), schedule).state, 'open')
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T14:30:00Z'), schedule).state, 'closed_today')
  assert.equal(getAvailabilityStatus(new Date('2026-10-21T06:00:00Z'), schedule).state, 'closed_weekly')
  schedule.holidays = Array.from({ length: 14 }, (_, i) => ({ date: new Date(Date.UTC(2026, 9, 19 + i)).toISOString().slice(0, 10), name: 'Test closure' }))
  const holiday = getAvailabilityStatus(new Date('2026-10-19T06:00:00Z'), schedule)
  assert.equal(holiday.state, 'holiday')
  assert.equal(holiday.nextOpenDisplay, 'Monday at 10:00 AM')
  assert.equal(availabilityClosuresJsonLd(schedule).length, 14)
  assert.notEqual(formatAvailability(schedule, 'mr'), formatAvailability(schedule, 'en'))
  const previous = process.env.TZ
  try {
    for (const zone of ['UTC', 'America/New_York', 'Pacific/Honolulu']) {
      process.env.TZ = zone
      assert.equal(getAvailabilityStatus(new Date('2026-10-19T06:00:00Z'), { ...schedule, holidays: [] }).state, 'open')
    }
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous }
})

test('actual availability reader projects published hours only and maps one confirmed singleton', async () => {
  const doc = hoursFixture(); let seen
  const reader = execute('sanity/lib/availability.ts', {
    './content-reader': { readPublishedContent: async (query, params, tag, resolve, publishedOnly) => {
      seen = { params, tag, publishedOnly }
      return resolve(await groq(query, [doc, { ...doc, _id: 'drafts.clinicAvailability' }, { ...doc, _id: 'versions.release.clinicAvailability' }])).value
    } },
  });
  const schedule = await reader.getClinicAvailability()
  assert.ok(schedule)
  assert.deepEqual(seen, { params: {}, tag: 'clinicAvailability', publishedOnly: true })
  const { buildClinicSchema } = require('../lib/schema.js')
  assert.equal(buildClinicSchema({ availability: schedule }).openingHoursSpecification[0].closes, '20:00')
  assert.equal(buildClinicSchema().openingHoursSpecification[0].closes, '20:00')
  const { createSchema } = require('sanity'), schema = createSchema({ name: 'availability-validation', types: schemaTypes })
  assert.deepEqual(schema._validation, [])
  const type = schema.get('clinicAvailability')
  const validate = async value => (await Promise.all(type.validation.map(rule => rule.validate(value, { document: value, parent: value, path: [], type, schema, i18n: { t: key => key } })))).flat()
  assert.deepEqual(await validate(doc), [])
  const changed = structuredClone(doc); changed.weeklyHours[0].close = '17:00'
  assert.ok((await validate(changed)).length > 0)
})
