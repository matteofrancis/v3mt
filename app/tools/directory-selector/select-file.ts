import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import getOSCommands from '../../utils/os_commands/get-command.js';
import Logger from '../../utils/logger/logger.js';

export default function selectFile(initialPath?: string, required: boolean = false) {
  try {
    const commands = getOSCommands();
    const command = commands.file(initialPath);

    const result = execSync(command, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr to avoid noise
    }).trim();

    if (result && fs.existsSync(result)) {
      return path.normalize(result);
    }

    return null;
  } catch (error: any) {
    if (required) {
      Logger.kill(`Failed to open file dialog: ${error?.message}`);
    } else {
      Logger.fail(`Failed to open file dialog: ${error?.message}`);
      return null;
    }
  }
}
