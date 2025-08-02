#!/usr/bin/env node

import { Command } from 'commander';
import init from './cli/init/init.js';
import launchGame from './cli/launch-game.js';
import openErrorLog from './cli/open-error-log.js';
import openGameFolder from './cli/open-game-folder.js';
import openModFolder from './cli/open-mod-folder.js';
import sendToGame from './cli/send-to-game.js';
import setupVSCTasks from './cli/setup-vsc-tasks/setup-vsc-tasks.js';
import setupModFolders from './cli/setup-mod-folders.js';
import packageJson from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('v3mt')
  .version(packageJson?.version ?? '0.0.0')
  .description('Victoria 3 modding CLI tools');

init.use(program);
launchGame.use(program);
openErrorLog.use(program);
openGameFolder.use(program);
openModFolder.use(program);
sendToGame.use(program);
setupVSCTasks.use(program);
setupModFolders.use(program);

program.parse();
