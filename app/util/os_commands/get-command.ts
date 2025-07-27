import { getLinuxTool } from "./get-linux-tool.js";
import os_commands from "./os_commands.js";
import { LinuxTool, LinuxTools, OSCommands } from "./types.js";

function getOSCommands(linuxTool?: LinuxTool): OSCommands {
  switch (process.platform) {
    case "win32":
      return os_commands.windows;
    case "darwin":
      return os_commands.macos;
    default:
      const tool = linuxTool || getLinuxTool();
      if (tool == LinuxTools.zenity) return os_commands.zenity;
      if (tool == LinuxTools.qarma) return os_commands.qarma;
      if (tool == LinuxTools.yad) return os_commands.yad;
      return os_commands.kdialog;
  }
}

export default getOSCommands;
