#!/usr/bin/env node
/**
 * Runs an Apify actor synchronously and writes the raw dataset to audit/raw/.
 * Raw output is never discarded or trimmed — it must stay re-queryable.
 *
 * Usage: node scripts/apify-run.mjs <actor-id> <input.json> <out-name>
 *   e.g. node scripts/apify-run.mjs compass~crawler-google-places gbp-in.json 2b-gbp
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const [actorId, inputPath, outName] = process.argv.slice(2);
if (!actorId || !inputPath || !outName) {
  console.error('usage: apify-run.mjs <actor-id> <input.json> <out-name>');
  process.exit(1);
}

// Token comes from .env.local only — never hardcoded, never logged.
const env = readFileSync('.env.local', 'utf8');
const TOKEN = env.match(/^APIFY_TOKEN=(.+)$/m)?.[1]?.trim();
if (!TOKEN) {
  console.error('APIFY_TOKEN not found in .env.local');
  process.exit(1);
}

const input = JSON.parse(readFileSync(inputPath, 'utf8'));
if (!existsSync('audit/raw')) mkdirSync('audit/raw', { recursive: true });

const t0 = Date.now();
console.log(`actor   : ${actorId}`);
console.log(`input   : ${inputPath}`);
console.log('starting run…');

// Async start + poll, so a long crawl doesn't die on a request timeout.
const startRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
  body: JSON.stringify(input),
});
const startBody = await startRes.json();
if (!startRes.ok) {
  console.error('start failed:', JSON.stringify(startBody).slice(0, 500));
  process.exit(1);
}

const runId = startBody.data.id;
const datasetId = startBody.data.defaultDatasetId;
console.log(`run id  : ${runId}`);

let status = startBody.data.status;
while (['READY', 'RUNNING'].includes(status)) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`);
  const j = await s.json();
  status = j.data.status;
  const usd = j.data.usageTotalUsd ?? 0;
  process.stdout.write(`\r  ${status}  ${Math.round((Date.now() - t0) / 1000)}s  $${usd.toFixed(4)}   `);
}
console.log('');

const runRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`);
const runJson = await runRes.json();
const usd = runJson.data.usageTotalUsd ?? 0;

const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}&clean=true&format=json`);
const items = await itemsRes.json();

const outPath = `audit/raw/${outName}.json`;
writeFileSync(outPath, JSON.stringify(items, null, 2));
writeFileSync(`audit/raw/${outName}.meta.json`, JSON.stringify({
  actorId, runId, datasetId, status,
  startedAt: runJson.data.startedAt, finishedAt: runJson.data.finishedAt,
  usageTotalUsd: usd, itemCount: Array.isArray(items) ? items.length : null,
  input,
}, null, 2));

console.log(`status  : ${status}`);
console.log(`items   : ${Array.isArray(items) ? items.length : 'n/a'}`);
console.log(`cost    : $${usd.toFixed(4)}`);
console.log(`saved   : ${outPath}`);
if (status !== 'SUCCEEDED') process.exit(1);
