import fs from 'fs';
import path from 'path';
import os from 'os';
import Logger from '../../logger/logger.js';

export default function findErrorLog() {
  const userHome = os.homedir();
  const errorLogPath = path.join(userHome, 'Documents', 'Paradox Interactive', 'Victoria 3', 'logs', 'error.log');

  if (fs.existsSync(errorLogPath)) {
    return errorLogPath;
  }

  Logger.warn(`Victoria 3 error log not found in the expected location: ${errorLogPath}`);
  return null;
}
