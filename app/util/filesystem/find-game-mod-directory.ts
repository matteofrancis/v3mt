import fs from "fs";
import path from "path";
import os from "os";

export default function findGameModDirectory() {
  const userHome = os.homedir();
  const modBasePath = path.join(
    userHome,
    "Documents",
    "Paradox Interactive",
    "Victoria 3",
    "mod"
  );

  // Check if the mod directory exists
  if (!fs.existsSync(modBasePath)) {
    console.log(`Victoria 3 mod directory not found: ${modBasePath}`);
    return null;
  }
  return path.normalize(modBasePath);
}
