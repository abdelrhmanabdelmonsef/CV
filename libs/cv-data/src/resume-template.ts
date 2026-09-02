import type { CvData } from './types';

export const RESUME_PRINT_SCRIPT = `
<script>
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('print') === '1') {
    window.addEventListener('load', () => {
      if (document.fonts) {
        document.fonts.ready.then(() => setTimeout(() => window.print(), 250));
      } else {
        setTimeout(() => window.print(), 350);
      }
    });
  }
</script>`;

export const RESUME_CSS = `
  @page {
    size: A4 portrait;
    margin: 6mm 8mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    background: #0f172a;
    font-size: 7.9pt;
    line-height: 1.25;
    -webkit-font-smoothing: antialiased;
  }
  a {
    color: #1e3a8a;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .resume-shell {
    background: #0f172a;
    min-height: calc(100vh - 50px);
    padding: 24px 12px 40px 12px;
    display: flex;
    justify-content: center;
  }
  .resume-page {
    width: 100%;
    max-width: 210mm;
    min-height: 297mm;
    background: #ffffff;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
    padding: 20px 24px;
    border-radius: 4px;
    margin: 0 auto;
  }
  .resume-header {
    text-align: center;
    margin-bottom: 4px;
  }
  .resume-name {
    font-size: 15.5pt;
    font-weight: 800;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 1px;
    line-height: 1.15;
  }
  .contact-bar {
    font-size: 7.5pt;
    color: #374151;
    line-height: 1.35;
  }
  .contact-bar a {
    color: #1e3a8a;
    font-weight: 500;
  }
  .header-rule {
    border: none;
    border-top: 1.2px solid #93c5fd;
    margin: 3px 0 4px 0;
  }
  .resume-block {
    margin-bottom: 3.5px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .resume-heading {
    font-size: 8.5pt;
    font-weight: 700;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1.2px solid #93c5fd;
    padding-bottom: 0.5px;
    margin-bottom: 2.5px;
  }
  .resume-summary {
    font-size: 7.8pt;
    color: #1f2937;
    text-align: left;
    line-height: 1.28;
  }
  .item {
    margin-bottom: 2.5px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5px;
  }
  .item-left {
    font-size: 8.1pt;
    color: #111827;
  }
  .role-title {
    font-weight: 700;
    color: #111827;
  }
  .org-name {
    font-weight: 600;
    color: #374151;
  }
  .item-badge {
    display: inline-block;
    font-size: 6.8pt;
    font-weight: 600;
    color: #1e3a8a;
    background: #dbeafe;
    padding: 0.2px 4px;
    border-radius: 2px;
    margin-left: 3px;
    vertical-align: middle;
  }
  .date-range {
    font-size: 7.6pt;
    font-weight: 600;
    color: #4b5563;
    white-space: nowrap;
    text-align: right;
  }
  .item-sub {
    font-size: 7.6pt;
    color: #4b5563;
    margin-bottom: 1px;
  }
  ul.bullets {
    margin-left: 13px;
    font-size: 7.7pt;
    color: #1f2937;
  }
  ul.bullets li {
    margin-bottom: 0.5px;
    line-height: 1.24;
  }
  .skills-list {
    font-size: 7.7pt;
    color: #1f2937;
    line-height: 1.26;
  }
  .skills-row {
    margin-bottom: 1px;
  }
  .skills-label {
    font-weight: 700;
    color: #111827;
  }
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 1px;
  }
  @media print {
    @page {
      size: A4 portrait;
      margin: 6mm 8mm;
    }
    nav, .resume-toolbar, #matrix-canvas, .skip-to-content, footer {
      display: none !important;
    }
    html, body {
      background: #ffffff !important;
      color: #111827 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: auto !important;
      min-height: auto !important;
      max-height: none !important;
      overflow: visible !important;
      font-size: 7.8pt !important;
      line-height: 1.25 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .resume-shell {
      padding: 0 !important;
      margin: 0 !important;
      min-height: auto !important;
      height: auto !important;
      background: #ffffff !important;
      display: block !important;
    }
    .resume-page {
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: #ffffff !important;
    }
    .resume-heading, .resume-name, .item-badge {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .resume-block, .item {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  }
`;

function formatLinkedIn(url: string) {
  return url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/').replace(/\/$/, '');
}

function formatGithub(url: string) {
  return url.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/\/$/, '');
}

