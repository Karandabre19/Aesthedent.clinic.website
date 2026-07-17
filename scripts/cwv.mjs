#!/usr/bin/env node
/**
 * Phase 3.7 — Core Web Vitals for us + competitors.
 *
 * PageSpeed Insights API. Reports BOTH:
 *  - CrUX field data (real Chrome users, 28-day) — the truth, when it exists
 *  - Lighthouse lab data — a simulation, used only when field data is absent
 * A new/low-traffic site has no CrUX sample, so "no field data" is itself a
 * finding, not a gap to paper over with lab numbers.
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
  ['sabkadentist.com (CHAIN)', 'https://sabkadentist.com/dental-clinics-in-pune/kothrud/'],
  ['clovedental.in (CHAIN)', 'https://clovedental.in/dentist-near-me/pune/kothrud'],
];

const STRATEGY = process.argv[2] === 'desktop' ? 'desktop' : 'mobile';
const out = [];

for (const [name, url] of TARGETS) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${STRATEGY}&category=performance`;
  const row = { name, url, strategy: STRATEGY, field: null, lab: null, error: null };
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(90000) });
    const j = await res.json();
    if (j.error) throw new Error(j.error.message);

    const le = j.loadingExperience?.metrics;
    if (le && j.loadingExperience?.overall_category) {
      row.field = {
        overall: j.loadingExperience.overall_category,
        LCP: le.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
        INP: le.INTERACTION_TO_NEXT_PAINT?.percentile,
        CLS: le.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
      };
    }
    const a = j.lighthouseResult?.audits;
    row.lab = {
      perf: Math.round((j.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
      LCP: a?.['largest-contentful-paint']?.numericValue,
      TBT: a?.['total-blocking-time']?.numericValue,
      CLS: a?.['cumulative-layout-shift']?.numericValue,
      TTI: a?.['interactive']?.numericValue,
      bytes: a?.['total-byte-weight']?.numericValue,
      unusedJs: a?.['unused-javascript']?.details?.overallSavingsBytes,
    };
  } catch (e) {
    row.error = String(e.message).slice(0, 90);
  }
  out.push(row);
  console.log(`${row.error ? 'ERR ' : 'ok  '} ${name}`);
}

const n = (v, d = 0) => (v == null ? '—' : (v / (d || 1)).toFixed(d ? 1 : 0));
console.log(`\n=== CORE WEB VITALS (${STRATEGY}) ===\n`);
console.log('site'.padEnd(30), 'perf'.padStart(5), 'LCPlab'.padStart(8), 'TBT'.padStart(7), 'CLS'.padStart(6), 'KB'.padStart(7), '  field(CrUX)');
for (const r of out) {
  if (r.error) { console.log(r.name.padEnd(30), ' ERR  ', r.error); continue; }
  const f = r.field ? `${r.field.overall} LCP:${r.field.LCP}ms CLS:${(r.field.CLS / 100).toFixed(2)}` : 'no field data';
  console.log(
    r.name.padEnd(30),
    String(r.lab.perf).padStart(5),
    (n(r.lab.LCP / 1000, 1) + 's').padStart(8),
    (n(r.lab.TBT) + 'ms').padStart(7),
    n(r.lab.CLS, 2).padStart(6),
    n(r.lab.bytes / 1024).padStart(7),
    ' ', f,
  );
}

if (!existsSync('audit/raw')) mkdirSync('audit/raw', { recursive: true });
writeFileSync(`audit/raw/3-cwv-${STRATEGY}.json`, JSON.stringify(out, null, 2));
console.log(`\nsaved: audit/raw/3-cwv-${STRATEGY}.json`);
