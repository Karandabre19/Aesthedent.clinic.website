import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
// Public configuration is fixture-local. No environment files or credentials are used.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
const { homeSections, aboutSections, experienceSections, headlineFields, resolveSections } = require('../sanity/lib/editorial-sections.ts');
const { imageFromRecord } = require('../sanity/lib/image.ts');
const { imageUrl } = require('../sanity/lib/image-url.ts');
const { schemaTypes } = require('../sanity/schemaTypes/index.ts');
const { createSchema } = require('sanity');
const { parse, evaluate } = require('groq-js');
const { homeContent, aboutContent, experienceContent, resolvePage, visitStages, resolveDoctors } = require('../sanity/lib/page-mapping.ts');
const { resolveServices } = require('../sanity/lib/service-mapping.ts');
const { services } = require('../lib/services.js');
const { resolveInsightOverrides } = require('../sanity/lib/insight-mapping.ts');
const { insightsQuery } = require('../sanity/lib/insight-query.ts');
const schema = createSchema({ name: 'editorial-test', types: schemaTypes });
const field = (name, key) => schema.get(name).fields.find(f => f.name === key).type;
const rules = value => value.validation.flatMap(r => r._rules);

test('Doctor portrait removal clears the native retained metadata and keeps replacement and read-only behavior', () => {
  const { DoctorPortraitInput } = require('../sanity/schemaTypes/editorial-fields.ts');
  const { PatchEvent, unset, set } = require('sanity');
  let patches, change;
  const props = { onChange: event => { patches = PatchEvent.from(event).patches; }, renderDefault: input => { change = input.onChange; return null; } };
  DoctorPortraitInput(props); change([unset(['asset']), unset(['crop'])]);
  assert.deepEqual(patches.map(patch => ({ type: patch.type, path: patch.path })), [{ type: 'unset', path: [] }]);
  change(set({ _ref: 'new' }, ['asset'])); assert.equal(patches[0].value._ref, 'new');
  patches = undefined; DoctorPortraitInput({ ...props, readOnly: true }); change(unset(['asset']));
  assert.equal(patches, undefined);
});
const asset = (width = 12000, height = 8000) => ({ _id: `image-abc123-${width}x${height}-jpg`, _type: 'sanity.imageAsset', url: `https://cdn.sanity.io/images/ae09qs5c/production/abc123-${width}x${height}.jpg`, mimeType: 'image/jpeg', metadata: { dimensions: { width, height } } });
const media = () => ({ alt: 'Local image fixture', asset: asset(), crop: { top: 0, bottom: 0, left: 0, right: 0 }, hotspot: { x: 0.5, y: 0.5, width: 0.4, height: 0.4 } });
function queryFrom(path, name) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  let query;
  function visit(n) { if (ts.isVariableDeclaration(n) && n.name.getText(source) === name) query = n.initializer.arguments[0].text; ts.forEachChild(n, visit); }
  visit(source); assert.ok(query, name); return query;
}
const copyFor = spec => Object.fromEntries(Object.entries(spec.fields).filter(([, f]) => f.kind !== 'image').map(([key, f]) => [key, f.kind === 'headline' ? Object.fromEntries(Object.keys(headlineFields).map(k => [k, 'Fixture phrase'])) : 'Fixture copy']));
const cases = [
  ['homePage', 'homeQuery', homeSections, homeContent, { visitHeading: 'Heading', visitQuote: 'Quote', visitSteps: visitStages.map(stage => ({ stage, detail: 'Detail' })) }, 'app/HomeClient.js'],
  ['aboutPage', 'aboutQuery', aboutSections, aboutContent, { storyIntro: 'Intro', storyApproach: 'Approach', values: Array.from({ length: 4 }, () => ({ title: 'Value', desc: 'Description' })) }, 'app/about/AboutClient.js'],
  ['experiencePage', 'experienceQuery', experienceSections, experienceContent, { specialistBenefits: Array.from({ length: 3 }, () => ({ title: 'Benefit', desc: 'Description' })), technology: Array.from({ length: 4 }, () => ({ title: 'Technology', desc: 'Description' })), approach: Array.from({ length: 3 }, () => ({ title: 'Approach', desc: 'Description' })), faqs: [{ question: 'Question?', answer: 'Answer.' }] }, 'app/aesthedent-experience/ExperienceClient.js'],
];

