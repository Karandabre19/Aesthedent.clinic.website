import fs from 'node:fs';

import path from 'node:path';

import crypto from 'node:crypto';

import { createRequire } from 'node:module';

import ts from 'typescript';

const require = createRequire(import.meta.url);

for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);

const { JSDOM } = require('jsdom');

const { renderToStaticMarkup } = require('react-dom/server');

const { services } = require('../lib/services.js');

const { insights } = require('../lib/insights.js');

const { getTestimonials } = require('../lib/testimonials.js');

const { landingPageContent } = require('../lib/landing-page-content.js');

const { homeContent, aboutContent, experienceContent, doctorContent, singletonNames } = require('../sanity/lib/page-mapping.ts');

const { homeSections, aboutSections, experienceSections, sectionCopySchema } = require('../sanity/lib/editorial-sections.ts');

const { serviceContent } = require('../sanity/lib/service-mapping.ts');

const { insightContent } = require('../sanity/lib/insight-mapping.ts');

export const target = { projectId: 'ae09qs5c', dataset: 'production' };

export const contentTypes = [...singletonNames, 'service', 'doctor', 'insight', 'testimonial'];

const { presentationDefinitions, presentationSpecs } = require('../sanity/lib/presentation-definitions.ts');

const { navigationDefaults } = require('../sanity/lib/navigation-data.ts');

const { siteMetadata } = require('../lib/site-metadata.ts');

export const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

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

    output.push({ consumer: `${file}:${tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1}`, field: props.imageOverride?.expression?.getText(tree), source: imports.get(raw) ?? raw, cropWidth: Number(props.cropWidth?.expression?.getText(tree)), cropHeight: Number(props.cropHeight?.expression?.getText(tree)), alt: ts.isStringLiteral(props.alt) ? props.alt.text : props.alt?.expression?.getText(tree), uploadAuthorized: false });

  });

  return output;

}

