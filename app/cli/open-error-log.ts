import { exec } from 'child_process';
import path from 'path';
import { CommandUse } from './types.js';
import { Config } from '../utils/config/config.js';

const command = 'open-error-log';
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description('Open the error log')
    .option('-e, --explorer', 'Open in file explorer')
    .option('-t, --text', 'Open in default text editor')
    .option('-n, --new-window', 'Open in a new VS Code window')
    .action(task);
};

const openErrorLog = { use, command };
export default openErrorLog;

interface Options {
  explorer?: boolean;
  text?: boolean;
  newWindow?: boolean;
}

function task(options: Options) {
  const config = Config.fromFile();
  const file = config.ERROR_LOG;

  if (!file) {
    console.error('ERROR_LOG environment variable is not set.');
    process.exit(1);
  }

  let cmd: string;

  if (options.explorer) {
    switch (process.platform) {
      case 'win32':
        cmd = `explorer /select,"${file}"`;
        break;
      case 'darwin':
        cmd = `open -R "${file}"`;
        break;
      case 'linux':
        cmd = `xdg-open "${path.dirname(file)}"`;
        break;
      default:
        console.error('Unsupported OS for opening explorer.');
        process.exit(1);
    }
  } else if (options.text) {
    switch (process.platform) {
      case 'win32':
        cmd = `notepad "${file}"`;
        break;
      case 'darwin':
        cmd = `open -a TextEdit "${file}"`;
        break;
      case 'linux':
        cmd = `xdg-open "${file}"`;
        break;
      default:
        console.error('Unsupported OS for opening text editor.');
        process.exit(1);
    }
  } else {
    cmd = `code "${file}" ${options.newWindow ? '-n' : ''}`;
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening error log: ${stderr || stdout || error.message}`);
      process.exit(1);
    }
  });
}
