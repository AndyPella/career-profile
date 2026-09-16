import type { APIRoute } from 'astro';
import career from '../data/career.json';

const base = career.profile.canonicalUrl;
const body = `# ${career.profile.name}\n\n${career.profile.positioning}\n\n${career.profile.summary}\n\n## Contact\n- Email: ${career.contact.email}\n- Contact page: ${base}/contact\n\n## Canonical human pages\n- Profile: ${base}/\n- Experience: ${base}/experience\n- Projects: ${base}/projects\n- Resume: ${base}/resume\n- Explore: ${base}/explore\n- Contact: ${base}/contact\n\n## Machine-readable resources\n- JSON resume: ${base}/resume.json\n- Markdown resume: ${base}/resume.md\n- Sitemap: ${base}/sitemap.xml\n\n## Project evidence\n- OpenTelemetry evaluation: ${base}/projects/otel-evaluation\n- Northstar Ridge: ${base}/projects/northstar-ridge\n- Agentic career workflow: ${base}/projects/agentic-job-search\n\n## External identity\n${career.links
  .filter((link) => ['linkedin', 'github-profile', 'github-public-portfolio'].includes(link.id))
  .map((link) => `- ${link.label}: ${link.url}`)
  .join('\n')}\n\nThis file is a concise discovery aid. Canonical human pages and structured resources above are the authoritative public representations for this site.\n`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
