'use client';

import { useEffect, useRef, useState } from 'react';
import type { CvData } from 'cv-data';
import ContactForm from '../contact/ContactForm';
import HtbPlatformCard from './HtbPlatformCard';
import {
  BriefcaseIcon,
  CertIcon,
  ClockIcon,
  CodeIcon,
  ContactIcon,
  EducationIcon,
  ExternalIcon,
  GitHubSmallIcon,
  LanguageIcon,
  MonitorIcon,
  PlatformIcon,
  SectionBlock,
  SkillsIcon,
  VolunteerIcon
} from '../layout/Section';
import CertLinkButton from '../ui/CertLinkButton';

/* ── Language Meters ── */
function LanguageMeters({ languages }: { languages: CvData['languages'] }) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {languages.map((lang) => (
        <div
          key={lang.id}
          id={lang.id}
          className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-4
            hover:border-border-green/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">{lang.name}</span>
            <span className="text-xs text-accent-green font-mono">{lang.level}</span>
          </div>
          <div className="h-2 rounded-full bg-bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-1000 ease-out"
              style={{ width: animate ? `${lang.proficiency}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Skill Color Map ── */
const SKILL_COLORS: Record<string, { tag: string; border: string }> = {
  green: { tag: 'bg-accent-green/10 text-accent-green border-accent-green/20', border: 'border-accent-green/20' },
  blue: { tag: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20', border: 'border-accent-cyan/20' },
  purple: { tag: 'bg-purple-500/10 text-purple-400 border-purple-500/20', border: 'border-purple-500/20' },
  gray: { tag: 'bg-white/5 text-text-secondary border-white/10', border: 'border-white/10' },
};

/* ── Progress Bars with scroll trigger ── */
function SkillProgressBars({ progress }: { progress: NonNullable<CvData['skillCategories'][0]['progress']> }) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-3 space-y-2">
      {progress.map((p) => (
        <div key={p.name}>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-text-secondary">{p.name}</span>
            <span className="text-text-muted font-mono">{p.label}</span>
          </div>
          <div className="h-1.5 rounded-full bg-bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-1000 ease-out"
              style={{ width: animate ? `${p.width}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main CvSections ── */
export default function CvSections({ data }: { data: CvData }) {
  return (
    <>
      {/* ── SUMMARY ── */}
      <SectionBlock id="summary-section" title="Professional Summary" icon={<MonitorIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <p className="text-sm sm:text-[15px] text-text-secondary leading-relaxed">{data.summary}</p>
        </div>
      </SectionBlock>

      {/* ── EXPERIENCE ── */}
      <SectionBlock id="experience-section" title="Work Experience" icon={<BriefcaseIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <div className="relative pl-6 border-l-2 border-accent-green/20 space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id} id={exp.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-accent-green bg-bg-primary
                  group-hover:shadow-[0_0_12px_rgba(0,255,136,0.4)] transition-shadow duration-300" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{exp.role}</h3>
                    <h4 className="text-sm text-accent-cyan font-medium">{exp.organization}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-muted">
                      <span>🗓️ {exp.duration}</span>
                      {exp.durationMonths && (
                        <>
                          <span className="text-border-subtle">●</span>
                          <span>{exp.durationMonths}</span>
                        </>
                      )}
                      {exp.status && (
                        <>
                          <span className="text-border-subtle">●</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            exp.statusVariant === 'green'
                              ? 'bg-accent-green/10 text-accent-green'
                              : 'bg-accent-amber/10 text-accent-amber'
                          }`}>
                            {exp.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {exp.certificateUrl && exp.certificateTitle && (
                    <CertLinkButton url={exp.certificateUrl} title={exp.certificateTitle} label="View Cert" />
                  )}
                </div>

                <ul className="space-y-1.5 mt-3">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-text-muted shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      {/* ── PROJECTS ── */}
      <SectionBlock id="projects-section" title="Featured Projects & Systems" icon={<CodeIcon />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.projects.map((project) => (
            <div
              key={project.id}
              id={project.id}
              className="relative rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 overflow-hidden
                hover:border-accent-green/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.08)]
                transition-all duration-300 group"
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-green via-accent-cyan to-transparent
                opacity-40 group-hover:opacity-80 transition-opacity duration-300" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-text-primary">{project.title}</h3>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider
                      bg-accent-green/10 text-accent-green border border-accent-green/20
                      hover:bg-accent-green/20 hover:shadow-[0_0_10px_rgba(0,255,136,0.15)] transition-all duration-200 shrink-0"
                  >
                    <GitHubSmallIcon />
                    GitHub
                  </a>
                ) : project.isPrivate ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider
                    bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shrink-0">
                    🚀 Production Platform
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                      project.featuredTags?.includes(tag)
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                        : 'bg-white/5 text-text-muted border-white/8'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── SKILLS ── */}
      <SectionBlock id="skills-section" title="Technical Skills & Tools" icon={<SkillsIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.skillCategories.map((cat) => {
              const colors = SKILL_COLORS[cat.color] || SKILL_COLORS.gray;
              return (
                <div key={cat.id} id={cat.id} className={`p-4 rounded-lg border ${colors.border} bg-bg-secondary/30`}>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">{cat.title}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${colors.tag}
                          hover:opacity-80 transition-opacity duration-150`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {cat.progress && <SkillProgressBars progress={cat.progress} />}
                </div>
              );
            })}
          </div>
        </div>
      </SectionBlock>

      {/* ── CORE ARCHITECTURAL COMPETENCIES ── */}
      <SectionBlock id="learning-highlights-section" title="Core Engineering Competencies" icon={<ClockIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <ul className="space-y-2.5">
            {data.learningHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-green shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </SectionBlock>

      {/* ── EDUCATION ── */}
      <SectionBlock id="education-section" title="Education" icon={<EducationIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <div className="relative pl-6 border-l-2 border-accent-cyan/20 space-y-8">
            {data.education.map((edu) => (
              <div key={edu.degree} id="edu-card" className="relative group">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-accent-cyan bg-bg-primary
                  group-hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-shadow duration-300" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{edu.degree}</h3>
                    <h4 className="text-sm text-accent-cyan font-medium">{edu.institution}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-muted">
                      <span>🗓️ {edu.duration}</span>
                      <span className="text-border-subtle">●</span>
                      <span>{edu.location}</span>
                      <span className="text-border-subtle">●</span>
                      <span className="text-accent-green font-semibold">Grade: {edu.grade}</span>
                    </div>
                  </div>
                  {edu.certificateUrl && edu.certificateTitle && (
                    <CertLinkButton url={edu.certificateUrl} title={edu.certificateTitle} label="View Degree" />
                  )}
                </div>

                <ul className="space-y-1.5 mt-3">
                  {edu.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-text-muted shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      {/* ── PLATFORMS ── */}
      <SectionBlock id="platforms-section" title="Security Labs & Technical Profiles" icon={<PlatformIcon />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.platforms.map((platform) =>
            platform.id === 'htb-card' ? (
              <HtbPlatformCard key={platform.id} fallback={platform} />
            ) : (
              <div
                key={platform.id}
                id={platform.id}
                className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5
                  flex flex-col items-center text-center
                  hover:border-border-cyan/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] transition-all duration-300"
              >
                <div className="text-3xl mb-2">{platform.emoji}</div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{platform.name}</h3>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent-cyan hover:text-accent-green transition-colors font-mono mb-3"
                >
                  {platform.handle}
                </a>

                {platform.badgeUrl && (
                  <div className="mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={platform.badgeUrl}
                      alt={`${platform.name} Badge for ${platform.handle}`}
                      className="max-h-16"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                {platform.stats && (
                  <div className="flex items-center gap-6 mb-4">
                    {platform.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-lg font-bold text-accent-green font-mono">{stat.value}</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center w-full">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold
                      bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20
                      hover:bg-accent-cyan/20 hover:shadow-[0_0_10px_rgba(0,229,255,0.15)] transition-all duration-200"
                  >
                    <ExternalIcon />
                    Live {platform.name} Profile
                  </a>
                  {platform.transcriptUrl && platform.transcriptTitle && (
                    <CertLinkButton url={platform.transcriptUrl} title={platform.transcriptTitle} label="Academy Transcript" />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </SectionBlock>

      {/* ── CERTIFICATIONS ── */}
      <SectionBlock id="certs-section" title="Certifications & Training" icon={<CertIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm divide-y divide-border-subtle">
          {data.certifications.map((cert, index) => (
            <div key={cert.id} id={cert.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5
              hover:bg-bg-card-hover transition-colors duration-200">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-text-muted mt-0.5 shrink-0 w-6 text-right">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{cert.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{cert.issuer}</div>
                </div>
              </div>

              {cert.status === 'verified' && cert.documents && (
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                  {cert.documents.map((doc) => (
                    <CertLinkButton key={doc.url} url={doc.url} title={doc.title} label={doc.label} />
                  ))}
                </div>
              )}
              {cert.status === 'completed' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider
                  bg-accent-green/10 text-accent-green border border-accent-green/20 shrink-0">
                  ✓ Completed
                </span>
              )}
              {cert.status === 'in_progress' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider
                  bg-accent-amber/10 text-accent-amber border border-accent-amber/20 shrink-0">
                  ⏳ In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── VOLUNTEER ── */}
      <SectionBlock id="volunteer-section" title="Volunteer & Leadership" icon={<VolunteerIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm divide-y divide-border-subtle">
          {data.volunteer.map((item) => (
            <div key={item.id} id={item.id} className="flex items-start gap-4 p-4 sm:p-5
              hover:bg-bg-card-hover transition-colors duration-200">
              <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-text-primary">{item.role}</h4>
                <div className="text-xs text-text-muted mt-0.5">
                  {item.org} <span className="text-border-subtle">|</span> {item.period}
                </div>
                <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── LANGUAGES ── */}
      <SectionBlock id="languages-section" title="Languages" icon={<LanguageIcon />}>
        <LanguageMeters languages={data.languages} />
      </SectionBlock>

      {/* ── CONTACT ── */}
      <SectionBlock id="contact-section" title="Contact" icon={<ContactIcon />}>
        <div className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
          <div className="space-y-1.5 mb-6">
            <p className="text-sm text-text-secondary">
              Email:{' '}
              <a href={`mailto:${data.contact.email}`} className="text-accent-green hover:underline">
                {data.contact.email}
              </a>
              {data.contact.secondaryEmail && (
                <>
                  {' / '}
                  <a href={`mailto:${data.contact.secondaryEmail}`} className="text-accent-green hover:underline">
                    {data.contact.secondaryEmail}
                  </a>
                </>
              )}
            </p>
            <p className="text-sm text-text-secondary">
              Phone: {data.contact.phones.join(' / ')}
            </p>
            <p className="text-sm text-text-secondary">
              Location: {data.contact.location}
            </p>
          </div>
          <ContactForm />
        </div>
      </SectionBlock>
    </>
  );
}
