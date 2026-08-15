import type { CvData } from './types';

export const RESUME_PRINT_SCRIPT = `
<script>
  if (new URLSearchParams(location.search).get('print') === '1') {
    window.addEventListener('load', () => {
      document.fonts.ready.then(() => setTimeout(() => window.print(), 200));
    });
  }
</script>`;

export const RESUME_CSS = `
  @page { size: A4; margin: 8mm 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Liberation Sans", "DejaVu Sans", Arial, sans-serif;
    color: #1a1a1a;
    background: #ffffff;
    font-size: 8.8pt;
    line-height: 1.32;
  }
  a { color: #1a1a1a; text-decoration: none; }
  .resume-name {
    font-size: 19pt;
    font-weight: 700;
    color: #6728b8;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: center;
    margin-bottom: 3px;
  }
  .contact-bar {
    font-size: 8pt;
    color: #333333;
    text-align: center;
    line-height: 1.45;
    margin-bottom: 1px;
  }
  .header-rule {
    border: none;
    border-top: 1.5px solid #c4a0f0;
    margin: 6px 0 8px 0;
  }
  .resume-block { margin-bottom: 7px; }
  .resume-heading {
    font-size: 9.5pt;
    font-weight: 700;
    color: #6728b8;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    border-bottom: 1.5px solid #c4a0f0;
    padding-bottom: 1px;
    margin-bottom: 4px;
  }
  .resume-summary {
    font-size: 8.5pt;
    color: #1a1a1a;
    text-align: justify;
    line-height: 1.38;
  }
  table.row-table { width: 100%; border-collapse: collapse; margin-bottom: 0px; }
  td.row-left { text-align: left; vertical-align: top; width: 70%; }
  td.row-right { text-align: right; vertical-align: top; width: 30%; white-space: nowrap; }
  .role-org { font-weight: 700; font-size: 8.8pt; color: #1a1a1a; }
  .date-range { font-weight: 700; font-size: 8.5pt; color: #1a1a1a; }
  .item { margin-bottom: 5px; }
  .item-sub { font-size: 8pt; color: #444444; margin: 0px 0 1px 0; }
  ul.bullets { margin-left: 14px; font-size: 8pt; color: #1a1a1a; }
  ul.bullets li { margin-bottom: 1px; line-height: 1.3; }
  ul.additional-list { list-style: disc; margin-left: 14px; font-size: 8pt; color: #1a1a1a; }
  ul.additional-list li { margin-bottom: 2px; line-height: 1.35; }
  ul.additional-list strong { color: #1a1a1a; }
  .resume-shell {
    background: #ffffff;
    min-height: 100vh;
    padding: 24px 16px;
  }
  .resume-page {
    max-width: 210mm;
    margin: 0 auto;
    background: #ffffff;
  }
  @media print {
    html, body {
      background: #ffffff !important;
      color: #1a1a1a !important;
      margin: 0 !important;
      padding: 0 !important;
      font-size: 8.8pt !important;
    }
    body::before, body::after {
      display: none !important;
      content: none !important;
    }
    .resume-shell {
      padding: 0 !important;
      min-height: auto !important;
    }
    .resume-page {
      max-width: 100% !important;
      margin: 0 !important;
    }
    .resume-heading, .resume-name {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .resume-block, .item {
      page-break-inside: avoid;
    }
  }
`;

function sanitizeExperience(experience: CvData['experience']) {
  return (experience || []).filter((exp) => {
    const text = `${exp.role} ${exp.organization} ${(exp.highlights || []).join(' ')}`.toLowerCase();
    return !text.includes('military') && !text.includes('armed forces');
  });
}

function itemRow(left: string, right: string) {
  return `<table class="row-table"><tr><td class="row-left">${left}</td><td class="row-right">${right}</td></tr></table>`;
}

function formatLinkedIn(url: string) {
  return url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/').replace(/\/$/, '');
}

function formatGithub(url: string) {
  return url.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/\/$/, '');
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

