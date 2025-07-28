import fs from "fs";
import { CommandUse } from "../types.js";
import { Config } from "../../utils/config/config.js";
import requestModSourceFolder from "./sections/request-mod-source-folder.js";
import requestGameFolder from "./sections/request-game-folder.js";
import requestGameModFolder from "./sections/request-game-mod-folder.js";
import requestErrorLog from "./sections/request-error-log.js";
import displayIntro from "./sections/display-intro.js";
import requestOSConfirmation from "./sections/request-os-confirmation.js";
import requestOverwriteConfirmation from "./sections/request-overwrite-confirmation.js";
import { confirm } from "@inquirer/prompts";
import { program } from "commander";
import createVSCTasks from "../create-vsc-tasks.js";
import setup_complete from "./data/outro.js";
import displayOutro from "./sections/display-outro.js";
import sleep from "../../utils/sleep.js";

const command = "init";
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description("Create initial v3mt.config.json file")
    .option("-s, --skip-intro", "Skip Intro")
    .option("-o, --yes-os-warning", "Auto confirm OS warning")
    .option("-y, --yes-overwrite", "Auto confirm Overwrite warning")
    .action(task);
};

const init = { use, command };
export default init;

async function task(options: {
  skipIntro?: boolean;
  yesOsWarning?: boolean;
  yesOverwrite?: boolean;
}) {
  const configPath = Config.getConfigPath();

  if (!options.skipIntro) {
    await displayIntro();
  }

  if (!options.yesOsWarning && process.platform !== "win32") {
    const confirmed = await requestOSConfirmation();
    if (!confirmed) return;
  }

  if (!options.yesOverwrite && fs.existsSync(configPath)) {
    const confirmed = await requestOverwriteConfirmation(configPath);
    if (!confirmed) return;
  }

  const MOD_SOURCE_FOLDER = await requestModSourceFolder();
  const GAME_FOLDER = await requestGameFolder();
  const GAME_MOD_FOLDER = await requestGameModFolder();
  const ERROR_LOG = await requestErrorLog();

  const newConfig = new Config({
    MOD_SOURCE_FOLDER,
    GAME_FOLDER,
    GAME_MOD_FOLDER,
    ERROR_LOG,
  });

  newConfig.saveToFile(configPath);

  console.log(`Config file created at: ${configPath}`);
  console.log(newConfig);

  const setupVSCTasks = await confirm({
    message: `Setup VS Code Tasks?`,
    default: true,
  });
  if (setupVSCTasks) {
    await createVSCTasks.task();
  }

  //outro
  await displayOutro();
}
