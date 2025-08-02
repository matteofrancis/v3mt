import { exec } from 'child_process';
import { CommandUse } from './types.js';
import Logger from '../utils/logger/logger.js';

const VICTORIA3_GAME_ID = '529340';

const command = 'launch-game';
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description('Launch the game')
    .option('-n, --no-debug', 'Launch game without debug mode')
    .option('-i, --id <id>', 'Steam Game ID', VICTORIA3_GAME_ID)
    .action(task);
};

const launchGame = { use, command };
export default launchGame;

function task(options: { noDebug?: boolean; id?: string }) {
  const steamGameId = options.id;

  if (!steamGameId) {
    Logger.kill('Steam Game ID is not set.');
  }

  const debugArg = options.noDebug ? '' : '-debug_mode';
  const steamUrl = `steam://rungameid/${steamGameId}//${debugArg}`;

  const commands: Partial<Record<NodeJS.Platform, string>> = {
    win32: 'start ""',
    darwin: 'open',
    linux: 'xdg-open',
  };

  const command = commands[process.platform];

  if (!command) {
    Logger.kill(`Unsupported platform: ${process.platform}`);
  }

  exec(`${command} "${steamUrl}"`, (error, stdout, stderr) => {
    if (error) {
      Logger.kill(`Error launching game: ${stderr || stdout || error.message}`);
    }
  });
}
