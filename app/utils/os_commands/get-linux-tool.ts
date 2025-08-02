import { execSync } from 'child_process';
import { LinuxTool, LinuxTools } from './types.js';

export function getLinuxTool(): LinuxTool {
  for (const tool of Object.keys(LinuxTools)) {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
      return tool as LinuxTool;
    } catch {
      continue;
    }
  }
  return 'kdialog';
}
