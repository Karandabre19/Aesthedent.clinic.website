import fs from 'node:fs';

import path from 'node:path';

import crypto from 'node:crypto';

import { createRequire } from 'node:module';

import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const require = createRequire(import.meta.url);

for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);

const { JSDOM } = require('jsdom');

const { renderToStaticMarkup } = require('react-dom/server');

const { services } = require('../lib/services.js');

const { insights } = require('../lib/insights.js');

const { getTestimonials } = require('../lib/testimonials.js');

const { landingPageContent } = require('../lib/landing-page-content.js');

const { homeContent, aboutContent, experienceContent, doctorContent, doctorWebsiteFields, singletonNames } = require('../sanity/lib/page-mapping.ts');

const { homeSections, aboutSections, experienceSections, sectionCopySchema } = require('../sanity/lib/editorial-sections.ts');

const { serviceContent } = require('../sanity/lib/service-mapping.ts');
const { teamValuesContent, teamValuesDefaults } = require('../sanity/lib/team-values.ts');

const { insightContent } = require('../sanity/lib/insight-mapping.ts');

export const target = { projectId: 'ae09qs5c', dataset: 'production' };

export const contentTypes = [...singletonNames, 'service', 'doctor', 'insight', 'testimonial'];

const { presentationDefinitions, presentationSpecs } = require('../sanity/lib/presentation-definitions.ts');

const { navigationDefaults } = require('../sanity/lib/navigation-data.ts');

const { siteMetadata } = require('../lib/site-metadata.ts');

const { navigationContent } = require('../sanity/lib/navigation-mapping.ts');

const { seoCopy } = require('../sanity/lib/seo-mapping.ts');

const { testimonialContent } = require('../sanity/lib/testimonial-mapping.ts');

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Value comparisons must not depend on key order: Sanity may return the same
// object with keys in a different order than the manifest built it.
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;

export const stableHash = value => hash(canonical(value));

const normalizeText = text => text.replace(/\s+/g, ' ').trim();

const source = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);

function walk(node, visit) { visit(node); ts.forEachChild(node, child => walk(child, visit)); }

