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
  assert.match((await checkInsightReadiness(legacy)).find(i => i.path[0] === 'sources').message, /real clinical source/);
  assert.match((await checkInsightReadiness(legacy)).find(i => i.path[0] === 'review').message, /actual reviewing clinician/);
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
  assert.equal((await resolvePublishedInsights([next], insights)).status, 'sanity', 'a reviewed CMS selection replaces the static Featured default');
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
  const exports = {}; new Function('require', 'exports', code)(id => id === 'sanity' ? { useClient: () => client, useCurrentUser: () => ({ id: 'local-editor' }), useDocumentOperation: () => ({ patch: { disabled: false } }) } : localRequire(id), exports);
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
  new Function('require', 'exports', code)(id => id === 'sanity' ? { getPublishedId: id => id, useFormValue: () => candidates[0].content, useFormCallbacks: () => ({}), useValidationStatus: () => ({ validation: [], isValidating: true }) } : localRequire(id), exports);
  const html = renderToStaticMarkup(React.createElement(exports.InsightReadinessInput, { renderDefault: () => null }));
  assert.match(html, /Checking what is left to do/); assert.doesNotMatch(html, /All checks passed/);
});

test('native Studio markers target source, review, Portable Text and conditional authorship inputs', async () => {
  const { createSchema } = require('sanity');
  const { validateDocumentWithWorkspace } = require('@sanity/validation');
  const { insight } = require('../sanity/schemaTypes/insight.ts');
  const { withPageSeo } = require('../sanity/schemaTypes/seo.ts');
  const schema = createSchema({ name: 'insight-field-markers', types: [withPageSeo(insight)] });
  const client = require('@sanity/client').createClient({ projectId: 'ae09qs5c', dataset: 'production', apiVersion: '2026-10-16', useCdn: false });
  client.fetch = async query => query.startsWith('!defined(') ? true : null;
  client.withConfig = () => client;
  const validate = async document => {
    const names = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'], previous = names.map(name => process.env[name]);
    try {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
      return (await validateDocumentWithWorkspace({ document, workspace: { schema, getClient: () => client }, environment: 'studio', getDocumentExists: async () => false })).filter(marker => marker.level === 'error');
    } finally { names.forEach((name, index) => previous[index] === undefined ? delete process.env[name] : process.env[name] = previous[index]); }
  };
  const good = await reviewed(); good.featured = false; good.review.digest = await reviewDigest(good);
  assert.deepEqual(await validate(good), [], 'a recorded local fixture is valid without remote writes');
  const incomplete = await validate({ _id: 'drafts.local-only', _type: 'insight', editorialStatus: 'draft', featured: false });
  for (const field of ['slug', 'title', 'excerpt', 'category', 'date', 'body', 'readTimeMinutes', 'sources', 'review', 'editorialStatus']) assert.ok(incomplete.some(marker => marker.path[0] === field), `${field}: ${JSON.stringify(incomplete)}`);
  assert.ok(incomplete.every(marker => marker.path.length && !/^(Required|Expected |Invalid literal)/.test(marker.message)));
  const partial = structuredClone(good);
  partial.sources = [{ _key: 'first', title: 'Source one', url: 'https://example.org/a' }, { _key: 'second', title: ' ', url: 'http://example.org/b' }];
  partial.review.identityConfirmed = false; partial.review.approvalReference = ' ';
  partial.authorKey = 'sahil';
  partial.body.unshift({ _type: 'block', _key: 'bad-heading', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 'text', text: 'Subheading', marks: [] }] });
  const errors = await validate(partial);
  for (const path of [['sources', { _key: 'second' }, 'title'], ['sources', { _key: 'second' }, 'url'], ['review', 'identityConfirmed'], ['review', 'approvalReference'], ['review', 'authorshipConfirmed'], ['body', { _key: 'bad-heading' }]]) assert.ok(errors.some(marker => JSON.stringify(marker.path) === JSON.stringify(path)), JSON.stringify(path));
  assert.equal(new Set(errors.map(marker => JSON.stringify(marker.path))).size, errors.length, 'one blocking instruction per affected input');
  partial.sources.reverse();
  assert.ok((await validate(partial)).some(marker => JSON.stringify(marker.path) === JSON.stringify(['sources', { _key: 'second' }, 'url'])));
  const { insightFieldErrors } = require('../sanity/lib/insight-review.ts');
  assert.equal(insightFieldErrors('metaTitle', undefined), true);
  assert.equal(insightFieldErrors('metaTitle', ' '), true, 'cleared optional overrides use the article title');
  assert.notEqual(insightFieldErrors('metaTitle', '<b>Invalid override</b>'), true, 'nonblank invalid overrides still block publication');
  const duplicate = insightFieldErrors('sources', [{ _key: 'a', title: 'One', url: 'https://example.org/a' }, { _key: 'b', title: 'Two', url: 'https://example.org/a' }]);
  assert.deepEqual(duplicate[0].path, [{ _key: 'b' }, 'url']);
  const body = structuredClone(good.body); body[0].markDefs = [{ _type: 'link', _key: 'bad-link', href: 'javascript:bad' }];
  const links = insightFieldErrors('body', body);
  assert.deepEqual(links[0].path, [{ _key: body[0]._key }, 'markDefs', { _key: 'bad-link' }, 'href']);
  const duplicateBlocks = structuredClone(good.body); duplicateBlocks[1]._key = duplicateBlocks[0]._key;
  assert.deepEqual(insightFieldErrors('body', duplicateBlocks)[0].path, [1], 'duplicate block identifiers need an unambiguous index target');
  const unsupported = structuredClone(good.body); unsupported[0].style = 'h1';
  assert.deepEqual(insightFieldErrors('body', unsupported)[0].path, [{ _key: unsupported[0]._key }], 'style errors focus the text block, not an internal metadata field');
  const seo = structuredClone(good); seo.seo = { ogTitle: '<b>Invalid title</b>', index: false };
  const seoErrors = await validate(seo);
  for (const path of [['seo', 'ogTitle'], ['seo', 'visibilityReason']]) assert.equal(seoErrors.filter(marker => JSON.stringify(marker.path) === JSON.stringify(path)).length, 1, JSON.stringify(path));
  assert.ok(!seoErrors.some(marker => marker.path.length === 1 && marker.path[0] === 'seo'));
  seo.seo = { secondaryKeywords: Array.from({ length: 9 }, (_, index) => 'Unique phrase ' + index) };
  assert.equal((await validate(seo)).filter(marker => JSON.stringify(marker.path) === JSON.stringify(['seo', 'secondaryKeywords'])).length, 1);
  seo.seo = { secondaryKeywords: ['same phrase', 'same phrase'] };
  assert.ok((await validate(seo)).some(marker => /repeated related keywords/.test(marker.message)));
  const missingImage = structuredClone(good); missingImage.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: 'image-local-1600x900-jpg' }, alt: 'Local fixture' };
  assert.ok((await validate(missingImage)).some(marker => marker.path[0] === 'coverImage'), 'missing referenced assets remain publication blockers');
});

