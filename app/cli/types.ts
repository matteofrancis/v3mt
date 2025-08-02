import { type Command } from 'commander';

export type CommandUse = (program: Command) => Command;

export interface VSCodeTaskPresentation {
  echo?: boolean;
  reveal?: 'always' | 'silent' | 'never';
  focus?: boolean;
  panel?: 'shared' | 'dedicated' | 'new';
  showReuseMessage?: boolean;
  clear?: boolean;
}

export interface VSCodeTask {
  label: string;
  type: string;
  command: string;
  group?: string | { kind: string; isDefault?: boolean };
  problemMatcher?: string[] | string;
  presentation?: VSCodeTaskPresentation;
  options?: Record<string, unknown>;
  dependsOn?: string | string[];
}

export interface VSCodeTasks {
  version?: string;
  presentation?: VSCodeTaskPresentation;
  tasks?: VSCodeTask[];
}
