import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
const { createSchema } = require('sanity');
const { parse, evaluate } = require('groq-js');
const { services } = require('../lib/services.js');
const { resolveServices, serviceDocument } = require('../sanity/lib/service-mapping.ts');
const { schemaTypes } = require('../sanity/schemaTypes/index.ts');
const { resolveDoctors, doctorDocument, homeContent, aboutContent, experienceContent, resolvePage, visitStages } = require('../sanity/lib/page-mapping.ts');
const { resolveTestimonials, testimonialDocument, reviewSource } = require('../sanity/lib/testimonial-mapping.ts');
const { getTestimonials } = require('../lib/testimonials.js');
const schema = createSchema({ name: 'content-test', types: schemaTypes });
const serviceFixtures = () => services.map((s, i) => ({ ...s, _id: `fixture-${i}` }));

test('all eight actual treatments round-trip through validation without changing sections or assets', () => {
  const fixtures = serviceFixtures();
  fixtures.forEach((doc) => assert.equal(serviceDocument.safeParse(doc).success, true, doc.slug));
  assert.deepEqual(resolveServices(fixtures).value, services);
  assert.deepEqual(schema._validation, []);
});
test('treatments retain all static data on missing, malformed, draft, duplicate or unknown records', () => {
  const first = serviceFixtures()[0];
  for (const input of [[], null, [first, first], [{ ...first, _id: 'drafts.hidden' }], [{ ...first, _id: 'versions.release.hidden' }], [{ ...first, slug: 'new-route' }], [{ ...first, faqs: [] }], [{ ...first, process: [{ step: 2, title: 'Stage', desc: 'Description' }] }]]) assert.deepEqual(resolveServices(input).value, services);
});
test('partial treatment coverage updates content, preserving routing, assets, locality, order and other treatments', () => {
  const first = { ...serviceFixtures()[0], title: 'Editorial fixture' };
  const result = resolveServices([first]).value;
  assert.equal(result[0].title, first.title); assert.equal(result[1], services[1]);
  for (const field of ['slug', 'locality', 'image', 'imageAlt', 'icon', 'isFeatured']) assert.equal(result[0][field], services[0][field]);
  assert.deepEqual(result.map(s => s.slug), services.map(s => s.slug));
});
test('treatment-specific optional lists cannot be lost or added to another layout', () => {
  const orthodontics = serviceFixtures().find(s => s.slug === 'orthodontic-treatment');
  assert.equal(resolveServices([{ ...orthodontics, aboutList: null }]).status, 'invalid');
  assert.equal(resolveServices([{ ...serviceFixtures()[0], aboutList: orthodontics.aboutList }]).status, 'invalid');
});

