import { select } from '@inquirer/prompts';
import { getModFolderFromMetadataPath, readVic3Metadata } from '../../../utils/config/vic3-metadata.js';
import createNewMod from '../utils/create-new-mod.js';
import promptSelectFile from '../../../tools/prompts/select-filesystem.js';
import findMetadataFiles from '../utils/find-metadata-files.js';

export default async function requestModSourceFolder() {
  const detectedMods = findMetadataFiles();

  let MOD_SOURCE_FOLDER;

  const isDetectedModsExist = detectedMods.length > 0;
  const existingModAsChoices = isDetectedModsExist
    ? detectedMods.map((metadataPath) => {
        const modName = readVic3Metadata(metadataPath)?.name;
        const modPath = getModFolderFromMetadataPath(metadataPath);
        return {
          name: `${modName} (${modPath})`,
          value: metadataPath,
        };
      })
    : [];

  const selection = await select({
    message: 'Select a mod or create a new one:',
    choices: [
      ...existingModAsChoices,
      { name: 'Create new mod', value: 'v3mt_init_choice_create_new' },
      { name: 'Select file manually', value: 'v3mt_init_choice_select_manual' },
    ],
  });

  if (selection === 'v3mt_init_choice_create_new') {
    const newModPath = await createNewMod();
    MOD_SOURCE_FOLDER = newModPath;
  } else if (selection === 'v3mt_init_choice_select_manual') {
    const metadataFile = await promptSelectFile({
      type: 'file',
      message: 'Please select metadata.json file. (<MOD_SOURCE_FOLDER>/.metadata/metadata.json',
      required: true,
    });
    MOD_SOURCE_FOLDER = getModFolderFromMetadataPath(metadataFile);
  } else {
    MOD_SOURCE_FOLDER = getModFolderFromMetadataPath(selection);
  }

  return MOD_SOURCE_FOLDER;
}
