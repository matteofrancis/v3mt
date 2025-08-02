import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { CommandUse } from './types.js';
import { Config } from '../utils/config/config.js';
import Logger from '../utils/logger/logger.js';

const command = 'send-to-game';
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description('Send data to the game')
    .option('-y, --yes', 'Automatically Yes confirmation prompt')
    .option('-i, --ignore-mod-folder-warning', 'Skip mod location validation')
    .action(task);
};

const sendToGame = { use, command };
export default sendToGame;

interface Options {
  yes?: boolean;
  ignoreModFolderWarning?: boolean;
}

async function task(options: Options) {
  const config = Config.fromFile();

  const modSource = config.MOD_SOURCE_FOLDER;
  const modDestination = config.MOD_DESTINATION_FOLDER;

  if (!modSource || !modDestination) {
    console.error('MOD_SOURCE, MOD_DESTINATION config setting is not set.');
    process.exit(1);
  }

  const sourcePath = path.resolve(modSource);
  const destinationPath = path.resolve(modDestination);

  // Verify destination folder
  if (options.ignoreModFolderWarning) {
    const normalizedPath = destinationPath.toLowerCase().replace(/\\/g, '/');
    if (!normalizedPath.includes('victoria 3/mod')) {
      console.warn(`⚠️ Destination does not the Victoria 3 Mod folder:\n  ${destinationPath}. Aborting.`);
      console.info(`Use --ignore-mod-folder-warning to override.`);
      process.exit(1);
    }

    if (normalizedPath.endsWith('victoria 3/mod') || normalizedPath.endsWith('victoria 3/mod/')) {
      console.error(`❌ Destination cannot be the mod directory itself. It must be a specific mod folder within it.`);
      console.error(`Expected: .../Victoria 3/mod/<modName>`);
      console.error(`Got: ${destinationPath}`);
      process.exit(1);
    }
  }

  // Show paths and confirm
  if (!options.yes) {
    Logger.info(`\nOperation Details:`);
    Logger.text(`Source:      ${sourcePath}`);
    Logger.text(`Destination: ${destinationPath}`);
    Logger.warn(`\nWARNING: This will DELETE all existing files in the destination!`);
    const response = await confirm({
      message: `Do you want to proceed with replacing the mod folder contents?`,
      default: false,
    });

    if (!response) {
      Logger.kill('Operation cancelled');
    }
  }

  if (fs.existsSync(destinationPath)) {
    fs.rmSync(destinationPath, { recursive: true, force: true });
  }
  fs.cpSync(sourcePath, destinationPath, { recursive: true });

  Logger.info(`Successfully sent to game`);
}
