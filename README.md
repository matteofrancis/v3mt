# Victoria 3 Mod Tools (v3mt)

[![npm version](https://badge.fury.io/js/v3mt.svg)](https://www.npmjs.com/package/v3mt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI toolkit for Victoria 3 modders. Automate common tasks like sending mod files to the game, launching the game, and managing your mod workspace.

---

## Features

- Send mod files to the Victoria 3 mod folder
- Launch Victoria 3 directly from the CLI
- Initialize and configure your mod workspace
- Set up common mod folder structures
- Create Visual Studio Code tasks for modding
- Cross-platform support (Windows, macOS, Linux)
- Interactive prompts for safe operations

---

## Installation

To install globally via npm:

```sh
npm install -g v3mt
```

---

## Quick Start Guide

Follow these steps to get started with the default behavior:

### 1. Initialize Your Workspace

Run the following command to set up your modding workspace:

```sh
v3mt init
```

This will guide you through project setup.

### 2. Send Mod Files to the Game

Once your workspace is configured, you can send your mod files to the game folder:

```sh
v3mt send-to-game
```

This command will:

- Delete all existing files in the destination folder.
- Copy your mod files from the source folder to the destination folder.

### 3. Launch Victoria 3

After sending your mod files, you can launch the game directly from the CLI:

```sh
v3mt launch-game
```

By default, the game will launch in debug mode. Use the `--no-debug` option to disable debug mode.

---

## Commands and Options

Here’s a detailed list of all available commands, their purposes, and options:

### `v3mt init`

**Purpose:**  
Initialize and configure your modding workspace.

**Options:**

- `-s, --skip-intro`: Skip the introductory animation.
- `-o, --yes-os-warning`: Automatically confirm the OS warning.
- `-y, --yes-overwrite`: Automatically confirm overwriting an existing configuration.

---

### `v3mt send-to-game`

**Purpose:**  
Send mod files from the source folder to the Victoria 3 mod folder.

**Options:**

- `-y, --yes`: Automatically confirm prompts without asking.
- `-i, --ignore-mod-folder-warning`: Skip validation of the destination folder (use with caution).

---

### `v3mt launch-game`

**Purpose:**  
Launch Victoria 3 directly from the CLI.

**Options:**

- `-n, --no-debug`: Launch the game without debug mode.
- `-i, --id <id>`: Specify a custom Steam Game ID (default: `529340`).

---

### `v3mt open-mod-folder`

**Purpose:**  
Open the mod folder in your system’s file explorer or Visual Studio Code.

**Options:**

- `-e, --explorer`: Open the folder in the system file explorer instead of VS Code.

---

### `v3mt open-game-folder`

**Purpose:**  
Open the Victoria 3 game folder in your system’s file explorer or Visual Studio Code.

**Options:**

- `-e, --explorer`: Open the folder in the system file explorer instead of VS Code.

---

### `v3mt open-error-log`

**Purpose:**  
Open the Victoria 3 error log file.

**Options:**

- `-e, --explorer`: Open the file in the system file explorer.
- `-t, --text`: Open the file in the default text editor.
- `-n, --new-window`: Open the file in a new Visual Studio Code window.

---

### `v3mt setup-mod-folders`

**Purpose:**  
Set up common folder structures for Victoria 3 mods in the source folder.

**Options:**  
None.

---

### `v3mt setup-vsc-tasks`

**Purpose:**  
Create or update Visual Studio Code tasks for modding.

**Options:**  
None.

---

## Example Workflow

Here’s an example workflow for using `v3mt`:

1. Run `v3mt init` to configure your workspace.
2. Make changes to your mod files in the source folder.
3. Run `v3mt send-to-game` to deploy your changes to the game.
4. Run `v3mt launch-game` to test your mod in Victoria 3.
5. Use `v3mt open-error-log` to debug any issues.

---

## Contributing

Pull requests and issues are welcome! See [GitHub Issues](https://github.com/matteofrancis/victoria3-mod-tools/issues).

---

## License

MIT
