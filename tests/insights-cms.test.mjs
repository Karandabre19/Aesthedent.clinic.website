import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

// Match the project's extensionless TS imports without changing its tsconfig or
// installing a test runner. Execute the real modules through the installed compiler.
const require = createRequire(import.meta.url);
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText, filename);
  };
}
const { createSchema } = require('sanity');
const { parse, evaluate } = require('groq-js');
const { JSDOM } = require('jsdom');
const { renderToStaticMarkup } = require('react-dom/server');
const { createElement } = require('react');
const { insights } = require('../lib/insights.js');
const { resolveInsightOverrides, insightBody, safeInsightLink } = require('../sanity/lib/insight-mapping.ts');
const { applyInsightOverrides } = require('../sanity/lib/insight-overrides.ts');
const { insightsQuery, insightFeaturedQuery } = require('../sanity/lib/insight-query.ts');
const { sanityEnvironment } = require('../sanity/env.ts');
const { insight } = require('../sanity/schemaTypes/insight.ts');
const InsightBody = require('../components/insights/InsightBody.tsx').default;

function sourceValue(path, name) {
  const source = ts.createSourceFile(path, readFileSync(new URL('../' + path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  let initializer;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) initializer = node.initializer.getText(source);
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(initializer, name);
  return new Function(`return (${initializer});`)();
}
const bodies = sourceValue('app/insights/[slug]/InsightDetailClient.js', 'insightsData');
const listing = sourceValue('app/insights/InsightsClient.js', 'fallbackInsights');

// Convert only existing source HTML into local fixtures; this is not a migration.
function portableBody(html) {
  const document = new JSDOM(html).window.document;
  let nextKey = 0;
  const key = () => `fixture-${nextKey++}`;
  function paragraph(element, listItem, level) {
    const markDefs = [], children = [];
    function spans(node, marks = []) {
      if (node.nodeType === 3) { children.push({ _type: 'span', _key: key(), text: node.textContent, marks }); return; }
      if (node.tagName === 'UL' || node.tagName === 'OL') return;
      if (node.tagName === 'BR') { children.push({ _type: 'span', _key: key(), text: '\n', marks }); return; }
      let extra = [];
      if (node.tagName === 'STRONG' || node.tagName === 'B') extra = ['strong'];
      if (node.tagName === 'EM' || node.tagName === 'I') extra = ['em'];
      if (node.tagName === 'A') { const id = key(); markDefs.push({ _type: 'link', _key: id, href: node.getAttribute('href') }); extra = [id]; }
      for (const child of node.childNodes) spans(child, [...marks, ...extra]);
    }
    spans(element);
    return { _type: 'block', _key: key(), style: element.tagName === 'H2' ? 'h2' : element.classList.contains('lead') ? 'lead' : 'normal',
      children, markDefs, ...(listItem ? { listItem, level } : {}) };
  }
  const blocks = [];
  function walk(element, level = 1) {
    if (element.tagName === 'UL' || element.tagName === 'OL') {
      for (const item of element.children) {
        assert.equal(item.tagName, 'LI');
        blocks.push(paragraph(item, element.tagName === 'UL' ? 'bullet' : 'number', level));
        for (const nested of item.children) if (nested.tagName === 'UL' || nested.tagName === 'OL') walk(nested, level + 1);
      }
    } else {
      assert.ok(['P', 'H2'].includes(element.tagName), element.tagName);
      blocks.push(paragraph(element));
    }
  }
  for (const element of document.body.children) walk(element);
  return blocks;
}
function fixture(slug = insights[0].slug) {
  const item = insights.find((article) => article.slug === slug);
  return { _id: `fixture-${slug}`, _type: 'insight', slug, title: item.title, excerpt: item.excerpt, metaTitle: item.metaTitle,
    date: new Date(`${item.date} UTC`).toISOString().slice(0, 10), category: item.category, readTimeMinutes: parseInt(item.readTime), featured: item.featured,
    body: portableBody(bodies[slug].content) };
}

test('all six existing article bodies validate with their actual headings, lists, emphasis and links', () => {
  assert.deepEqual(Object.keys(bodies), insights.map((article) => article.slug));
  const result = resolveInsightOverrides(insights.map((item) => fixture(item.slug)), insights);
  assert.equal(result.status, 'sanity');
  assert.equal(result.overrides.length, 6);
  for (const override of result.overrides) {
    const existing = insights.find((item) => item.slug === override.slug);
    assert.equal(override.date, existing.date);
    assert.equal(override.readTime, existing.readTime);
    assert.equal(override.title, existing.title);
  }
});

test('Portable Text renderer retains source semantics and internal link destinations for every body', () => {
  for (const item of insights) {
    const value = insightBody.parse(fixture(item.slug).body);
    const html = renderToStaticMarkup(createElement(InsightBody, { value }));
    const before = new JSDOM(bodies[item.slug].content).window.document.body;
    const after = new JSDOM(html).window.document.body;
    const normalized = (element) => element.textContent.replace(/\s+/g, ' ').trim();
    assert.deepEqual([...after.querySelectorAll('p,h2,li')].map(normalized), [...before.querySelectorAll('p,h2,li')].map(normalized));
    for (const tag of ['h2', 'li', 'strong', 'a', '.lead']) assert.equal(after.querySelectorAll(tag).length, before.querySelectorAll(tag).length, `${item.slug}/${tag}`);
    assert.deepEqual([...after.querySelectorAll('a')].map((a) => a.getAttribute('href')), [...before.querySelectorAll('a')].map((a) => a.getAttribute('href')));
  }
});

test('missing CMS content preserves all context-specific fallback copy, IDs, images and ordering', () => {
  const result = resolveInsightOverrides([], insights);
  assert.equal(result.status, 'missing');
  for (const existing of [insights, listing]) {
    const merged = applyInsightOverrides(existing, result.overrides);
    assert.deepEqual(merged, existing);
    merged.forEach((item, index) => assert.equal(item, existing[index]));
  }
  assert.notEqual(listing[0].title, insights[0].title);
});

test('valid partial coverage updates matching cards and metadata without changing routes or covers', () => {
  const doc = fixture();
  const result = resolveInsightOverrides([doc], insights);
  assert.equal(result.status, 'sanity');
  for (const existing of [insights, listing]) {
    const merged = applyInsightOverrides(existing, result.overrides);
    assert.deepEqual(merged.map((item) => item.slug), existing.map((item) => item.slug));
    assert.equal(merged[0].id, existing[0].id);
    assert.equal(merged[0].image, existing[0].image);
    assert.equal(merged[0].metaTitle, insights[0].metaTitle);
    assert.equal(merged[1], existing[1]);
  }
  const next = fixture(insights[1].slug); delete next.metaTitle;
  assert.equal(resolveInsightOverrides([next], insights).overrides[0].metaTitle, next.title);
});

test('malformed, ambiguous, draft, release and unknown-route documents retain all fallback content', () => {
  const empty = fixture(); empty.body = [];
  const invalidDate = fixture(); invalidDate.date = '2025-02-30';
  for (const input of [null, {}, [empty], [invalidDate], [fixture(), fixture()], [{ ...fixture(), _id: 'drafts.hidden' }], [{ ...fixture(), _id: 'versions.release.hidden' }], [{ ...fixture(), slug: 'new-route' }]]) {
    assert.deepEqual(resolveInsightOverrides(input, insights).overrides, []);
  }
  assert.equal(resolveInsightOverrides([fixture(), fixture()], insights).status, 'ambiguous');
});

test('conflicting featured flags fall back rather than silently choosing different featured cards', () => {
  const next = fixture(insights[1].slug); next.featured = true;
  assert.equal(resolveInsightOverrides([next], insights).status, 'ambiguous');
  const first = fixture(); first.featured = false;
  assert.equal(resolveInsightOverrides([first, next], insights).status, 'sanity');
});

test('unsafe links, unknown rich types, missing mark targets and duplicate keys fail closed', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,bad', '//evil.test', '/\\evil.test', 'http://example.com', 'https://user:secret@example.com', '/path\n']) assert.equal(safeInsightLink.safeParse(href).success, false, href);
  for (const href of ['/doctor', '/services/root-canal', '#section', 'https://www.aesthedentpune.com/doctor']) assert.equal(safeInsightLink.safeParse(href).success, true);
  for (const mutate of [
    (doc) => { doc.body[0]._type = 'image'; },
    (doc) => { doc.body[0].children[0].marks = ['missing-link']; },
    (doc) => { doc.body[1]._key = doc.body[0]._key; },
    (doc) => { doc.body[0].markDefs = [{ _type: 'link', _key: 'unsafe', href: 'javascript:alert(1)' }]; },
  ]) {
    const doc = fixture(); mutate(doc);
    assert.equal(resolveInsightOverrides([doc], insights).status, 'invalid');
  }
});

test('new CMS text is escaped as React content rather than accepted as HTML', () => {
  const value = insightBody.parse([{ _type: 'block', _key: 'escaped', style: 'normal', children: [{ _type: 'span', _key: 'span', text: '<img src=x onerror=alert(1)>', marks: [] }], markDefs: [] }]);
  const html = renderToStaticMarkup(createElement(InsightBody, { value }));
  assert.match(html, /&lt;img/);
  assert.equal(new JSDOM(html).window.document.querySelectorAll('img,script').length, 0);
});

test('actual GROQ filters drafts/releases and projects valid Portable Text, including absent optional fields', async () => {
  const doc = fixture(); doc.slug = { current: doc.slug }; delete doc.body[0].markDefs; delete doc.body[0].children[0].marks;
  const dataset = [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }, { ...doc, _id: 'unrelated', _type: 'doctor' }];
  const result = await (await evaluate(parse(insightsQuery), { dataset, params: { slugs: insights.map((item) => item.slug) } })).get();
  assert.equal(result.length, 1);
  assert.equal(result[0].body[0].listItem, null);
  assert.equal(resolveInsightOverrides(result, insights).status, 'sanity');
});

