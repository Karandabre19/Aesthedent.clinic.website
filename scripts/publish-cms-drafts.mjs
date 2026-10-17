import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { target, publishDrafts, publishableIdentities } from './content-sync-lib.mjs';

// Usage: node scripts/publish-cms-drafts.mjs --ids contactPage,navigation --confirm
// Without --confirm it only lists what would be published. Clinical documents are refused.
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const { requireSanityEnvironment } = require('../sanity/env.ts');
const config = requireSanityEnvironment();
if (config.projectId !== target.projectId || config.dataset !== target.dataset) throw new Error('Target mismatch; no request sent.');
const flag = process.argv.indexOf('--ids');
const identities = flag >= 0 ? process.argv[flag + 1].split(',').filter(Boolean) : [];
const refused = identities.filter(identity => !publishableIdentities.includes(identity));
if (!identities.length || refused.length) throw new Error(`Choose from: ${publishableIdentities.join(', ')}. Refused: ${refused.join(', ') || '(none given)'}.`);
if (!process.argv.includes('--confirm')) { console.log(JSON.stringify({ mode: 'preview', wouldPublish: identities })); process.exit(0); }
const cliRequire = createRequire(require.resolve('@sanity/cli/package.json'));
const { getProjectCliClient } = await import(pathToFileURL(cliRequire.resolve('@sanity/cli-core')));
const client = await getProjectCliClient({ ...config, requireUser: true, perspective: 'raw', useCdn: false, timeout: 15000, maxRetries: 0 });
const directory = '.cache/content-sync'; fs.mkdirSync(directory, { recursive: true });
const descriptor = fs.openSync(`${directory}/publish-journal-${Date.now()}.jsonl`, 'wx');
try {
  const record = entry => { fs.writeSync(descriptor, JSON.stringify({ at: new Date().toISOString(), target, ...entry }) + '\n'); fs.fsyncSync(descriptor); };
  console.log(JSON.stringify({ mode: 'published', results: await publishDrafts(client, identities, { record }) }));
} finally { fs.closeSync(descriptor); }
