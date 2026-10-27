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
const teamValuesModel = require('../sanity/lib/team-values.ts');
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

test('Team Values initializes only missing documents, prefers saved headings and stops on source-read failures', async () => {
  const { initialTeamValues, teamValuesDefaults } = teamValuesModel;
  const init = records => initialTeamValues({ fetch: async () => records });
  assert.deepEqual((await init([])).cards.map(card => card.icon), ['heart', 'users', 'award']);
  const published = { _id: 'teamPage', _type: 'teamPage', values: { heading: 'Published heading' } };
  const draft = { ...published, _id: 'drafts.teamPage', values: { heading: 'Saved draft heading', eyebrow: '', intro: '' } };
  const seeded = await init([published, draft]);
  assert.equal(seeded.heading, draft.values.heading); assert.equal(seeded.eyebrow, '');
  assert.equal(seeded.cards.length, 3); assert.equal(seeded.cards[0]._type, 'teamValueCard');
  assert.equal((await init([published])).heading, published.values.heading);
  assert.deepEqual(await init([{ _id: 'drafts.teamValues', _type: 'teamValues' }, draft]), {});
  assert.deepEqual(await init([{ _id: 'teamValues', _type: 'teamValues' }]), {});
  await assert.rejects(initialTeamValues({ fetch: async () => { throw Error('offline'); } }));
  await assert.rejects(init(null)); await assert.rejects(init([{ ...draft, values: { heading: 123 } }]));
  assert.equal((await init([{ ...published, values: {} }])).heading, '', 'a saved empty source is not replaced by defaults');
  const proposal = manifest.documents.find(doc => doc.identity === 'teamValues');
  assert.deepEqual(proposal.content.cards.map(card => card.title), teamValuesDefaults.cards.map(card => card.title));
  assert.equal(proposal.reviewRequired, true);
  assert.equal(manifest.documents.find(doc => doc.identity === 'teamPage').content.values, undefined);
});

test('Team Values native validation attaches requirements to keyed inputs and allows an intentionally empty section', async () => {
  const { createSchema, defaultTemplatesForSchema } = require('sanity');
  const { validateDocumentWithWorkspace } = require('@sanity/validation');
  const compiled = createSchema({ name: 'team-values', types: schemaTypes });
  assert.deepEqual(compiled._validation, []);
  assert(defaultTemplatesForSchema(compiled).some(template => template.id === 'teamValues'));
  const validate = async document => (await validateDocumentWithWorkspace({ document, workspace: { schema: compiled, getClient: () => { throw Error('Unexpected network access'); } }, environment: 'studio', getDocumentExists: async () => false })).filter(marker => marker.level === 'error');
  const doc = { _id: 'drafts.teamValues', _type: 'teamValues', ...await teamValuesModel.initialTeamValues({ fetch: async () => [] }) };
  assert.deepEqual(await validate(doc), []);
  const bad = structuredClone(doc); bad.heading = ''; bad.cards[1].title = ''; bad.cards[1].description = ''; bad.cards[1].icon = 'unknown';
  let errors = await validate(bad);
  for (const field of ['title', 'description', 'icon']) assert.equal(errors.filter(marker => JSON.stringify(marker.path) === JSON.stringify(['cards', { _key: bad.cards[1]._key }, field])).length, 1, field);
  assert(errors.some(marker => marker.path[0] === 'heading'));
  bad.cards.reverse(); errors = await validate(bad);
  assert(errors.some(marker => marker.path[1]?._key === 'specialist-planning' && marker.path[2] === 'icon'));
  assert.deepEqual(await validate({ _id: doc._id, _type: doc._type, cards: [] }), []);
  assert.deepEqual(await validate({ _id: doc._id, _type: doc._type }), []);
  assert((await validate({ ...doc, eyebrow: '<b>Label</b>' })).some(marker => marker.path[0] === 'eyebrow'));
  assert((await validate({ ...doc, cards: Array.from({ length: 21 }, (_, index) => ({ ...doc.cards[0], _key: 'card-' + index })) })).some(marker => marker.path[0] === 'cards'));
  const legacy = schemaTypes.find(type => type.name === 'teamPage').fields.find(field => field.name === 'values');
  assert.equal(legacy.readOnly, true); assert(legacy.components.input);
  const config = execute('sanity.config.ts', { './sanity/env': { requireSanityEnvironment: () => ({ projectId: 'ae09qs5c', dataset: 'production' }) } }).default;
  assert(!config.document.newDocumentOptions([{ templateId: 'teamValues' }], {}).length);
  const { createStructureBuilder } = require('sanity/structure');
  const S = createStructureBuilder({ source: { schema: compiled, templates: defaultTemplatesForSchema(compiled), projectId: config.projectId, dataset: config.dataset, currentUser: null, i18n: { t: key => key }, document: { singletons: [], resolveNewDocumentOptions: () => [] } }, perspectiveStack: ['drafts'] });
  const root = config.plugins.at(-1).tools[0].options.structure(S, {});
  const entry = root.getItems().find(item => item.getTitle?.() === 'Team Values').getChild().serialize();
  assert.equal(entry.options.id, 'teamValues'); assert.equal(entry.options.type, 'teamValues');
});

