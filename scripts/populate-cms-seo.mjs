import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { target, publishDrafts, publishableIdentities } from './content-sync-lib.mjs';
import { deriveSeoOverrides } from './derive-seo-overrides.mjs';

// Fills EMPTY seo.* fields with each route's current metadata, only for documents whose
// overrides were proven to render identically. Writes drafts (setIfMissing + revision
// guard); publishes only allowlisted non-clinical documents. Preview unless --confirm.
const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve('@sanity/cli/package.json'));
const { getProjectCliClient } = await import(pathToFileURL(cliRequire.resolve('@sanity/cli-core')));
const client = await getProjectCliClient({ ...target, apiVersion: '2025-01-01', requireUser: true, perspective: 'raw', useCdn: false, timeout: 30000, maxRetries: 0 });
if (client.config().projectId !== target.projectId || client.config().dataset !== target.dataset) throw new Error('Target mismatch; nothing written.');

const settings = await client.getDocument('seoSettings');
const results = await deriveSeoOverrides(settings?.defaults ?? {});
const failed = results.filter(r => !r.ok);
if (failed.length) throw new Error(`Not identical, nothing written: ${failed.map(r => `${r.identity} (${r.reason})`).join(', ')}`);
if (!process.argv.includes('--confirm')) { console.log(JSON.stringify({ mode: 'preview', documents: results.map(r => r.identity) })); process.exit(0); }

const descriptor = fs.openSync(`.cache/content-sync/seo-journal-${Date.now()}.jsonl`, 'wx');
const record = entry => { fs.writeSync(descriptor, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n'); fs.fsyncSync(descriptor); };
const toPublish = [];
try {
  for (const r of results) {
    const singleton = r.type === r.identity;
    const docs = await client.fetch(singleton ? '*[_id in [$id, "drafts." + $id] || _id in path("versions.*." + $id)]' : '*[_type == $type && slug.current == $slug]', { id: r.identity, type: r.type, slug: r.identity });
    if (docs.some(d => d._id.startsWith('versions.')) || docs.length > 2) throw new Error(`${r.identity}: ambiguous family`);
    let draft = docs.find(d => d._id.startsWith('drafts.'));
    const published = docs.find(d => !d._id.startsWith('drafts.'));
    if (!draft) {
      if (!published) throw new Error(`${r.identity}: no document`);
      const { _rev, _createdAt, _updatedAt, ...body } = published;
      draft = await client.createIfNotExists({ ...body, _id: `drafts.${published._id}` });
      record({ status: 'draft-from-published', identity: r.identity });
    }
    const missing = Object.fromEntries(Object.entries(r.seo).filter(([key, value]) => value !== undefined && draft.seo?.[key] == null).map(([key, value]) => [`seo.${key}`, value]));
    if (Object.keys(missing).length) {
      await client.patch(draft._id).ifRevisionId(draft._rev).setIfMissing({ seo: {} }).setIfMissing(missing).commit();
      const saved = await client.getDocument(draft._id);
      if (Object.entries(missing).some(([key, value]) => saved.seo?.[key.slice(4)] !== value)) throw new Error(`${r.identity}: read-back mismatch`);
    }
    record({ status: 'verified', identity: r.identity, id: draft._id, filled: Object.keys(missing).length });
    if (published && publishableIdentities.includes(r.identity)) toPublish.push(r.identity);
  }
  const published = toPublish.length ? await publishDrafts(client, toPublish, { record }) : [];
  console.log(JSON.stringify({ documents: results.length, published: published.map(p => p.id) }));
} finally { fs.closeSync(descriptor); }
