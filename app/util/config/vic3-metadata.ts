import fs from "fs";
import path from "path";

export interface Vic3Metadata {
  name?: string;
  version?: string;
  game_version?: string;
  author?: string;
  short_description?: string;
  description?: string;
}

export function readVic3Metadata(filePath: string): Vic3Metadata | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function getModFolderFromMetadataPath(filePath: string) {
  return path.dirname(path.dirname(filePath));
}
