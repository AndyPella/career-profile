import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, compareInputs, validateDownload } from './check-resume-download.mjs';
const source = '# Approved résumé\nCurrent wording.\n';
const manifest={source_fingerprint:fingerprint(source),format_policy_fingerprint:fingerprint('format'),version_index_fingerprint:fingerprint('V5')};
test('detects changed wording even when version and filename stay unchanged',()=>{
  assert.deepEqual(compareInputs(manifest,{source:source.replace('Current','Revised')}),{status:'review_required',changes:['source_changed']});
});
test('line endings and trailing blank lines do not create false updates',()=>{
  assert.equal(compareInputs(manifest,{source:source.replace(/\n/g,'\r\n')+'\r\n'}).status,'current');
});
test('a changed registry requests selection review and never chooses a successor',()=>{
  const result=compareInputs(manifest,{source,versionIndex:'V5\nV6 available'});
  assert.deepEqual(result.changes,['version_review_required']);
  assert.equal(result.version,undefined);
});
test('format changes require review even when résumé wording is unchanged',()=>{
  assert.deepEqual(compareInputs(manifest,{source,formatPolicy:'new format'}).changes,['format_review_required']);
});
test('published PDF bytes and rendering profile match the recorded fingerprints',()=>{
  const m=validateDownload(process.cwd());assert.equal(m.visual_review,'passed');
});
