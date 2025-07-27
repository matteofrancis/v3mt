export interface OSCommands {
  folder: (initialPath?: string) => string;
  file: (initialPath?: string) => string;
}
export type OSCommand = keyof OSCommands;

export const LinuxTools = {
  zenity: "zenity",
  kdialog: "kdialog",
  yad: "yad",
  qarma: "qarma",
} as const;

export type LinuxTool = (typeof LinuxTools)[keyof typeof LinuxTools];
