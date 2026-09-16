import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);

const prohibitedTokens = [
  ['master', '-career-record'].join(''),
  ['source', 'ClaimIds'].join(''),
  ['SIMON', '-PUBLIC-001'].join(''),
  ['role', 'Boundary'].join(''),
  ['public', 'ContentContract'].join(''),
  ['approved', 'At'].join(''),
  ['Si', 'mon'].join(''),
];

const prohibitedJsonKeys = [
  ['bound', 'aries'].join(''),
  ['source', 'ClaimIds'].join(''),
  ['role', 'Boundary'].join(''),
  ['proven', 'ance'].join(''),
  ['approved', 'At'].join(''),
];

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

for (const rel of files) {
  if (rel === 'scripts/validate-public-source.mjs') continue;
  const file = path.join(root, rel);
  if (!fs.existsSync(file) || fs.statSync(file).size > 2_000_000) continue;

  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const token of prohibitedTokens) {
    if (text.includes(token)) fail(`tracked public source exposes prohibited private-governance marker in ${rel}`);
  }

  if (rel.endsWith('.json')) {
    let value;
    try {
      value = JSON.parse(text);
    } catch {
      continue;
    }

    const visit = (node, pointer = '$') => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => visit(item, `${pointer}[${index}]`));
        return;
      }
      if (!node || typeof node !== 'object') return;
      for (const [key, child] of Object.entries(node)) {
        if (prohibitedJsonKeys.includes(key)) fail(`tracked public JSON contains prohibited governance key ${pointer}.${key} in ${rel}`);
        visit(child, `${pointer}.${key}`);
      }
    };

    visit(value);
  }
}

if (failures.length) {
  console.error('\nPUBLIC SOURCE BOUNDARY VALIDATION FAILED');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('PASS: tracked public repository source excludes private governance and traceability markers');