function literal(node, tree) {

  if (ts.isStringLiteralLike(node)) return node.text;

  // Only source literals/fragments are evaluated, never CMS values or full pages.

  const output = ts.transpileModule(`exports.value = (${node.getText(tree)});`, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;

  const result = {}; new Function('require', 'exports', output)(require, result);

  return result.value;

}

function namedValue(file, name) {

  const tree = source(file); let value;

  walk(tree, node => { if (ts.isVariableDeclaration(node) && node.name.getText(tree) === name) value = literal(node.initializer, tree); });

  if (!value) throw new Error(`Missing source initializer: ${file}:${name}`); return value;

}

function sourceArray(file, needle, fields) {

  const tree = source(file); let result;

  walk(tree, node => {

    if (ts.isArrayLiteralExpression(node) && node.elements.length && ts.isObjectLiteralExpression(node.elements[0]) && node.elements[0].getText(tree).includes(needle)) result = node.elements.map(element => Object.fromEntries(element.properties.filter(p => fields.includes(p.name?.getText(tree))).map(p => [p.name.getText(tree), literal(p.initializer, tree)])));

  });

  if (!result) throw new Error(`Missing array: ${file}:${needle}`); return result;

}

const setPath = (value, segments, entry) => { const key = segments.shift(); if (!segments.length) value[key] = entry; else { value[key] ??= {}; setPath(value[key], segments, entry); } };

function pageCopy(file, specs) {

  const tree = source(file), data = {}, evidence = [];

  walk(tree, node => {

    if (!ts.isBinaryExpression(node) || node.operatorToken.kind !== ts.SyntaxKind.QuestionQuestionToken) return;

    const lhs = node.left.getText(tree);

    if (!/^(editorial|presentation)(?:\?\.[A-Za-z]+)+$/.test(lhs)) return;

    if (!ts.isStringLiteralLike(node.right) && !ts.isJsxFragment(node.right)) return;

    const segments = lhs.replace(/^(editorial|presentation)\?\./, '').split('?.');

    const value = literal(node.right, tree), text = typeof value === 'string' ? value : normalizeText(new JSDOM(renderToStaticMarkup(value)).window.document.body.textContent);

    if (Array.isArray(value) || value && typeof value === 'object' && !('$$typeof' in value)) return;

    setPath(data, [...segments], text);

    evidence.push({ path: segments.join('.'), source: `${file}:${tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1}`, value: text });

  });

  // These two defaults belong to the shared component, not Home's call site.

  if (file === 'app/HomeClient.js') {

    const sharedFile = 'components/sections/InsightsSection.js', sharedTree = source(sharedFile);

    data.insights ??= {};

    walk(sharedTree, node => {

      if (!ts.isFunctionDeclaration(node) || node.name?.text !== 'InsightsSection') return;

      const bindings = node.parameters[0]?.name;

      if (!bindings || !ts.isObjectBindingPattern(bindings)) throw new Error('Missing shared Insights defaults.');

      for (const [field, prop] of [['eyebrow', 'eyebrow'], ['allInsightsLabel', 'viewAllLabel']]) {

        const binding = bindings.elements.find(element => element.name.getText(sharedTree) === prop);

        if (!binding?.initializer) throw new Error(`Missing shared default: ${prop}`);

        data.insights[field] = literal(binding.initializer, sharedTree);

        evidence.push({ path: `insights.${field}`, source: `${sharedFile}:${sharedTree.getLineAndCharacterOfPosition(binding.getStart(sharedTree)).line + 1}`, value: data.insights[field] });

      }

    });

  }

  for (const spec of specs) {

    sectionCopySchema(spec).parse(data[spec.name] ?? {});

    for (const [key, field] of Object.entries(spec.fields)) if (field.kind !== 'image' && data[spec.name]?.[key] == null) throw new Error(`Unmapped editable copy: ${file}:${spec.name}.${key}`);

  }

  return { data, evidence };

}

export function htmlToPortableText(html) {

  const document = new JSDOM(html).window.document; let index = 0;

  const key = () => `source${++index}`;

  function paragraph(element, listItem, level) {

    const markDefs = [], children = [];

    function spans(node, marks = []) {

      if (node.nodeType === 3) { children.push({ _type: 'span', _key: key(), text: node.textContent, marks }); return; }

      if (['UL', 'OL'].includes(node.tagName)) return;

      if (node.tagName === 'BR') { children.push({ _type: 'span', _key: key(), text: '\n', marks }); return; }

      if (!['P', 'H2', 'H3', 'LI', 'STRONG', 'B', 'EM', 'I', 'A'].includes(node.tagName)) throw new Error(`Unsupported source HTML: ${node.tagName}`);

      let extra = [];

      if (['STRONG', 'B'].includes(node.tagName)) extra = ['strong'];

      if (['EM', 'I'].includes(node.tagName)) extra = ['em'];

      if (node.tagName === 'A') { const id = key(); markDefs.push({ _type: 'link', _key: id, href: node.getAttribute('href') }); extra = [id]; }

      for (const child of node.childNodes) spans(child, [...marks, ...extra]);

    }

    spans(element);

    return { _type: 'block', _key: key(), style: ['H2', 'H3'].includes(element.tagName) ? element.tagName.toLowerCase() : element.classList.contains('lead') ? 'lead' : 'normal', children, markDefs, ...(listItem ? { listItem, level } : {}) };

  }

  const blocks = [];

  function visit(element, level = 1) {

    if (['UL', 'OL'].includes(element.tagName)) for (const item of element.children) {

      if (item.tagName !== 'LI') throw new Error('Invalid source list');

      blocks.push(paragraph(item, element.tagName === 'UL' ? 'bullet' : 'number', level));

      for (const nested of item.children) if (['UL', 'OL'].includes(nested.tagName)) visit(nested, level + 1);

    } else {

      if (!['P', 'H2', 'H3'].includes(element.tagName)) throw new Error(`Unsupported source section: ${element.tagName}`);

      blocks.push(paragraph(element));

    }

  }

  for (const child of document.body.children) visit(child);

  return blocks;

}

function assetSlots(file) {

  const tree = source(file), imports = new Map(), output = [];

  walk(tree, node => { if (ts.isImportDeclaration(node) && /\.(png|jpe?g|webp)$/.test(node.moduleSpecifier.text)) imports.set(node.importClause?.name?.text, path.resolve(path.dirname(file), node.moduleSpecifier.text)); });

  walk(tree, node => {

    if (!(ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) || node.tagName.getText(tree) !== 'EditorialImage') return;

    const props = Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute).map(a => [a.name.text, a.initializer]));

    const raw = props.src && (ts.isStringLiteral(props.src) ? props.src.text : props.src.expression?.getText(tree));

    output.push({ consumer: `${file}:${tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1}`, field: props.imageOverride?.expression?.getText(tree), source: imports.get(raw) ?? raw, ...(Object.hasOwn(props, 'cmsOnly') ? { cmsOnly: true } : {}), cropWidth: Number(props.cropWidth?.expression?.getText(tree)), cropHeight: Number(props.cropHeight?.expression?.getText(tree)), alt: ts.isStringLiteral(props.alt) ? props.alt.text : props.alt?.expression?.getText(tree), uploadAuthorized: false });

  });

  return output;

}

const withKeys = value => Array.isArray(value) ? value.map((item, i) => item && typeof item === 'object' ? { _type: 'object', _key: `item${i + 1}`, ...withKeys(item) } : item) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withKeys(entry)])) : value;

const sectionSpecs = { homePage: homeSections, aboutPage: aboutSections, experiencePage: experienceSections };

const coreSchemas = { teamValues: ['teamValuesContent', teamValuesContent], homePage: ['homeContent', homeContent], aboutPage: ['aboutContent', aboutContent], experiencePage: ['experienceContent', experienceContent], service: ['serviceContent', serviceContent], doctor: ['doctorContent', doctorContent], insight: ['insightContent', insightContent], navigation: ['navigationContent', navigationContent], testimonial: ['testimonialContent', testimonialContent] };

const issueText = issues => issues.map(issue => `${issue.path.join('.') || '(root)'}: ${issue.message}`);

// Validate the final keyed payload with the same Zod contracts the website readers use.
export function validateCandidate(content) {

  const type = content?._type, names = [], issues = [];

  const check = (name, schema, value) => { names.push(name); const result = schema.safeParse(value); if (!result.success) issues.push(...issueText(result.error.issues)); };

  if (coreSchemas[type]) check(coreSchemas[type][0], coreSchemas[type][1], content);

  if (type === 'seoSettings') check('seoCopy', seoCopy, content.defaults ?? {});

  for (const spec of sectionSpecs[type] ?? (presentationDefinitions[type] ? presentationSpecs(type) : [])) check(`sectionCopySchema(${spec.name})`, sectionCopySchema(spec), content[spec.name] ?? {});

  if (!names.length) issues.push(`No runtime contract registered for type ${type}.`);

  return { ok: issues.length === 0, schema: names.join(' + '), issues };

}

