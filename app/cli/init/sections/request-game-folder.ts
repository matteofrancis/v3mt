import promptSelectFile from "../../../tools/prompts/select-filesystem.js";
import chalk from "chalk";
import findGameDirectory from "../../../utils/filesystem/find-game-directory.js";

export default async function requestGameFolder() {
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

  return GAME_FOLDER;
}
