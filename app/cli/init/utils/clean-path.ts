import fs from 'fs';
import path from 'path';

export function cleanPath(dirPath: string): string {
  const normalizedPath = path.resolve(dirPath);

  if (!fs.existsSync(normalizedPath)) {
    console.error(`Directory does not exist: ${normalizedPath}`);
    process.exit(1);
  }

  return normalizedPath;
}
