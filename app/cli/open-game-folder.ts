import { exec } from "child_process";
import { CommandUse } from "./types.js";
import { Config } from "../util/config/config.js";

const use: CommandUse = (program) => {
  return program
    .command("open-game-folder")
    .description("Open the game folder")
    .option(
      "-e, --explorer",
      "Open folder in system file explorer instead of VS Code"
    )
    .action(task);
};

const openGameFolder = { use };
export default openGameFolder;

interface Options {
  explorer?: boolean;
}

function task(options: Options) {
  const config = Config.fromFile();
  const folder = config.GAME_FOLDER;

  if (!folder) {
    console.error("GAME_FOLDER environment variable is not set.");
    process.exit(1);
  }

  let cmd;

  if (options.explorer) {
    switch (process.platform) {
      case "win32":
        cmd = `explorer "${folder}"`;
        break;
      case "darwin":
        cmd = `open "${folder}"`;
        break;
      case "linux":
        cmd = `xdg-open "${folder}"`;
        break;
      default:
        console.error("Unsupported OS for opening explorer.");
        process.exit(1);
    }
  } else {
    cmd = `code "${folder}"`;
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error opening game folder: ${stderr || stdout || error.message}`
      );
      process.exit(1);
    }
  });
}