export function validateManifestDocuments(documents, reviews = []) {

  const identities = [...documents, ...reviews].map(entry => `${entry.content?._type}:${entry.identity}`);

  const duplicate = identities.find((identity, index) => identities.indexOf(identity) !== index);

  if (duplicate) throw new Error(`Duplicate manifest identity: ${duplicate}`);

  for (const doc of documents) {

    const result = validateCandidate(doc.content);

    if (!result.ok) throw new Error(`Invalid ${doc.content?._type} payload for ${doc.identity}: ${result.issues.join('; ')}`);

    doc.validation = `passed ${result.schema}`;

  }

  // Reviews stay blocked either way; record why their payload is not publishable.
  for (const review of reviews) { const result = validateCandidate(review.content); review.validation = result.ok ? `passed ${result.schema}` : `fails ${result.schema}: ${result.issues.join('; ')}`; }

}

export function buildContentManifest() {

  const homeFile = 'app/HomeClient.js', aboutFile = 'app/about/AboutClient.js', experienceFile = 'app/aesthedent-experience/ExperienceClient.js';

  const home = pageCopy(homeFile, homeSections), about = pageCopy(aboutFile, aboutSections), experience = pageCopy(experienceFile, experienceSections);

  const tree = source(homeFile); let stages;

  walk(tree, node => { if (ts.isArrayLiteralExpression(node) && node.elements.length === 6 && ts.isArrayLiteralExpression(node.elements[0]) && node.elements[0].elements[0]?.text === 'Checkup') stages = node.elements.map(item => ({ stage: literal(item.elements[0], tree), detail: literal(item.elements[1], tree) })); });

  home.data.visitSteps = stages; homeContent.parse(home.data);

  about.data.values = sourceArray(aboutFile, 'Painless Treatment', ['title', 'desc']); aboutContent.parse(about.data);

  Object.assign(experience.data, { specialistBenefits: sourceArray(experienceFile, 'Architectural Planning', ['title', 'desc']), technology: sourceArray(experienceFile, 'Intraoral Scanners', ['title', 'desc']), approach: sourceArray(experienceFile, 'Evidence-Based Planning', ['title', 'desc']), faqs: landingPageContent.faqs }); experienceContent.parse(experience.data);

  const documents = [["homePage", home], ["aboutPage", about], ["experiencePage", experience]].map(([type, page]) => ({ identity: type, source: type === 'homePage' ? homeFile : type === 'aboutPage' ? aboutFile : experienceFile, reviewRequired: true, content: { _type: type, ...Object.fromEntries(Object.entries(page.data).map(([k, v]) => [k, withKeys(v)])) } }));

  documents.push(...services.map(s => ({ identity: s.slug, source: 'lib/services.js', reviewRequired: true, content: { _type: 'service', ...serviceContent.parse(s), slug: { _type: 'slug', current: s.slug } } })));

  const doctors = sourceArray('app/doctor/DoctorClient.js', 'Dr. Sahil', ['bio', 'philosophy']), summaries = sourceArray(homeFile, 'DOCTORS.sahil', ['desc']);

  documents.push(...doctors.map((doc, index) => {
    const identity = index === 0 ? 'sahil' : 'aishwarya', fields = doctorWebsiteFields(identity);
    return { identity, source: 'app/doctor/DoctorClient.js + app/HomeClient.js + lib/clinic.ts', reviewRequired: true,
      content: { _type: 'doctor', slug: { _type: 'slug', current: identity }, ...doctorContent.parse({ ...doc, ...fields, homeSummary: summaries[index].desc }), ...fields } };
  }));

  const listing = namedValue('app/insights/InsightsClient.js', 'fallbackInsights'), bodies = namedValue('app/insights/[slug]/InsightDetailClient.js', 'insightsData');

  documents.push(...insights.map(article => {

    const contextual = listing.find(item => item.slug === article.slug);

    const content = { _type: 'insight', slug: { _type: 'slug', current: article.slug }, title: article.title, excerpt: article.excerpt, ...(article.metaTitle ? { metaTitle: article.metaTitle } : {}), category: article.category, date: new Date(`${article.date} UTC`).toISOString().slice(0, 10), readTimeMinutes: parseInt(article.readTime), featured: article.featured, body: htmlToPortableText(bodies[article.slug].content), editorialStatus: 'draft', ...(contextual.title !== article.title ? { listingTitle: contextual.title } : {}), ...(contextual.excerpt !== article.excerpt ? { listingExcerpt: contextual.excerpt } : {}) };

    insightContent.parse(content);

    return { identity: article.slug, source: 'lib/insights.js + InsightsClient fallbackInsights + InsightDetailClient insightsData', reviewRequired: true, content };

  }));

  const addedEvidence = [];

  for (const [name, definition] of Object.entries(presentationDefinitions)) {

    const files = [definition.consumer];

    if (name === 'servicesPage') files.push('app/services/[slug]/ServiceDetailClient.js');

    if (name === 'insightsPage') files.push('app/insights/[slug]/InsightDetailClient.js');

    const data = {};

    for (const file of files) {

      const mapped = pageCopy(file, []);

      Object.assign(data, mapped.data);

      addedEvidence.push(...mapped.evidence.map(item => ({ ...item, document: name })));

    }

    for (const spec of presentationSpecs(name).filter(spec => name !== 'teamPage' || spec.name !== 'values')) {

      sectionCopySchema(spec).parse(data[spec.name] ?? {});

      for (const key of Object.keys(spec.fields)) if (data[spec.name]?.[key] == null) throw new Error(`Missing presentation destination: ${name}.${spec.name}.${key}`);

    }

    if (name === 'teamPage') delete data.values;
    documents.push({ identity: name, source: files.join(' + '), reviewRequired: true, content: { _type: name, ...data } });

  }

  documents.push({ identity: 'teamValues', source: 'sanity/lib/team-values.ts (existing Team-page copy)', reviewRequired: true, content: { _type: 'teamValues', ...structuredClone(teamValuesDefaults), cards: teamValuesDefaults.cards.map(card => ({ _type: 'teamValueCard', ...card })) } });

  documents.push({ identity: 'navigation', source: 'sanity/lib/navigation-data.ts (verified existing menus)', reviewRequired: true, content: { _type: 'navigation', ...structuredClone(navigationDefaults) } });

  // Preserve existing search intent; empty page overrides remain self-canonical

  // and indexable. Shared settings cannot impose a global visibility decision.

  documents.push({ identity: 'seoSettings', source: 'lib/site-metadata.ts', reviewRequired: true, content: { _type: 'seoSettings', defaults: { metaTitle: siteMetadata.title.default, metaDescription: siteMetadata.description, ogTitle: siteMetadata.openGraph.title, ogDescription: siteMetadata.openGraph.description, twitterTitle: siteMetadata.twitter.title, twitterDescription: siteMetadata.twitter.description } } });

  const reviews = getTestimonials('latest').map(r => ({ identity: String(r.id), source: 'lib/testimonials.js', blocked: 'Specific review source and republication permission are not confirmed.', content: { _type: 'testimonial', slot: String(r.id), name: r.name, service: r.service, rating: r.rating, text: r.text, verifiedGoogleReview: false, publicationPermissionConfirmed: false } }));

  const consumers = [homeFile, aboutFile, experienceFile, 'app/doctor/DoctorClient.js', 'app/services/ServicesClient.js', 'app/services/[slug]/ServiceDetailClient.js', 'app/insights/InsightsClient.js', 'app/insights/[slug]/InsightDetailClient.js', 'components/sections/InsightsSection.js'];

  const doctorAssets = sourceArray('app/doctor/DoctorClient.js', 'Dr. Sahil', ['image']).flatMap((doctor, index) => typeof doctor.image === 'string' && doctor.image ? [{ identity: index === 0 ? 'sahil' : 'aishwarya', image: doctor.image }] : []);

  const assets = [...consumers.flatMap(assetSlots), ...services.map(s => ({ identity: s.slug, field: 'coverImage', source: s.image, uploadAuthorized: false })), ...insights.map(s => ({ identity: s.slug, field: 'coverImage', source: s.image, uploadAuthorized: false })), ...doctorAssets.map(s => ({ identity: s.identity, field: 'portrait', source: s.image, uploadAuthorized: false }))].map(asset => {

    const file = typeof asset.source === 'string' && asset.source.startsWith('/') ? path.resolve('public', asset.source.slice(1)) : asset.source;

    // Repo-relative POSIX paths keep the manifest hash identical across checkouts.
    return typeof file === 'string' && fs.existsSync(file) && fs.statSync(file).isFile() ? { ...asset, localFile: path.relative(repoRoot, path.resolve(file)).split(path.sep).join('/'), sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') } : asset;

  });

  for (const doc of documents) for (const key of Object.keys(doc.content)) doc.content[key] = withKeys(doc.content[key]);

  validateManifestDocuments(documents, reviews);

  const leafEvidence = (value, prefix = '') => Object.entries(value).flatMap(([key, entry]) => key.startsWith('_') ? [] : entry && typeof entry === 'object' ? leafEvidence(entry, prefix ? `${prefix}.${key}` : key) : [{ path: prefix ? `${prefix}.${key}` : key, value: entry }]);

  const detailedEvidence = documents.flatMap(doc => leafEvidence(doc.content).map(item => ({ document: doc.identity, ...item, source: doc.source })));

  const assetDecisions = assets.map(asset => {

    if (asset.cmsOnly) return { ...asset, destinations: documents.filter(doc => doc.content._type === 'doctor').map(doc => ({ identity: doc.identity, field: 'portrait' })), nativeAsset: null, decision: 'Managed through the Doctor portrait fields in Studio. There is no static fallback or source upload to plan; preserve existing native selections.' };

    const expression = asset.field ?? '';

    const model = expression.includes('service.coverImage') || expression === 's.coverImage' && asset.consumer?.startsWith('app/services') ? 'service' : expression.includes('insight.coverImage') || expression.includes('article.coverImage') ? 'insight' : expression.includes('portrait') || expression.includes('doctor') ? 'doctor' : undefined;

    const field = model === 'doctor' ? 'portrait' : 'coverImage';

    const destinations = model ? assets.filter(item => item.identity && item.field === field && documents.some(doc => doc.content._type === model && doc.identity === item.identity)).map(item => ({ identity: item.identity, field, source: item.source })) : [{ identity: asset.identity ?? (asset.consumer?.startsWith(homeFile) ? 'homePage' : asset.consumer?.startsWith(aboutFile) ? 'aboutPage' : 'experiencePage'), field: expression.replace(/^editorial\?\./, '').replaceAll('?.', '.'), source: asset.source }];

    return { ...asset, destinations, nativeAsset: null, decision: 'Keep current source fallback. Authenticated native-asset/permission reconciliation and any upload require separate approval.' };

  });

  const socialAssets = documents.filter(doc => singletonNames.includes(doc.identity) && !['navigation', 'teamValues'].includes(doc.identity) || ['service','insight'].includes(doc.content._type)).map(doc => ({ identity: doc.identity, field: doc.identity === 'seoSettings' ? 'defaults.socialImage' : 'seo.socialImage', source: doc.content._type === 'insight' ? insights.find(item => item.slug === doc.identity).image : siteMetadata.openGraph.images[0].url, nativeAsset: null, uploadAuthorized: false, altPolicy: 'Describe the approved social image; do not infer credentials or outcomes.', crop: '1200×630 (40:21), subject within central safe area; preserve high-resolution original.' }));

  const payload = { target, documents, reviews, fieldEvidence: [...home.evidence.map(e => ({...e, document: 'homePage'})), ...about.evidence.map(e => ({...e, document: 'aboutPage'})), ...experience.evidence.map(e => ({...e, document: 'experiencePage'})), ...addedEvidence], payloadEvidence: detailedEvidence, assets: assetDecisions, socialAssets, nativeImageControls: 24 };

  return { ...payload, manifestHash: hash(payload) };

}

const familyId = id => id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '');

