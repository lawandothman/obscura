import fs from 'node:fs/promises';
import path from 'node:path';

let jwtToken: string | null = null;

const seenDirs = new Set<string>();

async function scanDirectory(dirPath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (dirPath !== 'challenge' && !seenDirs.has(fullPath)) {
        seenDirs.add(fullPath);
      }
      await scanDirectory(fullPath);
    } else {
      if (entry.name === 'README.md') continue;

      try {
        const content = await fs.readFile(fullPath, 'utf-8');

        if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(content.trim())) {
          jwtToken = content.trim();
        }
      } catch {
        // If it's binary or unreadable, just ignore
      }
    }
  }
}

async function findJwtKey() {
  await scanDirectory('challenge');

  if (jwtToken) {
    console.log('Found JWT Token:', jwtToken);
  } else {
    console.log('JWT Token not found in files.');
  }
}

findJwtKey().catch(console.error);
