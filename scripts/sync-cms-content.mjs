import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { target, contentTypes, buildContentManifest, planDraftOperations, applyDraftOperations, renderPlanReport, hash } from './content-sync-lib.mjs';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const { requireSanityEnvironment } = require('../sanity/env.ts');
const config = requireSanityEnvironment();
if (config.projectId !== target.projectId || config.dataset !== target.dataset) throw new Error('Target mismatch; no request sent.');
const directory = '.cache/content-sync'; fs.mkdirSync(directory, { recursive: true });
// Receipts, backups and reviewed artifacts must survive a crash right after the write.
const writeDurable = (file, text) => { const descriptor = fs.openSync(file, 'w'); try { fs.writeSync(descriptor, text); fs.fsyncSync(descriptor); } finally { fs.closeSync(descriptor); } };
// Keep a previously reviewed artifact when its content changes instead of clobbering it.
const archivePrevious = (name, keyOf, nextKey) => {
  const file = `${directory}/${name}.json`; if (!fs.existsSync(file)) return;
  let previousKey; try { previousKey = keyOf(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch { previousKey = 'unreadable-' + hash(fs.readFileSync(file, 'utf8')); }
  const archived = `${directory}/${name}.${String(previousKey).slice(0, 25)}.json`;
  if (previousKey && previousKey !== nextKey && !fs.existsSync(archived)) fs.copyFileSync(file, archived, fs.constants.COPYFILE_EXCL);
};
const manifest = buildContentManifest();
archivePrevious('manifest', previous => previous.manifestHash, manifest.manifestHash);
writeDurable(`${directory}/manifest.json`, JSON.stringify(manifest, null, 2));
let client, inventory = { authenticated: false, complete: false, documents: [] };
try {
  const cliRequire = createRequire(require.resolve('@sanity/cli/package.json'));
  const { getProjectCliClient } = await import(pathToFileURL(cliRequire.resolve('@sanity/cli-core')));
  client = await getProjectCliClient({ ...config, requireUser: true, perspective: 'raw', useCdn: false, timeout: 10000, maxRetries: 0 });
  if (client.config().apiHost !== 'https://api.sanity.io') throw new Error('Unexpected API host.');
  const documents = []; let after = '';
  while (true) {
    const page = await client.fetch('*[_type in $types && _id > $after]|order(_id asc)[0...1000]', { types: [...contentTypes, 'sanity.imageAsset'], after });
    if (!Array.isArray(page)) throw new Error('Invalid inventory response.');
    documents.push(...page); if (page.length < 1000) break; after = page.at(-1)._id;
  }
  inventory = { authenticated: true, complete: true, checkedAt: new Date().toISOString(), documents };
} catch { inventory.blocker = 'Authenticated raw inventory unavailable; existing drafts/releases remain unknown. No writes are permitted.'; }
if (!inventory.complete) {
  try {
    const { createClient } = require('@sanity/client');
    const publicClient = createClient({ ...config, perspective: 'published', useCdn: false, timeout: 10000, maxRetries: 0 });
    const published = await publicClient.fetch('*[_type in $types && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]|order(_id asc){_id,_type,_rev}', { types: contentTypes });
    inventory.publishedSnapshot = { checkedAt: new Date().toISOString(), records: published, counts: Object.fromEntries(contentTypes.map(type => [type, published.filter(doc => doc._type === type).length])) };
  } catch { inventory.publishedSnapshot = { blocker: 'Published snapshot unavailable. No eligibility transition is approved for remote rollout.' }; }
}
const plan = planDraftOperations(manifest, inventory), operationsHash = hash(plan.operations);
const planKey = value => `${String(value.manifestHash).slice(0, 12)}-${String(value.operationsHash).slice(0, 12)}`;
archivePrevious('draft-plan', planKey, planKey({ manifestHash: manifest.manifestHash, operationsHash }));
writeDurable(`${directory}/inventory-current.json`, JSON.stringify(inventory, null, 2));
writeDurable(`${directory}/draft-plan.json`, JSON.stringify({ ...plan, operationsHash, manifestHash: manifest.manifestHash }, null, 2));
writeDurable(`${directory}/draft-plan.md`, renderPlanReport(manifest, inventory, plan));
if (process.argv.includes('--apply-drafts')) {
  const flag = process.argv.indexOf('--approval-file'), file = flag >= 0 ? process.argv[flag + 1] : undefined;
  if (!file || !client || !inventory.complete) throw new Error('Apply blocked: complete authenticated inventory and an exact approved operation file are required.');
  const approval = JSON.parse(fs.readFileSync(file, 'utf8'));
  writeDurable(`${directory}/backup-${Date.now()}.json`, JSON.stringify(inventory, null, 2));
  const journal = `${directory}/draft-journal-${Date.now()}.jsonl`;
  const descriptor = fs.openSync(journal, 'wx');
  try {
    const record = entry => { fs.writeSync(descriptor, JSON.stringify({ at: new Date().toISOString(), target, manifestHash: manifest.manifestHash, operationsHash, ...entry }) + '\n'); fs.fsyncSync(descriptor); };
    const results = await applyDraftOperations(client, manifest, inventory, approval, { record });
    writeDurable(`${directory}/apply-results-${Date.now()}.json`, JSON.stringify(results, null, 2));
  } finally { fs.closeSync(descriptor); }
}
console.log(JSON.stringify({ mode: process.argv.includes('--apply-drafts') ? 'draft-apply' : 'dry-run', targetVerified: true, mappedDocuments: manifest.documents.length, mappedReviews: manifest.reviews.length, fieldEvidence: manifest.fieldEvidence.length, imageSlots: manifest.assets.length, authenticatedInventory: inventory.complete, plannedOperations: plan.operations.length, candidates: Object.fromEntries(['create', 'update', 'skip', 'conflict', 'blocked'].map(status => [status, plan.candidates.filter(c => c.status === status).length])), blocked: plan.blocked, report: `${directory}/draft-plan.md`, artifacts: directory }));
