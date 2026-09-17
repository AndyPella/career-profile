import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dist = path.join(root, 'dist');
const site = 'https://andrewpella.com';
const requiredPages = ['/', '/experience', '/projects', '/projects/otel-evaluation', '/projects/northstar-ridge', '/projects/agentic-job-search', '/resume', '/explore', '/contact'];
const requiredMachineFiles = ['/resume.json', '/resume.md', '/llms.txt', '/sitemap.xml', '/robots.txt'];
const failures = [];
const pass = (message) => console.log(`PASS: ${message}`);
const fail = (message) => failures.push(message);
const exists = (file) => fs.existsSync(file);
const read = (file) => fs.readFileSync(file, 'utf8');
const section = (message, fn) => {
  const before = failures.length;
  fn();
  if (failures.length === before) pass(message);
};

function outputPath(urlPath) {
  if (urlPath === '/') return path.join(dist, 'index.html');
  const clean = urlPath.replace(/^\//, '');
  const direct = path.join(dist, clean);
  if (exists(direct) && fs.statSync(direct).isFile()) return direct;
  const html = path.join(dist, `${clean}.html`);
  if (exists(html)) return html;
  return path.join(dist, clean, 'index.html');
}

function pageUrlFromFile(file) {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -11)}`;
  if (rel.endsWith('.html')) return `/${rel.slice(0, -5)}`;
  return `/${rel}`;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!exists(dist)) fail('dist/ does not exist; run npm run build first.');

section('public career model JSON syntax and required fields', () => {
  const careerPath = path.join(root, 'src/data/career.json');
  try {
    const career = JSON.parse(read(careerPath));
    const requiredTop = ['schemaVersion', 'profile', 'skills', 'experience', 'projects', 'links', 'contact', 'resume'];
    for (const key of requiredTop) if (!(key in career)) fail(`career.json missing required field: ${key}`);
    for (const key of ['name', 'positioning', 'canonicalUrl', 'summary']) if (!career.profile?.[key]) fail(`career.profile missing required field: ${key}`);
    if (career.profile?.canonicalUrl !== site) fail(`career.profile.canonicalUrl must be ${site}`);
    if (!Array.isArray(career.skills) || career.skills.length === 0) fail('career.skills must be a non-empty array.');
    if (!Array.isArray(career.experience) || career.experience.length === 0) fail('career.experience must be a non-empty array.');
    if (!Array.isArray(career.projects) || career.projects.length === 0) fail('career.projects must be a non-empty array.');
    if (!career.contact?.primaryMethod) fail('career.contact.primaryMethod is required.');
  } catch (error) {
    fail(`career.json is invalid JSON: ${error.message}`);
  }
});

section('required human and machine outputs exist', () => {
  for (const urlPath of [...requiredPages, ...requiredMachineFiles]) {
    if (!exists(outputPath(urlPath))) fail(`missing generated output: ${urlPath}`);
  }
});

section('resume.json syntax and release contract', () => {
  const resumeJsonPath = outputPath('/resume.json');
  if (!exists(resumeJsonPath)) return;
  try {
    const resume = JSON.parse(read(resumeJsonPath));
    if (!resume.basics?.name) fail('resume.json missing basics.name');
    if (resume.basics?.url !== site) fail('resume.json basics.url must be canonical site URL');
    if (resume.basics?.location?.countryCode !== 'US') fail('resume.json basics.location.countryCode must be US');
    if (!Array.isArray(resume.work) || resume.work.length === 0) fail('resume.json work must be a non-empty array');
    if (!Array.isArray(resume.skills) || resume.skills.length === 0) fail('resume.json skills must be a non-empty array');
    if (!Array.isArray(resume.projects) || resume.projects.length === 0) fail('resume.json projects must be a non-empty array');
    if (!Array.isArray(resume.certificates)) fail('resume.json certificates must be an array');
  } catch (error) {
    fail(`resume.json is invalid JSON: ${error.message}`);
  }
});

if (exists(dist)) {
  section('internal links and canonical URL generation', () => {
    const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
    for (const file of htmlFiles) {
      const html = read(file);
      const pagePath = pageUrlFromFile(file);
      const expectedCanonical = pagePath === '/' ? `${site}/` : `${site}${pagePath}`;
      const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
        ?? html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)?.[1];
      if (canonical !== expectedCanonical) fail(`${pagePath} canonical mismatch: expected ${expectedCanonical}, found ${canonical ?? 'none'}`);

      const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
      for (const href of hrefs) {
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        const [targetPart, fragment] = href.split('#');
        const targetPath = targetPart || pagePath;
        const targetFile = outputPath(targetPath || '/');
        if (!exists(targetFile)) {
          fail(`${pagePath} has broken internal link: ${href}`);
          continue;
        }
        if (fragment && targetFile.endsWith('.html')) {
          const targetHtml = read(targetFile);
          const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (!new RegExp(`id=["']${escaped}["']`).test(targetHtml)) fail(`${pagePath} links to missing fragment: ${href}`);
        }
      }
    }
  });

  section('JSON-LD emitted and parseable on intended pages', () => {
    const jsonLdPages = ['/', '/projects/otel-evaluation', '/projects/northstar-ridge', '/projects/agentic-job-search'];
    for (const urlPath of jsonLdPages) {
      const html = read(outputPath(urlPath));
      const match = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (!match) {
        fail(`${urlPath} missing JSON-LD`);
        continue;
      }
      try {
        const data = JSON.parse(match[1]);
        const graph = Array.isArray(data['@graph']) ? data['@graph'] : [];
        if (!graph.some((item) => item['@type'] === 'Person')) fail(`${urlPath} JSON-LD missing Person`);
        if (urlPath === '/' && !graph.some((item) => item['@type'] === 'ProfilePage')) fail('/ JSON-LD missing ProfilePage');
        if (urlPath.startsWith('/projects/') && !graph.some((item) => item['@type'] === 'CreativeWork')) fail(`${urlPath} JSON-LD missing CreativeWork`);
      } catch (error) {
        fail(`${urlPath} JSON-LD is invalid JSON: ${error.message}`);
      }
    }
  });
}

