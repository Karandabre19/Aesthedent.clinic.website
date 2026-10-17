import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { isDeepStrictEqual } from 'node:util';

// Derives SEO override values equal to each route's CURRENT rendered metadata and proves,
// per document, that applying them renders identically (final title after the root
// "%s | Aesthedent" template, description, canonical, robots, Open Graph and Twitter).
// Only documents that pass are returned. Pure: no network, no writes.
const require = createRequire(import.meta.url);
for (const extension of ['.ts', '.tsx']) require.extensions[extension] ??= (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const { resolveSeoMetadata, seoCopy, pageRoutes } = require('../sanity/lib/seo-mapping.ts');
const { resolveServices } = require('../sanity/lib/service-mapping.ts');
const { services } = require('../lib/services.js');
const { insights } = require('../lib/insights.js');

// Load a route module and capture the base metadata it hands to getPageSeo.
async function captureBase(file, params) {
  const filename = path.join(root, file), local = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  let captured;
  const stub = new Proxy(function () {}, { get: (_, key) => key === '__esModule' ? true : key === 'then' ? undefined : stub, apply: () => stub });
  const mocks = {
    '@/sanity/lib/seo': { getPageSeo: async (route, base) => { captured = { route, base }; return { metadata: {} }; } },
    '@/sanity/lib/services': { getServices: async () => resolveServices([]).value },
    '@/sanity/lib/insights': { getInsightOverrides: async () => [] },
    '@/sanity/lib/presentation-pages': { getPresentationPage: async () => ({}) },
    'next/navigation': { notFound: () => { throw new Error('notFound'); } },
  };
  const resolve = id => mocks[id] ?? (id.startsWith('@/lib/') || ['@/sanity/lib/insight-overrides', '@/sanity/lib/insight-seo'].includes(id) ? require(path.join(root, id.slice(2))) : stub);
  new Function('require', 'exports', js)(resolve, exports);
  await exports.generateMetadata({ params: Promise.resolve(params) });
  return captured;
}

const renderTitle = title => typeof title === 'string' ? `${title} | Aesthedent` : title?.absolute ?? title?.default;
const comparable = (route, metadata) => ({ ...metadata, title: route === '/' ? renderTitle(metadata.title) : renderTitle(metadata.title) });

export async function deriveSeoOverrides(defaults) {
  const routeFiles = { '/': 'app/page.js', '/about': 'app/about/page.js', '/aesthedent-experience': 'app/aesthedent-experience/layout.js', '/services': 'app/services/page.js', '/doctor': 'app/doctor/page.js', '/insights': 'app/insights/page.js', '/contact': 'app/contact/page.js', '/dental-clinic-in-kothrud': 'app/dental-clinic-in-kothrud/page.js' };
  const targets = [
    ...Object.entries(pageRoutes).map(([type, route]) => ({ type, identity: type, route, file: routeFiles[route], params: {} })),
    ...services.map(s => ({ type: 'service', identity: s.slug, route: `/services/${s.slug}`, file: 'app/services/[slug]/page.js', params: { slug: s.slug } })),
    ...insights.map(a => ({ type: 'insight', identity: a.slug, route: `/insights/${a.slug}`, file: 'app/insights/[slug]/page.js', params: { slug: a.slug } })),
  ];
  const results = [];
  for (const t of targets) {
    const { route, base } = await captureBase(t.file, t.params);
    if (route !== t.route) { results.push({ ...t, ok: false, reason: `route mismatch ${route}` }); continue; }
    const before = resolveSeoMetadata(route, base, defaults, {});
    const m = before.metadata, title = m.title;
    // A string title is templated again, so it can be stored as-is; an absolute title
    // only survives if removing the template suffix reproduces it.
    const metaTitle = route === '/' ? renderTitle(title) : typeof title === 'string' ? title : title?.absolute?.endsWith(' | Aesthedent') ? title.absolute.slice(0, -' | Aesthedent'.length) : undefined;
    const supplied = { ...(metaTitle ? { metaTitle } : {}), metaDescription: m.description, ogTitle: m.openGraph?.title, ogDescription: m.openGraph?.description, twitterTitle: m.twitter?.title, twitterDescription: m.twitter?.description, canonicalRoute: route, index: true, follow: true, structuredData: before.structuredData, ...(t.type === 'service' ? { faqStructuredData: before.faqStructuredData } : {}) };
    const valid = seoCopy.safeParse(supplied);
    const after = resolveSeoMetadata(route, base, defaults, supplied);
    const same = valid.success && isDeepStrictEqual(comparable(route, after.metadata), comparable(route, m)) && after.indexable === before.indexable && after.structuredData === before.structuredData && after.faqStructuredData === before.faqStructuredData;
    results.push({ ...t, ok: same, reason: !valid.success ? valid.error.issues.map(i => i.message).join('; ') : same ? '' : 'rendered metadata differs', title: renderTitle(m.title), seo: supplied });
  }
  return results;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { siteMetadata } = require('../lib/site-metadata.ts');
  const defaults = { metaTitle: siteMetadata.title.default, metaDescription: siteMetadata.description, ogTitle: siteMetadata.openGraph.title, ogDescription: siteMetadata.openGraph.description, twitterTitle: siteMetadata.twitter.title, twitterDescription: siteMetadata.twitter.description };
  const results = await deriveSeoOverrides(defaults);
  console.table(results.map(r => ({ document: r.identity, route: r.route, identical: r.ok, metaTitle: r.seo?.metaTitle ? 'set' : 'inherit', reason: r.reason, renderedTitle: (r.title ?? '').slice(0, 55) })));
}
