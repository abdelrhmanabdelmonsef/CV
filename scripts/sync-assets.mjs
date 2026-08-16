import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'apps/web-cv/public');
const legacyDir = join(root, 'legacy');
const targets = [
  { name: 'photo', source: join(legacyDir, 'photo') },
  { name: 'certificates', source: join(legacyDir, 'certificates') },
  {
    name: 'HTB Academy Student Transcript.pdf',
    source: join(legacyDir, 'HTB Academy Student Transcript.pdf')
  }
];

mkdirSync(publicDir, { recursive: true });

for (const target of targets) {
  const destination = join(publicDir, target.name);
  rmSync(destination, { recursive: true, force: true });

  if (!existsSync(target.source)) {
    throw new Error(`Missing legacy asset: ${target.source}`);
  }

  symlinkSync(relative(publicDir, target.source), destination);
}

console.log('Symlinked legacy assets into apps/web-cv/public/');
