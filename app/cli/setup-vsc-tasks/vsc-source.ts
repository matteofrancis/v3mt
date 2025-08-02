import { VSCodeTask, VSCodeTaskPresentation } from '../types.js';

export const vsc_tasks: VSCodeTask[] = [
  {
    label: 'Send to Game',
    type: 'shell',
    command: 'v3mt send-to-game',
    group: 'build',
    problemMatcher: [],
  },
  {
    label: 'Launch Game',
    type: 'shell',
    command: 'v3mt launch-game',
    group: 'build',
    problemMatcher: [],
  },
  {
    label: 'Open Error Log',
    type: 'shell',
    command: 'v3mt open-error-log',
    group: 'build',
    problemMatcher: [],
  },
  {
    label: 'Open Game Folder',
    type: 'shell',
    command: 'v3mt open-game-folder',
    group: 'build',
    problemMatcher: [],
  },
  {
    label: 'Open Mod Folder',
    type: 'shell',
    command: 'v3mt open-mod-folder',
    group: 'build',
    problemMatcher: [],
  },
];

export const vsc_presentation: VSCodeTaskPresentation = {
  echo: true,
  reveal: 'always',
  focus: false,
  panel: 'shared',
  showReuseMessage: true,
};
