import {
  createPrompt,
  useState,
  useKeypress,
  useEffect,
  usePrefix,
  isEnterKey,
  isBackspaceKey,
  makeTheme,
  type Theme,
  type Status,
} from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';
import selectFile from '../directory-selector/select-file.js';
import selectFolder from '../directory-selector/select-folder.js';
import Logger from '../../utils/logger/logger.js';

type InputTheme = {
  validationFailureMode: 'keep' | 'clear';
};

const inputTheme: InputTheme = {
  validationFailureMode: 'keep',
};

type InputConfig = {
  message: string;
  type: 'file' | 'folder';
  autoSubmit?: boolean;
  default?: string;
  prefill?: 'tab' | 'editable';
  required?: boolean;
  transformer?: (value: string, { isFinal }: { isFinal: boolean }) => string;
  validate?: (value: string) => boolean | string | Promise<string | boolean>;
  theme?: PartialDeep<Theme<InputTheme>>;
};

// modified version of @inquirer/prompts input prompt.
export default createPrompt<string, InputConfig>((config, done) => {
  const { required, validate = () => true, prefill = 'tab', autoSubmit = false } = config;
  const theme = makeTheme<InputTheme>(inputTheme, config.theme);
  const [status, setStatus] = useState<Status>('idle');
  const [defaultValue = '', setDefaultValue] = useState<string>(config.default);
  const [errorMsg, setError] = useState<string>();
  const [value, setValue] = useState<string>('');

  const prefix = usePrefix({ status, theme });

  const submitAnswer = async (answer: string) => {
    setStatus('loading');

    const isValid = required && !answer ? 'You must provide a value' : await validate(answer);

    if (isValid === true) {
      setValue(answer);
      setStatus('done');
      done(answer);
    } else {
      setError(isValid || 'You must provide a valid value');
      setStatus('idle');
      return false;
    }
    return true;
  };

  useEffect((rl) => {
    const handleFileSelection = async () => {
      setStatus('loading');
      const response = config.type === 'file' ? selectFile(config.default) : selectFolder(config.default);
      Logger.text(response);
      setValue(response ?? '');
      setError(undefined);

      if (autoSubmit && response) {
        await submitAnswer(response);
      } else {
        setStatus('idle');
        if (response) {
          rl.write(response);
        }
      }
    };

    handleFileSelection();
  }, []);

  useKeypress(async (key, rl) => {
    // Ignore keypress while our prompt is doing other processing.
    if (status !== 'idle') {
      return;
    }
    if (isEnterKey(key)) {
      const answer = value || defaultValue;
      await submitAnswer(answer);
    } else if (isBackspaceKey(key) && !value) {
      setDefaultValue(undefined);
    } else if (key.name === 'tab' && !value) {
      setDefaultValue(undefined);
      rl.clearLine(0); // Remove the tab character.
      rl.write(defaultValue);
      setValue(defaultValue);
    } else {
      setValue(rl.line);
      setError(undefined);
    }
  });

  // If prefill is set to 'editable' cut out the default value and paste into current state and the user's cli buffer
  // They can edit the value immediately instead of needing to press 'tab'
  useEffect((rl) => {
    if (prefill === 'editable' && defaultValue) {
      rl.write(defaultValue);
      setValue(defaultValue);
    }
  }, []);

  const message = theme.style.message(config.message, status);
  let formattedValue = value;
  if (typeof config.transformer === 'function') {
    formattedValue = config.transformer(value, {
      isFinal: status === 'done',
    });
  } else if (status === 'done') {
    formattedValue = theme.style.answer(value);
  }

  let defaultStr;
  if (defaultValue && status !== 'done' && !value) {
    defaultStr = theme.style.defaultAnswer(defaultValue);
  }

  let error = '';
  if (errorMsg) {
    error = theme.style.error(errorMsg);
  }

  return [[prefix, message, defaultStr, formattedValue].filter((v) => v !== undefined).join(' '), error];
});
