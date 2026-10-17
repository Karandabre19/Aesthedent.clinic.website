import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { buildContentManifest, htmlToPortableText, planDraftOperations, applyDraftOperations, hash, target } from '../scripts/content-sync-lib.mjs';
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Body = require('../components/insights/InsightBody.tsx').default;
const { insights } = require('../lib/insights.js');
const { services } = require('../lib/services.js');
const ts = require('typescript');
const { homeContent, aboutContent, experienceContent } = require('../sanity/lib/page-mapping.ts');
const { applyInsightOverrides } = require('../sanity/lib/insight-overrides.ts');
const manifest = buildContentManifest();
const complete = documents => ({ authenticated: true, complete: true, documents });
const miniManifest = candidate => ({ ...manifest, documents: [candidate] });

test('dry-run maps every existing identity without approvals, duplicate shared page records or protected facts', () => {
  assert.equal(manifest.documents.length, 26); assert.equal(manifest.reviews.length, 6);
  assert.equal(manifest.manifestHash, buildContentManifest().manifestHash);
  assert.deepEqual(manifest.documents.filter(d => d.content._type === 'service').map(d => d.identity), services.map(s => s.slug));
  assert.deepEqual(manifest.documents.filter(d => d.content._type === 'insight').map(d => d.identity), insights.map(s => s.slug));
  for (const doc of manifest.documents) {
    assert.equal(doc.content._id, undefined, 'ordinary IDs are not fabricated');
    for (const key of ['credentials', 'qualifications', 'registrationNumber', 'phone', 'address', 'hours', 'stats', 'promises']) assert.equal(key in doc.content, false);
    if (doc.content._type === 'insight') { assert.equal(doc.content.editorialStatus, 'draft'); assert.equal(doc.content.review, undefined); assert.equal(doc.content.authorKey, undefined); assert.equal(doc.content.sources, undefined); }
  }
  for (const review of manifest.reviews) { assert.ok(review.blocked); assert.equal(review.content.publicationPermissionConfirmed, false); assert.equal(review.content.verifiedGoogleReview, false); }
  for (const [name, schema] of [['homePage', homeContent], ['aboutPage', aboutContent], ['experiencePage', experienceContent]]) {
    const value = manifest.documents.find(d => d.identity === name).content;
    assert.equal(schema.safeParse(value).success, true, name);
    for (const shared of ['services', 'doctors', 'testimonials']) assert.equal(shared in value, false);
  }
});

test('mapped page text is actually present in the pre-change rendered baseline, including CTA labels', () => {
  const baseline = JSON.parse(fs.readFileSync('.cache/acceptance-implementation/baseline-pages.json', 'utf8'));
  const routeFor = source => source.startsWith('app/about') ? '/about' : source.startsWith('app/aesthedent-experience') ? '/aesthedent-experience' : source.startsWith('app/services/[slug]') ? '/services/dental-implants' : source.startsWith('app/insights/[slug]') ? '/insights/' + manifest.documents.find(d => d.content._type === 'insight').identity : source.startsWith('app/services') ? '/services' : source.startsWith('app/doctor') ? '/doctor' : source.startsWith('app/insights') ? '/insights' : source.startsWith('app/contact') ? '/contact' : source.startsWith('app/dental-clinic') ? '/dental-clinic-in-kothrud' : '/';
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  const unresolved = [];
  for (const entry of manifest.fieldEvidence) {
    // These two labels appear only after opening a treatment dialog. Verify
    // their source mapping separately; they are not in the initial SSR HTML.
    if (entry.document === 'servicesPage' && ['labels.why','labels.book'].includes(entry.path)) { assert.ok(fs.readFileSync('app/services/ServicesClient.js','utf8').includes(entry.value)); continue; }
    const route = routeFor(entry.source), page = baseline.find(p => p.route === route);
    const candidates = [page.main.text, ...page.main.headings.flatMap(h => [h.text, h.label ?? '']), ...page.main.links.map(l => l.label ?? '')].map(normalize);
    // Mobile/desktop CTA variants can be hidden in one viewport; SSR text includes both.
    if (!candidates.some(text => text.includes(normalize(entry.value)))) unresolved.push(`${route}:${entry.path}:${entry.value}`);
  }
  assert.deepEqual(unresolved, []);
});