function missingPaths(existing, candidate, prefix = '') {

  const changes = {};

  for (const [key, value] of Object.entries(candidate)) {

    if (key.startsWith('_')) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (!Object.hasOwn(existing, key)) changes[path] = value;

    else if (value && typeof value === 'object' && !Array.isArray(value) && existing[key] && typeof existing[key] === 'object' && !Array.isArray(existing[key])) Object.assign(changes, missingPaths(existing[key], value, path));

    else if (Array.isArray(value) && Array.isArray(existing[key])) {

      if (value.length !== existing[key].length) throw new Error(`Existing array differs: ${path}`);

      value.forEach((item, index) => {

        const old = existing[key][index];

        if (item && typeof item === 'object' && old && typeof old === 'object') {

          if (item.key && old.key !== item.key) throw new Error(`Existing menu identity/order differs: ${path}`);

          if (item.stage && old.stage !== item.stage) throw new Error(`Existing stage differs: ${path}`);

          if (typeof old._key !== 'string') throw new Error(`Existing array item lacks its stable key: ${path}`);

          Object.assign(changes, missingPaths(old, item, `${path}[_key==${JSON.stringify(old._key)}]`));

        }

      });

    }

  }

  return changes;

}

export const generatedTarget = 'Sanity-generated on create';

const entryFor = candidate => ({ identity: candidate.identity, type: candidate.content._type, status: null, targetId: singletonNames.includes(candidate.content._type) ? `drafts.${candidate.identity}` : null, operation: null, reason: '', source: candidate.source, validation: candidate.validation, preservedConflicts: 0 });

