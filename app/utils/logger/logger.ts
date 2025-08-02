import chalk from 'chalk';

class Logger {
  static pass(message: string): void {
    console.log(chalk.green(`✅ ${message}`));
  }

  static text(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.white(message), ...optionalParams);
  }

  static info(message: string): void {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  static warn(message: string): void {
    console.warn(chalk.yellow(`⚠️  ${message}`));
  }

  static fail(message: string): void {
    console.error(chalk.red(`❌ ${message}`));
  }

  static kill(message: string, code: number = 1): never {
    console.error(chalk.red.bold(`❌ ${message}`));
    return process.exit(code);
  }
}

export default Logger;
