import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import ts from 'typescript';
import { buildContentManifest } from '../scripts/content-sync-lib.mjs';
const require = createRequire(import.meta.url);
const { reviewChecks, readinessIssues, reviewDigest, checkInsightReadiness, resolvePublishedInsights } = require('../sanity/lib/insight-review.ts');
const { resolveInsightOverrides } = require('../sanity/lib/insight-mapping.ts');
const { insightSeo } = require('../sanity/lib/insight-seo.ts');
const { insights } = require('../lib/insights.js');
const { insightsQuery } = require('../sanity/lib/insight-query.ts');
const { parse, evaluate } = require('groq-js');
const candidates = buildContentManifest().documents.filter(d => d.content._type === 'insight');
async function reviewed(index = 0) {
  const doc = { ...structuredClone(candidates[index].content), _id: 'fixture-' + index, sources: [{ title: 'LOCAL TEST source, not a clinical approval', url: 'https://example.org/local-source' }], review: { clinicianKey: 'sahil', approvalReference: 'LOCAL TEST evidence; never sent to Sanity', reviewedAt: '2026-10-16T10:00:00Z', ...Object.fromEntries(Object.keys(reviewChecks).map(k => [k, true])), recordedBy: 'local-test-editor', recordedAt: '2026-10-16T11:00:00Z' }, editorialStatus: 'ready' };
  doc.review.digest = await reviewDigest(doc); return doc;
}

test('legacy content remains parseable but cannot become a published override through title/body alone', async () => {
  const legacy = { ...candidates[0].content, _id: 'existing', slug: candidates[0].identity };
  assert.equal(resolveInsightOverrides([legacy], insights).status, 'sanity');
  assert.ok((await checkInsightReadiness(legacy)).some(i => i.path[0] === 'review'));
  assert.equal((await resolvePublishedInsights([legacy], insights)).overrides.length, 0);
});

test('reviewed publication uses actual query projection and strips internal sign-off details', async () => {
  const doc = await reviewed();
  const result = await (await evaluate(parse(insightsQuery), { dataset: [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }], params: { slugs: insights.map(i => i.slug) } })).get();
  assert.equal(result.length, 1); assert.deepEqual(await checkInsightReadiness(result[0]), []);
  const mapped = await resolvePublishedInsights(result, insights); assert.equal(mapped.status, 'sanity');
  assert.equal(mapped.overrides[0].reviewer.name, 'Dr. Sahil Wathodkar'); assert.equal(mapped.overrides[0].author, undefined);
  for (const key of ['review', 'approvalReference', 'recordedBy', 'digest', 'editorialStatus']) assert.equal(key in mapped.overrides[0], false);
});

test('all publication-relevant edits invalidate a recorded approval without invalidating it for Studio metadata', async () => {
  const doc = await reviewed(); assert.deepEqual(await checkInsightReadiness(doc), []);
  const changes = [d => d.title += ' changed', d => d.excerpt += ' changed', d => d.metaTitle = 'New SEO title', d => d.metaDescription = 'New SEO description', d => d.listingTitle = 'New listing title', d => d.listingExcerpt = 'New listing summary', d => d.date = '2024-04-01', d => d.modifiedAt = '2026-10-15T12:00:00Z', d => d.category = insights[1].category, d => d.featured = !d.featured, d => d.readTimeMinutes++, d => d.slug.current = insights[1].slug, d => d.body[0].children[0].text += ' changed', d => d.sources[0].url = 'https://example.org/changed', d => d.review.clinicianKey = 'aishwarya', d => d.review.approvalReference += ' changed', d => d.seo = { ogTitle: "Changed sharing title" }, d => d.seo = { canonicalRoute: "/about", visibilityReason: "Local fixture only" }, d => d.seo = { index: false, visibilityReason: "Local fixture only" }, d => d.seo = { structuredData: false }];
  for (const change of changes) {
    const edited = structuredClone(doc); change(edited);
    assert.ok((await checkInsightReadiness(edited)).length, change.toString());
    assert.equal((await resolvePublishedInsights([edited], insights)).overrides.length, 0);
  }
  const metadataOnly = { ...doc, _rev: 'changed', _updatedAt: '2026-10-17T00:00:00Z' };
  assert.equal(await reviewDigest(metadataOnly), doc.review.digest);
});

