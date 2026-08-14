import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cvDataDist = join(root, 'libs/cv-data/dist/index.js');
const outputPdfPath1 = join(root, 'apps/web-cv/public/Abdel_Rahman_Abdelemonsef_resume.pdf');
const outputPdfPath2 = join(root, 'apps/web-cv/public/Abdel_Rahman_Abdelmonsef_resume.pdf');

if (!existsSync(cvDataDist)) {
  console.log('Building cv-data library first...');
  execSync('npm --workspace cv-data run build', { cwd: root, stdio: 'inherit' });
}

// Import cvData
const pkg = await import(cvDataDist);
const cvData = pkg.default?.default || pkg.default || pkg;

// Sanitize & Filter Experience (Explicitly exclude armed forces / military details)
const sanitizedExperience = (cvData.experience || []).filter((exp) => {
  const text = `${exp.role} ${exp.organization} ${(exp.highlights || []).join(' ')}`.toLowerCase();
  return !text.includes('military') && !text.includes('armed forces');
});

// Format HTML Resume
function buildHtmlResume(data) {
  const p = data.personal;
  const c = data.contact || p;

  const emailsStr = [c.email, c.secondaryEmail].filter(Boolean).join(' | ');
  const phonesStr = (c.phones || []).join(' | ');

  const skillCategoriesHtml = (data.skillCategories || [])
    .map(
      (cat) => `
    <div className="skill-group">
      <div className="skill-title">${cat.title}</div>
      <div className="skill-tags">${(cat.tags || []).join(' • ')}</div>
    </div>
  `
    )
    .join('');

  const experienceHtml = sanitizedExperience
    .map(
      (exp) => `
    <div className="item">
      <div className="item-header">
        <span className="item-title">${exp.role} — <span className="org">${exp.organization}</span></span>
        <span className="item-date">${exp.duration}</span>
      </div>
      <ul className="bullets">
        ${(exp.highlights || []).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');

  const projectsHtml = (data.projects || [])
    .map(
      (proj) => `
    <div className="item">
      <div className="item-header">
        <span className="item-title">${proj.title}</span>
        ${proj.link ? `<a class="item-link" href="${proj.link}">${proj.link}</a>` : ''}
      </div>
      <p className="item-desc">${proj.description}</p>
      <div className="item-tags"><strong>Tech Stack:</strong> ${(proj.tags || []).join(', ')}</div>
    </div>
  `
    )
    .join('');

  const educationHtml = (data.education || [])
    .map(
      (edu) => `
    <div className="item">
      <div className="item-header">
        <span className="item-title">${edu.degree}</span>
        <span className="item-date">${edu.duration}</span>
      </div>
      <div className="item-sub">${edu.institution} — <strong>Grade: ${edu.grade}</strong></div>
      <ul className="bullets">
        ${(edu.highlights || []).map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');

  const certsHtml = (data.certifications || [])
    .map((cert) => `<li><strong>${cert.name}</strong> — ${cert.issuer} (${cert.status.toUpperCase()})</li>`)
    .join('');

  const volunteerHtml = (data.volunteer || [])
    .map(
      (vol) => `
    <div className="item-sub-inline">
      <strong>${vol.role}</strong> — ${vol.org} (${vol.period})
    </div>
  `
    )
    .join('');

  const languagesHtml = (data.languages || []).map((l) => `${l.name} (${l.level})`).join(' • ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${p.name} — Resume</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 10.5pt;
      line-height: 1.45;
    }
    a {
      color: #0284c7;
      text-decoration: none;
    }
    .resume-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .name {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .title-line {
      font-size: 11pt;
      font-weight: 600;
      color: #0284c7;
      margin-top: 2px;
      margin-bottom: 6px;
    }
    .contact-bar {
      font-size: 9pt;
      color: #475569;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .contact-item {
      display: inline-block;
    }
    .section {
      margin-bottom: 12px;
    }
    .section-header {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    .summary-text {
      font-size: 9.5pt;
      color: #334155;
      text-align: justify;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
    }
    .skill-group {
      font-size: 9pt;
    }
    .skill-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1px;
    }
    .skill-tags {
      color: #475569;
    }
    .item {
      margin-bottom: 8px;
    }
    .item:last-child {
      margin-bottom: 0;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }
    .org {
      font-weight: 600;
      color: #0284c7;
    }
    .item-date {
      font-size: 8.5pt;
      font-weight: 500;
      color: #64748b;
    }
    .item-sub {
      font-size: 9pt;
      color: #475569;
      margin-top: 1px;
      margin-bottom: 3px;
    }
    .item-desc {
      font-size: 9pt;
      color: #334155;
      margin-top: 2px;
      margin-bottom: 3px;
    }
    .item-tags {
      font-size: 8.5pt;
      color: #64748b;
    }
    .item-link {
      font-size: 8.5pt;
      font-weight: 500;
    }
    ul.bullets {
      margin-left: 16px;
      font-size: 9pt;
      color: #334155;
    }
    ul.bullets li {
      margin-bottom: 2px;
    }
    .cert-list {
      margin-left: 16px;
      font-size: 9pt;
      color: #334155;
    }
    .cert-list li {
      margin-bottom: 3px;
    }
    .item-sub-inline {
      font-size: 9pt;
      color: #334155;
      margin-bottom: 3px;
    }
  </style>
</head>
<body>
  <header className="resume-header">
    <h1 className="name">${p.name}</h1>
    <div className="title-line">${p.title}</div>
    <div className="contact-bar">
      <span className="contact-item"><strong>Location:</strong> ${p.location}</span>
      <span className="contact-item"><strong>Email:</strong> ${emailsStr}</span>
      <span className="contact-item"><strong>Phone:</strong> ${phonesStr}</span>
      <span className="contact-item"><strong>LinkedIn:</strong> <a href="${p.linkedIn}">abdelrhman-abdelmonsef</a></span>
      <span className="contact-item"><strong>GitHub:</strong> <a href="${p.github}">abdelrhmanabdelmonsef</a></span>
      <span className="contact-item"><strong>HTB:</strong> <a href="${p.htb}">@0xMonsef</a> (Pro Rank, 30+ Labs)</span>
      <span className="contact-item"><strong>THM:</strong> <a href="${p.tryHackMe}">@0xTDS</a></span>
    </div>
  </header>

  <section className="section">
    <h2 className="section-header">Professional Summary</h2>
    <p className="summary-text">${data.summary}</p>
  </section>

  <section className="section">
    <h2 className="section-header">Technical Skills Matrix</h2>
    <div className="skills-grid">
      ${skillCategoriesHtml}
    </div>
  </section>

  <section className="section">
    <h2 className="section-header">Professional Experience</h2>
    ${experienceHtml}
  </section>

  <section className="section">
    <h2 className="section-header">Engineering & Security Projects</h2>
    ${projectsHtml}
  </section>

  <section className="section">
    <h2 className="section-header">Education</h2>
    ${educationHtml}
  </section>

  <section className="section">
    <h2 className="section-header">Certifications & Credentials</h2>
    <ul className="cert-list">
      ${certsHtml}
    </ul>
  </section>

  <section className="section">
    <h2 className="section-header">Leadership & Volunteer Experience</h2>
    ${volunteerHtml}
  </section>

  <section className="section" style="margin-bottom: 0;">
    <h2 className="section-header">Languages</h2>
    <p style="font-size: 9pt; color: #334155;">${languagesHtml}</p>
  </section>
</body>
</html>`;
}

// Generate HTML file
const htmlContent = buildHtmlResume(cvData);
const tempHtmlPath = join(root, 'apps/web-cv/public/resume_template.html');
const tempPdfDir = join(root, 'apps/web-cv/public');

mkdirSync(tempPdfDir, { recursive: true });
writeFileSync(tempHtmlPath, htmlContent, 'utf8');

console.log('Compiled HTML resume template.');

// Convert HTML to PDF via system tools if available
let pdfGenerated = false;

try {
  execSync('which libreoffice', { stdio: 'ignore' });
  console.log('Converting HTML to PDF via LibreOffice...');
  execSync(`libreoffice --headless --convert-to pdf "${tempHtmlPath}" --outdir "${tempPdfDir}"`, {
    stdio: 'inherit'
  });

  const generatedPdfPath = join(tempPdfDir, 'resume_template.pdf');
  if (existsSync(generatedPdfPath)) {
    copyFileSync(generatedPdfPath, outputPdfPath1);
    copyFileSync(generatedPdfPath, outputPdfPath2);
    console.log(`[✓] Successfully updated PDF resume assets.`);
    pdfGenerated = true;
  }
} catch {
  // LibreOffice not available in current environment (e.g. Vercel CI)
}

if (!pdfGenerated) {
  if (existsSync(outputPdfPath1) || existsSync(outputPdfPath2)) {
    console.log(`[!] PDF rendering engine (libreoffice) not available in build environment (e.g. Vercel CI). Utilizing pre-compiled PDF resume.`);
  } else {
    console.warn(`[!] Warning: PDF engine not available and no pre-built PDF exists.`);
  }
}