test('all four contextual listing variants are retained while canonical titles and descriptions remain independent', () => {
  const articles = manifest.documents.filter(d => d.content._type === 'insight');
  assert.equal(articles.filter(d => d.content.listingTitle && d.content.listingExcerpt).length, 4);
  for (const { content } of articles) {
    const slug = content.slug.current, override = { ...content, slug };
    assert.equal(applyInsightOverrides([{ slug }], [override])[0].title, content.title);
    assert.equal(applyInsightOverrides([{ slug }], [override], 'listing')[0].title, content.listingTitle ?? content.title);
    assert.equal(applyInsightOverrides([{ slug }], [override], 'listing')[0].excerpt, content.listingExcerpt ?? content.excerpt);
  }
});

test('source HTML conversion preserves lead, heading, emphasis and link semantics and rejects unknown markup', () => {
  const source = '<p class="lead">A <strong>source</strong> paragraph.</p><h2>Section</h2><h3>Subsection</h3><ul><li><a href="/about">Known page</a></li></ul>';
  const blocks = htmlToPortableText(source), before = new JSDOM(source).window.document, after = new JSDOM(renderToStaticMarkup(React.createElement(Body, { value: blocks }))).window.document;
  assert.equal(after.body.textContent, before.body.textContent);
  for (const selector of ['.lead', 'h2', 'h3', 'li', 'a', 'strong']) assert.equal(after.querySelectorAll(selector).length, before.querySelectorAll(selector).length);
  assert.equal(after.querySelector('a').getAttribute('href'), '/about');
  assert.throws(() => htmlToPortableText('<iframe src="https://example.org"></iframe>'), /Unsupported/);
  for (const article of manifest.documents.filter(d => d.content._type === 'insight')) assert.ok(article.content.body.length > 1);
});

test('image manifest identifies exact static originals and shared portraits without fabricating native references', () => {
  assert.ok(manifest.assets.some(a => a.source === '/homepage-banner-mobile.png' && a.sha256));
  assert.equal(manifest.assets.filter(a => a.field === 'portrait' && a.sha256).length, 2);
  assert.ok(manifest.assets.some(a => a.source.includes('pexels.com')));
  assert.ok(manifest.assets.every(a => a.uploadAuthorized === false));
  for (const doc of manifest.documents) assert.equal(doc.content.coverImage, undefined);
});

test('planning fails closed on incomplete inventory, duplicate identities and release versions', () => {
  assert.equal(planDraftOperations(manifest, { complete: false }).operations.length, 0);
  const candidate = manifest.documents.find(d => d.content._type === 'insight'), single = miniManifest(candidate);
  for (const docs of [[{ ...candidate.content, _id: 'one' }, { ...candidate.content, _id: 'two' }], [{ ...candidate.content, _id: 'versions.release.existing' }]]) {
    const plan = planDraftOperations(single, complete(docs)); assert.equal(plan.operations.length, 0); assert.equal(plan.blocked.length, 1);
  }
});

test('only missing draft paths are filled; explicit blanks, values and keyed array identities are preserved', () => {
  const candidate = manifest.documents.find(d => d.identity === 'homePage');
  const draft = { ...structuredClone(candidate.content), _id: 'drafts.homePage', _rev: 'rev1' };
  delete draft.hero.eyebrow; draft.hero.whatsappLabel = ''; draft.visitSteps[0].detail = 'Existing editor wording'; delete draft.visitSteps[1].detail;
  const plan = planDraftOperations(miniManifest(candidate), complete([draft]));
  assert.equal(plan.blocked.length, 0); assert.equal(plan.operations.length, 1);
  assert.equal(plan.operations[0].setIfMissing['hero.eyebrow'], candidate.content.hero.eyebrow);
  assert.equal(plan.operations[0].setIfMissing['hero.whatsappLabel'], undefined);
  assert.equal(plan.operations[0].setIfMissing['visitSteps[_key=="item2"].detail'], candidate.content.visitSteps[1].detail);
  assert.equal(plan.operations[0].revision, 'rev1');
  assert.equal(planDraftOperations(miniManifest(candidate), complete([{ ...candidate.content, _id: 'drafts.homePage', _rev: 'rev2' }])).operations.length, 0, 'second run is a no-op');
});

