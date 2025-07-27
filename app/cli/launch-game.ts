import { platform } from "os";
import { exec } from "child_process";
import { CommandUse } from "./types.js";

const VICTORIA3_GAME_ID = "529340";

const use: CommandUse = (program) => {
  return program
    .command("launch-game")
    .description("Launch the game")
    .option("-n, --no-debug", "Launch game without debug mode")
    .option("-i, --id <id>", "Steam Game ID", VICTORIA3_GAME_ID)
    .action(task);
};

const launchGame = { use };
export default launchGame;

function task(options: { id?: string; debug?: boolean }) {
  const steamGameId = options.id;

  if (!steamGameId) {
    console.error("Steam Game ID is not set.");
    process.exit(1);
  }

  const debugArg = options.debug === false ? "" : "-debug_mode";
  const steamUrl = `steam://rungameid/${steamGameId}//${debugArg}`;

  const commands: Record<string, string> = {
    win32: 'start ""',
    darwin: "open",
    linux: "xdg-open",
  };

  const command = commands[platform()];

  if (!command) {
    console.error("Unsupported OS");
    process.exit(1);
  }

  exec(`${command} "${steamUrl}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening game: ${stderr || stdout || error.message}`);
      process.exit(1);
    }
  });
}
