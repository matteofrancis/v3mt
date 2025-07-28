import { confirm } from "@inquirer/prompts";

export default async function requestOverwriteConfirmation(configPath: string) {
  const accept_overwrite = await confirm({
    message: `An existing config file was found at ${configPath}.\nOverwrite it?`,
    default: false,
  });
  return accept_overwrite;
}
