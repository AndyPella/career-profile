#!/usr/bin/env node
/** Validate the published PDF and optionally compare its approved source inputs. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const fingerprint = text => crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n').trimEnd() + '\n').digest('hex');
export function compareInputs(manifest, inputs = {}) {
  const changes = [];
  for (const [key, field, action] of [
    ['source', 'source_fingerprint', 'source_changed'],
    ['formatPolicy', 'format_policy_fingerprint', 'format_review_required'],
    ['versionIndex', 'version_index_fingerprint', 'version_review_required'],
  ]) if (inputs[key] !== undefined && fingerprint(inputs[key]) !== manifest[field]) changes.push(action);
  return { status: changes.length ? 'review_required' : 'current', changes };
}
export function validateDownload(root) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/downloads/resume-version.json'), 'utf8'));
  if (manifest.schema_version !== 1 || manifest.version !== 'V5' && !/^V\d+(\.\d+)?$/.test(manifest.version)) throw Error('Invalid publication metadata.');
  if (!/^\/downloads\/[A-Za-z0-9._-]+\.pdf$/.test(manifest.url)) throw Error('Invalid download URL.');
  for (const key of ['source_fingerprint','format_policy_fingerprint','version_index_fingerprint','pdf_sha256','build_profile_sha256']) if (!/^[a-f0-9]{64}$/.test(manifest[key])) throw Error(`Invalid ${key}.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.published_on) || !Number.isInteger(manifest.page_count) || manifest.page_count < 1 || manifest.visual_review !== 'passed') throw Error('Missing publication review.');
  const bytes = fs.readFileSync(path.join(root, 'public', manifest.url));
  if (!bytes.subarray(0,5).equals(Buffer.from('%PDF-')) || bytes.length < 1000) throw Error('Download is not a complete PDF.');
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== manifest.pdf_sha256) throw Error('PDF fingerprint differs from publication metadata.');
  if (crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'scripts/build-public-resume.py'))).digest('hex') !== manifest.build_profile_sha256) throw Error('Build profile changed; review and refresh publication metadata.');
  return manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
    const manifest = validateDownload(root);
    const inputs = {};
    const flags = {'--source':'source','--format-policy':'formatPolicy','--version-index':'versionIndex'};
    for (let i=2;i<process.argv.length;i+=2) {
      if (!flags[process.argv[i]] || !process.argv[i+1]) throw Error('Use --source, --format-policy, or --version-index with a file path.');
      inputs[flags[process.argv[i]]] = fs.readFileSync(process.argv[i+1], 'utf8');
    }
    const result = compareInputs(manifest, inputs);
    console.log(JSON.stringify({version:manifest.version,download:manifest.url,published_on:manifest.published_on,publication:'valid',source_comparison:Object.keys(inputs).length?'performed':'not_requested',...result},null,2));
    if (result.status !== 'current') process.exitCode=2;
  } catch (error) { console.error(error.message); process.exitCode=1; }
}
