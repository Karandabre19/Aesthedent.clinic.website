#!/usr/bin/env node
/**
 * Asserts SEO invariants against real build output, reading the same way a
 * crawler does: strip tags, ignore aria-hidden, concatenate what's left.
 *
 * Run `next build` first, then `node scripts/seo-check.mjs`.
 */
import { readFileSync, existsSync } from 'node:fs';

const DIR = '.next/server/app';
const SITE = 'https://www.aesthedentpune.com';
const failures = [];
const passes = [];

const check = (name, ok, detail) => {
  (ok ? passes : failures).push({ name, detail });
};

/** Strip tags the way a text extractor does — no aria-hidden exemption. */
const crawlerText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;| /g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const read = (file) => {
  const p = `${DIR}/${file}`;
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
};

// ── BUG 1: headings must read cleanly, each word once ────────────────────
const headingChecks = [
  // Phase 4A: the H1 now carries both Tier-1 terms (dental care + Kothrud).
  { file: 'index.html', tag: 'h1', route: '/', expect: 'Dental Care in Kothrud, Pune. Redefined.' },
  { file: 'aesthedent-experience.html', tag: 'h2', route: '/aesthedent-experience', contains: 'RECLAIM', notContains: 'RECLAIMRECLAIM' },
];

for (const hc of headingChecks) {
  const html = read(hc.file);
  if (!html) { check(`${hc.route} ${hc.tag} present`, false, 'no prerendered HTML'); continue; }

  const re = new RegExp(`<${hc.tag}[^>]*>[\\s\\S]*?</${hc.tag}>`, 'g');
  const blocks = [...html.matchAll(re)].map((m) => crawlerText(m[0]));

  if (hc.expect) {
    const h1s = blocks;
    check(`${hc.route} has exactly one <h1>`, h1s.length === 1, `found ${h1s.length}`);
    const text = h1s[0] ?? '';
    check(`${hc.route} <h1> reads exactly right`, text === hc.expect, `expected "${hc.expect}" | got "${text}"`);
    // Belt and braces: catches a regression that still happened to produce the
    // right string by accident.
    const occurrences = (hay, needle) => hay.split(needle).length - 1;
    for (const phrase of ['Dental Care', 'in Kothrud, Pune.', 'Redefined.']) {
      const n = occurrences(text, phrase);
      check(`${hc.route} <h1> says "${phrase}" exactly once`, n === 1, `appears ${n}× in "${text}"`);
    }
  } else {
    const hit = blocks.find((b) => b.includes(hc.contains));
    check(`${hc.route} <${hc.tag}> "${hc.contains}" present`, Boolean(hit), 'not found');
    check(
      `${hc.route} <${hc.tag}> not duplicated`,
      hit ? !hit.includes(hc.notContains) : false,
      hit ? `got "${hit}"` : 'heading not found',
    );
  }
}

// Catch any future split-text regression: no 4+ char run immediately repeated.
// (\b(\w+)\1\b does NOT work here — with no spaces between stripped elements
// there are no word boundaries inside the run for the backreference to anchor.)
{
  const html = read('index.html');
  if (html) {
    const h1 = (html.match(/<h1[^>]*>[\s\S]*?<\/h1>/) || [''])[0];
    const text = crawlerText(h1).replace(/\s+/g, '');
    const doubled = /(.{4,})\1/.exec(text);
    check('/ <h1> has no doubled run', !doubled, doubled ? `"${doubled[1]}" repeats` : '');
  }
}

