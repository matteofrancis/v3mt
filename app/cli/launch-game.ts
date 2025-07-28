import { exec } from "child_process";
import { CommandUse } from "./types.js";

const VICTORIA3_GAME_ID = "529340";

const command = "launch-game";
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description("Launch the game")
    .option("-n, --no-debug", "Launch game without debug mode")
    .option("-i, --id <id>", "Steam Game ID", VICTORIA3_GAME_ID)
    .action(task);
};

const launchGame = { use, command };
export default launchGame;

function task(options: { noDebug?: boolean; id?: string }) {
  const steamGameId = options.id;

  if (!steamGameId) {
    console.error("Steam Game ID is not set.");
    process.exit(1);
  }

  const debugArg = options.noDebug ? "" : "-debug_mode";
  const steamUrl = `steam://rungameid/${steamGameId}//${debugArg}`;

  const commands: Record<string, string> = {
    win32: 'start ""',
    darwin: "open",
    linux: "xdg-open",
  };

  const command = commands[process.platform];

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