function arrayFromSource(path, firstText, fields) {
  const source = ts.createSourceFile(path, readFileSync(new URL('../' + path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  let value;
  function visit(n) {
    if (ts.isArrayLiteralExpression(n) && n.elements.length && ts.isObjectLiteralExpression(n.elements[0]) && n.elements[0].getText(source).includes(firstText)) {
      value = n.elements.map((element) => Object.fromEntries(element.properties.filter(p => fields.includes(p.name?.getText(source))).map(p => [p.name.getText(source), p.initializer.text])));
    }
    ts.forEachChild(n, visit);
  }
  visit(source); assert.ok(value, firstText); return value;
}
const doctorFixtures = arrayFromSource('app/doctor/DoctorClient.js', 'Dr. Sahil', ['bio', 'philosophy']).map((doc, i) => ({ ...doc, _id: `doctor-${i}`, slug: i === 0 ? 'sahil' : 'aishwarya', homeSummary: arrayFromSource('app/HomeClient.js', 'DOCTORS.sahil', ['desc'])[i].desc }));
const homeFixture = { visitHeading: 'What happens when you visit.', visitQuote: 'Local fixture quotation', visitSteps: visitStages.map(stage => ({ stage, detail: 'Local fixture explanation' })) };
const aboutFixture = { storyIntro: 'Local story fixture', storyApproach: 'Local approach fixture', values: arrayFromSource('app/about/AboutClient.js', 'Painless Treatment', ['title', 'desc']) };
const experienceFixture = {
  specialistBenefits: arrayFromSource('app/aesthedent-experience/ExperienceClient.js', 'Architectural Planning', ['title', 'desc']),
  technology: arrayFromSource('app/aesthedent-experience/ExperienceClient.js', 'Intraoral Scanners', ['title', 'desc']),
  approach: arrayFromSource('app/aesthedent-experience/ExperienceClient.js', 'Evidence-Based Planning', ['title', 'desc']),
  faqs: require('../lib/landing-page-content.js').landingPageContent.faqs,
};
test('actual doctor narratives and page arrays validate without exposing credentials or clinic facts', () => {
  doctorFixtures.forEach(doc => assert.equal(doctorDocument.safeParse(doc).success, true));
  assert.equal(resolveDoctors(doctorFixtures).value.length, 2);
  const fields = schema.get('doctor').fields.map(f => f.name);
  for (const field of ['name', 'qualifications', 'registrationNumber', 'role', 'image']) assert.equal(fields.includes(field), false);
  for (const [name, contract, content] of [['homePage', homeContent, homeFixture], ['aboutPage', aboutContent, aboutFixture], ['experiencePage', experienceContent, experienceFixture]]) {
    assert.equal(contract.safeParse(content).success, true, name);
    assert.deepEqual(resolvePage([{ _id: name, content }], name, contract).value, content);
    for (const input of [[], null, [{ _id: 'drafts.' + name, content }], [{ _id: 'wrong-id', content }], [{ _id: name, content }, { _id: name, content }], [{ _id: name, content: {} }]]) assert.equal(resolvePage(input, name, contract).value, null);
  }
});
test('doctor duplicates/drafts/unknown identities and invalid or reordered page arrays fail safely', () => {
  for (const input of [[], null, [doctorFixtures[0], doctorFixtures[0]], [{ ...doctorFixtures[0], slug: 'new-doctor' }], [{ ...doctorFixtures[0], _id: 'drafts.hidden' }], [{ ...doctorFixtures[0], bio: '' }]]) assert.deepEqual(resolveDoctors(input).value, []);
  assert.equal(homeContent.safeParse({ ...homeFixture, visitSteps: [...homeFixture.visitSteps].reverse() }).success, false);
  assert.equal(aboutContent.safeParse({ ...aboutFixture, values: [] }).success, false);
  assert.equal(experienceContent.safeParse({ ...experienceFixture, faqs: [] }).success, false);
});
function queryFrom(path, name) {
  const source = ts.createSourceFile(path, readFileSync(new URL('../' + path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
  let value; function visit(n) { if (ts.isVariableDeclaration(n) && n.name.getText(source) === name) value = n.initializer.arguments[0].text; ts.forEachChild(n, visit); } visit(source); assert.ok(value, name); return value;
}
test('actual bounded GROQ excludes drafts/releases and retains structured treatment/page content', async () => {
  const cases = [
    ['sanity/lib/services.ts', 'servicesQuery', { ...serviceFixtures()[0], slug: { current: services[0].slug }, _type: 'service' }, result => assert.equal(resolveServices(result).status, 'sanity')],
    ['sanity/lib/pages.ts', 'doctorsQuery', { ...doctorFixtures[0], slug: { current: 'sahil' }, _type: 'doctor' }, result => assert.equal(resolveDoctors(result).value.length, 1)],
    ...[['homePage', homeFixture, homeContent, 'homeQuery'], ['aboutPage', aboutFixture, aboutContent, 'aboutQuery'], ['experiencePage', experienceFixture, experienceContent, 'experienceQuery']].map(([name, content, contract, query]) => ['sanity/lib/pages.ts', query, { _id: name, _type: name, ...content }, result => assert.deepEqual(resolvePage(result, name, contract).value, content)]),
  ];
  for (const [path, name, doc, check] of cases) {
    const query = queryFrom(path, name);
    const dataset = [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }, { ...doc, _id: 'unrelated', _type: 'other' }];
    const result = await (await evaluate(parse(query), { dataset })).get();
    assert.equal(result.length, 1, name); check(result);
  }
});

const reviewFixture = () => ({ ...getTestimonials('latest')[0], _id: 'review-fixture', slot: String(getTestimonials('latest')[0].id), sourceUrl: 'https://www.google.com/maps/reviews/fixture', publicationPermissionConfirmed: true });
test('reviews require source and publication attestations; missing or invalid content preserves verified originals', () => {
  const existing = getTestimonials('latest'), doc = reviewFixture();
  assert.equal(testimonialDocument.safeParse(doc).success, true);
  for (const input of [[], null, [doc, doc], [{ ...doc, slot: 'new-position' }], [{ ...doc, rating: 0 }], [{ ...doc, verifiedGoogleReview: false }], [{ ...doc, publicationPermissionConfirmed: false }], [{ ...doc, _id: 'drafts.hidden' }], [{ ...doc, sourceUrl: 'https://example.com/unverified' }]]) assert.deepEqual(resolveTestimonials(input).value, existing);
  const result = resolveTestimonials([{ ...doc, text: 'Local review fixture, never remote content' }]).value;
  assert.equal(result[0].id, existing[0].id); assert.equal(result[1], existing[1]);
  assert.equal(result[0].text, 'Local review fixture, never remote content');
  assert.equal('sourceUrl' in result[0], false); assert.equal('publicationPermissionConfirmed' in result[0], false);
  for (const href of ['http://www.google.com/maps', 'https://user:secret@google.com/maps', 'https://google.com.evil.test/review', 'javascript:alert(1)']) assert.equal(reviewSource.safeParse(href).success, false);
});
test('review query independently filters drafts/releases and unverified or unauthorized quotations', async () => {
  const doc = { ...reviewFixture(), _type: 'testimonial' };
  const dataset = [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }, { ...doc, _id: 'no-permission', publicationPermissionConfirmed: false }, { ...doc, _id: 'unverified', verifiedGoogleReview: false }];
  const result = await (await evaluate(parse(queryFrom('sanity/lib/testimonials.ts', 'testimonialsQuery')), { dataset })).get();
  assert.equal(result.length, 1); assert.equal(resolveTestimonials(result).status, 'sanity');
});
test('all new schemas compile, field errors focus correctly and singleton IDs prevent parallel fact sources', () => {
  assert.deepEqual(schema._validation, []);
  for (const name of ['service', 'doctor', 'testimonial', 'homePage', 'aboutPage', 'experiencePage']) {
    const compiled = schema.get(name); assert.ok(compiled.preview);
    const validate = compiled.validation.flatMap(rule => rule._rules).find(rule => rule.flag === 'custom').constraint;
    const errors = validate({ _id: name });
    assert.ok(Array.isArray(errors), name); assert.ok(errors.every(error => error.path?.length && error.message));
  }
  const validate = schema.get('homePage').validation.flatMap(rule => rule._rules).find(rule => rule.flag === 'custom').constraint;
  assert.equal(validate({ _id: 'drafts.homePage', ...homeFixture }), true);
  assert.notEqual(validate({ _id: 'other-id', ...homeFixture }), true);
});

test('editor constraints match runtime limits and explain fixed positions without changing stored field shapes', () => {
  const field = (name, key) => schema.get(name).fields.find(f => f.name === key).type;
  const rules = value => value.validation.flatMap(r => r._rules);
  for (const [name, key, flag, limit] of [
    ['service', 'whyAesthedent', 'max', 12], ['aboutPage', 'values', 'length', 4],
    ['experiencePage', 'specialistBenefits', 'length', 3], ['experiencePage', 'technology', 'length', 4], ['experiencePage', 'approach', 'length', 3],
    ['doctor', 'bio', 'max', 6000], ['doctor', 'philosophy', 'max', 2000], ['doctor', 'homeSummary', 'max', 1000],
    ['service', 'shortDesc', 'max', 600], ['service', 'fullDescription', 'max', 16000], ['testimonial', 'text', 'max', 6000],
  ]) assert.ok(rules(field(name, key)).some(r => r.flag === flag && r.constraint === limit), name + '.' + key);
  const why = field('service', 'whyAesthedent').of[0];
  for (const [key, limit] of [['title', 180], ['desc', 4000]]) assert.ok(rules(why.fields.find(f => f.name === key).type).some(r => r.flag === 'max' && r.constraint === limit));
  const faqs = field('service', 'faqs').of[0];
  for (const [key, limit] of [['q', 300], ['a', 4000]]) assert.ok(rules(faqs.fields.find(f => f.name === key).type).some(r => r.flag === 'max' && r.constraint === limit));
  assert.ok(field('service', 'fullDescription').rows >= 8);
  const textValidation = rules(field('doctor', 'bio')).find(r => r.flag === 'custom').constraint;
  assert.equal(textValidation('Reviewed plain text'), true);
  for (const input of ['   ', '<p>HTML</p>']) assert.notEqual(textValidation(input), true);
  for (const [name, key] of [['aboutPage', 'values'], ['experiencePage', 'technology'], ['homePage', 'visitSteps']]) assert.equal(field(name, key).options.sortable, false);
  const stages = field('homePage', 'visitSteps');
  assert.equal(stages.of[0].name, 'object', 'existing array item type stays compatible');
  assert.equal(stages.of[0].fields.find(f => f.name === 'stage').type.readOnly, true);
  for (const action of ['add', 'remove', 'duplicate', 'copy']) assert.ok(stages.options.disableActions.includes(action));
  const initial = schemaTypes.find(t => t.name === 'homePage').initialValue.visitSteps;
  assert.deepEqual(initial.map(s => s.stage), [...visitStages]);
  assert.equal(new Set(initial.map(s => s._key)).size, 6);
  assert.ok(initial.every(s => s._type === 'object' && !('detail' in s)), 'no clinical copy is seeded');
  assert.equal(homeContent.safeParse({ ...homeFixture, visitSteps: initial }).success, false, 'explanations remain required');
  for (const name of ['service', 'experiencePage']) {
    const source = schemaTypes.find(t => t.name === name);
    assert.ok(source.groups.length > 1);
    assert.ok(source.fields.every(f => source.groups.some(g => g.name === f.group)));
  }
});

test('nested validation errors point to keyed array items and remain aligned with safe runtime fallback', () => {
  const { contentErrors } = require('../sanity/lib/content-validation.ts');
  const invalid = { ...serviceFixtures()[0], faqs: [{ _key: 'question-key', q: 'Question?', a: ' ' }] };
  const errors = contentErrors(require('../sanity/lib/service-mapping.ts').serviceContent, invalid);
  assert.ok(errors.some(error => JSON.stringify(error.path) === JSON.stringify(['faqs', { _key: 'question-key' }, 'a'])));
  assert.equal(resolveServices([invalid]).status, 'invalid');
  assert.deepEqual(resolveServices([invalid]).value, services);
  const withoutKeys = { ...invalid, faqs: [{ q: 'Question?', a: '' }] };
  assert.ok(contentErrors(require('../sanity/lib/service-mapping.ts').serviceContent, withoutKeys).some(error => JSON.stringify(error.path) === JSON.stringify(['faqs', 0, 'a'])));
});

test('singleton templates remain available for initialization but cannot create arbitrary singleton documents', () => {
  const env = require('../sanity/env.ts');
  const source = ts.transpileModule(readFileSync(new URL('../sanity.config.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', source)(id => id === './sanity/env' ? { ...env, requireSanityEnvironment: () => ({ projectId: 'ae09qs5c', dataset: 'production' }) } : id === './sanity/schemaTypes' ? { schemaTypes } : id === './sanity/lib/page-mapping' ? require('../sanity/lib/page-mapping.ts') : createRequire(new URL('../sanity.config.ts', import.meta.url))(id), exports);
  const config = exports.default;
  assert.equal(config.schema.templates, undefined, 'default templates must not be removed before Structure resolves them');
  const options = ['homePage', 'aboutPage', 'experiencePage', 'insight', 'service', 'doctor', 'testimonial'].map(templateId => ({ templateId }));
  assert.deepEqual(config.document.newDocumentOptions(options).map(o => o.templateId), ['insight', 'service', 'doctor', 'testimonial']);
  const actions = [{ action: 'duplicate' }, { action: 'publish' }];
  assert.deepEqual(config.document.actions(actions, { schemaType: 'homePage' }), [{ action: 'publish' }]);
  assert.deepEqual(config.document.actions(actions, { schemaType: 'insight' }).slice(0, actions.length), actions);
  assert.equal(config.document.actions(actions, { schemaType: 'insight' }).length, actions.length + 1);
});
test('new identity rules preserve published IDs and review positions fail closed on access errors', async () => {
  const previous = [process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, process.env.NEXT_PUBLIC_SANITY_DATASET];
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    const validate = schema.get('service').fields.find(f => f.name === 'slug').type.validation.flatMap(r => r._rules).filter(r => r.flag === 'custom').at(-1).constraint;
    let response = services[0].slug, fail = false;
    const context = { document: { _id: 'drafts.local-fixture' }, getClient: () => ({ withConfig: () => ({ fetch: async () => { if (fail) throw new Error('unavailable'); return response; } }) }) };
    assert.equal(await validate({ current: services[0].slug }, context), true);
    assert.notEqual(await validate({ current: services[1].slug }, context), true);
    fail = true; assert.match(await validate({ current: services[0].slug }, context), /retry/);
    const slot = schema.get('testimonial').fields.find(f => f.name === 'slot').type.validation.flatMap(r => r._rules).find(r => r.flag === 'custom').constraint;
    assert.match(await slot(reviewFixture().slot, context), /retry/);
    fail = false; response = 1; assert.notEqual(await slot(reviewFixture().slot, context), true);
    response = 0; assert.equal(await slot(reviewFixture().slot, context), true);
  } finally {
    ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'].forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]);
  }
});
test('service JSON-LD and clinical prose use the exact same mapped record as the detail page', () => {
  const helpers = {};
  new Function('require', 'exports', ts.transpileModule(readFileSync(new URL('../lib/schema.js', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(createRequire(new URL('../lib/schema.js', import.meta.url)), helpers);
  const doc = { ...serviceFixtures()[0], shortDesc: 'Local metadata fixture', faqs: [{ q: 'Local question?', a: 'Local answer.' }] };
  const mapped = resolveServices([doc]).value[0];
  assert.equal(helpers.buildProcedureSchema(mapped).description, doc.shortDesc);
  assert.equal(helpers.buildMedicalWebPageSchema(mapped).description, doc.shortDesc);
  assert.equal(helpers.buildFaqSchema(mapped.faqs).mainEntity[0].acceptedAnswer.text, doc.faqs[0].a);
  assert.match(helpers.buildProcedureSchema(mapped).url, new RegExp('/services/' + doc.slug + '$'));
});

test('all new server readers use published access, per-model cache tags and safe fallback diagnostics', async () => {
  function execute(path, dependencies) {
    const filename = new URL('../' + path, import.meta.url), localRequire = createRequire(filename), exports = {};
    const output = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    new Function('require', 'exports', output)(id => id === 'server-only' ? {} : dependencies[id] ?? localRequire(id), exports); return exports;
  }
  const names = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'];
  const previous = names.map(name => process.env[name]), oldError = console.error, messages = [], calls = [];
  let response = [], fail = false;
  try {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'; process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'; console.error = message => messages.push(message);
    const client = execute('sanity/lib/client.ts', { 'next/headers': { draftMode: async () => ({ isEnabled: false }) }, 'next-sanity': { createClient: config => {
      assert.equal(config.perspective, 'published'); assert.equal(config.useCdn, false);
      return { fetch: async (query, params, options) => { calls.push({ query, params, options }); if (fail) throw new Error('private upstream diagnostic'); return response; } };
    } } });
    const reader = execute('sanity/lib/content-reader.ts', { './client': client });
    const serviceReader = execute('sanity/lib/services.ts', { './content-reader': reader });
    const pages = execute('sanity/lib/pages.ts', { './content-reader': reader });
    const reviews = execute('sanity/lib/testimonials.ts', { './content-reader': reader });
    const cases = [
      [serviceReader.getServices, 'services', serviceFixtures(), value => assert.deepEqual(value, services), services],
      [pages.getDoctors, 'doctors', doctorFixtures, value => assert.equal(value.length, 2), []],
      [pages.getHomeContent, 'home-page', [{ _id: 'homePage', content: homeFixture }], value => assert.deepEqual(value, homeFixture), null],
      [pages.getAboutContent, 'about-page', [{ _id: 'aboutPage', content: aboutFixture }], value => assert.deepEqual(value, aboutFixture), null],
      [pages.getExperienceContent, 'experience-page', [{ _id: 'experiencePage', content: experienceFixture }], value => assert.deepEqual(value, experienceFixture), null],
      [reviews.getPublishedTestimonials, 'testimonials', [reviewFixture()], value => assert.deepEqual(value, getTestimonials('latest')), getTestimonials('latest')],
    ];
    for (const [load, tag, data, check, fallback] of cases) {
      fail = false; response = data; check(await load());
      assert.deepEqual(calls.at(-1).options, { cache: 'force-cache', next: { revalidate: 60, tags: [tag] } });
      response = []; assert.deepEqual(await load(), fallback);
      response = null; assert.deepEqual(await load(), fallback); assert.match(messages.at(-1), /Invalid or ambiguous/);
      fail = true; assert.deepEqual(await load(), fallback); assert.match(messages.at(-1), /CMS read failed/);
    }
    assert.doesNotMatch(messages.join(' '), /private upstream/);
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID; const count = calls.length;
    assert.deepEqual(await serviceReader.getServices(), services); assert.equal(calls.length, count); assert.match(messages.at(-1), /configuration unavailable/);
  } finally { console.error = oldError; names.forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]); }
});

function sourceTree(path) {
  return ts.createSourceFile(path, readFileSync(new URL('../' + path, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
}
test('actual client expressions use stable doctor identities and retain all six visit stages', () => {
  const doctorSource = sourceTree('app/doctor/DoctorClient.js');
  const initializers = {};
  function visit(n) { if (ts.isVariableDeclaration(n) && ['fallbackDoctors', 'doctors'].includes(n.name.getText(doctorSource))) initializers[n.name.getText(doctorSource)] = n.initializer.getText(doctorSource); ts.forEachChild(n, visit); } visit(doctorSource);
  const fallback = new Function('return (' + initializers.fallbackDoctors + ')')();
  const bind = new Function('fallbackDoctors', 'doctorNarratives', 'return (' + initializers.doctors + ')');
  assert.deepEqual(bind(fallback, []), fallback);
  const copy = { ...doctorFixtures[0], bio: 'Local biography fixture' };
  const renderedData = bind([...fallback].reverse(), [copy]);
  assert.equal(renderedData.find(d => d.personKey === 'sahil').bio, copy.bio);
  assert.equal(renderedData.find(d => d.personKey === 'aishwarya').bio, fallback[1].bio);
  const home = sourceTree('app/HomeClient.js'); let stages, summary;
  function find(n) {
    if (ts.isJsxExpression(n) && n.expression) {
      const text = n.expression.getText(home);
      if (text.startsWith('(editorial?.visitSteps?')) stages = n.expression.expression.expression.getText(home);
      if (text.includes('doctorNarratives.find') && text.includes('homeSummary')) summary = text;
    }
    ts.forEachChild(n, find);
  } find(home); assert.ok(stages); assert.ok(summary);
  const visitData = new Function('editorial', 'return ' + stages);
  assert.deepEqual(visitData(homeFixture), homeFixture.visitSteps.map(s => [s.stage, s.detail]));
  assert.equal(visitData(undefined).length, 6);
  const summaryData = new Function('doctor', 'doctorNarratives', 'return ' + summary);
  assert.equal(summaryData({ personKey: 'sahil', desc: 'Original' }, [copy]), copy.homeSummary);
  assert.equal(summaryData({ personKey: 'aishwarya', desc: 'Original' }, [copy]), 'Original');
});
test('actual About/Experience card bindings preserve icons and use validated CMS copy by existing position', () => {
  const icons = require('lucide-react');
  for (const [path, editorial, fields] of [
    ['app/about/AboutClient.js', aboutFixture, ['values']],
    ['app/aesthedent-experience/ExperienceClient.js', experienceFixture, ['specialistBenefits', 'technology', 'approach']],
  ]) {
    const source = sourceTree(path); const found = new Set();
    function visit(n) {
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isArrayLiteralExpression(n.expression.expression) && n.arguments[0]?.getText(source).includes('...editorial?.')) {
        const field = fields.find(f => n.arguments[0].getText(source).includes('editorial?.' + f));
        if (field) {
          const names = [...new Set(n.expression.expression.elements.flatMap(e => e.properties.filter(p => p.name?.getText(source) === 'icon').map(p => p.initializer.getText(source))))];
          const bind = new Function('editorial', ...names, 'return ' + n.getText(source));
          const before = bind(undefined, ...names.map(name => icons[name])), after = bind(editorial, ...names.map(name => icons[name]));
          assert.equal(before.length, after.length); after.forEach((item, i) => { assert.equal(item.icon, before[i].icon); assert.equal(item.title, editorial[field][i].title); assert.equal(item.desc, editorial[field][i].desc); }); found.add(field);
        }
      }
      ts.forEachChild(n, visit);
    } visit(source); assert.deepEqual([...found].sort(), [...fields].sort());
  }
});
