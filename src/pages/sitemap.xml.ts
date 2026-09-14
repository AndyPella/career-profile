import type { APIRoute } from 'astro';
import career from '../data/career.json';

const paths = [
  '/',
  '/experience',
  '/projects',
  '/projects/otel-evaluation',
  '/projects/agentic-job-search',
  '/resume',
  '/explore',
  '/contact',
];

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, career.profile.canonicalUrl).toString())}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
