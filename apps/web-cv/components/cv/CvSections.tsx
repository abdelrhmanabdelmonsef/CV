'use client';

import { useEffect } from 'react';
import type { CvData } from 'cv-data';
import { useLightbox } from '../../contexts/LightboxContext';
import ContactForm from '../contact/ContactForm';
import HtbPlatformCard from './HtbPlatformCard';
import {
  BriefcaseIcon,
  CertIcon,
  ClockIcon,
  CodeIcon,
  ContactIcon,
  DocIcon,
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

function CertLinkButton({ url, title, label }: { url: string; title: string; label: string }) {
  const { openLightbox } = useLightbox();
  return (
    <button type="button" className="cert-badge-link" onClick={() => openLightbox(url, title)}>
      <DocIcon />
      {label}
    </button>
  );
}

function LanguageMeters({ languages }: { languages: CvData['languages'] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      languages.forEach((lang) => {
        const bar = document.getElementById(`bar-${lang.id}`);
        if (bar) bar.style.width = `${lang.proficiency}%`;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [languages]);

  return (
    <div className="languages-grid">
      {languages.map((lang) => (
        <div key={lang.id} className="lang-meter-card" id={lang.id}>
          <div className="lang-meta-row">
            <span className="lang-text">{lang.name}</span>
            <span className="lang-metric">{lang.level}</span>
          </div>
          <div className="meter-container">
            <div className="meter-fill" id={`bar-${lang.id}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CvSections({ data }: { data: CvData }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SectionBlock id="summary-section" title="Professional Summary" icon={<MonitorIcon />}>
        <div className="glass-panel summary-card">
          <p style={{ margin: 0 }}>{data.summary}</p>
        </div>
      </SectionBlock>

      <SectionBlock id="learning-highlights-section" title="Learning Highlights" icon={<ClockIcon />}>
        <div className="glass-panel">
          <ul className="bullet-list">
            {data.learningHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </SectionBlock>

      <SectionBlock id="experience-section" title="Work Experience" icon={<BriefcaseIcon />}>
        <div className="glass-panel">
          <div className="timeline-container">
            {data.experience.map((exp) => (
              <div key={exp.id} className="timeline-item" id={exp.id}>
                <div className="timeline-dot" />
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-title">{exp.role}</h3>
                    <h4 className="timeline-subtitle">{exp.organization}</h4>
                    <div className="timeline-meta">
                      <span>🗓️ {exp.duration}</span>
                      {exp.durationMonths && (
                        <>
                          <span className="dot">●</span>
                          <span>{exp.durationMonths}</span>
                        </>
                      )}
                      {exp.status && (
                        <>
                          <span className="dot">●</span>
                          <span className={`timeline-badge${exp.statusVariant === 'green' ? ' green' : ''}`}>{exp.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {exp.certificateUrl && exp.certificateTitle && (
                    <CertLinkButton url={exp.certificateUrl} title={exp.certificateTitle} label="View Cert" />
                  )}
                </div>
                <ul className="bullet-list">
                  {exp.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock id="education-section" title="Education" icon={<EducationIcon />}>
        <div className="glass-panel">
          <div className="timeline-container">
            {data.education.map((edu) => (
              <div key={edu.degree} className="timeline-item" id="edu-card">
                <div className="timeline-dot" />
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-title">{edu.degree}</h3>
                    <h4 className="timeline-subtitle">{edu.institution}</h4>
                    <div className="timeline-meta">
                      <span>🗓️ {edu.duration}</span>
                      <span className="dot">●</span>
                      <span>{edu.location}</span>
                      <span className="dot">●</span>
                      <span style={{ color: 'var(--accent-green)' }}>Grade: {edu.grade}</span>
                    </div>
                  </div>
                  {edu.certificateUrl && edu.certificateTitle && (
                    <CertLinkButton url={edu.certificateUrl} title={edu.certificateTitle} label="View Degree" />
                  )}
                </div>
                <ul className="bullet-list">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock id="projects-section" title="Security Projects" icon={<CodeIcon />}>
        <div className="grid-2">
          {data.projects.map((project) => (
            <div key={project.id} className="glass-panel project-card" id={project.id}>
              <div className="project-header">
                <h3 className="project-title-text">{project.title}</h3>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" className="cert-badge-link">
                    <GitHubSmallIcon />
                    GitHub
                  </a>
                ) : project.isPrivate ? (
                  <span
                    className="cert-badge-link disabled"
                    style={{
                      opacity: 0.65,
                      cursor: 'default',
                      pointerEvents: 'none',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-muted)',
                      background: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    🔒 Private
                  </span>
                ) : null}
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="tag-container">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`tech-tag${project.featuredTags?.includes(tag) ? ' green' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="skills-section" title="Technical Skills & Tools" icon={<SkillsIcon />}>
        <div className="glass-panel skills-grid">
          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="skill-mod" id={cat.id}>
              <h4 className="skill-mod-title">{cat.title}</h4>
              <div className="skill-tag-list">
                {cat.tags.map((tag) => (
                  <span key={tag} className={`skill-mini-tag ${cat.color}`}>
                    {tag}
                  </span>
                ))}
              </div>
              {cat.progress && (
                <div className="skill-progress">
                  {cat.progress.map((p) => (
                    <div key={p.name} className="progress-item">
                      <div className="progress-label">
                        <span>{p.name}</span>
                        <span>{p.label}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${p.width}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="platforms-section" title="Hacking Profiles" icon={<PlatformIcon />}>
        <div className="grid-2">
          {data.platforms.map((platform) =>
            platform.id === 'htb-card' ? (
              <HtbPlatformCard key={platform.id} fallback={platform} />
            ) : (
              <div key={platform.id} className="glass-panel platform-card" id={platform.id}>
                <div className="platform-logo-large">{platform.emoji}</div>
                <h3 className="timeline-title" style={{ fontSize: 15 }}>
                  {platform.name}
                </h3>
                <a href={platform.url} target="_blank" rel="noreferrer" className="platform-username-link">
                  {platform.handle}
                </a>
                {platform.badgeUrl ? (
                  <div className="platform-badge-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={platform.badgeUrl} alt={`${platform.name} Badge for ${platform.handle}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                ) : null}
                {platform.stats && (
                  <div className="telemetry-row" style={{ marginBottom: 12 }}>
                    {platform.stats.map((stat) => (
                      <div key={stat.label} className="telemetry-item">
                        <div className="telemetry-val">{stat.value}</div>
                        <div className="telemetry-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                  <a href={platform.url} target="_blank" rel="noreferrer" className="cert-badge-link">
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

      <SectionBlock id="certs-section" title="Certifications & Training" icon={<CertIcon />}>
        <div className="glass-panel certifications-list">
          {data.certifications.map((cert, index) => (
            <div key={cert.id} className="cert-row" id={cert.id}>
              <div className="cert-row-left">
                <div className="cert-id">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <div className="cert-details-name">{cert.name}</div>
                  <div className="cert-details-issuer">{cert.issuer}</div>
                </div>
              </div>
              {cert.status === 'verified' && cert.documents && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {cert.documents.map((doc) => (
                    <CertLinkButton key={doc.url} url={doc.url} title={doc.title} label={doc.label} />
                  ))}
                </div>
              )}
              {cert.status === 'completed' && (
                <span className="cert-status-badge completed">Completed</span>
              )}
              {cert.status === 'in_progress' && (
                <span className="cert-status-badge in_progress">⏳ In Progress</span>
              )}
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="volunteer-section" title="Volunteer & Leadership" icon={<VolunteerIcon />}>
        <div className="glass-panel volunteer-list">
          {data.volunteer.map((item) => (
            <div key={item.id} className="volunteer-item" id={item.id}>
              <div className="volunteer-icon">{item.icon}</div>
              <div>
                <h4 className="volunteer-role">{item.role}</h4>
                <div className="volunteer-org">
                  {item.org} <span style={{ color: 'var(--text-muted)' }}>| {item.period}</span>
                </div>
                <p className="volunteer-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="languages-section" title="Languages" icon={<LanguageIcon />}>
        <LanguageMeters languages={data.languages} />
      </SectionBlock>

      <SectionBlock id="contact-section" title="Contact" icon={<ContactIcon />}>
        <div className="glass-panel contact-section">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Email:{' '}
            <a href={`mailto:${data.contact.email}`} style={{ color: 'var(--accent-green)' }}>
              {data.contact.email}
            </a>
            {data.contact.secondaryEmail && (
              <>
                {' / '}
                <a href={`mailto:${data.contact.secondaryEmail}`} style={{ color: 'var(--accent-green)' }}>
                  {data.contact.secondaryEmail}
                </a>
              </>
            )}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Phone: {data.contact.phones.join(' / ')}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Location: {data.contact.location}</p>
          <ContactForm />
        </div>
      </SectionBlock>
    </>
  );
}
