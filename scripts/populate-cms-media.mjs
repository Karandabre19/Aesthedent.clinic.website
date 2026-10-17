import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { target, buildContentManifest } from './content-sync-lib.mjs';

// Uploads the images the website already shows and sets them on EMPTY image fields of
// drafts only (setIfMissing + revision guard). Published documents get a draft copy;
// nothing is published. Preview unless --confirm.
const require = createRequire(import.meta.url);
const { services } = require('../lib/services.js');
const { insights } = require('../lib/insights.js');
const manifest = buildContentManifest();

const pageSlots = manifest.assets
  .filter(a => a.destinations?.length === 1 && ['homePage', 'aboutPage', 'experiencePage'].includes(a.destinations[0].identity) && typeof a.alt === 'string' && !a.alt.includes('.'))
  .map(a => ({ type: a.destinations[0].identity, identity: a.destinations[0].identity, field: a.destinations[0].field, source: a.localFile ?? a.source, alt: a.alt }));
const slots = [
  ...pageSlots,
  ...services.map(s => ({ type: 'service', identity: s.slug, field: 'coverImage', source: s.image, alt: s.imageAlt ?? `${s.title} at Aesthedent Dental Clinic, Kothrud` })),
  ...insights.map(a => ({ type: 'insight', identity: a.slug, field: 'coverImage', source: a.image, alt: a.title })),
  { type: 'doctor', identity: 'sahil', field: 'portrait', source: '/assets/doctor-male.jpeg' },
  { type: 'doctor', identity: 'aishwarya', field: 'portrait', source: '/assets/doctor-female.jpeg' },
];
const localPath = source => source.startsWith('public/') ? source : source.startsWith('/') ? path.join('public', source.slice(1)) : null;

if (!process.argv.includes('--confirm')) {
  console.table(slots.map(s => ({ document: s.identity, field: s.field, source: String(s.source).slice(0, 60), alt: (s.alt ?? '(portrait, fixed)').slice(0, 50) })));
  process.exit(0);
}

const cliRequire = createRequire(require.resolve('@sanity/cli/package.json'));
const { getProjectCliClient } = await import(pathToFileURL(cliRequire.resolve('@sanity/cli-core')));
const client = await getProjectCliClient({ ...target, apiVersion: '2025-01-01', requireUser: true, perspective: 'raw', useCdn: false, timeout: 60000, maxRetries: 0 });
const config = client.config();
if (config.projectId !== target.projectId || config.dataset !== target.dataset) throw new Error('Target mismatch; nothing written.');

const journalFile = `.cache/content-sync/media-journal-${Date.now()}.jsonl`;
const descriptor = fs.openSync(journalFile, 'wx');
const record = entry => { fs.writeSync(descriptor, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n'); fs.fsyncSync(descriptor); };
const uploaded = new Map();
async function assetFor(source) {
  if (uploaded.has(source)) return uploaded.get(source);
  const local = localPath(source);
  const remote = local ? null : Object.assign(new URL(source), { search: '?auto=compress&cs=tinysrgb&w=1600' });
  const body = local ? fs.readFileSync(local) : Buffer.from(await (await fetch(remote)).arrayBuffer());
  if (body.length < 1000) throw new Error(`Image download failed: ${source}`);
  const asset = await client.assets.upload('image', body, { filename: path.basename(local ?? new URL(source).pathname) });
  record({ status: 'asset', source, assetId: asset._id });
  uploaded.set(source, asset._id);
  return asset._id;
}
async function draftFor(slot) {
  const singleton = slot.type === slot.identity;
  const docs = await client.fetch(singleton ? '*[_id in [$id, "drafts." + $id]]' : '*[_type == $type && slug.current == $slug]', { id: slot.identity, type: slot.type, slug: slot.identity });
  const draft = docs.find(d => d._id.startsWith('drafts.')), published = docs.find(d => !d._id.startsWith('drafts.'));
  if (docs.some(d => d._id.startsWith('versions.')) || docs.length > 2) throw new Error(`${slot.identity}: ambiguous or release family; skipped.`);
  if (draft) return draft;
  if (!published) throw new Error(`${slot.identity}: no document.`);
  const { _rev, _createdAt, _updatedAt, ...body } = published;
  const created = await client.createIfNotExists({ ...body, _id: `drafts.${published._id}` });
  record({ status: 'draft-from-published', identity: slot.identity, id: created._id });
  return created;
}

try {
  for (const slot of slots) {
    const draft = await draftFor(slot);
    const current = slot.field.split('.').reduce((v, k) => v?.[k], draft);
    if (current?.asset) { record({ status: 'skip-existing', identity: slot.identity, field: slot.field }); continue; }
    const assetId = await assetFor(slot.source);
    const value = { _type: 'image', asset: { _type: 'reference', _ref: assetId }, ...(slot.alt ? { alt: slot.alt } : {}) };
    const result = await client.patch(draft._id).ifRevisionId(draft._rev).setIfMissing({ [slot.field]: value }).commit();
    const saved = await client.getDocument(draft._id);
    if (slot.field.split('.').reduce((v, k) => v?.[k], saved)?.asset?._ref !== assetId) throw new Error(`${slot.identity}.${slot.field}: read-back mismatch`);
    record({ status: 'verified', identity: slot.identity, field: slot.field, id: draft._id, revision: result._rev, assetId });
  }
} finally { fs.closeSync(descriptor); }
console.log(JSON.stringify({ journal: journalFile, assets: uploaded.size, slots: slots.length }));
