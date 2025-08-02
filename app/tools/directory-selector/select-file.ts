import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import getOSCommands from '../../utils/os_commands/get-command.js';

export default function selectFile(initialPath?: string) {
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
  } catch (error) {
    //@ts-ignore
    console.error('Failed to open file dialog:', error?.message);
    return null;
  }
}