test('Team Values published query, cached reader and real section preserve order, blank text, removal and legacy content', async () => {
  const { teamValuesDefaults, resolveTeamValues } = teamValuesModel;
  const { teamValuesQuery } = execute('sanity/lib/pages.ts', { './content-reader': {} });
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const utils = { '@/lib/utils': require('../lib/utils.js') };
  const { TeamValuesSection } = execute('components/doctor/TeamValuesSection.tsx', {
    '@/sanity/lib/team-values': teamValuesModel,
    '@/components/ui/card': execute('components/ui/card.jsx', utils),
    '@/components/ui/AnimatedSection': execute('components/ui/AnimatedSection.js').default,
    '@/components/ui/SectionHeading': execute('components/ui/SectionHeading.js', { '@/components/ui/badge': execute('components/ui/badge.jsx', utils) }).default,
  });
  const doc = { _id: 'teamValues', _type: 'teamValues', ...structuredClone(teamValuesDefaults), eyebrow: '', subheading: '' };
  doc.cards = [doc.cards[2], doc.cards[0]];
  const dataset = [doc, { ...doc, _id: 'drafts.teamValues', heading: 'Draft must stay private' }, { ...doc, _id: 'versions.release.teamValues' }];
  let request;
  const { readPublishedContent } = execute('sanity/lib/content-reader.ts', { './client': { getContentClient: async publishedOnly => { assert.equal(publishedOnly, true); return { preview: false, client: { fetch: async (query, params, options) => { request = options; return groq(query, dataset, params); } } }; } } });
  const { getTeamValues } = execute('sanity/lib/pages.ts', { './content-reader': { readPublishedContent } });
  const values = await getTeamValues();
  assert.deepEqual(request.next, { revalidate: 60, tags: ['teamValues'] });
  assert.equal(request.cache, 'force-cache');
  const render = values => renderToStaticMarkup(React.createElement(TeamValuesSection, { values, legacy: { heading: 'Legacy heading' } }));
  const html = render(values);
  assert(html.indexOf('Advanced Expertise') < html.indexOf('Clinical Excellence')); assert(!html.includes('Specialist-Led Planning'));
  assert(!html.includes('Our Values')); assert(!html.includes('The principles that guide')); assert(!html.includes('Draft must stay private'));
  assert.equal((html.match(/<h3/g) ?? []).length, 2); assert.equal((html.match(/<svg/g) ?? []).length, 2);
  assert(render(null).includes('Legacy heading')); assert(render(null).includes('Specialist-Led Planning'));
  assert.equal(render(resolveTeamValues(await groq(teamValuesQuery, [{ ...doc, cards: [] }])).value), '');
  assert.equal(resolveTeamValues(await groq(teamValuesQuery, dataset.slice(1))).value, null);
  assert.equal(resolveTeamValues([{ ...doc, cards: [{ ...doc.cards[0], icon: 'unknown' }] }]).value, null);
});

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
    for (const section of presentationSpecs(name).filter(spec => name !== 'teamPage' || spec.name !== 'values')) for (const key of Object.keys(section.fields)) assert.equal(mapped.value[section.name][key], candidate[section.name][key], `${name}.${section.name}.${key}`);
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
  const mutations = [d => d.header.forEach(i => i.visible = false), d => d.header[0].route = 'javascript:alert(1)', d => d.treatments[0].route = '/about', d => d.header[0].key = d.header[1].key];
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
  changed.footerQuick.push({ key: 'external-quick', label: 'External quick link', route: 'https://example.com/quick', visible: true, opensInNewTab: true });
  changed.legalLinks = [{ key: 'policy', label: 'Clinic policy', route: 'https://example.com/policy', visible: true, opensInNewTab: true }, { key: 'legal-contact', label: 'Legal contact', route: '/contact', visible: true }];
  changed.footer.copyright = 'CMS copyright {year}';
  let availability = null;
  const dependencies = { './NavigationProvider': { useNavigation: () => changed }, 'next/navigation': { usePathname: () => '/about' }, '@/lib/services': require('../lib/services.js'), '@/components/layout/ClinicAvailabilityProvider': { useClinicAvailability: () => availability }, '@/lib/clinic-availability': require('../lib/clinic-availability.ts') };
  const Header = execute('components/layout/Navbar.js', dependencies).default, Footer = execute('components/layout/Footer.js', dependencies).default;
  const render = Component => new JSDOM(renderToStaticMarkup(React.createElement(Component))).window.document;
  const header = render(Header), footer = render(Footer);
  const links = d => [...d.querySelectorAll('a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  assert.ok(links(header).some(a => a.text === 'Clinic story' && a.href === '/about'));
  assert.ok(!links(header).some(a => a.text === 'Insights'));
  assert.ok(links(footer).some(a => a.text === 'Start here' && a.href === '/insights'));
  for (const href of ['https://example.com/quick', 'https://example.com/policy']) {
    const link = footer.querySelector(`a[href="${href}"]`);
    assert.equal(link.target, '_blank'); assert.equal(link.rel, 'noopener noreferrer');
  }
  assert.ok(links(footer).some(a => a.text === 'Legal contact' && a.href === '/contact'));
  assert.ok(footer.body.textContent.includes(`CMS copyright ${new Date().getFullYear()}`));
  changed.legalLinks = [];
  assert.ok(!render(Footer).querySelector('a[href="https://example.com/policy"], a[href="/privacy"], a[href="/terms"]'));
  for (const d of [header, footer]) { assert.ok(links(d).some(a => a.href === 'tel:+919309816336')); assert.ok(links(d).some(a => a.href?.startsWith('https://api.whatsapp.com/send?phone=919309816336'))); }
  availability = resolveAvailability([hoursFixture()]).value;
  assert.ok(render(Footer).body.textContent.includes(formatAvailability(availability)), 'the real footer consumes the mapped published schedule');
});