test('configuration validates public identifiers and API dates without requiring credentials', () => {
  assert.equal(sanityEnvironment.safeParse({ projectId: 'ae09qs5c', dataset: 'production' }).success, true);
  for (const input of [{}, { projectId: 'bad', dataset: 'production' }, { projectId: 'ae09qs5c', dataset: 'production', apiVersion: '2025-02-30' }]) assert.equal(sanityEnvironment.safeParse(input).success, false);
});

test('featured peer query excludes the current document, drafts, releases and unrelated routes', async () => {
  const doc = fixture(); doc.slug = { current: doc.slug };
  const dataset = [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }, { ...doc, _id: 'other-route', slug: { current: 'unknown' } }, { ...doc, _id: 'different-type', _type: 'doctor' }];
  const params = { slugs: insights.map((item) => item.slug), id: doc._id };
  assert.deepEqual(await (await evaluate(parse(insightFeaturedQuery), { dataset, params })).get(), []);
  params.id = 'another-document';
  assert.deepEqual(await (await evaluate(parse(insightFeaturedQuery), { dataset, params })).get(), [{ slug: doc.slug.current, featured: doc.featured }]);
});

test('actual server reader forwards one cache policy and distinguishes missing, invalid and failed reads safely', async () => {
  // Replace only the external SDK boundary and the framework's server-only marker.
  // Execute the actual client, environment, reader, query and mapping modules.
  function execute(path, dependencies) {
    const filename = new URL('../' + path, import.meta.url);
    const localRequire = createRequire(filename), exports = {};
    const output = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    new Function('require', 'exports', output)((id) => id === 'server-only' ? {} : dependencies[id] ?? localRequire(id), exports);
    return exports;
  }
  const names = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'];
  const previous = names.map((name) => process.env[name]), originalError = console.error;
  let response = [], fail = false, calls = 0, configuration;
  const messages = [];
  console.error = (message) => messages.push(message);
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    const client = execute('sanity/lib/client.ts', { 'next/headers': { draftMode: async () => ({ isEnabled: false }) }, 'next-sanity': { createClient: (config) => {
      configuration = config;
      return { fetch: async (query, params, options) => {
        calls++;
        assert.equal(query, insightsQuery);
        assert.deepEqual(params.slugs, insights.map((item) => item.slug));
        assert.deepEqual(options, { cache: 'force-cache', next: { revalidate: 60, tags: ['insights'] } });
        if (fail) throw new Error('upstream diagnostic must remain private');
        return response;
      } };
    } } });
    const { getInsightOverrides } = execute('sanity/lib/insights.ts', { './client': client });
    assert.deepEqual(await getInsightOverrides(), []); assert.deepEqual(messages, []);
    assert.equal(configuration.perspective, 'published'); assert.equal(configuration.useCdn, false);
    assert.equal(configuration.timeout, 5000); assert.equal(configuration.maxRetries, 0);
    response = [fixture()]; assert.equal((await getInsightOverrides()).length, 0, 'unreviewed legacy content is not an approved CMS override');
    const { reviewChecks, reviewDigest } = require('../sanity/lib/insight-review.ts');
    const ready = { ...fixture(), editorialStatus: 'ready', sources: [{ title: 'Local test evidence only', url: 'https://example.org/local-test' }], review: { clinicianKey: 'sahil', approvalReference: 'Local fixture, never a remote approval', reviewedAt: '2026-10-16T10:00:00Z', recordedAt: '2026-10-16T11:00:00Z', recordedBy: 'local-test', ...Object.fromEntries(Object.keys(reviewChecks).map(key => [key, true])) } };
    ready.review.digest = await reviewDigest(ready); response = [ready];
    const approved = await getInsightOverrides(); assert.equal(approved.length, 1); assert.equal(approved[0].reviewer.name, 'Dr. Sahil Wathodkar'); assert.equal('review' in approved[0], false);
    response = [{ ...fixture(), body: [] }]; assert.deepEqual(await getInsightOverrides(), []);
    assert.match(messages.at(-1), /Invalid or ambiguous/);
    fail = true; assert.deepEqual(await getInsightOverrides(), []);
    assert.match(messages.at(-1), /CMS read failed/); assert.doesNotMatch(messages.join(' '), /upstream diagnostic/);
    const requests = calls; delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    assert.deepEqual(await getInsightOverrides(), []); assert.equal(calls, requests);
    assert.match(messages.at(-1), /configuration unavailable/);
  } finally {
    console.error = originalError;
    names.forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]);
  }
});

