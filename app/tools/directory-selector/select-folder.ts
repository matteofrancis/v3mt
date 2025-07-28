import fs from "fs";
import { execSync } from "child_process";
import getOSCommands from "../../utils/os_commands/get-command.js";
import path from "path";

export default function selectFolder(initialPath?: string) {
  try {
    const commands = getOSCommands();
    const command = commands.folder(initialPath);

    const result = execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"], // Suppress stderr to avoid noise
    }).trim();

    if (result && fs.existsSync(result) && fs.statSync(result).isDirectory()) {
      return path.normalize(result);
    }

    return null;
  } catch (error) {
    //@ts-ignore
    console.error("Failed to open folder dialog:", error.message);
    return null;
  }
}
