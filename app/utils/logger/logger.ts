const Logger = {
  pass: (message: string): void => {
    console.log(`✅ ${message}`);
  },

  text: (message?: any, ...optionalParams: any[]): void => {
    console.log(message, ...optionalParams);
  },

  info: (message: string): void => {
    console.log(`ℹ️  ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`⚠️  ${message}`);
  },

  fail: (message: string): void => {
    console.error(`❌ ${message}`);
  },

  kill: (message: string, code: number = 1): void => {
    console.error(`❌ ${message}`);
    process.exit(code);
  },
};

export default Logger;
