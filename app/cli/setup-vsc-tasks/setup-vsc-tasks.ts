import fs from 'fs';
import path from 'path';
import * as jsonc from 'jsonc-parser';
import { CommandUse, VSCodeTaskPresentation, VSCodeTasks } from '../types.js';
import { vsc_presentation, vsc_tasks } from './vsc-source.js';
import ensureDirSync from '../../utils/filesystem/tools/ensureDirSync.js';
import Logger from '../../utils/logger/logger.js';

const command = 'setup-vsc-tasks';
const use: CommandUse = (program) => {
  return program.command(command).description('Setup tasks within Visual Studio Code').action(task);
};

const setupVSCTasks = { use, command, task };
export default setupVSCTasks;

async function task() {
  const vscodeDir = ensureDirSync(path.resolve(process.cwd(), '.vscode'));
  const tasksFile = path.join(vscodeDir, 'tasks.json');

  if (!fs.existsSync(tasksFile)) {
    createTasksFile(tasksFile);
  } else {
    updateTasksFile(tasksFile);
  }
}

function createTasksFile(tasksFile: string) {
  const newContent = {
    version: '2.0.0',
    presentation: vsc_presentation,
    tasks: vsc_tasks,
  };

  fs.writeFileSync(tasksFile, JSON.stringify(newContent, null, 2), 'utf8');
  Logger.pass(`Created tasks.json at ${tasksFile}`);
}

function updateTasksFile(tasksFile: string) {
  let content = fs.readFileSync(tasksFile, 'utf8');
  const parsed: VSCodeTasks = jsonc.parse(content);

  if (!parsed || typeof parsed !== 'object') {
    console.error('Invalid tasks.json format, aborting update.');
    process.exit(1);
  }

  const formattingOptions = { insertSpaces: true, tabSize: 2 };

  try {
    if (!parsed.version) {
      const edits = jsonc.modify(content, ['version'], '2.0.0', {
        formattingOptions,
      });
      content = jsonc.applyEdits(content, edits);
    }

    if (!parsed.presentation) {
      const edits = jsonc.modify(content, ['presentation'], vsc_presentation, {
        formattingOptions,
      });
      content = jsonc.applyEdits(content, edits);
    } else {
      for (const key in vsc_presentation) {
        if (parsed.presentation[key as keyof VSCodeTaskPresentation] === undefined) {
          const edits = jsonc.modify(
            content,
            ['presentation', key],
            vsc_presentation[key as keyof VSCodeTaskPresentation],
            {
              formattingOptions,
            },
          );
          content = jsonc.applyEdits(content, edits);
        }
      }
    }

    if (!Array.isArray(parsed.tasks)) {
      const edits = jsonc.modify(content, ['tasks'], [], { formattingOptions });
      content = jsonc.applyEdits(content, edits);
    }

    const currentTasks = parsed.tasks ?? [];

    const tasksToAdd = vsc_tasks.filter((newTask) => !currentTasks.some((t) => t.label === newTask.label));

    if (tasksToAdd.length > 0) {
      for (const newTask of tasksToAdd) {
        const edits = jsonc.modify(content, ['tasks', -1], newTask, {
          formattingOptions,
          isArrayInsertion: true,
        });
        content = jsonc.applyEdits(content, edits);
      }
    }

    fs.writeFileSync(tasksFile, content, 'utf8');
    Logger.pass('Updated tasks.json successfully');
  } catch (err) {
    console.error('Failed to modify tasks.json:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
