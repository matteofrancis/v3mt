import { exec } from 'child_process';
import { CommandUse } from './types.js';
import { Config } from '../utils/config/config.js';
import Logger from '../utils/logger/logger.js';

const command = 'open-mod-folder';
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description('Open the mod folder')
    .option('-e, --explorer', 'Open folder in system file explorer instead of VS Code')
    .action(task);
};

const errorLog = { use, command };
export default errorLog;

interface Options {
  explorer?: boolean;
}

function task(options: Options) {
  const config = Config.fromFile();
  const folder = config.GAME_MOD_FOLDER;

  if (!folder) {
    Logger.kill('GAME_MOD_FOLDER environment variable is not set.');
  }

  const platform = process.platform;

  let cmd;

  if (options.explorer) {
    switch (platform) {
      case 'win32':
        cmd = `explorer "${folder}"`;
        break;
      case 'darwin':
        cmd = `open "${folder}"`;
        break;
      case 'linux':
        cmd = `xdg-open "${folder}"`;
        break;
      default:
        Logger.kill(`Unsupported platform: ${platform}`);
    }
  } else {
    cmd = `code "${folder}"`;
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      Logger.kill(`Error opening mod folder: ${stderr || stdout || error.message}`);
    }
  });
}
