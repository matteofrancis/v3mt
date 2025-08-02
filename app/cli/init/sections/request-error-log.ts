import promptSelectFile from '../../../tools/prompts/select-filesystem.js';
import findErrorLog from '../../../utils/filesystem/game/find-error-log.js';

export default async function requestErrorLog() {
  const foundErrorLog = findErrorLog();
  const ERROR_LOG = await promptSelectFile({
    type: 'file',
    message:
      'Please select error log file (example: C:/Users/<USER>/Documents/Paradox Interactive/Victoria 3/logs/error.log)',
    default: foundErrorLog ?? undefined,
    required: true,
  });

  return ERROR_LOG;
}