test('readiness focuses draft fields while the article picker supports existing choices and native new-address input', async () => {
  const React = require('react'), { createRoot } = require('react-dom/client'), { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="root"></div>');
  const globals = ['window', 'document', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'];
  const previous = globals.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const filename = new URL('../sanity/studio/InsightReadinessInput.tsx', import.meta.url), localRequire = createRequire(filename), exports = {};
  const draft = { _id: 'drafts.local-test', _rev: 'current-revision' }, calls = [];
  const path = ['sources', { _key: 'second-source' }, 'url'];
  let status = { isValidating: false, revision: draft._rev, validation: [{ level: 'error', path, message: 'Enter the source’s full HTTPS link.' }] };
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', code)(id => id === 'sanity' ? {
    set: require('sanity').set, setIfMissing: require('sanity').setIfMissing,
    useFormValue: () => draft,
    useValidationStatus: (id, type, references) => { assert.equal(id, draft._id); assert.equal(type, 'insight'); assert.equal(references, true); return status; },
    useFormCallbacks: () => ({ onFieldGroupSelect: (...args) => calls.push(['group', ...args]), onPathOpen: value => calls.push(['open', value]), onPathFocus: value => calls.push(['focus', value]) }),
  } : localRequire(id), exports);
  let root;
  try {
    for (const [index, name] of globals.entries()) Object.defineProperty(globalThis, name, { configurable: true, value: [dom.window, dom.window.document, dom.window.navigator, true][index] });
    root = createRoot(dom.window.document.getElementById('root'));
    const render = () => React.act(async () => root.render(React.createElement(exports.InsightReadinessInput, { renderDefault: () => React.createElement('select', { 'aria-label': 'Editorial status' }) })));
    await render();
    assert.ok(dom.window.document.querySelector('select'), 'native input is preserved');
    assert.equal(dom.window.document.querySelector('details').open, false, 'draft guidance starts concise');
    assert.match(dom.window.document.body.textContent, /Doctor’s approval/);
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.deepEqual(calls, [['group', [], 'review'], ['open', path], ['focus', path]]);
    status = { ...status, revision: 'older-revision' }; await render();
    assert.match(dom.window.document.body.textContent, /Checking what is left to do/);
    assert.equal(dom.window.document.querySelector('button'), null, 'stale markers are not offered as current');
    status = { isValidating: true, revision: draft._rev, validation: [] }; await render();
    assert.doesNotMatch(dom.window.document.body.textContent, /All checks passed/);
    status = { ...status, isValidating: false }; await render();
    assert.match(dom.window.document.body.textContent, /All checks passed/);
    assert.match(dom.window.document.body.textContent, /Save doctor’s approval/);
    const patches = [];
    const pickerProps = { elementProps: { id: 'article-choice', 'aria-describedby': 'article-help', style: {} }, value: { _type: 'slug', current: insights[0].slug }, onChange: value => patches.push(value), renderDefault: props => React.createElement('input', { id: props.elementProps.id, value: props.value.current, readOnly: true, 'aria-label': 'Native article address' }) };
    await React.act(async () => root.render(React.createElement(exports.InsightArticleInput, pickerProps)));
    let select = dom.window.document.querySelector('select');
    assert.equal(select.getAttribute('aria-describedby'), 'article-help');
    assert.equal(select.value, insights[0].slug);
    assert.deepEqual([...select.options].slice(1).map(option => option.textContent), insights.map(article => article.title));
    assert.equal(patches.length, 0, 'rendering an existing article never writes to its document');
    await React.act(async () => { select.value = insights[5].slug; select.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
    assert.equal(patches.length, 1);
    assert.equal(patches[0][0].type, 'setIfMissing');
    assert.deepEqual(patches[0][0].value, { _type: 'slug' });
    assert.deepEqual(patches[0][1].path, ['current']);
    assert.equal(patches[0][1].value, insights[5].slug);
    await React.act(async () => root.render(React.createElement(exports.InsightArticleInput, { ...pickerProps, readOnly: true })));
    select = dom.window.document.querySelector('select'); assert.equal(select.disabled, true);
    await React.act(async () => { select.value = insights[1].slug; select.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
    assert.equal(patches.length, 1, 'read-only editors cannot change the article');
    await React.act(async () => root.render(React.createElement(exports.InsightArticleInput, { ...pickerProps, value: { _type: 'slug', current: 'unknown-stored-article' } })));
    select = dom.window.document.querySelector('select');
    assert.equal(select.value, '', 'new addresses do not masquerade as a preset article');
    assert.equal(dom.window.document.querySelector('input').value, 'unknown-stored-article', 'native input retains the new address without rewriting it');
    assert.equal(patches.length, 1);
  } finally {
    if (root) await React.act(async () => root.unmount());
    globals.forEach((name, index) => previous[index] ? Object.defineProperty(globalThis, name, previous[index]) : Reflect.deleteProperty(globalThis, name));
    dom.window.close();
  }
});

test('article body heading control inserts native text without replacing content or granting approval', async () => {
  const React = require('react'), { createRoot } = require('react-dom/client'), { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="root"></div>');
  const globals = ['window', 'document', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'];
  const previous = globals.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const filename = new URL('../sanity/studio/InsightReadinessInput.tsx', import.meta.url), localRequire = createRequire(filename), exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', code)(localRequire, exports);
  const changes = [], focus = [];
  const doc = await reviewed();
  doc.body.forEach(block => block.style = 'normal');
  const original = structuredClone(doc.body);
  const props = { id: 'article-body', value: doc.body, onChange: value => changes.push(require('sanity').PatchEvent.from(value).patches), onPathFocus: path => focus.push(path), renderDefault: () => React.createElement('div', { 'data-native-editor': true }, 'Native text editor') };
  let root;
  try {
    for (const [index, name] of globals.entries()) Object.defineProperty(globalThis, name, { configurable: true, value: [dom.window, dom.window.document, dom.window.navigator, true][index] });
    root = createRoot(dom.window.document.getElementById('root'));
    const render = async additions => React.act(async () => root.render(React.createElement(exports.InsightBodyInput, { ...props, ...additions })));
    await render();
    assert(dom.window.document.querySelector('[data-native-editor]'));
    const input = dom.window.document.querySelector('input');
    assert.equal(input.labels[0].textContent, 'Section heading');
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(changes.length, 0, 'blank headings never write placeholder content');
    input.value = 'Preparing for your appointment';
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(changes.length, 1);
    assert.equal(changes[0][0].type, 'setIfMissing');
    const patch = changes[0][1], heading = patch.items[0];
    assert.equal(patch.type, 'insert'); assert.equal(patch.position, 'after'); assert.deepEqual(patch.path, [-1]);
    assert.equal(heading.style, 'h2'); assert.equal(heading.children[0].text, 'Preparing for your appointment');
    assert(heading._key); assert(heading.children[0]._key);
    assert.deepEqual(doc.body, original, 'the control never mutates or replaces the existing body');
    const edited = { ...doc, body: [...doc.body, heading] };
    assert(!readinessIssues(edited).some(issue => /meaningful H2/.test(issue.message)));
    assert((await checkInsightReadiness(edited)).some(issue => issue.path[0] === 'review'), 'a body edit still requires renewed doctor approval');
    assert.deepEqual(focus, [[{ _key: heading._key }]]);
    await render({ readOnly: true });
    assert(dom.window.document.querySelector('input').disabled);
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(changes.length, 1);
    await render({ value: Array.from({ length: 200 }, () => original[0]) });
    assert(dom.window.document.querySelector('button').disabled);
    assert.match(dom.window.document.body.textContent, /reached 200 blocks/);
    await render({ value: undefined });
    dom.window.document.querySelector('input').value = 'First section';
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(changes.length, 2, 'a new article needs no pre-existing body array');
  } finally {
    if (root) await React.act(async () => root.unmount());
    dom.window.close();
    globals.forEach((name, index) => previous[index] ? Object.defineProperty(globalThis, name, previous[index]) : delete globalThis[name]);
  }
});

test('doctor approval is visible beside its fields and both menus, with review, revision and permission safeguards', async () => {
  const React = require('react'), { createRoot } = require('react-dom/client'), { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="root"></div>');
  const globals = ['window', 'document', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'];
  const previous = globals.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const filename = new URL('../sanity/studio/RecordInsightReviewAction.tsx', import.meta.url), localRequire = createRequire(filename), exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const complete = { ...await reviewed(), _id: 'drafts.local-review-control', _rev: 'saved-revision' };
  let document = { ...complete, review: { ...complete.review, identityConfirmed: false } }, permission, user = { id: 'local-editor' }, saved, completed;
  const writes = [];
  let commitFinished;
  const committed = new Promise(resolve => { commitFinished = resolve; });
  const client = { getDocument: async () => structuredClone(saved ?? document), patch: id => ({
    ifRevisionId(revision) { assert.equal(id, document._id); assert.equal(revision, document._rev); return this; },
    set(value) { writes.push(value); return this; },
    async commit() { commitFinished(); },
  }) };
  new Function('require', 'exports', code)(id => id === 'sanity' ? {
    getPublishedId: require('sanity').getPublishedId, useClient: () => client, useCurrentUser: () => user,
    useDocumentOperation: () => ({ patch: { disabled: permission } }), useFormValue: () => document,
  } : localRequire(id), exports);
  let root;
  const envNames = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'], envPrevious = envNames.map(name => process.env[name]);
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    for (const [index, name] of globals.entries()) Object.defineProperty(globalThis, name, { configurable: true, value: [dom.window, dom.window.document, dom.window.navigator, true][index] });
    root = createRoot(dom.window.document.getElementById('root'));
    const render = async additions => React.act(async () => root.render(React.createElement(exports.InsightReviewInput, { renderDefault: () => React.createElement('div', { 'data-native-review': true }, 'Native review fields'), ...additions })));
    await render();
    assert(dom.window.document.querySelector('[data-native-review]'));
    assert.equal(dom.window.document.querySelector('button').textContent, 'Save doctor’s approval');
    assert.equal(dom.window.document.querySelector('button').style.borderStyle, 'solid');
    assert.equal(dom.window.document.querySelector('button').style.borderWidth, '1px');
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(writes.length, 0);
    assert.match(dom.window.document.querySelector('[role="alert"]').textContent, /Tick this box only after/);
    document = structuredClone(complete);
    saved = { ...document, _rev: 'newer-saved-revision' };
    await render();
    await React.act(async () => dom.window.document.querySelector('button').click());
    assert.equal(writes.length, 0);
    assert.match(dom.window.document.querySelector('[role="alert"]').textContent, /draft changed/);
    saved = undefined;
    await render();
    await React.act(async () => { dom.window.document.querySelector('button').click(); await committed; });
    assert.equal(writes.length, 1);
    assert.equal(writes[0].editorialStatus, 'ready');
    assert.equal(writes[0].review.digest, await reviewDigest(complete));
    assert.equal(writes[0].review.recordedBy, 'local-editor');
    assert.equal(writes[0].review.approvalReference, complete.review.approvalReference);
    assert.deepEqual(document, complete, 'the UI does not rewrite article text or confirmation checkboxes');
    for (const state of ['permission', 'signed-out', 'read-only']) {
      permission = state === 'permission' ? 'INSUFFICIENT_PERMISSIONS' : undefined;
      user = state === 'signed-out' ? null : { id: 'local-editor' };
      await render({ readOnly: state === 'read-only' });
      assert(dom.window.document.querySelector('button').disabled, state);
    }
    permission = undefined; user = { id: 'local-editor' };
    function MenuProbe() { completed = exports.RecordInsightReviewAction({ id: 'local-review-control', type: 'insight', draft: complete, onComplete: () => {} }); return null; }
    await React.act(async () => root.render(React.createElement(MenuProbe)));
    assert.deepEqual(completed.group, ['default', 'paneActions']);
  } finally {
    if (root) await React.act(async () => root.unmount());
    dom.window.close();
    globals.forEach((name, index) => previous[index] ? Object.defineProperty(globalThis, name, previous[index]) : delete globalThis[name]);
    envNames.forEach((name, index) => envPrevious[index] === undefined ? delete process.env[name] : process.env[name] = envPrevious[index]);
  }
});

test('treatment readiness opens exact keyed fields with bordered controls and never invents approval', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const filename = new URL('../sanity/studio/DocumentStatusInput.tsx', import.meta.url), localRequire = createRequire(filename), exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const doc = { _id: 'drafts.local-treatment', _rev: 'current', _type: 'service' };
  const path = ['process', { _key: 'step-three' }, 'step'], calls = [];
  let status = { isValidating: false, revision: 'current', validation: [{ level: 'error', path, message: 'Use step 3 at this position.' }] };
  new Function('require', 'exports', code)(id => id === 'sanity' ? {
    useValidationStatus: () => status,
    useFormCallbacks: () => ({ onFieldGroupSelect: (...args) => calls.push(['group', ...args]), onPathOpen: path => calls.push(['open', path]), onPathFocus: path => calls.push(['focus', path]) }),
  } : localRequire(id), exports);
  const view = exports.TreatmentReadinessInput({ document: doc });
  const buttons = [];
  function walk(element) { if (!React.isValidElement(element)) return; if (element.type === 'button') buttons.push(element); React.Children.forEach(element.props.children, walk); }
  walk(view);
  assert(buttons.length >= 2);
  assert.equal(buttons[0].props.style.border, '1px solid currentColor');
  buttons[0].props.onClick();
  assert.deepEqual(calls, [['group', [], 'process'], ['open', path], ['focus', path]]);
  const html = renderToStaticMarkup(view);
  assert.match(html, /Treatment steps.*Step number/);
  assert.match(html, /Have the clinic check/);
  assert.doesNotMatch(html, /Save doctor|approval saved/);
  status = { ...status, revision: 'older' };
  assert.match(renderToStaticMarkup(exports.TreatmentReadinessInput({ document: doc })), /Checking treatment fields/);
  assert.deepEqual(doc, { _id: 'drafts.local-treatment', _rev: 'current', _type: 'service' });
});

test('a new article reaches query, review gate, listing and metadata without a preset URL or fabricated cover', async () => {
  const { applyInsightOverrides } = require('../sanity/lib/insight-overrides.ts');
  const doc = await reviewed(1);
  doc._id = 'local-new-article'; doc.slug = { current: 'local-new-clinic-article' }; doc.featured = false;
  doc.review.digest = await reviewDigest(doc);
  const dataset = [doc, { ...doc, _id: 'drafts.local-new-article' }, { ...doc, _id: 'versions.local.local-new-article' }];
  const result = await (await evaluate(parse(insightsQuery), { dataset })).get();
  assert.equal(result.length, 1);
  const mapped = await resolvePublishedInsights(result, insights);
  assert.equal(mapped.status, 'sanity');
  const added = applyInsightOverrides(insights, mapped.overrides).find(article => article.slug === doc.slug.current);
  assert.ok(added); assert.equal(added.title, doc.title); assert.deepEqual(added.body, mapped.overrides[0].body);
  assert.equal(added.image, '', 'new articles do not inherit an unrelated stock photograph');
  assert.equal(insightSeo(added).metadata.alternates.canonical, '/insights/local-new-clinic-article');
  const changed = structuredClone(result); changed[0].title += ' changed';
  assert.equal((await resolvePublishedInsights(changed, insights)).status, 'invalid', 'the same stale-review protection applies to newly created URLs');
  const unreviewed = structuredClone(result); unreviewed[0].editorialStatus = 'draft';
  assert.equal((await resolvePublishedInsights(unreviewed, insights)).overrides.length, 0);
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
