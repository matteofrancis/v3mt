import { input } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import { Vic3Metadata } from '../../../utils/config/vic3-metadata.js';

export default async function createNewMod() {
  const modName = await input({
    message: 'Enter Mod Name:',
    validate: (value) => {
      if (!value.trim()) return 'Mod name cannot be empty';
      if (!/^[a-zA-Z0-9_\-\s]+$/.test(value)) {
        return 'Mod name can only contain letters, numbers, spaces, underscores, and hyphens';
      }
      return true;
    },
  });

  const modPath = path.join(process.cwd(), modName);
  const metadataDir = path.join(modPath, '.metadata');
  const metadataFilePath = path.join(metadataDir, 'metadata.json');

  // Create directory structure
  fs.mkdirSync(metadataDir, { recursive: true });

  // Create metadata.json with basic structure
  const metadata: Vic3Metadata = {
    name: modName,
    id: modName.replaceAll(' ', ''),
    version: '0.0.1',
    supported_game_version: '',
    short_description: '',
    tags: [],
    author: '',
    relationships: '',
    description: '',
    game_custom_data: {
      multiplayer_synchronized: true,
    },
  };

  fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));

  return modPath;
}