for (const [name, query, specs, contract, content, consumer] of cases) {
  test(`${name}: actual query resolves every optional section and native asset without changing legacy content`, async () => {
    const sections = Object.fromEntries(specs.map(spec => [spec.name, { ...copyFor(spec), ...Object.fromEntries(Object.entries(spec.fields).filter(([, f]) => f.kind === 'image').map(([key]) => [key, { ...media(), asset: { _type: 'reference', _ref: asset()._id } }])) }]));
    const doc = { _id: name, _type: name, ...content, ...sections };
    const result = await (await evaluate(parse(queryFrom('sanity/lib/pages.ts', query)), { dataset: [doc, asset(), { ...doc, _id: 'drafts.' + name }, { ...doc, _id: 'versions.release.' + name }] })).get();
    assert.equal(result.length, 1);
    const mapped = resolvePage(result, name, contract).value;
    assert.deepEqual(contract.parse(mapped), content);
    for (const spec of specs) for (const [key, f] of Object.entries(spec.fields)) assert.deepEqual(mapped[spec.name][key], f.kind === 'image' ? imageFromRecord(media()) : copyFor(spec)[key], `${name}.${spec.name}.${key}`);
    const source = readFileSync(consumer, 'utf8');
    for (const spec of specs) for (const key of Object.keys(spec.fields)) assert.ok(source.includes(`editorial?.${spec.name}?.${key}`), `missing frontend connection: ${name}.${spec.name}.${key}`);
    assert.deepEqual(resolvePage([{ _id: name, content }], name, contract).value, content, 'old documents remain compatible');
  });
  test(`${name}: empty fields fall back independently; malformed copy falls back per section and media per slot`, () => {
    assert.deepEqual(resolveSections(undefined, undefined, specs), {});
    assert.deepEqual(resolveSections(Object.fromEntries(specs.map(s => [s.name, {}])), {}, specs), {});
    for (const spec of specs) for (const [key, f] of Object.entries(spec.fields)) if (f.kind === 'text') {
      const source = { [spec.name]: { ...copyFor(spec), [key]: 'x'.repeat(f.max + 1) } };
      assert.deepEqual(resolveSections(source, {}, specs), {}, `${spec.name}.${key} limit`);
      source[spec.name][key] = '   ';
      assert.equal(resolveSections(source, {}, specs)[spec.name]?.[key], undefined, 'blank means fallback');
      source[spec.name][key] = '<b>Invalid</b>';
      assert.deepEqual(resolveSections(source, {}, specs), {}, 'HTML rejected');
    }
    const spec = specs.find(s => Object.values(s.fields).some(f => f.kind === 'image'));
    const images = Object.keys(spec.fields).filter(k => spec.fields[k].kind === 'image');
    const supplied = { [spec.name]: Object.fromEntries(images.map(k => [k, media()])) };
    assert.ok(resolveSections({ [spec.name]: {} }, supplied, specs)[spec.name][images[0]]);
    assert.deepEqual(resolveSections({ [spec.name]: [] }, supplied, specs), {}, 'malformed parent is not accepted');
    supplied[spec.name][images[0]] = { ...media(), alt: '' };
    const resolved = resolveSections({ [spec.name]: copyFor(spec) }, supplied, specs);
    assert.equal(resolved[spec.name]?.[images[0]], undefined);
    for (const key of images.slice(1)) assert.ok(resolved[spec.name][key], 'other image survives');
    for (const [key, value] of Object.entries(copyFor(spec))) assert.deepEqual(resolved[spec.name][key], value, 'copy survives bad image');
  });
}

test('headline is all-or-none and other sections/images survive invalid headline copy', () => {
  const images = { hero: { desktopImage: media() } };
  const invalid = resolveSections({ hero: { eyebrow: 'Valid', headline: { opening: 'Incomplete' } }, treatments: { heading: 'Independent heading' } }, images, homeSections);
  assert.equal(invalid.hero.eyebrow, undefined); assert.ok(invalid.hero.desktopImage);
  assert.equal(invalid.treatments.heading, 'Independent heading');
  for (const headline of [undefined, null, {}, { _type: 'headline' }, { _type: 'headline', opening: '', continuation: '', emphasis: '' }]) {
    assert.deepEqual(resolveSections({ hero: { headline } }, {}, homeSections), {});
    assert.equal(resolveSections({ hero: { headline, eyebrow: 'Independent copy' } }, {}, homeSections).hero.eyebrow, 'Independent copy');
  }
});

