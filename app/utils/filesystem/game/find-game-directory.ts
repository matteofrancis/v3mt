import fs from 'fs';
import path from 'path';
import os from 'os';

export default function findGameDirectory() {
  const commonSteamPaths = [
    'C:/Program Files (x86)/Steam/steamapps/common/Victoria 3/game',
    'C:/Program Files/Steam/steamapps/common/Victoria 3/game',
    path.join(os.homedir(), '.steam/steam/steamapps/common/Victoria 3/game'), // Linux
    path.join(os.homedir(), 'Library/Application Support/Steam/steamapps/common/Victoria 3/game'), // macOS
  ];

  // Check common Steam locations first
  for (const steamPath of commonSteamPaths) {
    if (fs.existsSync(steamPath)) {
      return steamPath;
    }
  }

  // If not found in common locations, try to find Steam installation and search there
  const possibleSteamRoots = [
    'C:/Program Files (x86)/Steam',
    'C:/Program Files/Steam',
    path.join(os.homedir(), '.steam/steam'), // Linux
    path.join(os.homedir(), 'Library/Application Support/Steam'), // macOS
  ];

  for (const steamRoot of possibleSteamRoots) {
    const victoriaGamePath = path.join(steamRoot, 'steamapps/common/Victoria 3/game');
    if (fs.existsSync(victoriaGamePath)) {
      return victoriaGamePath;
    }
  }
  return null;
}
