import { confirm } from '@inquirer/prompts';

export default async function requestOSConfirmation() {
  const accept_os_warning = await confirm({
    message: `This application has not been fully tested for your operating system. Continue anyway?`,
    default: false,
  });
  return accept_os_warning;
}
