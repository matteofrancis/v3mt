import { exec } from 'child_process';
import { CommandUse } from './types.js';
import { Config } from '../utils/config/config.js';

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
    console.error('GAME_MOD_FOLDER environment variable is not set.');
    process.exit(1);
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
        console.error('Unsupported OS for opening explorer.');
        process.exit(1);
    }
  } else {
    cmd = `code "${folder}"`;
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening mod folder: ${stderr || stdout || error.message}`);
      process.exit(1);
    }
  });
}