section('llms.txt exists with canonical discovery references', () => {
  const llmsPath = outputPath('/llms.txt');
  if (!exists(llmsPath)) return;
  const text = read(llmsPath);
  for (const required of [site, `${site}/resume`, `${site}/resume.json`, `${site}/resume.md`, `${site}/projects/otel-evaluation`, `${site}/projects/agentic-job-search`]) {
    if (!text.includes(required)) fail(`llms.txt missing required canonical reference: ${required}`);
  }
});

section('sitemap exists and contains required canonical human pages', () => {
  const sitemapPath = outputPath('/sitemap.xml');
  if (!exists(sitemapPath)) return;
  const xml = read(sitemapPath);
  for (const urlPath of requiredPages) {
    const expected = urlPath === '/' ? `${site}/` : `${site}${urlPath}`;
    if (!xml.includes(`<loc>${expected}</loc>`)) fail(`sitemap missing required page: ${expected}`);
  }
  for (const machine of ['/resume.json', '/resume.md', '/llms.txt']) {
    if (xml.includes(`${site}${machine}`)) fail(`sitemap should not promote machine resource as canonical page: ${machine}`);
  }
});

section('robots.txt exists and references sitemap', () => {
  const robotsPath = outputPath('/robots.txt');
  if (!exists(robotsPath)) return;
  const robots = read(robotsPath);
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) fail('robots.txt must allow normal public crawling');
  if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) fail('robots.txt missing canonical sitemap reference');
});

if (exists(dist)) {
  section('generated output excludes known private-source markers', () => {
    const publicText = walk(dist)
      .filter((file) => !/\.(png|jpe?g|gif|webp|ico|woff2?)$/i.test(file))
      .map((file) => [file, read(file)]);
    const prohibited = [
      ['master', '-career-record'].join(''),
      ['source', 'ClaimIds'].join(''),
      ['SIMON', '-PUBLIC-001'].join(''),
      ['SF', '-001'].join(''),
      ['role', 'Boundary'].join(''),
    ];
    for (const [file, text] of publicText) {
      for (const token of prohibited) if (text.includes(token)) fail(`generated output ${path.relative(dist, file)} exposes prohibited private-source marker`);
    }
  });
}

section('tracked-file obvious secret signature scan', () => {
  try {
    const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
    const secretPatterns = [
      ['gh', 'p_'].join(''),
      ['github_', 'pat_'].join(''),
      ['AK', 'IA'].join(''),
      ['xox', 'b-'].join(''),
      ['sk', '-'].join(''),
      ['BEGIN ', 'PRIVATE KEY'].join(''),
    ];
    for (const rel of files) {
      if (rel === 'scripts/validate-release.mjs' || rel === 'scripts/validate-public-source.mjs') continue;
      const file = path.join(root, rel);
      if (!exists(file) || fs.statSync(file).size > 2_000_000) continue;
      let text;
      try { text = read(file); } catch { continue; }
      for (const pattern of secretPatterns) if (text.includes(pattern)) fail(`possible secret signature found in tracked file: ${rel}`);
    }
  } catch (error) {
    fail(`unable to scan tracked files for obvious secret signatures: ${error.message}`);
  }
});

if (failures.length) {
  console.error('\nD2 RELEASE VALIDATION FAILED');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('\nD2 RELEASE VALIDATION PASSED');