test('readiness requires real source/reviewer evidence, proper heading order, dates and checked authorship', async () => {
  const doc = await reviewed();
  for (const change of [d => d.sources = [], d => d.sources[0].url = 'javascript:bad', d => d.review.identityConfirmed = false, d => d.review.clinicianKey = 'invented', d => d.review.approvalReference = ' ', d => d.review.reviewedAt = '2099-01-01T00:00:00Z', d => d.modifiedAt = '2000-01-01T00:00:00Z', d => d.date = '2099-01-01', d => d.authorKey = 'sahil', d => d.body[0].style = 'h3', d => d.body.forEach(b => b.style = 'normal')]) {
    const bad = structuredClone(doc); change(bad); assert.ok(readinessIssues(bad).length, change.toString());
  }
  const authored = structuredClone(doc); authored.authorKey = 'aishwarya'; authored.review.authorshipConfirmed = true; authored.review.digest = await reviewDigest(authored);
  assert.deepEqual(await checkInsightReadiness(authored), []);
  const mapped = (await resolvePublishedInsights([authored], insights)).overrides[0];
  assert.equal(mapped.author.name, 'Dr. Aishwarya Kulkarni Wathodkar'); assert.notEqual(mapped.author.name, mapped.reviewer.name);
});

test('cover references, crops and alt produce the same digest before/after dereferencing, and edits become stale', async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  const doc = await reviewed(); doc.coverImage = { asset: { _ref: 'image-abc123-12000x8000-jpg' }, alt: 'Local image fixture', crop: { top: 0, bottom: 0, left: 0, right: 0 }, hotspot: { x: 0.5, y: 0.5, width: 0.2, height: 0.2 } };
  doc.review.digest = await reviewDigest(doc); assert.deepEqual(await checkInsightReadiness(doc), []);
  const asset = { _id: doc.coverImage.asset._ref, _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/ae09qs5c/production/abc123-12000x8000.jpg', mimeType: 'image/jpeg', metadata: { dimensions: { width: 12000, height: 8000 } } };
  const result = await (await evaluate(parse(insightsQuery), { dataset: [doc, asset], params: { slugs: insights.map(i => i.slug) } })).get();
  assert.deepEqual(await checkInsightReadiness(result[0]), []);
  for (const change of [d => d.coverImage.alt = 'Different description', d => d.coverImage.crop.top = 0.1, d => d.coverImage.hotspot.x = 0.6]) { const edited = structuredClone(doc); change(edited); assert.ok((await checkInsightReadiness(edited)).length); }
  const missing = await (await evaluate(parse(insightsQuery), { dataset: [doc], params: { slugs: insights.map(i => i.slug) } })).get();
  assert.ok((await checkInsightReadiness(missing[0])).length, 'missing asset fails closed');
});

test('reviewed partial coverage keeps collection ambiguity and effective Featured safeguards', async () => {
  const doc = await reviewed();
  assert.equal((await resolvePublishedInsights([doc, doc], insights)).status, 'ambiguous');
  const next = await reviewed(1); next.featured = true; next.review.digest = await reviewDigest(next);
  assert.equal((await resolvePublishedInsights([next], insights)).status, 'ambiguous', 'static Featured still counts');
  assert.equal((await resolvePublishedInsights([{ ...doc, _id: 'drafts.hidden' }], insights)).status, 'invalid');
});

test('SEO output matches canonical content, contextual overrides do not leak, and no authors/dates are invented', async () => {
  for (const article of insights) {
    const result = insightSeo(article);
    assert.equal(result.metadata.alternates.canonical, '/insights/' + article.slug);
    assert.equal(result.metadata.twitter.title, article.title); assert.equal(result.metadata.openGraph.images[0].url, article.image);
    assert.equal(result.structuredData.headline, article.title); assert.equal(result.structuredData.author, undefined); assert.equal(result.structuredData.dateModified, undefined);
  }
  const doc = await reviewed(), mapped = (await resolvePublishedInsights([doc], insights)).overrides[0];
  const result = insightSeo({ ...insights[0], ...mapped, metaDescription: 'Local SEO fixture', modifiedAt: '2026-10-15T00:00:00Z' });
  assert.equal(result.metadata.description, 'Local SEO fixture'); assert.equal(result.structuredData.dateModified, '2026-10-15T00:00:00Z');
  assert.equal(result.structuredData.author, undefined, 'reviewer is not fabricated as author');
  assert.deepEqual(result.structuredData.citation, [doc.sources[0].url]);
});

test('JSON-LD escapes a script-closing sequence while preserving the parsed article data', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server'), { JSDOM } = require('jsdom');
  const code = ts.transpileModule(fs.readFileSync('components/seo/JsonLd.js', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, allowJs: true } }).outputText;
  const exports = {}; new Function('require', 'exports', code)(require, exports);
  const schema = { headline: '</script><script>unsafe()</script>' };
  const html = renderToStaticMarkup(React.createElement(exports.default, { schema }));
  const d = new JSDOM(html).window.document;
  assert.equal(d.querySelectorAll('script').length, 1); assert.deepEqual(JSON.parse(d.querySelector('script').textContent), schema);
});