test('new ordinary drafts use Sanity-generated IDs; singleton identities and existing published values survive', () => {
  const article = manifest.documents.find(d => d.content._type === 'insight');
  assert.equal(planDraftOperations(miniManifest(article), complete([])).operations[0].content._id, 'drafts.');
  const home = manifest.documents.find(d => d.identity === 'homePage');
  assert.equal(planDraftOperations(miniManifest(home), complete([])).operations[0].content._id, 'drafts.homePage');
  const published = { ...article.content, _id: 'existing', _rev: 'published-rev', title: 'Preserve published editorial title', customField: 'Preserve custom value' };
  const operation = planDraftOperations(miniManifest(article), complete([published])).operations[0];
  assert.equal(operation.content._id, 'drafts.existing'); assert.equal(operation.content.title, published.title); assert.equal(operation.content.customField, published.customField);
});

test('applying drafts requires exact approval, correct target and the still-current revision', async () => {
  const candidate = manifest.documents.find(d => d.identity === 'homePage'), single = miniManifest(candidate);
  const draft = { ...structuredClone(candidate.content), _id: 'drafts.homePage', _rev: 'rev1' }; delete draft.hero.eyebrow;
  const inventory = complete([draft]), plan = planDraftOperations(single, inventory), calls = [];
  let saved = draft; const journal = [];
  const options = { record: entry => journal.push(entry) };
  const client = { config: () => ({ ...target, apiHost: 'https://api.sanity.io' }), fetch: async () => [{ _id: saved._id, _rev: saved._rev }], getDocument: async () => saved, patch: id => ({ ifRevisionId: rev => ({ setIfMissing: values => ({ commit: async () => { calls.push({ id, rev, values }); saved = { ...draft, hero: { ...draft.hero, eyebrow: candidate.content.hero.eyebrow }, _rev: 'rev2' }; return saved; } }) }) }) };
  const approval = { ...target, manifestHash: single.manifestHash, operationsHash: hash(plan.operations) };
  await assert.rejects(applyDraftOperations(client, single, inventory, { ...approval, manifestHash: 'wrong' }), /approval/);
  await assert.rejects(applyDraftOperations({ ...client, config: () => ({ ...target, projectId: 'wrong' }) }, single, inventory, approval), /target mismatch/);
  await assert.rejects(applyDraftOperations(client, single, inventory, approval), /journal/);
  await assert.rejects(applyDraftOperations({ ...client, getDocument: async () => ({ ...draft, _rev: 'changed' }) }, single, inventory, approval, options), /operation stopped/);
  assert.equal(calls.length, 0);
  await applyDraftOperations(client, single, inventory, approval, options);
  assert.equal(calls.length, 1); assert.equal(calls[0].id, 'drafts.homePage'); assert.equal(calls[0].rev, 'rev1');
  assert.deepEqual(journal.slice(-3).map(e => e.status), ['started', 'committed', 'verified']);
});

test('all six mapped article bodies reproduce their actual source headings, text, emphasis and destinations', () => {
  const filename = 'app/insights/[slug]/InsightDetailClient.js', tree = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  let initializer;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText(tree) === 'insightsData') initializer = node.initializer.getText(tree); ts.forEachChild(node, visit); }
  visit(tree); assert.ok(initializer);
  const actual = new Function(`return (${initializer})`)();
  const capture = html => { const dom = new JSDOM(html), d = dom.window.document, clean = text => text.replace(/\s+/g, ' ').trim(); const result = { text: [...d.querySelectorAll('p,h2,h3,li')].map(e => clean(e.textContent)), headings: [...d.querySelectorAll('h2,h3')].map(e => [e.tagName, clean(e.textContent)]), links: [...d.querySelectorAll('a')].map(e => [clean(e.textContent), e.getAttribute('href')]), emphasis: [...d.querySelectorAll('strong,em')].map(e => [e.tagName, clean(e.textContent)]), listItems: [...d.querySelectorAll('li')].map(e => clean(e.textContent)) }; dom.window.close(); return result; };
  for (const article of manifest.documents.filter(d => d.content._type === 'insight')) assert.deepEqual(capture(renderToStaticMarkup(React.createElement(Body, { value: article.content.body }))), capture(actual[article.identity].content), article.identity);
});

