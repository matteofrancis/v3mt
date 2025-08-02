import fs from 'fs';
import path from 'path';
import Logger from '../../logger/logger.js';

export default function findModSourceDirectory(searchPath = process.cwd(), required: boolean = false) {
  try {
    const items = fs.readdirSync(searchPath);

    for (const item of items) {
      const fullPath = path.join(searchPath, item);

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const metadataPath = path.join(fullPath, '.metadata', 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            return fullPath;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
        continue;
      }
    }

    return null;
  } catch (error: any) {
    if (required) {
      Logger.kill(`Failed to search for metadata directory: ${error?.message}`);
    } else {
      Logger.fail(`Failed to search for metadata directory: ${error?.message}`);
      return null;
    }
  }
}