test('media validation accepts high-resolution originals, honors crop/hotspot and rejects unusable references', () => {
  const valid = imageFromRecord(media()); assert.ok(valid, '96 MP is not blocked by an arbitrary megapixel cap');
  const url = new URL(imageUrl(valid, 1600, 900));
  assert.equal(url.origin, 'https://cdn.sanity.io'); assert.equal(url.searchParams.get('w'), '1600'); assert.equal(url.searchParams.get('h'), '900'); assert.equal(url.searchParams.get('auto'), 'format');
  assert.notEqual(imageUrl({ ...valid, hotspot: { ...valid.hotspot, y: 0.7 } }, 1600, 900), url.href, 'hotspot changes the delivered crop');
  assert.deepEqual(imageFromRecord({ ...media(), asset: asset(100, 100) })?.assetId, asset(100, 100)._id, 'small image is guidance, not rejection');
  for (const input of [null, {}, { ...media(), alt: '' }, { ...media(), alt: '<b>Invalid</b>' }, { ...media(), asset: { ...asset(), url: asset().url.replace('/production/', '/wrong/') } }, { ...media(), asset: { ...asset(), url: asset().url + '?token=untrusted' } }, { ...media(), asset: { ...asset(), mimeType: 'image/svg+xml' } }, { ...media(), crop: { top: 0.6, bottom: 0.6, left: 0, right: 0 } }, { ...media(), hotspot: { x: 0, y: 0, width: 1, height: 1 } }, { ...media(), asset: { ...asset(), metadata: { dimensions: { width: 1, height: 1 } } } }]) assert.equal(imageFromRecord(input), undefined);
  assert.ok(imageFromRecord({ ...media(), alt: null }, true), 'portrait alt derives from the fixed named clinician');
});

test('image controls retain guidance while Doctor photos require a usable selected asset', async () => {
  assert.deepEqual(schema._validation, []);
  const imageTypes = [];
  function visit(value) { for (const f of value.fields ?? []) { if (f.type.name === 'image') imageTypes.push(f.type); else visit(f.type); } }
  for (const type of schemaTypes) visit(schema.get(type.name));
  assert.equal(imageTypes.length, 24);
  for (const value of imageTypes) {
    if (value === field('doctor', 'portrait')) {
      assert.equal(value.options.hotspot, true);
      const validator = value.validation.find(r => r._level !== 'warning' && r._rules.some(rule => rule.flag === 'custom'))._rules.find(rule => rule.flag === 'custom').constraint;
      assert.equal(await validator({ asset: { _ref: asset()._id } }, { getClient: () => ({ fetch: async () => asset() }) }), true);
      const missing = await validator({ asset: { _ref: 'missing' } }, { getClient: () => ({ fetch: async () => null }) });
      assert.deepEqual(missing.paths, [['asset']]); assert.match(missing.message, /unavailable/);
      continue;
    }
    assert.match(value.description, /Recommended .*px/); assert.match(value.description, /crop|cropping/); assert.match(value.description, /Original uploads are preserved/);
    assert.equal(value.options.hotspot, true); assert.equal(value.options.maxUploadSize, undefined);
    const warning = value.validation.find(r => r._level === 'warning')._rules.find(r => r.flag === 'custom').constraint;
    const context = data => ({ getClient: () => ({ fetch: async () => data }) });
    assert.equal(await warning({ asset: { _ref: asset()._id } }, context(asset())), true);
    assert.match(await warning({ asset: { _ref: asset()._id } }, context(asset(100, 100))), /not an upload restriction/);
    assert.match(await warning({ asset: { _ref: asset()._id } }, context({ mimeType: 'image/svg+xml' })), /retain the original asset/);
  }
  const alt = field('service', 'coverImage').fields.find(f => f.name === 'alt').type;
  const validate = rules(alt).find(r => r.flag === 'custom').constraint;
  assert.equal(validate(undefined, { parent: {} }), true);
  assert.notEqual(validate(' ', { parent: { asset: { _ref: 'selected' } } }), true);
  assert.equal(validate('Approved image description', { parent: { asset: { _ref: 'selected' } } }), true);
});

test('shared treatment, doctor and Insight mappings isolate bad images from valid content', async () => {
  const service = { ...services[0], _id: 'service-fixture', coverImage: media() };
  assert.ok(resolveServices([service]).value[0].coverImage);
  assert.equal(resolveServices([{ ...service, coverImage: {} }]).value[0].title, service.title);
  assert.equal(resolveServices([{ ...service, coverImage: {} }]).value[0].coverImage, undefined);
  const doctor = { _id: 'doctor-fixture', slug: 'sahil', bio: 'Biography', philosophy: 'Philosophy', homeSummary: 'Summary', portrait: { ...media(), alt: null } };
  assert.ok(resolveDoctors([doctor]).value[0].portrait);
  assert.equal(resolveDoctors([{ ...doctor, portrait: {} }]).value[0].bio, doctor.bio);
  const insight = { _id: 'insight-fixture', _type: 'insight', slug: { current: 'fixture' }, title: 'Fixture', excerpt: 'Summary', category: 'Dental Care', date: '2026-10-17', readTimeMinutes: 2, featured: false, body: [{ _type: 'block', _key: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'span', text: 'Fixture content', marks: [] }] }], coverImage: { ...media(), asset: { _type: 'reference', _ref: asset()._id } } };
  const result = await (await evaluate(parse(insightsQuery), { dataset: [insight, asset()], params: { slugs: ['fixture'] } })).get();
  const mapped = resolveInsightOverrides(result, [{ slug: 'fixture' }]);
  assert.equal(mapped.status, 'sanity'); assert.ok(mapped.overrides[0].coverImage);
  assert.equal(resolveInsightOverrides([{ ...result[0], coverImage: {} }], [{ slug: 'fixture' }]).overrides[0].coverImage, undefined);
});