test('actual Studio document validation blocks incomplete or stale review and accepts the recorded content version', async () => {
  const { createSchema } = require('sanity'), { insight } = require('../sanity/schemaTypes/insight.ts');
  const schema = createSchema({ name: 'readiness-validator', types: [insight] });
  const validate = schema.get('insight').validation.flatMap(rule => rule._rules).filter(rule => rule.flag === 'custom').at(-1).constraint;
  const doc = await reviewed(); assert.equal(await validate(doc), true);
  const stale = structuredClone(doc); stale.excerpt += ' edited';
  assert.ok((await validate(stale)).some(issue => issue.path[0] === 'review'));
  assert.ok((await validate(candidates[0].content)).some(issue => issue.path[0] === 'editorialStatus'));
});

test('actual Studio sign-off action certifies only the saved draft revision and never publishes', async () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const filename = new URL('../sanity/studio/RecordInsightReviewAction.tsx', import.meta.url), localRequire = createRequire(filename);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const doc = await reviewed(); doc._id = 'drafts.local-test'; doc._rev = 'saved-revision';
  let saved = doc, patches = [], completed = 0, action;
  const client = { getDocument: async () => saved, patch: id => {
    const patch = { id }; patches.push(patch);
    const chain = { ifRevisionId: revision => { patch.revision = revision; return chain; }, set: values => { patch.values = values; return chain; }, commit: async () => ({ _id: id }) }; return chain;
  } };
  const exports = {}; new Function('require', 'exports', code)(id => id === 'sanity' ? { useClient: () => client, useCurrentUser: () => ({ id: 'local-editor' }) } : localRequire(id), exports);
  function Harness({ draft = doc, id = 'local-test' }) { action = exports.RecordInsightReviewAction({ draft, id, onComplete: () => completed++ }); return null; }
  renderToStaticMarkup(React.createElement(Harness)); assert.equal(action.disabled, false); await action.onHandle();
  assert.equal(completed, 1); assert.equal(patches.length, 1); assert.equal(patches[0].id, doc._id); assert.equal(patches[0].revision, doc._rev);
  assert.equal(patches[0].values.editorialStatus, 'ready'); assert.equal(patches[0].values.review.recordedBy, 'local-editor');
  assert.equal(patches[0].values.review.digest, await reviewDigest(doc));
  saved = { ...doc, _rev: 'someone-else-saved' }; await action.onHandle(); assert.equal(patches.length, 1);
  saved = { ...doc, sources: [] }; await action.onHandle(); assert.equal(patches.length, 1);
  renderToStaticMarkup(React.createElement(Harness, { draft: undefined, id: 'versions.release.local-test' })); assert.equal(action.disabled, true);
});

test('Studio never reports a matching approval while its first readiness check is pending', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const filename = new URL('../sanity/studio/InsightReadinessInput.tsx', import.meta.url), localRequire = createRequire(filename), exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', code)(id => id === 'sanity' ? { useFormValue: () => candidates[0].content } : localRequire(id), exports);
  const html = renderToStaticMarkup(React.createElement(exports.InsightReadinessInput, { renderDefault: () => null }));
  assert.match(html, /Checking editorial readiness/); assert.doesNotMatch(html, /Recorded review matches/);
});


test('advanced SEO and native social media retain a matching review through real GROQ, and sharing edits stale it', async () => {
  const doc = await reviewed();
  const asset = { _id: 'image-test123-12000x8000-jpg', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/ae09qs5c/production/test123-12000x8000.jpg', mimeType: 'image/jpeg', metadata: { dimensions: { width: 12000, height: 8000 } } };
  doc.seo = { ogTitle: 'Local fixture sharing title', socialImage: { alt: 'Local fixture image', asset: { _type: 'reference', _ref: asset._id } } };
  doc.review.digest = await reviewDigest(doc);
  const projected = await (await evaluate(parse(insightsQuery), { dataset: [doc, asset], params: { slugs: insights.map(i => i.slug) } })).get();
  assert.deepEqual(await checkInsightReadiness(projected[0]), []);
  assert.equal((await resolvePublishedInsights(projected, insights)).overrides.length, 1);
  projected[0].seo.twitterTitle = 'Different sharing headline';
  assert.ok((await checkInsightReadiness(projected[0])).length);
});