const schema = createSchema({ name: 'aesthedent-insight-test', types: [insight] });
test('document errors identify the fields an editor needs to correct', () => {
  const validate = schema.get('insight').validation.flatMap((rule) => rule._rules).find((rule) => rule.flag === 'custom').constraint;
  const errors = validate({ ...fixture(), title: ' ', date: '2025-02-30', body: [] });
  assert.ok(Array.isArray(errors), 'Return field-addressable errors instead of a generic document error');
  for (const field of ['title', 'date', 'body']) assert.ok(errors.some((error) => error.path?.[0] === field && error.message));
});

test('Studio prevents a featured conflict before publication and explains the fallback article', async () => {
  const validate = schema.get('insight').fields.find((field) => field.name === 'featured').type.validation.flatMap((rule) => rule._rules).find((rule) => rule.flag === 'custom')?.constraint;
  assert.equal(typeof validate, 'function', 'Featured must validate the same effective selection as the website');
  const names = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'];
  const previous = names.map((name) => process.env[name]);
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    let published = [], unavailable = false, requested;
    const context = { document: { _id: 'drafts.editorial-fixture', slug: { current: insights[1].slug } }, getClient: () => ({ withConfig: (options) => {
      assert.equal(options.perspective, 'published'); assert.equal(options.useCdn, false);
      return { fetch: async (query, params) => { requested = { query, params }; if (unavailable) throw new Error('unavailable'); return published; } };
    } }) };
    const conflict = await validate(true, context);
    assert.match(conflict, new RegExp(insights[0].slug));
    assert.match(conflict, /publish.*Featured off/i);
    assert.equal(requested.params.id, 'editorial-fixture');
    assert.equal(await validate(false, context), true);
    published = [{ slug: insights[0].slug, featured: false }];
    assert.equal(await validate(true, context), true);
    assert.equal(resolveInsightOverrides([{ ...fixture(), featured: false }, { ...fixture(insights[1].slug), featured: true }], insights).status, 'sanity');
    published = [{ slug: insights[0].slug, featured: true }];
    assert.notEqual(await validate(true, context), true);
    published = [{ slug: insights[0].slug, featured: false }, { slug: insights[0].slug, featured: false }];
    assert.match(await validate(true, context), /duplicate/i);
    published = [{ slug: insights[0].slug, featured: 'yes' }];
    assert.match(await validate(true, context), /verify/i);
    unavailable = true;
    assert.match(await validate(true, context), /retry/i);
    assert.equal(await validate(false, context), true, 'Unfeaturing remains available to resolve conflicts');
  } finally { names.forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]); }
});