test('real Next Image renders responsive CMS sources for static-import slots and restricts the CDN path', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
  const config = require('../next.config.js').images;
  const { JSDOM } = require('jsdom');
  const EditorialImage = require('../components/insights/EditorialImage.tsx').default;
  const original = { src: '/original.jpg', width: 2400, height: 3200 };
  const render = imageOverride => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, ...config } }, React.createElement(EditorialImage, { src: original, alt: 'Original description', imageOverride, cropWidth: 900, cropHeight: 1200, sizes: '50vw' })));
  const fallback = new JSDOM(render()).window.document.querySelector('img');
  assert.equal(fallback.width, 2400); assert.equal(fallback.height, 3200);
  const remote = new JSDOM(render(imageFromRecord(media()))).window.document.querySelector('img');
  assert.equal(remote.width, 900); assert.equal(remote.height, 1200);
  assert.match(remote.srcset, /640w/); assert.equal(remote.sizes, '50vw');
  assert.match(decodeURIComponent(remote.getAttribute('src')), /cdn.sanity.io\/images\/ae09qs5c\/production\//);
  assert.deepEqual(config.remotePatterns.find(p => p.hostname === 'cdn.sanity.io'), { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '/images/ae09qs5c/production/**' });
});

test('a failed CMS image restores the original image and alternative text in the mounted component', async () => {
  const { JSDOM } = require('jsdom');
  const React = require('react');
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/' });
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const { createRoot } = require('react-dom/client');
  const exports = {}, source = ts.transpileModule(readFileSync('components/insights/EditorialImage.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', source)(id => id === 'next/image' ? { __esModule: true, default: props => React.createElement('img', props) } : id === '../../sanity/lib/image-url' ? require('../sanity/lib/image-url.ts') : require(id), exports);
  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await React.act(async () => root.render(React.createElement(exports.default, { src: '/original.jpg', alt: 'Original description', imageOverride: imageFromRecord(media()), cropWidth: 1200, cropHeight: 900 })));
    assert.match(dom.window.document.querySelector('img').src, /cdn.sanity.io/);
    assert.equal(dom.window.document.querySelector('img').getAttribute('width'), '1200', 'remote replacement supplies dimensions previously inferred from a static import');
    assert.equal(dom.window.document.querySelector('img').getAttribute('height'), '900');
    await React.act(async () => dom.window.document.querySelector('img').dispatchEvent(new dom.window.Event('error')));
    assert.equal(dom.window.document.querySelector('img').getAttribute('src'), '/original.jpg');
    assert.equal(dom.window.document.querySelector('img').alt, 'Original description');
    assert.equal(dom.window.document.querySelector('img').getAttribute('width'), null, 'fallback keeps the original static-import props');
    await React.act(async () => root.render(React.createElement(exports.default, { src: '/original.jpg', alt: 'Doctor name', imageOverride: imageFromRecord(media(), true), cropWidth: 600, cropHeight: 750, cmsOnly: true })));
    await React.act(async () => dom.window.document.querySelector('img').dispatchEvent(new dom.window.Event('error')));
    assert.equal(Boolean(dom.window.document.querySelector('img')), false, 'a failed CMS-only portrait cannot resurrect the local photograph');
    const replacement = imageFromRecord({ ...media(), asset: { ...asset(), _id: asset()._id.replace('abc123', 'replacement'), url: asset().url.replace('abc123', 'replacement') } }, true);
    await React.act(async () => root.render(React.createElement(exports.default, { src: '', alt: 'Doctor name', imageOverride: replacement, cropWidth: 600, cropHeight: 750, cmsOnly: true })));
    assert.match(dom.window.document.querySelector('img').src, /replacement/);
    await React.act(async () => root.render(React.createElement(exports.default, { src: '', alt: 'Doctor name', cropWidth: 600, cropHeight: 750, cmsOnly: true })));
    assert.equal(Boolean(dom.window.document.querySelector('img')), false, 'removing the photo preserves an empty reserved area');
  } finally {
    await React.act(async () => root.unmount()); dom.window.close();
    globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
  }
});