// ── BUG 2: stats must ship real values, not zeros ────────────────────────
{
  const html = read('index.html');
  if (html) {
    const text = crawlerText(html);
    // Two traps here, both of which produced wrong results while writing this:
    //  1. No \b anchors — tag-stripping yields "Scroll0.0Google Rating", so `0`
    //     is preceded by a word char and \b never matches.
    //  2. The (?<![\d.]) lookbehind is load-bearing. Without it, "0+Years"
    //     matches inside the CORRECT "10+Years", "0+Happy" inside "5000+Happy",
    //     and "0%Painless" inside "100%Painless" — reporting failure on a fix
    //     that works.
    const zeroPatterns = [
      { pat: /(?<![\d.])0\.0\s*Google Rating/, label: 'Google Rating renders 0.0' },
      { pat: /(?<![\d.])0\+\s*Years/, label: 'Years renders 0+' },
      { pat: /(?<![\d.])0\+\s*Happy/, label: 'Happy Patients renders 0+' },
      { pat: /(?<![\d.])0%\s*Painless/, label: 'Painless renders 0%' },
    ];
    for (const z of zeroPatterns) {
      check(`/ stat not zeroed — ${z.label.split(' renders')[0]}`, !z.pat.test(text), z.pat.test(text) ? z.label : '');
    }
    check('/ ships "5000" (Happy Patients real value)', html.includes('5000'), 'absent from SSR HTML');
    // 277, not 263: verified against the live Google Business Profile on
    // 2026-07-17 (audit/02-gbp-comparison.md). The site was 14 reviews behind.
    check('/ ships "277 Reviews" (verified live count)', html.includes('277 Reviews'), 'absent from SSR HTML');
  }
}

// ── BUG 1b: doctor names must appear once, not once per breakpoint ───────
{
  const html = read('index.html');
  if (html) {
    const text = crawlerText(html);
    for (const name of ['Dr. Sahil Wathodkar', 'Dr. Aishwarya Kulkarni']) {
      const n = text.split(name).length - 1;
      // Once in the card. The <img alt> is an attribute, so it isn't counted.
      check(`/ "${name}" appears once`, n === 1, `appears ${n}×`);
    }
  }
}

// ── BUG 4 + refactor: metadata hygiene ───────────────────────────────────
const SERVICE_SLUGS = [
  'dental-implants', 'root-canal', 'full-mouth-rehabilitation', 'tooth-fillings',
  'wisdom-tooth-surgery', 'orthodontic-treatment', 'dentures', 'digital-smile-design',
];
const INSIGHT_SLUGS = [
  'dental-implants-pune-specialist', 'root-canal-pain-myths', 'best-dentist-kothrud-pune',
  'teeth-whitening-safety', 'dental-anxiety-tips', 'when-to-get-braces',
];

const routes = [
  ['/', 'index.html'],
  ['/about', 'about.html'],
  ['/contact', 'contact.html'],
  ['/doctor', 'doctor.html'],
  ['/services', 'services.html'],
  ['/insights', 'insights.html'],
  ['/aesthedent-experience', 'aesthedent-experience.html'],
  // Prerendered via generateStaticParams — the money pages. Included so a
  // regression on any one of them fails the check.
  ...SERVICE_SLUGS.map((s) => [`/services/${s}`, `services/${s}.html`]),
  ...INSIGHT_SLUGS.map((s) => [`/insights/${s}`, `insights/${s}.html`]),
];

const titles = new Map();
for (const [route, file] of routes) {
  const html = read(file);
  if (!html) continue;

  check(`${route} has no keywords meta`, !/<meta[^>]+name="keywords"/i.test(html), 'keywords meta still present');

  const tw = html.match(/<meta[^>]+name="twitter:card"[^>]+content="([^"]+)"/i);
  check(`${route} twitter:card is summary_large_image`, tw?.[1] === 'summary_large_image', `got "${tw?.[1] ?? 'none'}"`);

  // Assert the VALUE, not just presence. A canonical inherited from the root
  // layout points every page at "/" and asks Google to de-index the whole site.
  // Presence-only checking hid exactly that bug during this phase.
  const canon = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1];
  const expected = route === '/' ? SITE : SITE + route;
  check(`${route} canonical is self-referencing`, canon === expected, `expected "${expected}" | got "${canon ?? 'none'}"`);

  check(`${route} no wrong-domain (aesthedent.clinic)`, !html.includes('aesthedent.clinic'), 'wrong domain referenced');

  const t = (html.match(/<title>(.*?)<\/title>/) || [])[1];
  if (t) titles.set(route, t);

  // Meta descriptions truncate in SERPs past ~155 chars. I shipped a 156 by
  // eye-counting, so this is now enforced.
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  check(`${route} has meta description`, Boolean(desc), 'missing');
  if (desc) {
    // Decode entities so &amp; counts as one char, as the SERP renders it.
    const len = desc.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').length;
    check(`${route} description <= 155 chars`, len <= 155, `${len} chars`);
  }
}

