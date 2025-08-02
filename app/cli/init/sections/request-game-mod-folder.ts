import promptSelectFile from '../../../tools/prompts/select-filesystem.js';
import findGameModDirectory from '../../../utils/filesystem/game/find-game-mod-directory.js';
import { cleanPath } from '../utils/clean-path.js';

export default async function requestGameModFolder() {
  const foundGameModDirectory = findGameModDirectory();
  const GAME_MOD_FOLDER = await promptSelectFile({
    type: 'folder',
    message:
      'Please select Victoria 3 mod directory (example: C:/Users/<user>/Documents/Paradox Interactive/Victoria 3/mod)',
    default: foundGameModDirectory ?? undefined,
    required: true,
  });

  return cleanPath(GAME_MOD_FOLDER);
}
