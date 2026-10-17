import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Read-only: runs the website's own published queries and resolvers against the
// live dataset and reports which models are served from Sanity versus fallback.
const require = createRequire(import.meta.url);
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const { requireSanityEnvironment } = require('../sanity/env.ts');
const { createClient } = require('@sanity/client');

// Load a reader module for its query string only; its server-only reader is stubbed.
function queries(file) {
  const filename = new URL('../' + file, import.meta.url), local = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const stubs = { 'server-only': {}, './content-reader': {}, './insights': {}, 'next/headers': {}, react: { cache: fn => fn } };
  new Function('require', 'exports', js)(id => stubs[id] ?? local(id), exports);
  return exports;
}

const config = requireSanityEnvironment();
const client = createClient({ ...config, perspective: 'published', useCdn: false, timeout: 15000, maxRetries: 0 });
const { presentationPageQuery } = queries('sanity/lib/presentation-pages.ts');
const { navigationQuery } = queries('sanity/lib/navigation.ts');
const { seoQuery } = queries('sanity/lib/seo.ts');
const { homeQuery, aboutQuery, experienceQuery, doctorsQuery } = queries('sanity/lib/pages.ts');
const { servicesQuery } = queries('sanity/lib/services.ts');
const { testimonialsQuery } = queries('sanity/lib/testimonials.ts');
const { resolvePresentationPage } = require('../sanity/lib/presentation-mapping.ts');
const { presentationPageNames } = require('../sanity/lib/presentation-definitions.ts');
const { resolveNavigation } = require('../sanity/lib/navigation-mapping.ts');
const { resolveSeoInventory } = require('../sanity/lib/seo-mapping.ts');
const { resolvePage, homeContent, aboutContent, experienceContent, resolveDoctors } = require('../sanity/lib/page-mapping.ts');
const { resolveServices } = require('../sanity/lib/service-mapping.ts');
const { resolveTestimonials } = require('../sanity/lib/testimonial-mapping.ts');

const checks = [
  ...presentationPageNames.map(name => [name, presentationPageQuery, { name }, input => resolvePresentationPage(input, name)]),
  ['navigation', navigationQuery, {}, resolveNavigation],
  ['seo', seoQuery, {}, resolveSeoInventory],
  ['homePage', homeQuery, {}, input => resolvePage(input, 'homePage', homeContent)],
  ['aboutPage', aboutQuery, {}, input => resolvePage(input, 'aboutPage', aboutContent)],
  ['experiencePage', experienceQuery, {}, input => resolvePage(input, 'experiencePage', experienceContent)],
  ['services', servicesQuery, {}, resolveServices],
  ['doctors', doctorsQuery, {}, resolveDoctors],
  ['testimonials', testimonialsQuery, {}, resolveTestimonials],
];
const report = [];
for (const [model, query, params, resolve] of checks) {
  const input = await client.fetch(query, params);
  const { status } = resolve(input);
  report.push({ model, publishedRecords: Array.isArray(input) ? input.length : input ? 1 : 0, status });
}
console.table(report);