// Testimonials never produce operations; they are listed so reviewers see why.
const reviewEntries = manifest => (manifest.reviews ?? []).map(review => ({ identity: review.identity, type: review.content._type, status: 'blocked', targetId: null, operation: null, reason: review.blocked ?? 'Not eligible for synchronization.', source: review.source, validation: review.validation, preservedConflicts: 0, excludedFromApply: true }));

export function planDraftOperations(manifest, inventory) {

  if (!inventory.authenticated || !inventory.complete) {

    const reason = 'Authenticated complete published/draft/release inventory is required.';

    return { blocked: [reason], operations: [], candidates: [...manifest.documents.map(candidate => ({ ...entryFor(candidate), status: 'blocked', reason })), ...reviewEntries(manifest)] };

  }

  const operations = [], blocked = [], decisions = [], candidates = [];

  // A stored record whose identity matches no candidate may be one of ours under an
  // edited slug; creating another record of that type could silently duplicate it.
  const unmatched = {};

  for (const type of new Set(manifest.documents.map(d => d.content._type))) {

    if (singletonNames.includes(type)) continue;

    const known = new Set(manifest.documents.filter(d => d.content._type === type).map(d => d.identity));

    const strays = [...new Set(inventory.documents.filter(doc => doc._type === type && !known.has(doc.slug?.current)).map(doc => familyId(doc._id)))].sort();

    if (strays.length) unmatched[type] = strays;

  }

  for (const candidate of manifest.documents) {

    const singleton = singletonNames.includes(candidate.content._type), entry = entryFor(candidate);

    const settle = (status, reason, gating = false) => { if (gating) blocked.push(`${candidate.identity}: ${reason}`); candidates.push({ ...entry, status, reason }); };

    const matches = inventory.documents.filter(doc => doc._type === candidate.content._type && (singleton || doc.slug?.current === candidate.identity));

    const families = new Set(matches.map(doc => familyId(doc._id)));

    if (matches.some(doc => doc._id.startsWith('versions.'))) { settle('blocked', 'a release version exists; resolve the release in Studio before synchronizing.', true); continue; }

    if (families.size > 1 || singleton && [...families].some(id => id !== candidate.identity)) { settle('conflict', 'ambiguous identity: more than one document family matches; review which record is authoritative.', true); continue; }

    const draft = matches.find(doc => doc._id.startsWith('drafts.')), published = matches.find(doc => !doc._id.startsWith('drafts.'));

    const existing = draft ?? published;

    if (existing) {

      const first = decisions.length;

      const compare = (old, next, prefix = '') => {

        for (const [key, value] of Object.entries(next)) {

          if (key.startsWith('_')) continue;

          const path = prefix ? `${prefix}.${key}` : key;

          if (!Object.hasOwn(old, key)) decisions.push({ identity: candidate.identity, path, status: 'missing', proposedValue: value, existingId: existing._id, revision: existing._rev });

          else if (value && typeof value === 'object' && !Array.isArray(value) && old[key] && typeof old[key] === 'object' && !Array.isArray(old[key])) compare(old[key], value, path);

          else decisions.push({ identity: candidate.identity, path, status: stableHash(old[key]) === stableHash(value) ? 'unchanged' : 'preserved-conflict', existingValue: old[key], proposedValue: value, existingId: existing._id, revision: existing._rev });

        }

      };

      compare(existing, candidate.content);

      entry.preservedConflicts = decisions.slice(first).filter(d => d.status === 'preserved-conflict').length;

    } else {

      decisions.push({ identity: candidate.identity, status: 'new-draft', payloadHash: hash(candidate.content) });

      if (unmatched[candidate.content._type]) { settle('conflict', `unmatched existing ${candidate.content._type} record(s) ${unmatched[candidate.content._type].join(', ')} may be this item under another slug; review before creating.`, true); continue; }

    }

    try {

      if (draft) {

        entry.targetId = draft._id;

        const setIfMissing = missingPaths(draft, candidate.content), count = Object.keys(setIfMissing).length;

        if (!count) { settle('skip', 'existing draft already contains every mapped path; nothing to fill.'); continue; }

        operations.push({ kind: 'patch', id: draft._id, revision: draft._rev, identity: candidate.identity, setIfMissing });

        settle('update', `fill ${count} missing path(s) in the existing draft; existing values are kept.`);

      } else {

        entry.targetId = singleton ? `drafts.${candidate.identity}` : published ? `drafts.${published._id}` : generatedTarget;

        const content = published ? structuredClone(published) : structuredClone(candidate.content);

        if (published) {

          const additions = missingPaths(published, candidate.content);

          if (Object.keys(additions).some(p => p.includes('.') || p.includes('['))) { settle('blocked', 'nested additions to a published document require a reviewed draft first.', true); continue; }

          if (!Object.keys(additions).length) { settle('skip', 'published document already contains every mapped path; no companion draft needed.'); continue; }

          Object.assign(content, additions);

        }

        for (const key of ['_rev', '_createdAt', '_updatedAt', '_id']) delete content[key];

        operations.push({ kind: 'create', identity: candidate.identity, publishedRevision: published?._rev, publishedId: published?._id, content: { ...content, _id: singleton ? `drafts.${candidate.identity}` : published ? `drafts.${published._id}` : 'drafts.' } });

        settle(published ? 'update' : 'create', published ? 'companion draft from published values plus missing top-level paths.' : 'new draft from mapped source content.');

      }

      candidates.at(-1).operation = operations.at(-1).kind;

    } catch (error) { settle('blocked', error.message, true); }

  }

  return { operations, blocked, decisions, candidates: [...candidates, ...reviewEntries(manifest)] };

}