test('Footer projection supports optional legal links, new-tab flags and legacy documents', async () => {
  const doc = { _id: 'navigation', _type: 'navigation', ...structuredClone(navigationDefaults) };
  delete doc.legalLinks; delete doc.footer.copyright;
  const legacy = resolveNavigation(await groq(navigationQuery, [doc]));
  assert.equal(legacy.status, 'sanity'); assert.deepEqual(legacy.value.legalLinks, []);
  assert.equal(legacy.value.footer.copyright, navigationDefaults.footer.copyright);
  doc.legalLinks = Array.from({ length: 4 }, (_, index) => ({ _key: `policy-${index}`, label: `Policy ${index}`, route: `https://example.com/policy-${index}`, visible: true, opensInNewTab: index === 0 }));
  doc.footer.copyright = 'Clinic copyright {year}';
  let mapped = resolveNavigation(await groq(navigationQuery, [doc]));
  assert.equal(mapped.status, 'sanity'); assert.equal(mapped.value.legalLinks.length, 4);
  assert.equal(mapped.value.legalLinks[0].key, 'policy-0'); assert.equal(mapped.value.legalLinks[0].opensInNewTab, true);
  doc.header[0].label = 'CMS Home';
  doc.legalLinks[1].route = '/privacy';
  mapped = resolveNavigation([doc]);
  assert.equal(mapped.status, 'invalid'); assert.equal(mapped.value.legalLinks.length, 3);
  assert.equal(mapped.value.header[0].label, 'CMS Home', 'a bad footer link cannot reset the header');
  doc.legalLinks.push({ _key: 'fifth', label: 'Fifth', route: '/contact', visible: true });
  assert.deepEqual(resolveNavigation([doc]).value.legalLinks, []);
  doc.footerQuick[1].route = doc.footerQuick[0].route;
  assert.equal(resolveNavigation([doc]).value.footerQuick.filter(item => item.route === '/').length, 1);
  doc.footerServices[0].label = 'Invalid'; doc.footerServices[0].route = 'https://example.com/treatment';
  assert.ok(!resolveNavigation([doc]).value.footerServices.some(item => item.label === 'Invalid'), 'treatment-column rules remain strict');
});