export function buildResumeBodyHtml(data: CvData): string {
  const p = data.personal;
  const c = data.contact || p;

  const emailsStr = [c.email, c.secondaryEmail].filter(Boolean).join(' \u2022 ');
  const phonesStr = (c.phones || []).join(' \u2022 ');
  const languagesStr = (data.languages || []).map((l) => `${l.name} (${l.level.split('/')[0].trim()})`).join(', ');

  // 1-Page Curated Experience Bullets
  const curatedExperience = [
    {
      role: 'Software Engineer',
      organization: 'Kneraflow (kneraflow.com)',
      duration: 'Sep 2026 – Present',
      highlights: [
        'Architecting full-stack web services and robust backend microservices utilizing Node.js, NestJS, Next.js, and TypeScript.',
        'Designing scalable RESTful APIs, asynchronous worker pipelines (BullMQ/Redis), and automated cloud workflows.'
      ]
    },
    {
      role: 'Full-Stack Developer Intern (AI-Driven)',
      organization: 'Smaww (smaww.net)',
      duration: 'Jun 2026 – Sep 2026',
      highlights: [
        'Contributed to core revamp of Ocean67 fulfillment platform, building scalable backend APIs, async worker queues, and frontend components.',
        'Applied modular TypeScript architectures, secure webhook integrations, and automated testing (~85 tests).'
      ]
    },
    {
      role: 'Penetration Tester Intern',
      organization: 'Hackers For You',
      duration: 'Feb 2024 – May 2024',
      highlights: [
        'Collaborated with senior penetration testers performing comprehensive web application assessments against OWASP Top 10 vulnerabilities.',
        'Executed reconnaissance, vulnerability scanning, and drafted detailed technical remediation reports for engineering teams.'
      ]
    }
  ];

  const experienceHtml = curatedExperience
    .map(
      (exp) => `
    <div class="item">
      <div class="item-header">
        <div class="item-left"><span class="role-title">${exp.role}</span> &bull; <span class="org-name">${exp.organization}</span></div>
        <div class="date-range">${exp.duration}</div>
      </div>
      <ul class="bullets">
        ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  // 1-Page Curated Projects
  const curatedProjects = [
    {
      title: 'Ocean67 Fulfillment Platform',
      badge: 'Smaww Internship',
      linkText: 'Private Project',
      linkUrl: '',
      description: 'Full-stack digital-goods fulfillment platform featuring secure webhook ingestion, async BullMQ workers, RBAC, and PostgreSQL/Redis workflows with ~85 automated tests.',
      techStack: 'TypeScript, NestJS, Next.js, BullMQ, PostgreSQL, Redis, Jest, RBAC'
    },
    {
      title: 'Automated Web Pentest Tool',
      badge: 'Graduation Project',
      linkText: 'github.com/abdelrhmanabdelmonsef/web-app-vuln-scanner',
      linkUrl: 'https://github.com/abdelrhmanabdelmonsef/web-app-vuln-scanner',
      description: 'Automated web penetration testing toolkit performing reconnaissance, service enumeration, vulnerability identification, and structured PDF reporting.',
      techStack: 'Python, Bash, OWASP Top 10, Nmap API, Burp Suite API'
    },
    {
      title: 'Tasks & Notes App',
      badge: '',
      linkText: 'github.com/abdelrhmanabdelmonsef/tasks-notes-app',
      linkUrl: 'https://github.com/abdelrhmanabdelmonsef/tasks-notes-app',
      description: 'Modular NestJS REST API with JWT authentication, role-based access control (RBAC), TypeORM/PostgreSQL persistence, and Next.js frontend scaffold.',
      techStack: 'TypeScript, NestJS, Node.js, PostgreSQL, TypeORM, JWT, Passport, Next.js'
    }
  ];

  const projectsHtml = curatedProjects
    .map(
      (proj) => `
    <div class="item">
      <div class="item-header">
        <div class="item-left">
          <span class="role-title">${proj.title}</span>
          ${proj.badge ? `<span class="item-badge">${proj.badge}</span>` : ''}
        </div>
        <div class="date-range">${proj.linkUrl ? `<a href="${proj.linkUrl}" target="_blank" rel="noreferrer">${proj.linkText}</a>` : proj.linkText}</div>
      </div>
      <ul class="bullets">
        <li>${proj.description}</li>
        <li><strong>Tech Stack:</strong> ${proj.techStack}</li>
      </ul>
    </div>`
    )
    .join('');

  const educationHtml = `
    <div class="item">
      <div class="item-header">
        <div class="item-left"><span class="role-title">Bachelor of Science — Computers &amp; Systems Engineering</span></div>
        <div class="date-range">Oct 2019 – Jun 2024</div>
      </div>
      <div class="item-sub">Al-Azhar University, Faculty of Computers &amp; Systems Engineering &bull; Cairo, Egypt &bull; <strong>Cumulative Grade: Very Good (Grade A Equivalent)</strong></div>
      <ul class="bullets">
        <li>Comprehensive curriculum in software engineering, operating systems, distributed networks, and cybersecurity.</li>
      </ul>
    </div>`;

  return `
    <header class="resume-header">
      <h1 class="resume-name">${p.name}</h1>
      <div class="contact-bar">
        ${p.location} &bull; ${phonesStr} &bull; ${emailsStr}<br>
        <a href="${c.linkedIn}" target="_blank" rel="noreferrer">${formatLinkedIn(c.linkedIn)}</a> &bull;
        <a href="${c.github}" target="_blank" rel="noreferrer">${formatGithub(c.github)}</a>
        ${p.htb ? ` &bull; <a href="${p.htb}" target="_blank" rel="noreferrer">HackTheBox (@0xMonsef)</a>` : ''}
        ${p.tryHackMe ? ` &bull; <a href="${p.tryHackMe}" target="_blank" rel="noreferrer">TryHackMe (@0xTDS)</a>` : ''}
      </div>
    </header>
    <hr class="header-rule">

    <section class="resume-block">
      <h2 class="resume-heading">Professional Summary</h2>
      <p class="resume-summary">Computers &amp; Systems Engineering graduate and Software Engineer at Kneraflow with hands-on experience in full-stack web development (TypeScript, Node.js, NestJS, Next.js) and web application penetration testing. Applies OWASP-aware secure coding practices, microservice architectures, and active training for advanced security credentials.</p>
    </section>

    <section class="resume-block">
      <h2 class="resume-heading">Technical Skills</h2>
      <div class="skills-list">
        <div class="skills-row"><span class="skills-label">Languages &amp; Core:</span> TypeScript, JavaScript (ES6+), Node.js, Python, Bash, SQL, Java</div>
        <div class="skills-row"><span class="skills-label">Frameworks &amp; Web:</span> NestJS, Next.js (App Router), Express.js, React, Tailwind CSS, HTML5/CSS3</div>
        <div class="skills-row"><span class="skills-label">Backend &amp; DevOps:</span> REST APIs, Asynchronous Queues (BullMQ), Redis, PostgreSQL, TypeORM, Docker, Jest, Webhooks, RBAC</div>
        <div class="skills-row"><span class="skills-label">Security &amp; Pentesting:</span> Web App Pentesting, OWASP Top 10, Burp Suite, Nmap, Vulnerability Assessment, Kali Linux, Red Hat Enterprise Linux</div>
      </div>
    </section>

    <section class="resume-block">
      <h2 class="resume-heading">Work Experience</h2>
      ${experienceHtml}
    </section>

    <section class="resume-block">
      <h2 class="resume-heading">Technical Projects</h2>
      ${projectsHtml}
    </section>

    <section class="resume-block">
      <h2 class="resume-heading">Education</h2>
      ${educationHtml}
    </section>

    <div class="bottom-grid">
      <section class="resume-block" style="margin-bottom:0;">
        <h2 class="resume-heading">Certifications &amp; Training</h2>
        <ul class="bullets">
          <li><strong>Red Hat System Administration I (RH124)</strong> &mdash; Red Hat</li>
          <li><strong>Google Cybersecurity Professional Cert</strong> &mdash; Google &amp; Coursera</li>
          <li><strong>McKinsey Forward Program</strong> &mdash; McKinsey &amp; Company</li>
          <li><strong>OSCP &amp; eWAPT (Active Preparation)</strong> &mdash; Offensive Security</li>
        </ul>
      </section>

      <section class="resume-block" style="margin-bottom:0;">
        <h2 class="resume-heading">Languages &amp; Security Labs</h2>
        <ul class="bullets">
          <li><strong>Languages:</strong> ${languagesStr}</li>
          <li><strong>Leadership:</strong> Vice-Head, Cybersecurity Team (GDSC &amp; AZ-SEnCS)</li>
          <li><strong>Hacking Profiles:</strong> HackTheBox Pro Rank (30+ Labs) &bull; TryHackMe</li>
        </ul>
      </section>
    </div>`;
}

export function buildResumeHtml(data: CvData): string {
  const p = data.personal;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} — Resume</title>
  <style>${RESUME_CSS}</style>
</head>
<body>
  <div class="resume-shell">
    <main class="resume-page">
      ${buildResumeBodyHtml(data)}
    </main>
  </div>
  ${RESUME_PRINT_SCRIPT}
</body>
</html>`;
}