export const unresolvedClinicFacts = [
  'Patient count: About story says over 5,000; lib/clinic.ts confirms 1000+.',
  'Review count: Experience wording says 260+; elsewhere 280.',
  'Dr. Aishwarya is described as "Pregnancy Dentistry Specialist"; the clinic authority records BDS/general and family dentistry.',
  'Doctor route metadata keeps older "surgeon" wording.',
  'Provider assignments: orthodontic care (C10) and surgery (C11) providers are unconfirmed; no registrations are recorded in CMS content.',
  'Clinical and outcome claims in treatments, Experience and the six Insights need clinic sign-off.',
  'Testimonials: specific Google source links and republication permission are not confirmed.',
];

const preview = value => {

  if (value === undefined) return '(absent)';

  const text = (typeof value === 'string' ? value : JSON.stringify(value)).replace(/\s+/g, ' ');

  return text.length > 120 ? `${text.slice(0, 117)}... (sha256 ${stableHash(value).slice(0, 12)})` : text;

};

const cell = value => String(value ?? '').replaceAll('|', '\\|');

const table = (headers, rows) => [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.map(cell).join(' | ')} |`)].join('\n');

// Human-readable review of a dry-run. Deterministic for a given manifest and inventory.
export function renderPlanReport(manifest, inventory, plan) {

  const documents = inventory.documents ?? [], state = id => id.startsWith('drafts.') ? 'draft' : id.startsWith('versions.') ? 'release' : 'published';

  const statuses = ['create', 'update', 'skip', 'conflict', 'blocked'];

  const lines = [

    '# Aesthedent CMS draft-synchronization review', '',

    'Dry-run output. Nothing was written, uploaded or published. Approving this report is not approval to apply: applying requires a separate approval file naming the exact hashes below, and writes drafts only.', '',

    `- Target: \`${manifest.target.projectId}\` / \`${manifest.target.dataset}\``,

    `- Manifest hash: \`${manifest.manifestHash}\``,

    `- Operations hash: \`${hash(plan.operations)}\` (${plan.operations.length} operation(s))`,

    `- Inventory: ${inventory.authenticated && inventory.complete ? `authenticated and complete, checked ${inventory.checkedAt}, ${documents.length} record(s)` : `INCOMPLETE. ${inventory.blocker ?? 'Authenticated inventory unavailable.'}`}`,

  ];

  if (inventory.publishedSnapshot?.counts) lines.push(`- Published-only snapshot ${inventory.publishedSnapshot.checkedAt}: ${Object.values(inventory.publishedSnapshot.counts).reduce((a, b) => a + b, 0)} published record(s). This does not establish draft, release or asset inventory.`);

  if (plan.blocked.length) lines.push(`- Apply gate: closed (${plan.blocked.length} gating issue(s)).`);

  lines.push('', '## Summary', '', table(['Status', 'Count'], statuses.map(status => [status, plan.candidates.filter(c => c.status === status).length])));

  if (documents.length) {

    const types = [...new Set(documents.map(doc => doc._type))].sort();

    lines.push('', '## Dataset inventory', '', table(['Type', 'Published', 'Draft', 'Release'], types.map(type => ['published', 'draft', 'release'].reduce((row, s) => [...row, documents.filter(doc => doc._type === type && state(doc._id) === s).length], [type]))));

    const categories = [...new Set(documents.filter(doc => doc._type === 'insight' && doc.category).map(doc => doc.category))].sort();

    lines.push('', `Insight categories present: ${categories.length ? categories.join(', ') : 'none'}.`);

  }

  lines.push('', '## Candidates', '', table(['#', 'Identity', 'Type', 'Status', 'Target ID', 'Operation', 'Preserved conflicts', 'Source', 'Validation', 'Reason'], plan.candidates.map((c, i) => [i + 1, c.identity, c.type, c.status, c.targetId ?? (c.excludedFromApply ? 'none (excluded)' : 'decided after inventory'), c.operation ?? '-', c.preservedConflicts, c.source, preview(c.validation), c.reason])));

  lines.push('', '## Field-level detail', '', 'Existing values always win. `missing` paths would be filled; `preserved-conflict` paths keep the stored value and are listed for review only.');

  for (const candidate of plan.candidates.filter(c => !c.excludedFromApply)) {

    const evidence = Object.fromEntries((manifest.fieldEvidence ?? []).filter(e => e.document === candidate.identity).map(e => [e.path, e.source]));

    const decided = (plan.decisions ?? []).filter(d => d.identity === candidate.identity && d.path);

    lines.push('', `### ${candidate.identity} (${candidate.type}): ${candidate.status}`, '');

    if (decided.length) lines.push(table(['Path', 'Decision', 'Existing', 'Proposed', 'Source line'], decided.map(d => [d.path, d.status, preview(d.existingValue), preview(d.proposedValue), evidence[d.path] ?? candidate.source])));

    else lines.push(table(['Path', 'Proposed', 'Source line'], (manifest.payloadEvidence ?? []).filter(e => e.document === candidate.identity).map(e => [e.path, preview(e.value), evidence[e.path] ?? e.source])));

  }

  const uploads = (manifest.assets ?? []).filter(a => a.uploadAuthorized).length;

  lines.push('', '## Images', '', `${(manifest.assets ?? []).length} image slot(s) and ${(manifest.socialAssets ?? []).length} social-image destination(s) are mapped; ${uploads} upload(s) authorized. Every slot keeps its current website image until an asset and its permission are separately approved.`);

  lines.push('', '## Unresolved clinic and business facts', '', 'Mapped payloads reproduce existing website copy. They do not settle these questions, and none should be published until the clinic decides:', '', ...unresolvedClinicFacts.map(fact => `- ${fact}`));

  lines.push('', '## Before any apply', '', '1. Confirm the inventory above is authenticated and complete for this exact target.', '2. Resolve every conflict and blocked candidate, or remove it from scope.', '3. Obtain clinic approval for the copy of each document to be drafted.', '4. Approve the exact manifest and operations hashes in an approval file; rerun the dry-run first if anything changed.', '');

  return lines.join('\n');

}

