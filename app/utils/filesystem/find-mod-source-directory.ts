import fs from "fs";
import path from "path";

export default function findModSourceDirectory(searchPath = process.cwd()) {
  try {
    const items = fs.readdirSync(searchPath);

    for (const item of items) {
      const fullPath = path.join(searchPath, item);

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const metadataPath = path.join(
            fullPath,
            ".metadata",
            "metadata.json"
          );
          if (fs.existsSync(metadataPath)) {
            return fullPath;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
        continue;
      }
    }

    return null;
  } catch (error) {
    //@ts-ignore
    console.error("Failed to search for metadata directory:", error?.message);
    return null;
  }
}
