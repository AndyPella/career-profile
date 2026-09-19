import type { APIRoute } from 'astro';
import career from '../data/career.json';

const profiles = career.links
  .filter((link) => ['linkedin', 'github-profile'].includes(link.id))
  .map((link) => ({ network: link.label, url: link.url }));

const projectUrl = (project: (typeof career.projects)[number]) => {
  if (project.id === 'otel-evaluation') return `${career.profile.canonicalUrl}/projects/otel-evaluation`;
  if (project.id === 'northstar-ridge') return `${career.profile.canonicalUrl}/projects/northstar-ridge`;
  if (project.id === 'agentic-career-workflow') return `${career.profile.canonicalUrl}/projects/agentic-job-search`;
  return undefined;
};

export const GET: APIRoute = () => {
  const resume = {
    meta: {
      schemaVersion: career.schemaVersion,
      canonical: `${career.profile.canonicalUrl}/resume`,
      source: career.profile.canonicalUrl,
    },
    basics: {
      name: career.profile.name,
      label: career.resume.headline,
      email: career.contact.email,
      summary: career.profile.summary,
      location: { region: 'Oregon', countryCode: 'US' },
      url: career.profile.canonicalUrl,
      profiles,
    },
    work: career.resume.experienceIds
      .map((id) => career.experience.find((role) => role.id === id))
      .filter((role): role is (typeof career.experience)[number] => Boolean(role))
      .map((role) => ({
        name: role.employer,
        position: role.title,
        functionalAssignment: 'functionalAssignment' in role ? role.functionalAssignment : undefined,
        startDate: role.startDate,
        endDate: role.endDate,
        dateDisplay: role.dateDisplay,
        summary: role.summary,
        highlights: role.highlights,
      })),
    skills: career.skills.map((skill) => ({
      name: skill.label,
      keywords: 'aliases' in skill && skill.aliases ? skill.aliases : [],
    })),
    projects: career.resume.projectIds
      .map((id) => career.projects.find((project) => project.id === id))
      .filter((project): project is (typeof career.projects)[number] => Boolean(project))
      .map((project) => ({
        name: project.title,
        description: project.summary,
        role: project.role,
        url: projectUrl(project),
      })),
    education: [{ summary: career.resume.education }],
    certificates: career.resume.certifications,
  };

  return new Response(JSON.stringify(resume, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