test('native Footer validation reports one clear error on each keyed input', async () => {
  const { createSchema } = require('sanity');
  const { validateDocumentWithWorkspace } = require('@sanity/validation');
  const schema = createSchema({ name: 'footer-validation', types: schemaTypes });
  const validate = async document => (await validateDocumentWithWorkspace({ document, workspace: { schema, getClient: () => { throw Error('No network needed'); } }, environment: 'studio', getDocumentExists: async () => false })).filter(marker => marker.level === 'error');
  const doc = { _id: 'drafts.navigation', _type: 'navigation', ...structuredClone(navigationDefaults) };
  assert.deepEqual(await validate(doc), []);
  doc.legalLinks = [{ _type: 'object', _key: 'policy', label: '', route: '/privacy', visible: true }];
  let errors = await validate(doc);
  assert.equal(errors.filter(marker => marker.path.at(-1) === 'label').length, 1);
  assert.deepEqual(errors.find(marker => marker.path.at(-1) === 'label').path, ['legalLinks', { _key: 'policy' }, 'label']);
  assert.match(errors.find(marker => marker.path.at(-1) === 'label').message, /link name/);
  doc.legalLinks[0].label = 'Policy';
  errors = await validate(doc);
  assert.equal(errors.length, 1); assert.deepEqual(errors[0].path, ['legalLinks', { _key: 'policy' }, 'route']);
  assert.match(errors[0].message, /existing page path/);
  doc.legalLinks.unshift({ _type: 'object', _key: 'contact', label: 'Contact', route: '/contact', visible: true });
  assert.deepEqual((await validate(doc))[0].path, ['legalLinks', { _key: 'policy' }, 'route']);
  doc.legalLinks[1].route = 'https://example.com/privacy';
  assert.deepEqual(await validate(doc), []);
  doc.footer.copyright = 'Copyright {wrong}';
  errors = await validate(doc); assert.equal(errors.length, 1); assert.deepEqual(errors[0].path, ['footer', 'copyright']);
  delete doc.footer.copyright;
  delete doc.footer.contactHeading;
  errors = await validate(doc); assert.equal(errors.length, 1); assert.deepEqual(errors[0].path, ['footer', 'contactHeading']);
});