export const operationFamilyQuery = '*[_type == $type && ($singleton || slug.current == $identity || _id in [$identity,$draft,$published] || _id in path($versions))]{_id,_rev}';

export async function applyDraftOperations(client, manifest, inventory, approval, { record } = {}) {

  const config = client.config();

  if (config.projectId !== target.projectId || config.dataset !== target.dataset || config.apiHost !== 'https://api.sanity.io') throw new Error('Client target mismatch; no write sent.');

  const plan = planDraftOperations(manifest, inventory);

  if (plan.blocked.length || approval.projectId !== target.projectId || approval.dataset !== target.dataset || approval.manifestHash !== manifest.manifestHash || approval.operationsHash !== hash(plan.operations)) throw new Error('Exact draft-operation approval and complete unambiguous inventory are required. No write sent.');

  if (typeof record !== 'function') throw new Error('A durable per-operation journal is required. No write sent.');

  const results = [];

  const signature = rows => JSON.stringify(rows.map(({ _id, _rev }) => ({ _id, _rev })).sort((a, b) => a._id.localeCompare(b._id)));

  for (const [index, operation] of plan.operations.entries()) {

    if (!(operation.id ?? operation.content?._id)?.startsWith('drafts.')) throw new Error('Only draft writes are permitted.');

    const candidate = manifest.documents.find(d => d.identity === operation.identity);

    const singleton = singletonNames.includes(candidate.content._type);

    const family = familyId(operation.id ?? operation.publishedId ?? (singleton ? operation.identity : '__new__'));

    const params = { type: candidate.content._type, singleton, identity: operation.identity, draft: operation.id ?? operation.content._id, published: operation.publishedId ?? '', versions: `versions.*.${family}` };

    let expected = inventory.documents.filter(doc => doc._type === params.type && (singleton || doc.slug?.current === operation.identity));

    const checkFamily = async () => {

      const current = await client.fetch(operationFamilyQuery, params);

      if (!Array.isArray(current) || current.some(doc => doc._id?.startsWith('versions.')) || signature(current) !== signature(expected)) throw new Error('Document family changed or a release appeared; stop and prepare a fresh inventory and plan.');

    };

    await checkFamily();

    await record({ index, identity: operation.identity, kind: operation.kind, status: 'started', expectedRevision: operation.revision ?? operation.publishedRevision });

    let committed = false;

    try {

      let result;

      if (operation.kind === 'patch') {

      const actual = await client.getDocument(operation.id);

      if (actual?._rev !== operation.revision) throw new Error('Draft revision changed; stop and prepare a fresh plan.');

      result = await client.patch(operation.id).ifRevisionId(operation.revision).setIfMissing(operation.setIfMissing).commit();

      } else {

      if (operation.publishedId && (await client.getDocument(operation.publishedId))?._rev !== operation.publishedRevision) throw new Error('Published revision changed; stop and prepare a fresh plan.');

      result = await client.create(operation.content);

      }

      committed = true;

      const receipt = { index, identity: operation.identity, kind: operation.kind, status: 'committed', id: result._id, revision: result._rev };

      // Persist the returned identity before read-back or the next operation.

      await record(receipt);

      if (!result._id?.startsWith('drafts.') || typeof result._rev !== 'string') throw new Error('Unexpected write receipt.');

      expected = [...expected.filter(doc => doc._id !== result._id), { _id: result._id, _rev: result._rev }];

      const saved = await client.getDocument(result._id);

      if (saved?._rev !== result._rev) throw new Error('Draft read-back changed.');

      const readPath = (value, path) => {

        const parts = path.match(/[^.\[\]]+|\[_key=="[^"]+"\]/g) ?? [];

        for (const part of parts) value = part.startsWith('[_key==') ? value?.find(item => item._key === JSON.parse(part.slice(7, -1))) : value?.[part];

        return value;

      };

      const checks = operation.kind === 'patch' ? operation.setIfMissing : Object.fromEntries(Object.entries(operation.content).filter(([key]) => !key.startsWith('_')));

      if (saved?._type !== candidate.content._type || Object.entries(checks).some(([path, value]) => stableHash(readPath(saved, path)) !== stableHash(value))) throw new Error('Saved draft payload differs; review before continuing.');

      await checkFamily();

      await record({ ...receipt, status: 'verified' });

      results.push({ id: result._id, revision: result._rev });

    } catch {

      await record({ index, identity: operation.identity, kind: operation.kind, status: committed ? 'committed-not-verified' : 'uncertain' });

      throw new Error('Draft operation stopped. Inspect the journal and fresh inventory before preparing a new approved plan; never blindly retry.');

    }

  }

  return results;

}


// Documents whose copy is labels, calls to action and clinic-confirmed facts only.
// Clinical, credential and testimonial content is published by people in Studio
// after sign-off, never by this tool.
export const publishableIdentities = ['navigation', 'seoSettings', 'servicesPage', 'teamPage', 'insightsPage', 'contactPage', 'localLandingPage'];

const withoutSystemFields = doc => Object.fromEntries(Object.entries(doc ?? {}).filter(([key]) => !['_id', '_rev', '_createdAt', '_updatedAt', '_system'].includes(key)));

export async function publishDrafts(client, identities, { record } = {}) {

  const config = client.config();

  if (config.projectId !== target.projectId || config.dataset !== target.dataset || config.apiHost !== 'https://api.sanity.io') throw new Error('Client target mismatch; nothing published.');

  if (typeof record !== 'function') throw new Error('A durable journal is required. Nothing published.');

  const refused = identities.filter(identity => !publishableIdentities.includes(identity));

  if (refused.length || !identities.length) throw new Error(`Not publishable by this tool: ${refused.join(', ') || '(none given)'}. Clinical content is published in Studio after sign-off.`);

  const results = [];

  for (const identity of identities) {

    const draftId = `drafts.${identity}`;

    const family = await client.fetch('*[_id == $id || _id == $draft || _id in path($versions)]{_id,_rev}', { id: identity, draft: draftId, versions: `versions.*.${identity}` });

    if (!Array.isArray(family) || family.some(doc => doc._id.startsWith('versions.'))) throw new Error(`${identity}: release version present; resolve it in Studio first.`);

    const draft = await client.getDocument(draftId);

    if (!draft) throw new Error(`${identity}: no draft to publish.`);

    const validation = validateCandidate(draft);

    if (!validation.ok) throw new Error(`${identity}: draft fails the website contract: ${validation.issues.join('; ')}`);

    const published = family.find(doc => doc._id === identity);

    await record({ identity, status: 'started', draftRevision: draft._rev, publishedRevision: published?._rev ?? null });

    let committed = false;

    try {

      await client.action({ actionType: 'sanity.action.document.publish', draftId, publishedId: identity, ifDraftRevisionId: draft._rev, ...(published ? { ifPublishedRevisionId: published._rev } : {}) });

      committed = true;

      const saved = await client.getDocument(identity);

      if (!saved || stableHash(withoutSystemFields(saved)) !== stableHash(withoutSystemFields(draft))) throw new Error('Published read-back differs.');

      if (await client.getDocument(draftId)) throw new Error('Draft still present after publish.');

      await record({ identity, status: 'verified', revision: saved._rev });

      results.push({ id: identity, revision: saved._rev });

    } catch {

      await record({ identity, status: committed ? 'committed-not-verified' : 'uncertain' });

      throw new Error(`${identity}: publish stopped. Inspect Studio and the journal before retrying.`);

    }

  }

  return results;

}
