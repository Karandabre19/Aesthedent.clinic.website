import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file);
// All documents, approvals and assets below are synthetic and never sent to Sanity.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
const { schemaTypes } = require('../sanity/schemaTypes/index.ts');
const { createSchema } = require('sanity');
const { validateDocumentWithWorkspace } = require('@sanity/validation');
const { buildContentManifest } = require('../scripts/content-sync-lib.mjs');
const { parse, evaluate } = require('groq-js');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');
const { availabilitySnapshot, resolveAvailability } = require('../sanity/lib/availability-mapping.ts');
const { appointmentOptions, defaultAvailability } = require('../lib/clinic-availability.ts');
const { clinicAvailability } = require('../sanity/schemaTypes/clinic-availability.ts');
const { reviewChecks, reviewDigest } = require('../sanity/lib/insight-review.ts');
const manifest = buildContentManifest();
const schema = createSchema({ name: 'schema-workflows', types: schemaTypes });
const groq = async (query, dataset, params = {}) => (await evaluate(parse(query), { dataset, params })).get();
const asset = { _id: 'image-fixture-1200x900-jpg', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/ae09qs5c/production/fixture-1200x900.jpg', mimeType: 'image/jpeg', metadata: { dimensions: { width: 1200, height: 900 } } };
const client = { withConfig() { return this; }, fetch: async query => query.trim().startsWith('!defined') ? true : query.startsWith('count(') ? 0 : query.includes('sanity.imageAsset') ? asset : query.includes('[0].slug.current') ? null : [] };
const validate = async document => (await validateDocumentWithWorkspace({ document, workspace: { schema, getClient: () => client }, environment: 'studio', getDocumentExists: async () => true })).filter(marker => marker.level === 'error');
const hours = () => {
  const doc = { ...clinicAvailability.initialValue(), _id: 'drafts.clinicAvailability', _type: 'clinicAvailability', confirmationNote: 'Synthetic local confirmation only', confirmedAt: '2026-01-01T00:00:00Z' };
  doc.confirmedSnapshot = availabilitySnapshot(doc);
  return doc;
};
async function fixtures() {
  const documents = manifest.documents.map((candidate, index) => ({ ...structuredClone(candidate.content), _id: 'drafts.' + (candidate.content.slug ? 'local-' + index : candidate.identity) }));
  for (const doc of documents.filter(doc => doc._type === 'insight')) {
    doc.date = '2024-01-01';
    doc.editorialStatus = 'ready';
    doc.sources = [{ _key: 'source', title: 'Synthetic test reference', url: 'https://example.org/local-fixture' }];
    doc.review = { clinicianKey: 'sahil', approvalReference: 'Synthetic local approval; never publish this fixture', reviewedAt: '2026-01-01T00:00:00Z', recordedAt: '2026-01-02T00:00:00Z', recordedBy: 'local-test-editor', ...Object.fromEntries(Object.keys(reviewChecks).map(key => [key, true])) };
    doc.review.digest = await reviewDigest(doc);
  }
  documents.push(hours(), { ...manifest.reviews[0].content, _id: 'drafts.local-review', sourceUrl: 'https://www.google.com/maps/reviews/local-fixture', verifiedGoogleReview: true, publicationPermissionConfirmed: true });
  return documents;
}
function execute(file, dependencies = {}) {
  const filename = new URL('../' + file, import.meta.url), local = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)(id => id === 'server-only' ? {} : dependencies[id] ?? local(id), exports);
  return exports;
}

test('all sixteen registered schemas validate usable documents and keep every field in an accessible Studio group', async () => {
  assert.equal(schemaTypes.length, 16);
  assert.deepEqual(schema._validation, []);
  const documents = await fixtures();
  for (const type of schemaTypes) {
    const doc = documents.find(doc => doc._type === type.name);
    assert(doc, type.name);
    assert.deepEqual(await validate(doc), [], type.name);
    for (const field of type.fields) if (field.group) for (const group of [field.group].flat()) assert(type.groups.some(item => item.name === group), `${type.name}.${field.name} group ${group}`);
  }
  const article = documents.find(doc => doc._type === 'insight');
  article.title += ' edited after approval';
  assert((await validate(article)).some(marker => marker.path[0] === 'review'), 'approval still becomes stale after content changes');
});

