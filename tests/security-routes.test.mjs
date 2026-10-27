import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function execute(file, dependencies = {}) {
  const filename = new URL('../' + file, import.meta.url), localRequire = createRequire(filename), exports = {};
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)(id => id === 'server-only' ? {} : dependencies[id] ?? localRequire(id), exports);
  return exports;
}

// Synthetic database double: records every connection and stores nothing real.
function fakeMongo({ failWith } = {}) {
  const calls = { connects: 0, inserts: [], finds: 0 };
  class MongoClient {
    async connect() { calls.connects += 1; if (failWith) throw failWith; }
    db() {
      return {
        command: async () => ({ ok: 1 }),
        collection: () => ({
          insertOne: async doc => { calls.inserts.push(doc); },
          find: () => { calls.finds += 1; return { sort: () => ({ limit: () => ({ toArray: async () => [] }) }) }; },
        }),
      };
    }
  }
  return { calls, module: { MongoClient } };
}

const loadRoute = mongo => execute('app/api/[[...path]]/route.js', { mongodb: mongo.module });
const context = path => ({ params: Promise.resolve({ path }) });

test('listing appointments is refused before any database connection', async () => {
  const mongo = fakeMongo();
  const route = loadRoute(mongo);

  const response = await route.GET(new Request('http://localhost/api/appointments'), context(['appointments']));

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
  assert.equal(mongo.calls.connects, 0);
  assert.equal(mongo.calls.finds, 0);
});

test('legacy API responses carry no CORS headers', async () => {
  const mongo = fakeMongo();
  const route = loadRoute(mongo);
  const synthetic = { name: 'Test Person', phone: '0000000000', service: 'checkup', preferredDate: '2099-01-01', preferredTime: '10:00' };

  const responses = [
    await route.GET(new Request('http://localhost/api/health'), context(['health'])),
    await route.GET(new Request('http://localhost/api/appointments'), context(['appointments'])),
    await route.POST(new Request('http://localhost/api/appointments', { method: 'POST', body: JSON.stringify(synthetic) }), context(['appointments'])),
    await route.GET(new Request('http://localhost/api/unknown'), context(['unknown'])),
  ];

  assert.equal(route.OPTIONS, undefined);
  for (const response of responses) assert.equal(response.headers.get('access-control-allow-origin'), null);
  assert.equal(responses[2].status, 201);
});

test('database failures return generic errors without upstream detail', async () => {
  const mongo = fakeMongo({ failWith: Object.assign(new Error('connect ECONNREFUSED secret-host:27017 user=admin'), { name: 'MongoServerSelectionError' }) });
  const route = loadRoute(mongo);
  const originalError = console.error, logged = [];
  console.error = (...args) => logged.push(args.join(' '));

  try {
    const health = await route.GET(new Request('http://localhost/api/health'), context(['health']));
    const create = await route.POST(new Request('http://localhost/api/contact', { method: 'POST', body: '{}' }), context(['contact']));
    const bodies = [await health.text(), await create.text()];

    assert.deepEqual([health.status, create.status], [500, 500]);
    for (const text of [...bodies, ...logged]) assert.doesNotMatch(text, /secret-host|ECONNREFUSED|admin/);
  } finally {
    console.error = originalError;
  }
});

test('global security headers keep framing protection and drop wildcard CORS', async () => {
  const config = require('../next.config.js');

  const headers = (await config.headers()).flatMap(rule => rule.headers.map(h => h.key));

  assert.ok(headers.includes('X-Frame-Options'));
  assert.ok(headers.includes('Content-Security-Policy'));
  assert.equal(headers.some(key => key.toLowerCase().startsWith('access-control-')), false);
});

function loadInsightPage() {
  const notFoundMarker = new Error('NEXT_HTTP_ERROR_FALLBACK;404');
  const { insights } = require('../lib/insights.js');
  const page = execute('app/insights/[slug]/page.js', {
    '@/components/seo/BacklinkReferences': { BacklinkReferences: () => null },
    'next/navigation': { notFound: () => { throw notFoundMarker; } },
    '@/sanity/lib/seo': { getPageSeo: async () => ({ metadata: { title: 'fixture' }, structuredData: false }) },
    '@/sanity/lib/presentation-pages': { getPresentationPage: async () => ({}) },
    '@/lib/insights': { insights },
    '@/components/seo/JsonLd': { default: () => null },
    '@/lib/schema': { buildBreadcrumbSchema: () => ({}) },
    './InsightDetailClient': { default: () => null },
    '@/sanity/lib/insights': { getInsightOverrides: async () => ({}) },
    '@/sanity/lib/insight-overrides': { applyInsightOverrides: list => list },
    '@/sanity/lib/insight-seo': { insightSeo: () => ({ metadata: {}, structuredData: {} }) },
  });
  return { page, insights, notFoundMarker };
}

test('unknown insight slugs produce a real 404 from both metadata and page', async () => {
  const { page, notFoundMarker } = loadInsightPage();
  const params = Promise.resolve({ slug: 'does-not-exist' });

  await assert.rejects(page.generateMetadata({ params }), error => error === notFoundMarker);
  await assert.rejects(page.default({ params: Promise.resolve({ slug: 'does-not-exist' }) }), error => error === notFoundMarker);

});

test('every existing insight slug still renders and is statically generated', async () => {
  const { page, insights } = loadInsightPage();

  const params = page.generateStaticParams().map(p => p.slug);

  assert.deepEqual(params, insights.map(i => i.slug));
  for (const slug of params) {
    assert.ok(await page.default({ params: Promise.resolve({ slug }) }));
    assert.deepEqual(await page.generateMetadata({ params: Promise.resolve({ slug }) }), { title: 'fixture' });
  }
});