const withKeys = value => Array.isArray(value) ? value.map((item, i) => item && typeof item === 'object' ? { _type: 'object', _key: `item${i + 1}`, ...withKeys(item) } : item) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withKeys(entry)])) : value;

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

  documents.push(...doctors.map((doc, index) => ({ identity: index === 0 ? 'sahil' : 'aishwarya', source: 'app/doctor/DoctorClient.js + app/HomeClient.js', reviewRequired: true, content: { _type: 'doctor', slug: { _type: 'slug', current: index === 0 ? 'sahil' : 'aishwarya' }, ...doctorContent.parse({ ...doc, homeSummary: summaries[index].desc }) } })));

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

    for (const spec of presentationSpecs(name)) {

      sectionCopySchema(spec).parse(data[spec.name] ?? {});

      for (const key of Object.keys(spec.fields)) if (data[spec.name]?.[key] == null) throw new Error(`Missing presentation destination: ${name}.${spec.name}.${key}`);

    }

    documents.push({ identity: name, source: files.join(' + '), reviewRequired: true, content: { _type: name, ...data } });

  }

  documents.push({ identity: 'navigation', source: 'sanity/lib/navigation-data.ts (verified existing menus)', reviewRequired: true, content: { _type: 'navigation', ...structuredClone(navigationDefaults) } });

  // Preserve existing search intent; empty page overrides remain self-canonical

  // and indexable. Shared settings cannot impose a global visibility decision.

  documents.push({ identity: 'seoSettings', source: 'lib/site-metadata.ts', reviewRequired: true, content: { _type: 'seoSettings', defaults: { metaTitle: siteMetadata.title.default, metaDescription: siteMetadata.description, ogTitle: siteMetadata.openGraph.title, ogDescription: siteMetadata.openGraph.description, twitterTitle: siteMetadata.twitter.title, twitterDescription: siteMetadata.twitter.description } } });

  const reviews = getTestimonials('latest').map(r => ({ identity: String(r.id), source: 'lib/testimonials.js', blocked: 'Specific review source and republication permission are not confirmed.', content: { _type: 'testimonial', slot: String(r.id), name: r.name, service: r.service, rating: r.rating, text: r.text, verifiedGoogleReview: false, publicationPermissionConfirmed: false } }));

  const consumers = [homeFile, aboutFile, experienceFile, 'app/doctor/DoctorClient.js', 'app/services/ServicesClient.js', 'app/services/[slug]/ServiceDetailClient.js', 'app/insights/InsightsClient.js', 'app/insights/[slug]/InsightDetailClient.js', 'components/sections/InsightsSection.js'];

  const doctorAssets = sourceArray('app/doctor/DoctorClient.js', 'Dr. Sahil', ['image']);

  const assets = [...consumers.flatMap(assetSlots), ...services.map(s => ({ identity: s.slug, field: 'coverImage', source: s.image, uploadAuthorized: false })), ...insights.map(s => ({ identity: s.slug, field: 'coverImage', source: s.image, uploadAuthorized: false })), ...doctorAssets.map((s, index) => ({ identity: index === 0 ? 'sahil' : 'aishwarya', field: 'portrait', source: s.image, uploadAuthorized: false }))].map(asset => {

    const file = typeof asset.source === 'string' && asset.source.startsWith('/') ? path.resolve('public', asset.source.slice(1)) : asset.source;

    return typeof file === 'string' && fs.existsSync(file) && fs.statSync(file).isFile() ? { ...asset, localFile: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') } : asset;

  });

  for (const doc of documents) for (const key of Object.keys(doc.content)) doc.content[key] = withKeys(doc.content[key]);

  const leafEvidence = (value, prefix = '') => Object.entries(value).flatMap(([key, entry]) => key.startsWith('_') ? [] : entry && typeof entry === 'object' ? leafEvidence(entry, prefix ? `${prefix}.${key}` : key) : [{ path: prefix ? `${prefix}.${key}` : key, value: entry }]);

  const detailedEvidence = documents.flatMap(doc => leafEvidence(doc.content).map(item => ({ document: doc.identity, ...item, source: doc.source })));

  const assetDecisions = assets.map(asset => {

    const expression = asset.field ?? '';

    const model = expression.includes('service.coverImage') || expression === 's.coverImage' && asset.consumer?.startsWith('app/services') ? 'service' : expression.includes('insight.coverImage') || expression.includes('article.coverImage') ? 'insight' : expression.includes('portrait') || expression.includes('doctor') ? 'doctor' : undefined;

    const field = model === 'doctor' ? 'portrait' : 'coverImage';

    const destinations = model ? assets.filter(item => item.identity && item.field === field && documents.some(doc => doc.content._type === model && doc.identity === item.identity)).map(item => ({ identity: item.identity, field, source: item.source })) : [{ identity: asset.identity ?? (asset.consumer?.startsWith(homeFile) ? 'homePage' : asset.consumer?.startsWith(aboutFile) ? 'aboutPage' : 'experiencePage'), field: expression.replace(/^editorial\?\./, '').replaceAll('?.', '.'), source: asset.source }];

    return { ...asset, destinations, nativeAsset: null, decision: 'Keep current source fallback. Authenticated native-asset/permission reconciliation and any upload require separate approval.' };

  });

  const socialAssets = documents.filter(doc => singletonNames.includes(doc.identity) && doc.identity !== 'navigation' || ['service','insight'].includes(doc.content._type)).map(doc => ({ identity: doc.identity, field: doc.identity === 'seoSettings' ? 'defaults.socialImage' : 'seo.socialImage', source: doc.content._type === 'insight' ? insights.find(item => item.slug === doc.identity).image : siteMetadata.openGraph.images[0].url, nativeAsset: null, uploadAuthorized: false, altPolicy: 'Describe the approved social image; do not infer credentials or outcomes.', crop: '1200×630 (40:21), subject within central safe area; preserve high-resolution original.' }));

  const payload = { target, documents, reviews, fieldEvidence: [...home.evidence.map(e => ({...e, document: 'homePage'})), ...about.evidence.map(e => ({...e, document: 'aboutPage'})), ...experience.evidence.map(e => ({...e, document: 'experiencePage'})), ...addedEvidence], payloadEvidence: detailedEvidence, assets: assetDecisions, socialAssets, nativeImageControls: 23 };

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

export function planDraftOperations(manifest, inventory) {

  if (!inventory.authenticated || !inventory.complete) return { blocked: ['Authenticated complete published/draft/release inventory is required.'], operations: [] };

  const operations = [], blocked = [], decisions = [];

  for (const candidate of manifest.documents) {

    const singleton = singletonNames.includes(candidate.content._type);

    const matches = inventory.documents.filter(doc => doc._type === candidate.content._type && (singleton || doc.slug?.current === candidate.identity));

    const families = new Set(matches.map(doc => familyId(doc._id)));

    if (families.size > 1 || singleton && [...families].some(id => id !== candidate.identity) || matches.some(doc => doc._id.startsWith('versions.'))) { blocked.push(`${candidate.identity}: ambiguous identity or release version requires review.`); continue; }

    const draft = matches.find(doc => doc._id.startsWith('drafts.')), published = matches.find(doc => !doc._id.startsWith('drafts.'));

    const existing = draft ?? published;

    if (existing) {

      const compare = (old, next, prefix = '') => {

        for (const [key, value] of Object.entries(next)) {

          if (key.startsWith('_')) continue;

          const path = prefix ? `${prefix}.${key}` : key;

          if (!Object.hasOwn(old, key)) decisions.push({ identity: candidate.identity, path, status: 'missing', proposedValue: value, existingId: existing._id, revision: existing._rev });

          else if (value && typeof value === 'object' && !Array.isArray(value) && old[key] && typeof old[key] === 'object' && !Array.isArray(old[key])) compare(old[key], value, path);

          else decisions.push({ identity: candidate.identity, path, status: hash(old[key]) === hash(value) ? 'unchanged' : 'preserved-conflict', existingValue: old[key], proposedValue: value, existingId: existing._id, revision: existing._rev });

        }

      };

      compare(existing, candidate.content);

    } else decisions.push({ identity: candidate.identity, status: 'new-draft', payloadHash: hash(candidate.content) });

    try {

      if (draft) {

        const setIfMissing = missingPaths(draft, candidate.content);

        if (Object.keys(setIfMissing).length) operations.push({ kind: 'patch', id: draft._id, revision: draft._rev, identity: candidate.identity, setIfMissing });

      } else {

        const content = published ? structuredClone(published) : structuredClone(candidate.content);

        if (published) { const additions = missingPaths(published, candidate.content); if (Object.keys(additions).some(p => p.includes('.') || p.includes('['))) { blocked.push(`${candidate.identity}: nested additions to a published document require a reviewed draft first.`); continue; } Object.assign(content, additions); }

        for (const key of ['_rev', '_createdAt', '_updatedAt', '_id']) delete content[key];

        operations.push({ kind: 'create', identity: candidate.identity, publishedRevision: published?._rev, publishedId: published?._id, content: { ...content, _id: singleton ? `drafts.${candidate.identity}` : published ? `drafts.${published._id}` : 'drafts.' } });

      }

    } catch (error) { blocked.push(`${candidate.identity}: ${error.message}`); }

  }

  return { operations, blocked, decisions };

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

      if (saved?._type !== candidate.content._type || Object.entries(checks).some(([path, value]) => hash(readPath(saved, path)) !== hash(value))) throw new Error('Saved draft payload differs; review before continuing.');

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