test('Doctor editor requires qualifications and maps editable specializations to the actual profile', async (t) => {
  const previous = { project: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET };
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  t.after(() => { for (const [key, value] of [['NEXT_PUBLIC_SANITY_PROJECT_ID', previous.project], ['NEXT_PUBLIC_SANITY_DATASET', previous.dataset]]) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  const { createSchema } = require('sanity');
  const { validateDocumentWithWorkspace } = require('@sanity/validation');
  const schema = createSchema({ name: 'doctor-qualifications', types: schemaTypes });
  const doc = { _id: 'drafts.local-doctor', _type: 'doctor', slug: { current: 'sahil' }, bio: 'Local biography fixture', philosophy: 'Local philosophy fixture', homeSummary: 'Local summary fixture', qualifications: [
    { _type: 'doctorQualification', _key: 'first', title: 'Local qualification fixture', institution: 'Local institution fixture', year: 2020 },
    { _type: 'doctorQualification', _key: 'second', title: 'Second fixture' },
  ], specializations: [{ _type: 'doctorSpecialization', _key: 'practice-one', title: 'Local practice fixture' }, { _type: 'doctorSpecialization', _key: 'practice-two', title: 'Second practice fixture' }] };
  const client = { withConfig() { return this; }, fetch: async query => query.trim().startsWith('!defined') ? true : null };
  const validate = async document => (await validateDocumentWithWorkspace({ document, workspace: { schema, getClient: () => client }, environment: 'studio', getDocumentExists: async () => false })).filter(marker => marker.level === 'error');
  assert.deepEqual(await validate(doc), []);
  const qualifications = doc.qualifications;
  for (const value of [undefined, null, []]) {
    doc.qualifications = value;
    const errors = await validate(doc);
    assert.equal(errors.length, 1, JSON.stringify({ value, errors })); assert.deepEqual(errors[0].path, ['qualifications']);
    assert.match(errors[0].message, /at least one doctor-verified qualification/);
  }
  doc.qualifications = qualifications;
  delete doc.specializations[0].title;
  const specializationErrors = await validate(doc);
  assert.equal(specializationErrors.length, 1);
  assert.deepEqual(specializationErrors[0].path, ['specializations', { _key: 'practice-one' }, 'title']);
  doc.specializations[0].title = 'Local practice fixture';
  delete doc.qualifications[0].title;
  const errors = await validate(doc);
  assert.equal(errors.length, 1); assert.deepEqual(errors[0].path, ['qualifications', { _key: 'first' }, 'title']);
  doc.qualifications[0].title = 'Local qualification fixture';
  const { resolveDoctors } = require('../sanity/lib/page-mapping.ts');
  const { doctorsQuery } = execute('sanity/lib/pages.ts', { './content-reader': {} });
  const map = async () => resolveDoctors(await groq(doctorsQuery, [{ ...doc, _id: 'local-doctor' }])).value;
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const Doctor = execute('app/doctor/DoctorClient.js', {
    '@/components/layout/PageWrapper': wrapper, '@/components/ui/AnimatedSection': wrapper,
    '@/components/ui/button': { Button: wrapper }, '@/components/ui/card': { Card: wrapper, CardContent: wrapper },
    '@/components/ui/badge': { Badge: wrapper }, '@/components/ui/SectionHeading': wrapper,
    '../../public/clinic/clinicAssistancePic.png': { src: '/staff-fixture.png', width: 1, height: 1 },
    '@/components/insights/EditorialImage': () => null,
    '@/components/doctor/TeamValuesSection': { TeamValuesSection: () => null },
  }).default;
  let records = await map();
  const html = renderToStaticMarkup(React.createElement(Doctor, { doctorNarratives: records }));
  assert(html.includes('Local qualification fixture · Local institution fixture · 2020'));
  assert(html.indexOf('Local qualification fixture') < html.indexOf('Second fixture'));
  assert(html.includes('Local practice fixture')); assert(html.indexOf('Local practice fixture') < html.indexOf('Second practice fixture'));
  doc.specializations.reverse();
  assert.equal((await map())[0].specializations[0]._key, 'practice-two');
  doc.specializations = [];
  assert(!renderToStaticMarkup(React.createElement(Doctor, { doctorNarratives: await map() })).includes('Specializations'));
  doc.qualifications.reverse(); records = await map();
  assert.equal(records[0].qualifications[0].label, 'Second fixture');
  doc.qualifications = [];
  const cleared = renderToStaticMarkup(React.createElement(Doctor, { doctorNarratives: await map() }));
  assert(!cleared.includes('Local qualification fixture'));
  assert(!cleared.includes('Advanced Training in Digital Dentistry'));
});

test('Doctor templates and copy action use existing code facts without overwriting edited CMS lists', () => {
  const { DOCTORS } = require('../lib/clinic.ts');
  let patches, complete = 0;
  const patch = { disabled: false, execute: value => { patches = value; } };
  const sanity = require('sanity');
  const module = execute('sanity.config.ts', {
    './sanity/env': { requireSanityEnvironment: () => ({ projectId: 'ae09qs5c', dataset: 'production' }) },
    sanity: { ...sanity, useDocumentOperation: () => ({ patch }) },
  });
  const templates = module.default.schema.templates([]);
  for (const key of ['sahil', 'aishwarya']) {
    const value = templates.find(template => template.id === `doctor-${key}`).value();
    assert.equal(value.qualifications[0]._type, 'doctorQualification');
    assert.equal(value.qualifications[0].title + ' - ' + value.qualifications[0].institution, DOCTORS[key].credential);
    assert.equal(value.qualifications[0].year, undefined);
    assert.equal(value.specializations[0].title, DOCTORS[key].role.split('|').at(-1).trim());
    assert.equal(value.reviewStatus, undefined);
    assert.equal(value._id, undefined);
    const doc = { slug: value.slug, qualifications: [], specializations: [] };
    assert.deepEqual(module.missingDoctorWebsiteFields(doc), { qualifications: value.qualifications, specializations: value.specializations });
    const action = module.FillDoctorDetailsAction({ id: 'local-only', type: 'doctor', draft: doc, onComplete: () => complete++, readOnly: false });
    assert.deepEqual(action.group, ['default', 'paneActions']); assert.equal(action.disabled, false); action.onHandle();
    assert.deepEqual(patches, [{ set: { qualifications: value.qualifications, specializations: value.specializations } }]);
    const edited = { ...doc, qualifications: [{ _key: 'saved', title: 'Saved qualification' }], specializations: [{ _key: 'saved', title: 'Saved practice' }] };
    assert.deepEqual(module.missingDoctorWebsiteFields(edited), {});
    patches = undefined;
    const blocked = module.FillDoctorDetailsAction({ id: 'local-only', type: 'doctor', draft: doc, onComplete() {}, readOnly: true });
    assert.equal(blocked.disabled, true); blocked.onHandle(); assert.equal(patches, undefined);
    const mapped = require('../sanity/lib/page-mapping.ts').resolveDoctors([{ _id: 'local-only', bio: 'Local biography', philosophy: 'Local philosophy', homeSummary: 'Local summary', ...value, slug: key }]);
    assert.equal(mapped.status, 'sanity'); assert(mapped.value[0].qualifications[0].label.includes(value.qualifications[0].title));
    assert.equal(mapped.value[0].specializations[0].title, value.specializations[0].title);
  }
  assert.equal(complete, 2);
  assert.deepEqual(module.missingDoctorWebsiteFields({ slug: { current: 'unknown' } }), {});
  const doctors = manifest.documents.filter(document => document.content._type === 'doctor');
  assert.equal(doctors.length, 2);
  for (const document of doctors) {
    assert.equal(document.reviewRequired, true);
    assert.equal(document.content.qualifications[0]._type, 'doctorQualification');
    assert(document.content.qualifications[0].title.length > 0);
    assert(document.content.specializations[0].title.length > 0);
  }
});

test('actual treatment metadata handler consumes advanced SEO while retaining the existing title and copy', async () => {
  const { services } = require('../lib/services.js'); const service = services[0]; let seen;
  const module = execute('app/services/[slug]/page.js', {
    '@/components/seo/BacklinkReferences': require('../components/seo/BacklinkReferences.tsx'),
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
    if (name === 'teamPage' && section.name === 'values') {
      assert.equal(compiled.get(name).fields.find(field => field.name === 'values').type.readOnly, true);
      continue;
    }
    const field = compiled.get(name).fields.find(f => f.name === section.name).type.fields.find(f => f.name === key);
    const id = `${name}.${section.name}.${key}`, current = presentationDefaults[id];

    assert.equal(field.type.title ?? field.title, spec.title, id);
    assert.doesNotMatch(spec.title, /^(Heading|Intro|Eyebrow|[A-Z][a-z]+ Label)$/, id);
    assert.ok(current && evidence[id]?.startsWith(current.replace(/…$/, '')), `${id} default matches the website source`);
    assert.ok((field.type.description ?? field.description).includes(current), id);
    descriptions.add(spec.description);
  }
  assert.equal(descriptions.size, Object.keys(presentationDefaults).filter(path => !path.startsWith('teamPage.values.')).length, 'every editable field has its own description');
});

function hoursFixture() {
  const doc = { ...clinicAvailability.initialValue(), _id: 'clinicAvailability', _type: 'clinicAvailability',  confirmationNote: 'Test-only clinic confirmation fixture', confirmedAt: '2026-10-18T06:00:00.000Z' }
  doc.confirmedSnapshot = availabilitySnapshot(doc)
  return doc
}

test('hours form prefills all seven current website days without approval or invented confirmation', () => {
  assert.equal(typeof schemaTypes.find(type => type.name === 'clinicAvailability').components?.input, 'function', 'hours form has its own confirmation guidance')
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

test('hours closures have one actionable marker per missing field and remain optional', async () => {
  const { createSchema } = require('sanity');
  const { validateDocumentWithWorkspace } = require('@sanity/validation');
  const schema = createSchema({ name: 'hours-markers', types: [clinicAvailability] });
  const validate = async document => (await validateDocumentWithWorkspace({ document, workspace: { schema, getClient: () => { throw Error('No network needed'); } }, environment: 'studio', getDocumentExists: async () => false })).filter(marker => marker.level === 'error');
  const good = hoursFixture(); good.closures = []; good.confirmedSnapshot = availabilitySnapshot(good);
  assert.deepEqual(await validate(good), []);
  const empty = { ...good, closures: [{ _key: 'holiday', _type: 'clinicAvailabilityClosure' }] };
  const errors = await validate(empty);
  assert.equal(errors.length, 2, JSON.stringify(errors));
  for (const field of ['date', 'reason']) assert.equal(errors.filter(marker => JSON.stringify(marker.path) === JSON.stringify(['closures', { _key: 'holiday' }, field])).length, 1);
  assert.ok(errors.every(marker => marker.message !== 'Required'));
  const badDate = { ...good, closures: [{ _key: 'holiday', _type: 'clinicAvailabilityClosure', date: '2026-02-30', reason: 'Maintenance' }] };
  assert.ok((await validate(badDate)).some(marker => marker.path.at(-1) === 'date'));
  const changed = { ...good, confirmationNote: 'Changed local test reference' };
  assert.ok((await validate(changed)).some(marker => marker.path[0] === 'confirmedAt'));
});

test('hours confirmation stays visible, respects read-only and never publishes or approves', () => {
  let current = hoursFixture(), patchDisabled = false; const patches = [];
  const actual = require('../sanity/studio/RecordHoursConfirmationAction.ts');
  assert.equal(actual.hoursConfirmationState({ ...current, confirmedAt: 'invalid' }).confirmed, false);
  const { HoursConfirmationInput } = execute('sanity/studio/RecordHoursConfirmationAction.ts', {
    sanity: { getPublishedId: id => id.replace(/^drafts\./, ''), useFormValue: () => current, useDocumentOperation: () => ({ patch: { disabled: patchDisabled, execute: value => patches.push(value) } }) },
  });
  const buttons = node => !node || typeof node !== 'object' ? [] : [...(node.type === 'button' ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(buttons)];
  const props = { renderDefault: () => 'native fields' };
  assert.equal(buttons(HoursConfirmationInput(props))[0].props.disabled, true);
  current = { ...current, confirmedAt: 'invalid' };
  const button = buttons(HoursConfirmationInput(props))[0];
  assert.equal(button.props.disabled, false); button.props.onClick();
  assert.deepEqual(Object.keys(patches[0][0].set).sort(), ['confirmedAt', 'confirmedSnapshot']);
  assert.equal(buttons(HoursConfirmationInput({ ...props, readOnly: true }))[0].props.disabled, true);
  patchDisabled = true;
  assert.equal(buttons(HoursConfirmationInput(props))[0].props.disabled, true);
  const { renderToStaticMarkup } = require('react-dom/server');
  assert.match(renderToStaticMarkup(HoursConfirmationInput(props)), /native fields/);
});


test('new menu links survive Studio array keys, projection, ordering and removal', async () => {
  const doc = { _id: 'navigation', _type: 'navigation', ...structuredClone(navigationDefaults) };
  doc.header.push({ _key: 'new-link', label: 'Our experience', route: '/aesthedent-experience', visible: true });
  doc.treatments.push({ _key: 'new-treatment', label: 'New treatment', route: '/services/new-treatment', visible: false });
  const mapped = resolveNavigation(await groq(navigationQuery, [doc]));
  assert.equal(mapped.status, 'sanity');
  assert.equal(mapped.value.header.at(-1).key, 'new-link');
  assert.equal(mapped.value.header.at(-1).route, '/aesthedent-experience');
  assert.equal(mapped.value.treatments.at(-1).visible, false);
  doc.header.push({ _key: 'external', label: 'External website', route: 'https://example.com/shop', visible: true });
  assert.equal(resolveNavigation([doc]).value.header.at(-1).route, 'https://example.com/shop');
  doc.header.splice(0, 1);
  assert.equal(resolveNavigation([doc]).status, 'sanity');
  const { navigation } = require('../sanity/schemaTypes/navigation.ts');
  assert.equal(navigation.fields.find(field => field.name === 'header').options?.disableActions, undefined);
  const { getNavigationWithTreatments } = execute('sanity/lib/navigation.ts', { './content-reader': { readPublishedContent: async () => mapped.value }, './services': { getServices: async () => [{ slug: 'new-treatment', title: 'Ignore this title' }, { slug: 'another-treatment', title: 'Another treatment' }] } });
  const complete = await getNavigationWithTreatments();
  assert.equal(complete.treatments.filter(item => item.route === '/services/new-treatment').length, 1);
  assert.equal(complete.treatments.find(item => item.route === '/services/new-treatment').visible, false);
  assert.equal(complete.treatments.at(-1).route, '/services/another-treatment');
});

test('Studio treatment and article create actions resolve registered schemas and their actual default templates', () => {
  const { createSchema, defaultTemplatesForSchema } = require('sanity');
  const { createStructureBuilder } = require('sanity/structure');
  const schema = createSchema({ name: 'creation-workflows', types: schemaTypes });
  const templates = defaultTemplatesForSchema(schema);
  const config = execute('sanity.config.ts', { './sanity/env': { requireSanityEnvironment: () => ({ projectId: 'ae09qs5c', dataset: 'production' }) } }).default;
  const source = { schema, templates, projectId: config.projectId, dataset: config.dataset, name: config.name, currentUser: null,
    i18n: { t: key => key }, document: { singletons: [], resolveNewDocumentOptions: ({ schemaType }) => templates.filter(template => template.schemaType === schemaType).map(template => ({ id: template.id, templateId: template.id })) } };
  const S = createStructureBuilder({ source, perspectiveStack: ['drafts'] });
  const tool = config.plugins.flatMap(plugin => plugin.tools ?? []).find(tool => typeof tool.options?.structure === 'function');
  const structure = tool.options.structure(S, {});
  for (const [type, label] of [['service', 'Add new treatment'], ['insight', 'Add new article']]) {
    const pane = structure.getItems().find(item => item.getId?.() === type).getChild().serialize();
    const action = pane.menuItems.find(item => item.title === label);
    assert.equal(action.showAsAction, true);
    assert.deepEqual(action.intent, { type: 'create', params: { type, template: type } });
    assert.equal(pane.initialValueTemplates[0].templateId, type);
    assert.equal(templates.find(template => template.id === type).schemaType, type);
    assert.equal(schema.get(type).fields.find(field => field.name === 'slug').type.options.source, 'title');
  }
  assert.equal(schema.get('insight').fields.find(field => field.name === 'editorialStatus').type.initialValue, 'draft');
  assert.equal(schema.get('insight').fields.find(field => field.name === 'featured').type.initialValue, false);
  const nav = resolveNavigation([{ _id: 'navigation', ...navigationDefaults, header: [...navigationDefaults.header, { _key: 'new-article', label: 'New guide', route: '/insights/local-new-guide', visible: true }] }]);
  assert.equal(nav.status, 'sanity'); assert.equal(nav.value.header.at(-1).route, '/insights/local-new-guide');
});

test('Treatment and Insight Delete is visible in both menus and preserves native confirmation and permission state', () => {
  const config = execute('sanity.config.ts', { './sanity/env': { requireSanityEnvironment: () => ({ projectId: 'ae09qs5c', dataset: 'production' }) } }).default;
  const dialog = { type: 'confirm', message: 'Native confirmation fixture' };
  const onHandle = () => { throw new Error('Do not execute deletion in this test'); };
  let state = { label: 'Delete', tone: 'critical', disabled: true, title: 'Native permission or reference restriction', dialog, onHandle }, received;
  const nativeDelete = Object.assign(props => { received = props; return state; }, { action: 'delete' });
  const publish = Object.assign(() => ({ label: 'Publish' }), { action: 'publish' });
  for (const [type, label] of [['service', 'Delete treatment'], ['insight', 'Delete article']]) {
    const actions = config.document.actions([publish, nativeDelete], { schemaType: type });
    assert.equal(actions[0], publish);
    const action = actions.find(action => action.action === 'delete'), props = { id: 'local-fixture', type };
    assert.deepEqual(action(props), { ...state, label, group: ['default', 'paneActions'] });
    assert.equal(received, props);
    assert.equal(action, config.document.actions([publish, nativeDelete], { schemaType: type }).find(action => action.action === 'delete'));
    assert(!config.document.actions([publish], { schemaType: type }).some(action => action.action === 'delete'));
    if (type === 'insight') assert(actions.some(action => action.name === 'RecordInsightReviewAction'));
  }
  assert.equal(config.document.actions([nativeDelete], { schemaType: 'homePage' })[0], nativeDelete, 'unrelated action configuration stays unchanged');
  const action = config.document.actions([nativeDelete], { schemaType: 'insight' })[0];
  state = { ...state, label: 'Deleting…' }; assert.equal(action({ type: 'insight' }).label, 'Deleting…');
  state = null; assert.equal(action({ type: 'insight' }), null);
});
