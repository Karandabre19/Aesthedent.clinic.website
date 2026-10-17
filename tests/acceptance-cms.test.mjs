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
const manifest = buildContentManifest();
function execute(file, dependencies = {}) {
  const filename = new URL('../' + file, import.meta.url), localRequire = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)(id => id === 'server-only' ? {} : dependencies[id] ?? localRequire(id), exports);
  return exports;
}
const { presentationPageQuery } = execute('sanity/lib/presentation-pages.ts', { './content-reader': {} });
const { navigationQuery } = execute('sanity/lib/navigation.ts', { './content-reader': {} });
const { seoQuery } = execute('sanity/lib/seo.ts', { './content-reader': {}, './insights': {}, 'next/headers': {} });
const groq = async (query, dataset, params = {}) => (await evaluate(parse(query), { dataset, params })).get();

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
  const dependencies = { './NavigationProvider': { useNavigation: () => changed }, 'next/navigation': { usePathname: () => '/about' }, '@/lib/services': require('../lib/services.js') };
  const Header = execute('components/layout/Navbar.js', dependencies).default, Footer = execute('components/layout/Footer.js', dependencies).default;
  const render = Component => new JSDOM(renderToStaticMarkup(React.createElement(Component))).window.document;
  const header = render(Header), footer = render(Footer);
  const links = d => [...d.querySelectorAll('a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  assert.ok(links(header).some(a => a.text === 'Clinic story' && a.href === '/about'));
  assert.ok(!links(header).some(a => a.text === 'Insights'));
  assert.ok(links(footer).some(a => a.text === 'Start here' && a.href === '/insights'));
  for (const d of [header, footer]) { assert.ok(links(d).some(a => a.href === 'tel:+919309816336')); assert.ok(links(d).some(a => a.href?.startsWith('https://api.whatsapp.com/send?phone=919309816336'))); }
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