test('draft creation stops if another draft or release appears after the approved inventory', async () => {
  const candidate = manifest.documents.find(d => d.content._type === 'insight'), single = miniManifest(candidate), inventory = complete([]), plan = planDraftOperations(single, inventory);
  const approval = { ...target, manifestHash: single.manifestHash, operationsHash: hash(plan.operations) }; let writes = 0;
  const { parse, evaluate } = require('groq-js');
  for (const record of [{ ...candidate.content, _id: 'drafts.other', _rev: 'r' }, { _type: 'homePage', _id: 'versions.release.homePage', _rev: 'r' }]) {
    const current = record._type === 'homePage' ? miniManifest(manifest.documents.find(d => d.identity === 'homePage')) : single;
    const currentPlan = planDraftOperations(current, inventory), currentApproval = { ...approval, manifestHash: current.manifestHash, operationsHash: hash(currentPlan.operations) };
    const client = { config: () => ({ ...target, apiHost: 'https://api.sanity.io' }), fetch: async (query, params) => (await evaluate(parse(query), { dataset: [record], params })).get(), create: async () => { writes++; } };
    await assert.rejects(applyDraftOperations(client, current, inventory, currentApproval, { record() {} }), /family changed/);
  }
  assert.equal(writes, 0);
});

test('partial failure retains the first draft receipt and an uncertain operation without continuing', async () => {
  const documents = manifest.documents.filter(d => ['homePage', 'aboutPage', 'experiencePage'].includes(d.identity));
  const current = { documents, manifestHash: 'local-journal-test' }, inventory = complete([]), plan = planDraftOperations(current, inventory), journal = [], dataset = [];
  const { parse, evaluate } = require('groq-js'); let attempts = 0;
  const client = { config: () => ({ ...target, apiHost: 'https://api.sanity.io' }), fetch: async (query, params) => (await evaluate(parse(query), { dataset, params })).get(), getDocument: async id => dataset.find(d => d._id === id), create: async doc => { attempts++; if (attempts === 2) throw Error('private upstream response'); const saved = { ...doc, _rev: 'created' }; dataset.push(saved); return saved; } };
  await assert.rejects(applyDraftOperations(client, current, inventory, { ...target, manifestHash: current.manifestHash, operationsHash: hash(plan.operations) }, { record: entry => journal.push(entry) }), /Inspect the journal/);
  assert.equal(attempts, 2); assert.equal(dataset.length, 1); assert.equal(journal.find(e => e.status === 'committed').id, 'drafts.homePage'); assert.equal(journal.at(-1).status, 'uncertain'); assert.doesNotMatch(JSON.stringify(journal), /private upstream/);
});

test('receipts are durable on disk before a later operation fails, and resume requires a fresh plan', async () => {
  const { parse, evaluate } = require('groq-js');
  const directory = fs.mkdtempSync('.cache/acceptance-implementation/receipt-test-'), file = directory + '/journal.jsonl', fd = fs.openSync(file, 'wx');
  const records = ['homePage','aboutPage'].map(name => manifest.documents.find(d => d.identity === name));
  const current = { documents: records, manifestHash: 'local-disk-journal-test' }, inventory = complete([]), plan = planDraftOperations(current, inventory), dataset = [];
  const client = { config: () => ({ ...target, apiHost: 'https://api.sanity.io' }), fetch: async (query, params) => (await evaluate(parse(query), { dataset, params })).get(), getDocument: async id => dataset.find(d => d._id === id), create: async doc => { if (dataset.length) throw Error('network result unknown'); const saved = { ...doc, _rev: 'saved' }; dataset.push(saved); return saved; } };
  try {
    await assert.rejects(applyDraftOperations(client, current, inventory, { ...target, manifestHash: current.manifestHash, operationsHash: hash(plan.operations) }, { record: entry => { fs.writeSync(fd, JSON.stringify(entry) + '\n'); fs.fsyncSync(fd); } }), /fresh inventory/);
    const journal = fs.readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(journal.find(r => r.status === 'verified').id, 'drafts.homePage'); assert.equal(journal.at(-1).status, 'uncertain');
    const refreshed = planDraftOperations(current, complete(dataset)); assert.equal(refreshed.operations.length, 1); assert.equal(refreshed.operations[0].identity, 'aboutPage');
  } finally { fs.closeSync(fd); }
});
