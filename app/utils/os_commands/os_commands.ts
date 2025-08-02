import path from 'path';
import { OSCommands } from './types.js';

const windows: OSCommands = {
  folder: (initialPath) =>
    `powershell -command "$shell = New-Object -ComObject Shell.Application; $folder = $shell.BrowseForFolder(0, 'Select a folder', 0, ${
      initialPath ? `'${initialPath}'` : '0'
    }); if ($folder) { $folder.Self.Path } else { '' }"`,

  file: (initialPath) => {
    if (initialPath) {
      const dir = path.dirname(initialPath);
      const fileName = path.basename(initialPath);
      return `powershell -command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.InitialDirectory = '${dir}'; $f.FileName = '${fileName}'; $f.Filter = 'All files (*.*)|*.*'; $result = $f.ShowDialog(); if ($result -eq 'OK') { $f.FileName } else { '' }"`;
    }
    return `powershell -command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.InitialDirectory = Get-Location; $f.Filter = 'All files (*.*)|*.*'; $result = $f.ShowDialog(); if ($result -eq 'OK') { $f.FileName } else { '' }"`;
  },
};

const macos: OSCommands = {
  folder: (initialPath) =>
    `osascript -e 'try' -e 'tell application "System Events" to set selectedFolder to choose folder${
      initialPath ? ` default location (POSIX file "${initialPath}")` : ''
    } with prompt "Select a folder:"' -e 'POSIX path of selectedFolder' -e 'on error' -e '""' -e 'end try'`,

  file: (initialPath) => {
    if (initialPath) {
      const dir = path.dirname(initialPath);
      return `osascript -e 'try' -e 'tell application "System Events" to set selectedFile to choose file default location (POSIX file "${dir}") with prompt "Select a file:"' -e 'POSIX path of selectedFile' -e 'on error' -e '""' -e 'end try'`;
    }
    return `osascript -e 'try' -e 'tell application "System Events" to set selectedFile to choose file with prompt "Select a file:"' -e 'POSIX path of selectedFile' -e 'on error' -e '""' -e 'end try'`;
  },
};

const zenity: OSCommands = {
  folder: (initialPath) =>
    `zenity --file-selection --directory --title="Select a folder"${
      initialPath ? ` --filename="${initialPath}/"` : ''
    }`,
  file: (initialPath) =>
    `zenity --file-selection --title="Select a file"${initialPath ? ` --filename="${initialPath}"` : ''}`,
};

const kdialog: OSCommands = {
  folder: (initialPath) => `kdialog --getexistingdirectory ${initialPath ? `"${initialPath}"` : '.'} "Select a folder"`,
  file: (initialPath) => `kdialog --getopenfilename ${initialPath ? `"${initialPath}"` : '.'} "All files (*)"`,
};

const yad: OSCommands = {
  folder: (initialPath) =>
    `yad --file-selection --directory --title="Select a folder"${initialPath ? ` --filename="${initialPath}/"` : ''}`,
  file: (initialPath) =>
    `yad --file-selection --title="Select a file"${initialPath ? ` --filename="${initialPath}"` : ''}`,
};

const qarma: OSCommands = {
  folder: (initialPath) =>
    `qarma --file-selection --directory --title="Select a folder"${initialPath ? ` --filename="${initialPath}/"` : ''}`,
  file: (initialPath) =>
    `qarma --file-selection --title="Select a file"${initialPath ? ` --filename="${initialPath}"` : ''}`,
};

const os_commands = { windows, macos, zenity, kdialog, yad, qarma };

export default os_commands;