// Every route must have a distinct title
{
  const seen = new Map();
  for (const [route, t] of titles) {
    if (seen.has(t)) {
      check(`${route} title is unique`, false, `duplicates ${seen.get(t)}`);
    } else {
      seen.set(t, route);
      check(`${route} title is unique`, true, '');
    }
    check(`${route} title <= 60 chars`, t.length <= 60, `${t.length} chars: "${t}"`);
  }
}

// ── Phase 4: structured data ─────────────────────────────────────────────
const ldTypes = (html) => {
  const types = new Set();
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n['@type']) [].concat(n['@type']).forEach((t) => types.add(t));
    Object.values(n).forEach(walk);
  };
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1])); } catch { types.add('__MALFORMED__'); }
  }
  return types;
};

{
  const home = read('index.html');
  if (home) {
    const t = ldTypes(home);
    check('/ JSON-LD parses', !t.has('__MALFORMED__'), 'a block failed JSON.parse');
    for (const want of ['Dentist', 'LocalBusiness', 'Organization', 'WebSite']) {
      check(`/ has ${want} schema`, t.has(want), 'missing');
    }
    // Held until the clinic confirms 277/5.0 — schema states facts to Google.
    check('/ does NOT publish aggregateRating yet', !t.has('AggregateRating'), 'shipped without sign-off');
    check('/ no stale 263 review count', !home.includes('263 Reviews'), 'stale count still rendered');
  }

  // Every service page: FAQPage (28 FAQs already written) + MedicalProcedure + breadcrumb
  for (const slug of SERVICE_SLUGS) {
    const html = read(`services/${slug}.html`);
    if (!html) { check(`/services/${slug} prerendered`, false, 'missing'); continue; }
    const t = ldTypes(html);
    check(`/services/${slug} JSON-LD parses`, !t.has('__MALFORMED__'), 'a block failed JSON.parse');
    check(`/services/${slug} FAQPage`, t.has('FAQPage'), 'missing');
    check(`/services/${slug} MedicalProcedure`, t.has('MedicalProcedure'), 'missing');
    check(`/services/${slug} BreadcrumbList`, t.has('BreadcrumbList'), 'missing');
  }

  // FAQPage must carry real questions — an empty one is invalid markup.
  const di = read('services/dental-implants.html');
  if (di) {
    const m = [...di.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((x) => { try { return JSON.parse(x[1]); } catch { return null; } })
      .find((j) => j?.['@type'] === 'FAQPage');
    check('/services/dental-implants FAQPage has questions', (m?.mainEntity?.length ?? 0) >= 3, `got ${m?.mainEntity?.length ?? 0}`);
  }
}

// ── Phase 4: no absolute medical claims ──────────────────────────────────
for (const [route, file] of routes) {
  const html = read(file);
  if (!html) continue;
  const text = crawlerText(html);
  for (const claim of ['100% Painless', 'zero discomfort', 'zero procedure anxiety', 'Lifetime guarantee']) {
    check(`${route} no absolute claim "${claim}"`, !new RegExp(claim, 'i').test(text), 'present on health content');
  }
}

// ── Report ───────────────────────────────────────────────────────────────
const pad = (s) => s.padEnd(52);
for (const p of passes) console.log(`  PASS  ${pad(p.name)}`);
for (const f of failures) console.log(`  FAIL  ${pad(f.name)} ${f.detail}`);

console.log(`\n${passes.length} passed, ${failures.length} failed\n`);
process.exit(failures.length ? 1 : 0);
