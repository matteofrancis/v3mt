import path from 'path';
import fs from 'fs';
import { Vic3Metadata } from './vic3-metadata.js';

export interface ConfigData {
  MOD_SOURCE_FOLDER: string;
  GAME_FOLDER: string;
  GAME_MOD_FOLDER: string;
  MOD_DESTINATION_FOLDER: string;
  ERROR_LOG: string;
}

export class Config implements ConfigData {
  MOD_SOURCE_FOLDER: string;
  GAME_FOLDER: string;
  GAME_MOD_FOLDER: string;
  MOD_DESTINATION_FOLDER: string;
  ERROR_LOG: string;

  constructor(config: {
    MOD_SOURCE_FOLDER: string;
    GAME_FOLDER: string;
    GAME_MOD_FOLDER: string;
    MOD_DESTINATION_FOLDER?: string | null;
    ERROR_LOG: string;
  }) {
    this.MOD_SOURCE_FOLDER = config.MOD_SOURCE_FOLDER;
    this.GAME_FOLDER = config.GAME_FOLDER;
    this.GAME_MOD_FOLDER = config.GAME_MOD_FOLDER;
    this.MOD_DESTINATION_FOLDER =
      config.MOD_DESTINATION_FOLDER ??
      Config.generateModDestinationFolder(config.GAME_MOD_FOLDER, config.MOD_SOURCE_FOLDER);
    this.ERROR_LOG = config.ERROR_LOG;
  }

  static readonly V3MT_CONFIG_FILE_NAME = 'v3mt.config.json';

  static getConfigPath() {
    return path.resolve(process.cwd(), Config.V3MT_CONFIG_FILE_NAME);
  }

  private static generateModDestinationFolder(GAME_MOD_FOLDER: string, MOD_SOURCE_FOLDER: string) {
    return path.join(GAME_MOD_FOLDER, path.basename(MOD_SOURCE_FOLDER));
  }

  static fromFile(filePath?: string): Config {
    const configPath = filePath ?? Config.getConfigPath();
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found at ${configPath}. Run 'v3mt init' to create one.`);
    }

    const raw = fs.readFileSync(configPath, 'utf-8');
    const data = JSON.parse(raw);
    return new Config(data);
  }

  saveToFile(filePath?: string): void {
    const configPath = filePath ?? Config.getConfigPath();

    const exportData: ConfigData = {
      MOD_SOURCE_FOLDER: this.MOD_SOURCE_FOLDER,
      GAME_FOLDER: this.GAME_FOLDER,
      GAME_MOD_FOLDER: this.GAME_MOD_FOLDER,
      MOD_DESTINATION_FOLDER: this.MOD_DESTINATION_FOLDER,
      ERROR_LOG: this.ERROR_LOG,
    };

    fs.writeFileSync(configPath, JSON.stringify(exportData, null, 2));
  }

  getMetadataFile(): string {
    return path.join(this.MOD_SOURCE_FOLDER, '.metadata', 'metadata.json');
  }

  getMetadata(): Vic3Metadata | null {
    try {
      return JSON.parse(fs.readFileSync(this.getMetadataFile(), 'utf8'));
    } catch {
      return null;
    }
  }

  getModName(): string {
    return this.getMetadata()?.name ?? path.basename(this.MOD_SOURCE_FOLDER);
  }

  getModFolderName(): string {
    return path.basename(this.MOD_SOURCE_FOLDER);
  }
}