test('cleared optional metadata and copyright validate and reach the fallback mapper without losing unrelated edits', async () => {
  const documents = await fixtures();
  const { resolveSeoInventory } = require('../sanity/lib/seo-mapping.ts');
  const { resolveNavigation } = require('../sanity/lib/navigation-mapping.ts');
  const { insightFieldErrors } = require('../sanity/lib/insight-review.ts');
  const query = execute('sanity/lib/seo.ts', { './content-reader': {}, './insights': {}, 'next/headers': {} }).seoQuery;
  for (const type of schemaTypes.filter(type => type.fields.some(field => field.name === 'seo'))) {
    const doc = structuredClone(documents.find(doc => doc._type === type.name));
    doc.seo = { metaTitle: '', metaDescription: ' ', ogTitle: '', ogDescription: '', twitterTitle: '', twitterDescription: '', focusKeyword: '', visibilityReason: '' };
    if (doc._type === 'insight') {
      delete doc.seo.metaTitle; delete doc.seo.metaDescription;
      for (const field of ['metaTitle', 'metaDescription', 'listingTitle', 'listingExcerpt', 'modifiedAt']) {
        doc[field] = field === 'modifiedAt' ? undefined : '';
        assert.equal(insightFieldErrors(field, ''), true, field);
      }
      doc.review.digest = await reviewDigest(doc);
    }
    assert.deepEqual(await validate(doc), [], type.name);
    if (doc._type !== 'insight') assert.equal(resolveSeoInventory(await groq(query, [{ ...doc, _id: doc._id.replace(/^drafts\./, '') }])).status, 'sanity', type.name);
  }
  const shared = documents.find(doc => doc._type === 'seoSettings'); shared.defaults = { metaTitle: '', ogDescription: ' ' };
  assert.deepEqual(await validate(shared), []);
  const nav = documents.find(doc => doc._type === 'navigation'); nav.footer.copyright = ''; nav.footer.intro = 'A retained footer edit';
  assert.deepEqual(await validate(nav), []);
  const mapped = resolveNavigation([{ ...nav, _id: 'navigation' }]);
  assert.equal(mapped.status, 'sanity'); assert.equal(mapped.value.footer.intro, nav.footer.intro); assert.match(mapped.value.footer.copyright, /\{year\}/);
  const invalid = { ...documents.find(doc => doc._type === 'servicesPage'), seo: { secondaryKeywords: ['<b>Invalid</b>'] } };
  const markers = await validate(invalid);
  assert.equal(markers.length, 1); assert.deepEqual(markers[0].path, ['seo', 'secondaryKeywords', 0]);
});

test('every native image control blocks unusable assets and crops while small permitted images stay publishable', async () => {
  const images = [];
  const walk = (type, path) => { for (const field of type.fields ?? []) { const key = `${path}.${field.name}`; if (field.type.name === 'image') images.push([key, field.type]); else walk(field.type, key); } };
  for (const type of schemaTypes) walk(schema.get(type.name), type.name);
  assert.equal(images.length, 24);
  for (const [path, type] of images) {
    const check = type.validation.find(rule => rule._level !== 'warning' && rule._rules.some(item => item.flag === 'custom'))._rules.find(item => item.flag === 'custom').constraint;
    const image = { asset: { _ref: asset._id }, alt: 'Synthetic image description', crop: { top: 0, bottom: 0, left: 0, right: 0 }, hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 } };
    assert.equal(await check(undefined, { getClient: () => client }), true, `${path} optional`);
    assert.equal(await check(image, { getClient: () => client }), true, path);
    for (const data of [null, { ...asset, mimeType: 'image/svg+xml' }]) assert.notEqual(await check(image, { getClient: () => ({ fetch: async () => data }) }), true, `${path} cannot deliver`);
    assert.notEqual(await check({ ...image, crop: { top: 0.8, bottom: 0.8, left: 0, right: 0 } }, { getClient: () => client }), true, `${path} crop`);
    const small = { ...asset, _id: 'image-small-10x10-jpg', url: 'https://cdn.sanity.io/images/ae09qs5c/production/small-10x10.jpg', metadata: { dimensions: { width: 10, height: 10 } } };
    assert.equal(await check({ asset: { _ref: small._id } }, { getClient: () => ({ fetch: async () => small }) }), true, `${path} size is guidance`);
  }
});

test('closed weekdays never expose hidden-time errors and published hours control booking periods', async () => {
  const doc = hours();
  doc.weeklyHours[0] = { ...doc.weeklyHours[0], closed: true, open: '', close: 'incomplete' };
  doc.weeklyHours[2] = { ...doc.weeklyHours[2], closed: false, open: '14:30', close: '18:00' };
  doc.confirmedSnapshot = availabilitySnapshot(doc);
  assert.deepEqual(await validate(doc), []);
  const mapped = resolveAvailability([{ ...doc, _id: 'clinicAvailability' }]).value;
  assert.equal(appointmentOptions(mapped, 'Mon').closed, true);
  assert.deepEqual(appointmentOptions(mapped, 'Wed').times, ['Afternoon (2:30 – 4)', 'Evening (4 – 6)']);
  assert.deepEqual(appointmentOptions(defaultAvailability, 'Mon').times, ['Morning (10 – 1)', 'Afternoon (1 – 4)', 'Evening (4 – 8)']);
  const invalid = structuredClone(doc); invalid.weeklyHours[2].close = '12:00';
  assert((await validate(invalid)).some(marker => marker.path[0] === 'weeklyHours' && marker.path.at(-1) === 'close'));
  const changed = structuredClone(doc); changed.weeklyHours[2].close = '19:00';
  assert((await validate(changed)).some(marker => marker.path[0] === 'confirmedAt'), 'a real hours edit still requires new confirmation');
});

