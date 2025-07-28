import fs from "fs";
import { CommandUse } from "../types.js";
import promptSelectFile from "../../tools/prompts/select-filesystem.js";
import { confirm, select } from "@inquirer/prompts";
import findGameDirectory from "../../util/filesystem/find-game-directory.js";
import findErrorLog from "../../util/filesystem/find-error-log.js";
import findMetadataFiles from "./findMetadataFiles.js";
import createNewMod from "./createNewMod.js";
import { Config } from "../../util/config/config.js";
import {
  getModFolderFromMetadataPath,
  readVic3Metadata,
} from "../../util/config/vic3-metadata.js";
import findGameModDirectory from "../../util/filesystem/find-game-mod-directory.js";
import chalk from "chalk";
import displayIntro from "./displayIntro.js";

const use: CommandUse = (program) => {
  return program
    .command("init")
    .description("Create initial v3mt.config.json file")
    .action(task);
};

const init = { use };
export default init;

async function task() {
  const configPath = Config.getConfigPath();

  // INTRO
  displayIntro();

  // OS Confirmation
  if (process.platform !== "win32") {
    const accept_os_warning = await confirm({
      message: `This application has not been fully tested for your operating system. Continue anyway?`,
      default: false,
    });
    if (!accept_os_warning) {
      return;
    }
  }

  // Overwrite confirmation
  if (fs.existsSync(configPath)) {
    const accept_overwrite = await confirm({
      message: `An existing config file was found at ${configPath}.\nOverwrite it?`,
      default: false,
    });
    if (!accept_overwrite) {
      return;
    }
  }

  // MOD_SOURCE_FOLDER
  // Find all metadata.json files
  const detectedMods = findMetadataFiles();

  let MOD_SOURCE_FOLDER;

  const isDetectedModsExist = detectedMods.length > 0;
  const existingModAsChoices = isDetectedModsExist
    ? detectedMods.map((metadataPath) => {
        const modName = readVic3Metadata(metadataPath)?.name;
        const modPath = getModFolderFromMetadataPath(metadataPath);
        return {
          name: `${modName} (${modPath})`,
          value: metadataPath,
        };
      })
    : [];

  const selection = await select({
    message: "Select a mod or create a new one:",
    choices: [
      ...existingModAsChoices,
      { name: "Create new mod", value: "v3mt_init_choice_create_new" },
      { name: "Select file manually", value: "v3mt_init_choice_select_manual" },
    ],
  });

  if (selection === "v3mt_init_choice_create_new") {
    const newModPath = await createNewMod();
    MOD_SOURCE_FOLDER = newModPath;
  } else if (selection === "v3mt_init_choice_select_manual") {
    const metadataFile = await promptSelectFile({
      type: "file",
      message:
        "Please select metadata.json file. (<MOD_SOURCE_FOLDER>/.metadata/metadata.json",
      required: true,
    });
    MOD_SOURCE_FOLDER = getModFolderFromMetadataPath(metadataFile);
  } else {
    MOD_SOURCE_FOLDER = getModFolderFromMetadataPath(selection);
  }

  // GAME_FOLDER
  const foundGameDirectory = findGameDirectory();
  if (!foundGameDirectory) {
    console.warn(
      chalk.yellow(
        "Victoria 3 game directory not found in common Steam locations"
      )
    );
  }
  const GAME_FOLDER = await promptSelectFile({
    type: "folder",
    message:
      "Please select game folder (example: C:/Program Files (x86)/Steam/steamapps/common/Victoria 3/game)",
    // TODO: set C:/Program Files (x86) to default if it exists
    default: foundGameDirectory ?? undefined,
    required: true,
  });

  // GAME_MOD_FOLDER
  const foundGameModDirectory = findGameModDirectory();
  const GAME_MOD_FOLDER = await promptSelectFile({
    type: "folder",
    message:
      "Please select Victoria 3 mod directory (example: C:/Users/<user>/Documents/Paradox Interactive/Victoria 3/mod)",
    default: foundGameModDirectory ?? undefined,
    required: true,
  });

  // ERROR_LOG
  const foundErrorLog = findErrorLog();
  const ERROR_LOG = await promptSelectFile({
    type: "file",
    message:
      "Please select error log file (example: C:/Users/<USER>/Documents/Paradox Interactive/Victoria 3/logs/error.log)",
    default: foundErrorLog ?? undefined,
    required: true,
  });

  // Create config object
  const newConfig = new Config({
    MOD_SOURCE_FOLDER,
    GAME_FOLDER,
    GAME_MOD_FOLDER,
    ERROR_LOG,
  });

  newConfig.saveToFile(configPath);

  console.log("\n...");
  console.log("v3mt initialized successfully!");
  console.log(`Config file created at: ${configPath}`);
  console.log("\nConfiguration:");
  console.log(newConfig);
}
