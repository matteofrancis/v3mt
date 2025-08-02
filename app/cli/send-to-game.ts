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
    Logger.kill('MOD_SOURCE, MOD_DESTINATION config setting is not set.');
  }

  const sourcePath = path.resolve(modSource);
  const destinationPath = path.resolve(modDestination);

  // Verify destination folder
  if (!options.ignoreModFolderWarning) {
    const normalizedPath = destinationPath.toLowerCase().replace(/\\/g, '/');

    //force destination to be a subfolder of the mod folder
    if (!normalizedPath.includes('victoria 3/mod')) {
      Logger.fail(`Destination must be a folder within the Victoria 3 Mod folder: ${destinationPath}`);
      Logger.fail(`Expected: .../Victoria 3/mod/<modName>`);
      Logger.fail(`Received: ${destinationPath}`);
      Logger.info(`Use --ignore-mod-folder-warning to override.`);
      Logger.kill(`Aborting.`);
    }

    //force destination NOT to be the mod folder itself
    if (normalizedPath.endsWith('victoria 3/mod') || normalizedPath.endsWith('victoria 3/mod/')) {
      Logger.fail(`Destination cannot be the mod directory itself. It must be a specific mod folder within it.`);
      Logger.fail(`Expected: .../Victoria 3/mod/<modName>`);
      Logger.fail(`Received: ${destinationPath}`);
      Logger.info(`Use --ignore-mod-folder-warning to override.`);
      Logger.kill(`Aborting.`);
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
