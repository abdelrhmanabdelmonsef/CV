import cvData from 'cv-data';
import type { CandidateProfileContext } from './types/job-matcher';

/**
 * Extracts a concise, structured candidate profile from cv-data.
 * Strictly complies with Principle I: Single Source of Truth for Data.
 */
export function getCandidateProfileContext(): CandidateProfileContext {
  const categorySkills = (cvData.skillCategories ?? []).flatMap((cat) => cat.tags || []);
  const topSkills: string[] = [
    ...(cvData.resume?.skills ?? []),
    ...categorySkills
  ];
  // Deduplicate skills while preserving order
  const uniqueSkills = Array.from(new Set(topSkills));

  const experienceHighlights: string[] = (cvData.experience ?? []).flatMap((exp) => {
    const roleHeader = `${exp.role} at ${exp.organization} (${exp.duration})`;
    const bullets = (exp.highlights || []).slice(0, 3);
    return [roleHeader, ...bullets.map((b) => `  - ${b}`)];
  });

  const featuredProjects: string[] = (cvData.projects ?? []).slice(0, 5).map((p) => {
    const techStack = (p.tags || []).join(', ');
    return `${p.title} (${techStack}): ${p.description}`;
  });

  const certifications: string[] = (cvData.certifications ?? []).map(
    (c) => `${c.name} (${c.issuer})`
  );

  return {
    name: cvData.personal?.name || 'Abdel-Rahman Abdel-Monsef',
    title: cvData.personal?.title || 'Software Engineer | Full-Stack & Backend Systems',
    location: cvData.personal?.location || 'Cairo, Egypt',
    summary: cvData.resume?.summary || cvData.summary || '',
    topSkills: uniqueSkills,
    experienceHighlights,
    featuredProjects,
    certifications
  };
}

/**
 * Formats the candidate profile into a high-density prompt text block
 * for the AI model grounding analysis.
 */
export function formatCandidatePromptContext(profile: CandidateProfileContext): string {
  return `
[CANDIDATE CV PROFILE]
Candidate Name: ${profile.name}
Target Title / Focus: ${profile.title}
Base Location: ${profile.location}
Professional Summary: ${profile.summary}

Core Competencies & Skills:
${profile.topSkills.join(', ')}

Key Work Experience Milestones:
${profile.experienceHighlights.join('\n')}

Featured Technical Projects:
${profile.featuredProjects.join('\n')}

Certifications & Industry Credentials:
${profile.certifications.join(', ')}
`.trim();
}
