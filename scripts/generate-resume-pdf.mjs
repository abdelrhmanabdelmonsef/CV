import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
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

const pkg = await import(cvDataDist);
const cvData = pkg.default?.default || pkg.default || pkg;
const buildResumeHtml = pkg.buildResumeHtml;

const htmlContent = buildResumeHtml(cvData);
const tempHtmlPath = join(root, 'apps/web-cv/public/resume_template.html');
const tempPdfDir = join(root, 'apps/web-cv/public');

mkdirSync(tempPdfDir, { recursive: true });
writeFileSync(tempHtmlPath, htmlContent, 'utf8');

console.log('Compiled HTML resume template.');

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
    console.log('[✓] Successfully updated PDF resume assets.');
    pdfGenerated = true;
  }
} catch {
  // LibreOffice not available in current environment (e.g. Vercel CI)
}

if (!pdfGenerated) {
  if (existsSync(outputPdfPath1) || existsSync(outputPdfPath2)) {
    console.log(
      '[!] PDF rendering engine (libreoffice) not available in build environment (e.g. Vercel CI). Utilizing pre-compiled PDF resume.'
    );
  } else {
    console.warn('[!] Warning: PDF engine not available and no pre-built PDF exists.');
  }
}
