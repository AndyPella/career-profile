import type { APIRoute } from 'astro';
import career from '../data/career.json';

const projectUrl = (project: (typeof career.projects)[number]) => {
  if (project.id === 'otel-evaluation') return `${career.profile.canonicalUrl}/projects/otel-evaluation`;
  if (project.id === 'northstar-ridge') return `${career.profile.canonicalUrl}/projects/northstar-ridge`;
  if (project.id === 'agentic-career-workflow') return `${career.profile.canonicalUrl}/projects/agentic-job-search`;
  return undefined;
};

const lines: string[] = [
  `# ${career.profile.name}`,
  '',
  career.resume.headline,
  '',
  career.profile.summary,
  '',
  career.profile.summaryDetail,
  '',
  `Email: ${career.contact.email}`,
  `Canonical profile: ${career.profile.canonicalUrl}`,
  `Human-readable resume: ${career.profile.canonicalUrl}/resume`,
  '',
  '## Experience',
  '',
];

for (const id of career.resume.experienceIds) {
  const role = career.experience.find((item) => item.id === id);
  if (!role) continue;
  lines.push(`### ${role.title} — ${role.employer}`);
  if ('functionalAssignment' in role && role.functionalAssignment) lines.push(`**Functional assignment:** ${role.functionalAssignment}`);
  lines.push(`**Dates:** ${role.dateDisplay}`, '', role.summary, '');
  for (const highlight of role.highlights) lines.push(`- ${highlight}`);
  lines.push('');
}

lines.push('## Selected Projects', '');
for (const id of career.resume.projectIds) {
  const project = career.projects.find((item) => item.id === id);
  if (!project) continue;
  const url = projectUrl(project);
  lines.push(`### ${project.title}`, '');
  if (url) lines.push(`**Canonical project:** ${url}`, '');
  lines.push(`**Role:** ${project.role}`, '', project.summary, '');
}

lines.push('## Expertise', '');
for (const skill of career.skills) lines.push(`- ${skill.label}`);

lines.push('', '## Education', '', career.resume.education, '', '## Professional Links', '');
for (const link of career.links.filter((item) => ['linkedin', 'github-profile', 'github-public-portfolio'].includes(item.id))) {
  lines.push(`- ${link.label}: ${link.url}`);
}

export const GET: APIRoute = () =>
  new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