test('Insight schema retains legacy body content and adds explicit review without locale fields', () => {
  assert.deepEqual(schema._validation, []);
  const compiled = schema.get('insight');
  assert.equal(compiled.fields.some((field) => ['reviewStatus', 'language'].includes(field.name)), false);
  const validate = compiled.validation.flatMap((rule) => rule._rules).find((rule) => rule.flag === 'custom').constraint;
  assert.equal(validate(fixture()), true);
  assert.notEqual(validate({ ...fixture(), body: [] }), true);
  const slug = compiled.fields.find((field) => field.name === 'slug').type.validation.flatMap((rule) => rule._rules).filter((rule) => rule.flag === 'custom').at(-1).constraint;
  return slug({ current: 'not-an-existing-route' }, {}).then((result) => assert.notEqual(result, true));
});

test('actual URL rule preserves published slugs and fails closed on lookup errors', async () => {
  // Public config only, scoped to this test process; no files or remote calls.
  const names = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'NEXT_PUBLIC_SANITY_API_VERSION'];
  const previous = names.map((name) => process.env[name]);
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2026-10-16';
    const compiled = schema.get('insight');
    const validate = compiled.fields.find((field) => field.name === 'slug').type.validation.flatMap((rule) => rule._rules).filter((rule) => rule.flag === 'custom').at(-1).constraint;
    const context = { document: { _id: 'drafts.fixture' }, getClient: () => ({ withConfig: () => ({ fetch: async () => insights[0].slug }) }) };
    assert.equal(await validate({ current: insights[0].slug }, context), true);
    assert.notEqual(await validate({ current: insights[1].slug }, context), true);
    context.getClient = () => ({ withConfig: () => ({ fetch: async () => { throw new Error('unavailable'); } }) });
    assert.notEqual(await validate({ current: insights[0].slug }, context), true);
  } finally {
    names.forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]);
  }
});

test('insight category is limited to the existing categories on every read path', () => {
  const { insightContent, insightCategories } = require('../sanity/lib/insight-mapping.ts');
  const base = fixture();

  const results = insightCategories.map(category => insightContent.safeParse({ ...base, category }).success);
  const unlisted = insightContent.safeParse({ ...base, category: 'Miracle Cures' });

  assert.deepEqual(insightCategories, [...new Set(insights.map(i => i.category))]);
  assert.ok(results.every(Boolean));
  assert.equal(unlisted.success, false);
  assert.match(unlisted.error.issues[0].message, /existing Insight categories/);
  assert.notEqual(resolveInsightOverrides([{ ...base, category: 'Miracle Cures' }], insights).status, 'sanity', 'preview/published resolver rejects it too');
});
