import fs from 'fs';
import path from 'path';
import Logger from '../../../utils/logger/logger.js';

export function cleanPath(dirPath: string): string {
  const normalizedPath = path.resolve(dirPath);

  if (!fs.existsSync(normalizedPath)) {
    Logger.kill(`Directory does not exist: ${normalizedPath}`);
  }

  return normalizedPath;
}
