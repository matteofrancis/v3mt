import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import {
  CommandUse,
  VSCodeSettings,
  VSCodeTask,
  VSCodeTaskPresentation,
} from "./types.js";

const command = "create-vsc-tasks";
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description("Send data to the game")
    .action(task);
};

const createVSCTasks = { use, command, task };
export default createVSCTasks;

async function task() {
  const defaultPresentation: VSCodeTaskPresentation = {
    echo: true,
    reveal: "always",
    focus: false,
    panel: "shared",
    showReuseMessage: true,
  };

  const newTasks: VSCodeTask[] = [
    {
      label: "Send to Game",
      type: "shell",
      command: "v3mt send-to-game",
      group: "build",
      problemMatcher: [],
    },
    {
      label: "Launch Game",
      type: "shell",
      command: "v3mt launch-game",
      group: "build",
      problemMatcher: [],
    },
    {
      label: "Open Error Log",
      type: "shell",
      command: "v3mt open-error-log",
      group: "build",
      problemMatcher: [],
    },
    {
      label: "Open Game Folder",
      type: "shell",
      command: "v3mt open-game-folder",
      group: "build",
      problemMatcher: [],
    },
    {
      label: "Open Mod Folder",
      type: "shell",
      command: "v3mt open-mod-folder",
      group: "build",
      problemMatcher: [],
    },
  ];

  const vscodeDir = await getOrCreateVscodeDir();
  const tasksFile = path.join(vscodeDir, "tasks.json");

  if (!fs.existsSync(tasksFile)) {
    const newContent = {
      version: "2.0.0",
      presentation: defaultPresentation,
      tasks: newTasks,
    };
    fs.writeFileSync(tasksFile, JSON.stringify(newContent, null, 2), "utf8");
    console.log(`Created new tasks.json at ${tasksFile}`);
    return;
  }

  let existing = readTasksFile(tasksFile);

  if (existing.version === undefined) {
    existing.version = "2.0.0";
  }

  if (existing.presentation === undefined) {
    existing.presentation = { ...defaultPresentation };
  } else {
    if (existing.presentation.clear === undefined)
      existing.presentation.clear = defaultPresentation.clear;
    if (existing.presentation.echo === undefined)
      existing.presentation.echo = defaultPresentation.echo;
    if (existing.presentation.focus === undefined)
      existing.presentation.focus = defaultPresentation.focus;
    if (existing.presentation.panel === undefined)
      existing.presentation.panel = defaultPresentation.panel;
    if (existing.presentation.reveal === undefined)
      existing.presentation.reveal = defaultPresentation.reveal;
    if (existing.presentation.showReuseMessage === undefined)
      existing.presentation.showReuseMessage =
        defaultPresentation.showReuseMessage;
  }

  if (!Array.isArray(existing.tasks)) {
    existing.tasks = [];
  }

  const existingLabels = new Set(existing.tasks.map((t) => t.label));
  for (const newTask of newTasks) {
    if (!existingLabels.has(newTask.label)) {
      existing.tasks.push(newTask);
    }
  }

  fs.writeFileSync(tasksFile, JSON.stringify(existing, null, 2), "utf8");
  console.log(`Updated tasks.json at ${tasksFile}`);
}

async function getOrCreateVscodeDir() {
  let vscodeDir = path.resolve(process.cwd(), ".vscode");

  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }
  return vscodeDir;
}

function readTasksFile(tasksFile: string): VSCodeSettings | never {
  try {
    return JSON.parse(fs.readFileSync(tasksFile, "utf8"));
  } catch (err) {
    console.error("Failed to parse existing tasks.json, aborting update.");
    process.exit(1);
  }
}
