import fs from "fs";
import path from "path";
import { CommandUse } from "./types.js";
import { Config } from "../utils/config/config.js";

const FOLDER_STRUCTURE = [
  "common",
  "common/buildings",
  "common/goods",
  "common/modifier_type_definitions",
  "common/production_methods",
  "common/production_method_groups",
  "common/script_values",
  "gfx",
  "gfx/interface",
  "gfx/interface/icons",
  "gfx/interface/icons/building_icons",
  "gfx/interface/icons/goods_icons",
  "gfx/interface/icons/production_method_icons",
  "localization",
  "localization/english",
];

const command = "setup-mod-folders";
const use: CommandUse = (program) => {
  return program
    .command(command)
    .description("sets up common mod folders")
    .action(task);
};

const setupModFolders = { use, command, task };
export default setupModFolders;

async function task() {
  const config = Config.fromFile();
  const modSource = config.MOD_SOURCE_FOLDER;

  if (!modSource) {
    console.error("MOD_SOURCE_FOLDER config setting is not set.");
    process.exit(1);
  }

  for (const folder of FOLDER_STRUCTURE) {
    const folderPath = path.join(modSource, folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`   ✅ Created: ${folder}`);
    } else {
      console.log(`   ⏭️  Exists: ${folder}`);
    }
  }
}
