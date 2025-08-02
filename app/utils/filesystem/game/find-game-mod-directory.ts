import fs from 'fs';
import path from 'path';
import os from 'os';
import Logger from '../../logger/logger.js';

export default function findGameModDirectory() {
  const userHome = os.homedir();
  const modBasePath = path.join(userHome, 'Documents', 'Paradox Interactive', 'Victoria 3', 'mod');

  if (!fs.existsSync(modBasePath)) {
    Logger.warn(`Victoria 3 mod directory not found in the expected location: ${modBasePath}`);
    return null;
  }
  return path.normalize(modBasePath);
}