export function buildResumeBodyHtml(data: CvData): string {
  const p = data.personal;
  const c = data.contact || p;
  const resume = data.resume;

  const emailsStr = [c.email, c.secondaryEmail].filter(Boolean).join(' \u2022 ');
  const phonesStr = (c.phones || []).join(' \u2022 ');

  const certsGrouped = truncateText(
    (data.certifications || [])
      .map((cert) => `${cert.name} (${cert.issuer.split('\u2014')[0].trim().replace(/&/g, '&amp;')})`)
      .join('; '),
    400
  );

  const volunteerGrouped = (data.volunteer || [])
    .map((vol) => `${vol.role} at ${vol.org.split('\u2014')[0].trim()} (${vol.period})`)
    .join('; ');

  const languagesStr = (data.languages || []).map((l) => `${l.name} (${l.level})`).join(', ');
  const skillsStr = resume.skills.join(', ');
  const platformSuffix = resume.platformLine ? ` &bull; ${resume.platformLine}` : '';

  const experienceHtml = sanitizeExperience(data.experience)
    .map(
      (exp) => `
    <div class="item">
      ${itemRow(`<span class="role-org">${exp.role} , ${exp.organization}</span>`, `<span class="date-range">${exp.duration}</span>`)}
      <ul class="bullets">
        ${(exp.highlights || []).slice(0, 3).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  const projectsHtml = (data.projects || [])
    .map(
      (proj) => `
    <div class="item">
      ${itemRow(
        `<span class="role-org">${proj.title.replace(/^[^a-zA-Z0-9]+/, '')}</span>`,
        `<span class="date-range">${proj.link ? proj.link.replace('https://', '') : 'Private Repository'}</span>`
      )}
      <ul class="bullets"><li><strong>Tech Stack:</strong> ${(proj.tags || []).join(', ')}</li></ul>
    </div>`
    )
    .join('');

  const educationHtml = (data.education || [])
    .map(
      (edu) => `
    <div class="item">
      ${itemRow(`<span class="role-org">${edu.degree}</span>`, `<span class="date-range">${edu.duration}</span>`)}
      <div class="item-sub">${edu.institution} \u2014 <strong>Grade: ${edu.grade}</strong></div>
      <ul class="bullets">
        ${(edu.highlights || []).slice(0, 1).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  return `
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    <tbody><tr><td style="border:2.5px solid #1a1a1a; padding:12px 16px; vertical-align:top;">

    <div class="resume-name">${p.name}</div>
    <div class="contact-bar">
      ${p.location} &bull; ${phonesStr}<br>
      ${emailsStr}<br>
      ${formatLinkedIn(c.linkedIn)} &bull; ${formatGithub(c.github)}
    </div>
    <hr class="header-rule">

    <div class="resume-block">
      <div class="resume-heading">Summary</div>
      <p class="resume-summary">${resume.summary}</p>
    </div>

    <div class="resume-block">
      <div class="resume-heading">Work Experience</div>
      ${experienceHtml}
    </div>

    <div class="resume-block">
      <div class="resume-heading">Projects &amp; Engineering Builds</div>
      ${projectsHtml}
    </div>

    <div class="resume-block">
      <div class="resume-heading">Education</div>
      ${educationHtml}
    </div>

    <div class="resume-block" style="margin-bottom:0;">
      <div class="resume-heading">Additional Information</div>
      <ul class="additional-list">
        <li><strong>Technical Skills:</strong> ${skillsStr}</li>
        <li><strong>Languages:</strong> ${languagesStr}</li>
        <li><strong>Certifications:</strong> ${certsGrouped}</li>
        <li><strong>Leadership &amp; Activities:</strong> ${volunteerGrouped}${platformSuffix}</li>
      </ul>
    </div>

    </td></tr></tbody>
  </table>`;
}

export function buildResumeHtml(data: CvData): string {
  const p = data.personal;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${p.name} \u2014 Resume</title>
  <style>${RESUME_CSS}</style>
</head>
<body>
  ${buildResumeBodyHtml(data)}
  ${RESUME_PRINT_SCRIPT}
</body>
</html>`;
}
