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
    size: A4;
    margin: 9mm 11mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1a1a1a;
    background: #06090e;
    font-size: 8.6pt;
    line-height: 1.32;
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
    background: transparent;
    min-height: calc(100vh - 54px);
    padding: 24px 16px 60px 16px;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 10;
  }
  .resume-page {
    width: 100%;
    max-width: 210mm;
    background: #ffffff;
    box-shadow: 0 0 50px rgba(0, 255, 136, 0.08), 0 20px 50px rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 229, 255, 0.18);
    padding: 24px 28px;
    border-radius: 4px;
    position: relative;
  }
  .resume-header {
    text-align: center;
    margin-bottom: 6px;
  }
  .resume-name {
    font-size: 17.5pt;
    font-weight: 700;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }
  .contact-bar {
    font-size: 7.9pt;
    color: #374151;
    line-height: 1.4;
  }
  .contact-bar a {
    color: #1e3a8a;
    font-weight: 500;
  }
  .header-rule {
    border: none;
    border-top: 1.5px solid #93c5fd;
    margin: 5px 0 6px 0;
  }
  .resume-block {
    margin-bottom: 6px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .resume-heading {
    font-size: 9.2pt;
    font-weight: 700;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid #93c5fd;
    padding-bottom: 1px;
    margin-bottom: 4px;
  }
  .resume-summary {
    font-size: 8.3pt;
    color: #1f2937;
    text-align: left;
    line-height: 1.35;
  }
  .item {
    margin-bottom: 4.5px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1px;
  }
  .item-left {
    font-size: 8.6pt;
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
    font-size: 7.2pt;
    font-weight: 600;
    color: #1e3a8a;
    background: #dbeafe;
    padding: 0.5px 5px;
    border-radius: 3px;
    margin-left: 4px;
    vertical-align: middle;
  }
  .date-range {
    font-size: 8pt;
    font-weight: 600;
    color: #4b5563;
    white-space: nowrap;
    text-align: right;
  }
  .item-sub {
    font-size: 8pt;
    color: #4b5563;
    margin-bottom: 1.5px;
  }
  ul.bullets {
    margin-left: 14px;
    font-size: 8.1pt;
    color: #1f2937;
  }
  ul.bullets li {
    margin-bottom: 1px;
    line-height: 1.3;
  }
  .skills-list {
    font-size: 8.1pt;
    color: #1f2937;
    line-height: 1.38;
  }
  .skills-row {
    margin-bottom: 1.5px;
  }
  .skills-label {
    font-weight: 700;
    color: #111827;
  }
  @media print {
    @page {
      size: A4 portrait;
      margin: 4mm 6mm;
    }
    nav, .resume-toolbar, #matrix-canvas, .skip-to-content, footer {
      display: none !important;
    }
    html, body {
      background: #ffffff !important;
      color: #111827 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-size: 7.7pt !important;
      line-height: 1.22 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .resume-shell {
      padding: 0 !important;
      margin: 0 !important;
      min-height: auto !important;
      background: #ffffff !important;
      display: block !important;
    }
    .resume-page {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: #ffffff !important;
    }
    .resume-header {
      margin-bottom: 2px !important;
    }
    .resume-name {
      font-size: 14pt !important;
      line-height: 1.1 !important;
      margin-bottom: 1px !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .contact-bar {
      font-size: 7.2pt !important;
      line-height: 1.28 !important;
    }
    .header-rule {
      margin: 2px 0 2.5px 0 !important;
      border-top: 1px solid #93c5fd !important;
    }
    .resume-block {
      margin-bottom: 2.2px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .resume-heading {
      font-size: 8.1pt !important;
      font-weight: 700 !important;
      border-bottom: 1px solid #93c5fd !important;
      padding-bottom: 0.2px !important;
      margin-bottom: 1.5px !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .resume-summary {
      font-size: 7.4pt !important;
      line-height: 1.22 !important;
    }
    .item {
      margin-bottom: 1.5px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .item-header {
      margin-bottom: 0.2px !important;
    }
    .item-left, .role-title, .org-name {
      font-size: 7.7pt !important;
    }
    .date-range {
      font-size: 7.2pt !important;
    }
    .item-sub {
      font-size: 7.2pt !important;
      margin-bottom: 0.2px !important;
    }
    .item-badge {
      font-size: 6.4pt !important;
      padding: 0.2px 3px !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    ul.bullets {
      margin-left: 11px !important;
      font-size: 7.4pt !important;
    }
    ul.bullets li {
      margin-bottom: 0.2px !important;
      line-height: 1.2 !important;
    }
    .skills-list {
      font-size: 7.4pt !important;
      line-height: 1.22 !important;
    }
    .skills-row {
      margin-bottom: 0.5px !important;
    }
  }
`;

function sanitizeExperience(experience: CvData['experience']) {
  return (experience || []).filter((exp) => {
    const text = `${exp.role} ${exp.organization} ${(exp.highlights || []).join(' ')}`.toLowerCase();
    return !text.includes('military') && !text.includes('armed forces');
  });
}

function formatLinkedIn(url: string) {
  return url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/').replace(/\/$/, '');
}

function formatGithub(url: string) {
  return url.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/\/$/, '');
}

export function buildResumeBodyHtml(data: CvData): string {
  const p = data.personal;
  const c = data.contact || p;
  const resume = data.resume;

  const emailsStr = [c.email, c.secondaryEmail].filter(Boolean).join(' \u2022 ');
  const phonesStr = (c.phones || []).join(' \u2022 ');

  const volunteerGrouped = (data.volunteer || [])
    .map((vol) => `${vol.role} (${vol.org.split('\u2014')[0].trim()})`)
    .join('; ');

  const languagesStr = (data.languages || []).map((l) => `${l.name} (${l.level})`).join(', ');

  const experienceHtml = sanitizeExperience(data.experience)
    .map(
      (exp) => `
    <div class="item">
      <div class="item-header">
        <div class="item-left"><span class="role-title">${exp.role}</span> &bull; <span class="org-name">${exp.organization}</span></div>
        <div class="date-range">${exp.duration}</div>
      </div>
      <ul class="bullets">
        ${(exp.highlights || []).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  const projectsHtml = (data.projects || [])
    .map(
      (proj) => `
    <div class="item">
      <div class="item-header">
        <div class="item-left">
          <span class="role-title">${proj.title.replace(/^[^a-zA-Z0-9]+/, '').trim()}</span>
          ${proj.associatedWith ? `<span class="item-badge">${proj.associatedWith}</span>` : ''}
        </div>
        <div class="date-range">${proj.link ? `<a href="${proj.link}" target="_blank" rel="noreferrer">${formatGithub(proj.link)}</a>` : 'Private Project'}</div>
      </div>
      <ul class="bullets">
        <li>${proj.description}</li>
        <li><strong>Tech Stack:</strong> ${(proj.tags || []).join(', ')}</li>
      </ul>
    </div>`
    )
    .join('');

  const educationHtml = (data.education || [])
    .map(
      (edu) => `
    <div class="item">
      <div class="item-header">
        <div class="item-left"><span class="role-title">${edu.degree}</span></div>
        <div class="date-range">${edu.duration}</div>
      </div>
      <div class="item-sub">${edu.institution} &bull; <strong>Grade: ${edu.grade}</strong></div>
      <ul class="bullets">
        ${(edu.highlights || []).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  return `
    <header class="resume-header">
      <h1 class="resume-name">${p.name}</h1>
      <div class="contact-bar">
        ${p.location} &bull; ${phonesStr}<br>
        ${emailsStr}<br>
        <a href="${c.linkedIn}" target="_blank" rel="noreferrer">${formatLinkedIn(c.linkedIn)}</a> &bull;
        <a href="${c.github}" target="_blank" rel="noreferrer">${formatGithub(c.github)}</a>
        ${p.htb ? ` &bull; <a href="${p.htb}" target="_blank" rel="noreferrer">HackTheBox (@0xMonsef)</a>` : ''}
        ${p.tryHackMe ? ` &bull; <a href="${p.tryHackMe}" target="_blank" rel="noreferrer">TryHackMe (@0xTDS)</a>` : ''}
      </div>
    </header>
    <hr class="header-rule">

    <section class="resume-block">
      <h2 class="resume-heading">Professional Summary</h2>
      <p class="resume-summary">${resume.summary}</p>
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

    <section class="resume-block">
      <h2 class="resume-heading">Certifications &amp; Training</h2>
      <ul class="bullets">
        <li><strong>Red Hat System Administration I (RH124)</strong> &mdash; Red Hat Inc.</li>
        <li><strong>Google Cybersecurity Professional Certificate</strong> &mdash; Google &amp; Coursera (Risk Management, Linux &amp; SQL, Network Security)</li>
        <li><strong>McKinsey Forward Program</strong> &mdash; McKinsey &amp; Company (Adaptability &amp; Problem Solving)</li>
        <li><strong>OSCP &amp; eWAPT (Active Training)</strong> &mdash; Offensive Security &amp; eLearnSecurity</li>
        <li><strong>HackTheBox Academy Student Transcript</strong> &mdash; HackTheBox Academy</li>
      </ul>
    </section>

    <section class="resume-block" style="margin-bottom:0;">
      <h2 class="resume-heading">Languages &amp; Activities</h2>
      <ul class="bullets">
        <li><strong>Languages:</strong> ${languagesStr}</li>
        <li><strong>Leadership:</strong> ${volunteerGrouped}</li>
        <li><strong>Security Labs:</strong> ${resume.platformLine || 'HackTheBox Pro Rank (30+ Labs) \u2022 TryHackMe (@0xTDS)'}</li>
      </ul>
    </section>`;
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
