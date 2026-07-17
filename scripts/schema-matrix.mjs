#!/usr/bin/env node
/**
 * Phase 2D — JSON-LD coverage matrix.
 *
 * Fetches raw HTML directly. apify/website-content-crawler returns CLEANED html
 * with every <script> stripped, so JSON-LD is invisible to it — reading schema
 * from that dataset reports "no competitor has schema", which is false.
 *
 * Free: plain fetch, no actor run.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const TARGETS = [
  ['aesthedentpune.com (US)', 'https://www.aesthedentpune.com/'],
  ['soulfuldental.com', 'https://www.soulfuldental.com/'],
  ['silverpearlsdental.com', 'https://www.silverpearlsdental.com/'],
  ['smileinn.in', 'https://smileinn.in/'],
  ['oriondentalspecialities.com', 'https://oriondentalspecialities.com/'],
  ['thedentalstudio.co.in', 'https://thedentalstudio.co.in/'],
  ['microdentdentistry.com', 'https://microdentdentistry.com/'],
  ['toothandcodental.com', 'https://www.toothandcodental.com/'],
  ['integritydentalcare.in', 'https://www.integritydentalcare.in/integritydentalcare'],
  ['sabkadentist.com (CHAIN)', 'https://sabkadentist.com/dental-clinics-in-pune/kothrud/'],
  ['clovedental.in (CHAIN)', 'https://clovedental.in/dentist-near-me/pune/kothrud'],
];

const WANTED = ['Dentist', 'LocalBusiness', 'MedicalBusiness', 'MedicalClinic', 'AggregateRating',
  'FAQPage', 'Review', 'BreadcrumbList', 'Organization', 'WebSite', 'MedicalProcedure', 'Person'];

const collectTypes = (node, out) => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out));
  if (node['@type']) [].concat(node['@type']).forEach((t) => out.add(String(t)));
  Object.values(node).forEach((v) => collectTypes(v, out));
};

const results = [];
for (const [name, url] of TARGETS) {
  const row = { name, url, types: [], ldBlocks: 0, error: null, ratingValue: null, reviewCount: null };
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-audit/1.0)' },
      signal: AbortSignal.timeout(25000),
    });
    const html = await res.text();
    const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    row.ldBlocks = blocks.length;
    const types = new Set();
    for (const b of blocks) {
      try {
        const parsed = JSON.parse(b[1].trim());
        collectTypes(parsed, types);
        const findRating = (n) => {
          if (!n || typeof n !== 'object') return;
          if (Array.isArray(n)) return n.forEach(findRating);
          if (n['@type'] === 'AggregateRating' || n.ratingValue) {
            row.ratingValue ??= n.ratingValue ?? null;
            row.reviewCount ??= n.reviewCount ?? n.ratingCount ?? null;
          }
          Object.values(n).forEach(findRating);
        };
        findRating(parsed);
      } catch { /* malformed block — counted, not typed */ }
    }
    row.types = [...types].sort();
  } catch (e) {
    row.error = e.message.slice(0, 60);
  }
  results.push(row);
  process.stdout.write('.');
}
console.log('\n');

const pad = (s, n) => String(s).padEnd(n);
console.log('=== JSON-LD COVERAGE MATRIX ===\n');
console.log(pad('site', 30), pad('blk', 4), WANTED.map((w) => w.slice(0, 6)).map((w) => pad(w, 7)).join(''));
for (const r of results) {
  if (r.error) { console.log(pad(r.name, 30), 'ERR  ', r.error); continue; }
  console.log(pad(r.name, 30), pad(r.ldBlocks, 4),
    WANTED.map((w) => pad(r.types.includes(w) ? ' YES' : '  .', 7)).join(''));
}
console.log('\n=== AggregateRating values actually published ===');
for (const r of results) {
  if (r.ratingValue != null || r.reviewCount != null) {
    console.log(' ', pad(r.name, 30), 'rating:', r.ratingValue, '| count:', r.reviewCount);
  }
}
console.log('\n=== full type lists ===');
for (const r of results) if (!r.error) console.log(' ', pad(r.name, 30), r.types.join(', ') || '(none)');

if (!existsSync('audit/raw')) mkdirSync('audit/raw', { recursive: true });
writeFileSync('audit/raw/2d-schema-matrix.json', JSON.stringify(results, null, 2));
console.log('\nsaved: audit/raw/2d-schema-matrix.json');
