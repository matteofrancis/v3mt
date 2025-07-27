import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import {
  CommandUse,
  VSCodeSettings,
  VSCodeTask,
  VSCodeTaskPresentation,
} from "./types.js";

const use: CommandUse = (program) => {
  return program
    .command("create-vsc-tasks")
    .description("Send data to the game")
    .action(task);
};

const createVSCTasks = { use };
export default createVSCTasks;

async function task() {
  const vscodeDir = await getVscodeDir();
  const tasksFile = path.join(vscodeDir, "tasks.json");

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

  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir);
  }

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

  let existing = getTasksFile(tasksFile);

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

async function getVscodeDir() {
  let vscodeDir = path.resolve(process.cwd(), ".vscode");

  if (!fs.existsSync(vscodeDir)) {
    console.log("could not find .vscode folder");

    const dir = await input({
      message: "Please enter the path to your .vscode folder:",
      default: vscodeDir,
    });

    if (!dir || !fs.existsSync(dir)) {
      console.error("Invalid directory provided. Aborting.");
      process.exit(1);
    }

    vscodeDir = path.resolve(dir);
  }

  return vscodeDir;
}

function getTasksFile(tasksFile: string): VSCodeSettings | never {
  try {
    return JSON.parse(fs.readFileSync(tasksFile, "utf8"));
  } catch (err) {
    console.error("Failed to parse existing tasks.json, aborting update.");
    process.exit(1);
  }
}
