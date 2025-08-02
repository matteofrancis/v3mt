import fs from 'fs';
import path from 'path';

export default function findMetadataFiles(dir = process.cwd()) {
  const metadataFiles: string[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        const metadataPath = path.join(filePath, '.metadata', 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          metadataFiles.push(metadataPath);
        }
      }
    }
  } catch {}

  return metadataFiles;
}