test('treatment steps point at their editable keyed number and SEO survives catalogues beyond forty records', async () => {
  const { serviceContent } = require('../sanity/lib/service-mapping.ts');
  const { contentErrors } = require('../sanity/lib/content-validation.ts');
  const service = structuredClone(manifest.documents.find(doc => doc.content._type === 'service').content);
  service.process[1].step = 1;
  assert(contentErrors(serviceContent, service).some(error => JSON.stringify(error.path) === JSON.stringify(['process', { _key: service.process[1]._key }, 'step'])));
  const { resolveSeoInventory } = require('../sanity/lib/seo-mapping.ts');
  const query = execute('sanity/lib/seo.ts', { './content-reader': {}, './insights': {}, 'next/headers': {} }).seoQuery;
  const records = Array.from({ length: 65 }, (_, i) => ({ _id: 'local-' + i, _type: 'service', slug: { current: 'treatment-' + i }, seo: { metaTitle: 'Edited title ' + i } }));
  const state = resolveSeoInventory(await groq(query, records));
  assert.equal(state.status, 'sanity'); assert.equal(Object.keys(state.value.pages).length, records.length);
  assert.equal(state.value.pages['/services/treatment-64'].metaTitle, 'Edited title 64');
  const { validateDocumentSeo } = require('../sanity/schemaTypes/seo.ts');
  const dataset = [...records, { _id: 'aboutPage', _type: 'aboutPage', seo: { index: false, visibilityReason: 'Local fixture only' } }];
  const document = { _id: 'drafts.contactPage', _type: 'contactPage', seo: { canonicalRoute: '/about', visibilityReason: 'Synthetic duplicate-content decision' } };
  const context = { getClient: () => ({ withConfig() { return this; }, fetch: (query, params) => groq(query, dataset, params) }) };
  assert.match((await validateDocumentSeo(document, context)).message, /not indexable/);
});

test('a mounted Treatments page accepts added and removed CMS treatments without changing React hook order or losing expanded cards', async () => {
  const dom = new JSDOM('<div id="root"></div>');
  const old = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const motion = new Proxy({}, { get: (_, tag) => ({ children }) => React.createElement(tag, null, children) });
  const { services } = require('../lib/services.js');
  const Component = execute('app/services/ServicesClient.js', {
    'framer-motion': { motion, AnimatePresence: wrapper }, '@/components/insights/EditorialImage': () => null,
    '@/components/layout/PageWrapper': wrapper, '@/components/ui/SectionHeading': wrapper, '@/components/ui/AnimatedSection': wrapper,
    '@/components/ui/button': { Button: ({ children }) => children }, '@/lib/services': { services },
    'next/link': ({ children }) => React.createElement('a', null, children),
  }).default;
  const root = createRoot(dom.window.document.getElementById('root'));
  const initial = services.slice(0, 2), added = { ...services[0], slug: 'local-new-treatment', title: 'New CMS treatment' };
  try {
    await React.act(async () => root.render(React.createElement(Component, { services: initial })));
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert(dom.window.document.body.textContent.includes(initial[0].problem));
    await React.act(async () => root.render(React.createElement(Component, { services: [...initial, added] })));
    assert(dom.window.document.body.textContent.includes(added.title)); assert(dom.window.document.body.textContent.includes(initial[0].problem));
    await React.act(async () => root.render(React.createElement(Component, { services: [initial[0], added] })));
    assert(dom.window.document.body.textContent.includes(initial[0].problem));
  } finally {
    await React.act(async () => root.unmount()); dom.window.close();
    globalThis.window = old.window; globalThis.document = old.document; globalThis.IS_REACT_ACT_ENVIRONMENT = old.act;
  }
});

test('a published review rating reaches the real card without a false five-star claim, and saved new-tab controls remain accessible', () => {
  const { resolveTestimonials } = require('../sanity/lib/testimonial-mapping.ts');
  const source = { ...manifest.reviews[0].content, _id: 'local-review', rating: 3, text: 'Synthetic three-star review', sourceUrl: 'https://www.google.com/maps/reviews/local-fixture', verifiedGoogleReview: true, publicationPermissionConfirmed: true };
  const cards = resolveTestimonials([source]).value.slice(0, 1);
  const Component = execute('components/sections/TestimonialsSection.js', {
    '@/components/ui/AnimatedSection': ({ children }) => React.createElement('div', null, children),
    '@/lib/testimonials': require('../lib/testimonials.js'), '@/lib/clinic': require('../lib/clinic.ts'),
  }).default;
  const { renderToStaticMarkup } = require('react-dom/server');
  const html = renderToStaticMarkup(React.createElement(Component, { reviewCards: cards }));
  assert(html.includes(source.text)); assert(!html.includes('five-star reviews')); assert(html.includes('Google reviews'));
  const navigation = schemaTypes.find(type => type.name === 'navigation');
  for (const name of ['footerServices', 'footerQuick', 'legalLinks']) {
    const control = navigation.fields.find(field => field.name === name).of[0].fields.find(field => field.name === 'opensInNewTab');
    assert.equal(control.hidden({ parent: { route: '/contact', opensInNewTab: true } }), false, name);
    assert.equal(control.hidden({ parent: { route: '/contact', opensInNewTab: false } }), true, name);
  }
});
