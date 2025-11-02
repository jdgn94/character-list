import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { Logger, createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import chalk from 'chalk';

declare global {
  // extend Console interface to allow console.success
  interface Console {
    success(...args: unknown[]): void;
  }
}

@Injectable()
export class LoggerService implements NestLogger {
  private loggerInfo: Logger;
  private loggerWarning: Logger;
  private loggerSuccess: Logger;
  private loggerError: Logger;
  private loggerAll: Logger;

  constructor() {
    this.createLoggers();
    this.replaceConsole();
  }

  // custom level for success messages
  success(message: any, context?: string) {
    this.loggerSuccess.log({
      level: 'success',
      message: formatMessage(message),
      context,
    });
    this.loggerAll.log({
      level: 'success',
      message: formatMessage(message),
      context,
    });
  }

  /*
   * Nest expects these methods on a custom logger: log, error, warn, debug, verbose
   */
  log(message: any, context?: string) {
    this.loggerInfo.info(formatMessage(message), { context });
    this.loggerAll.info(formatMessage(message), { context });
  }

  error(message: any, trace?: string, context?: string) {
    const msg = `${formatMessage(message)}${trace ? ' | ' + trace : ''}`;
    this.loggerError.error(msg, { context });
    this.loggerAll.error(msg, { context });
  }

  warn(message: any, context?: string) {
    this.loggerWarning.warn(formatMessage(message), { context });
    this.loggerAll.warn(formatMessage(message), { context });
  }

  debug(message: any, context?: string) {
    this.loggerAll.debug(formatMessage(message), { context });
  }

  verbose(message: any, context?: string) {
    this.loggerAll.verbose(formatMessage(message), { context });
  }

  replaceConsole() {
    console.log = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      this.loggerAll.debug(
        formatMessage(message as any, rest.length ? rest : null),
      );
    };

    // success: custom console method to log successful operations
    // behaves like console.log but writes to the `success` logger and global
    console.success = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      const formatted = formatMessage(
        message as any,
        rest.length ? rest : null,
      );
      this.loggerSuccess.log({ level: 'success', message: formatted });
      this.loggerAll.log({ level: 'success', message: formatted });
    };

    console.error = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      this.loggerError.error(
        formatMessage(message as any, rest.length ? rest : null),
      );
      this.loggerAll.error(
        formatMessage(message as any, rest.length ? rest : null),
      );
    };

    console.info = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      this.loggerInfo.info(
        formatMessage(message as any, rest.length ? rest : null),
      );
      this.loggerAll.info(
        formatMessage(message as any, rest.length ? rest : null),
      );
    };

    console.warn = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      this.loggerWarning.warn(
        formatMessage(message as any, rest.length ? rest : null),
      );
      this.loggerAll.warn(
        formatMessage(message as any, rest.length ? rest : null),
      );
    };

    console.debug = (...params: unknown[]) => {
      const message: unknown = params[0];
      const rest = params.slice(1);
      this.loggerAll.debug(
        formatMessage(message as any, rest.length ? rest : null),
      );
    };
  }

  createLoggers() {
    const customLevels = {
      levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
      colors: {
        error: 'red',
        warn: 'yellow',
        success: 'green',
        info: 'cyan',
        verbose: 'magenta',
        debug: 'gray',
        silly: 'white',
      },
    };

    // register colors with winston so colorize (if used) can pick them up
    try {
      // safe cast for addColors typing
      const colors = (
        customLevels as unknown as { colors: Record<string, string> }
      ).colors;
      addColors(colors as any);
    } catch {
      // ignore if addColors not available in this version
    }
    const plainPrintf = format.printf((info: unknown) => {
      const infoAny = info as Record<string, unknown>;
      const timestamp = infoAny.timestamp as string | undefined;
      const level = infoAny.level as string | undefined;
      const message = infoAny.message as string | undefined;
      const context = infoAny.context;

      return `${timestamp} [${String(level).toUpperCase()}] ${
        context ? '[' + safeStringify(context) + ']' : ''
      } ${message}`;
    });

    const consolePrintf = format.printf((info: unknown) => {
      const infoAny = info as Record<string, unknown>;
      const timestamp = infoAny.timestamp as string | undefined;
      const level = (infoAny.level as string | undefined) ?? 'log';
      const message = infoAny.message as string | undefined;
      const context = infoAny.context;

      // choose color per level
      const lvl = level.toLowerCase();
      let levelColored: string;
      switch (lvl) {
        case 'error':
          levelColored = chalk.red(level.toUpperCase());
          break;
        case 'warning':
          levelColored = chalk.yellow(level.toUpperCase());
          break;
        case 'info':
          levelColored = chalk.cyan(level.toUpperCase());
          break;
        case 'success':
          levelColored = chalk.green(level.toUpperCase());
          break;
        case 'debug':
          levelColored = chalk.gray(level.toUpperCase());
          break;
        case 'verbose':
          levelColored = chalk.magenta(level.toUpperCase());
          break;
        default:
          levelColored = chalk.green(level.toUpperCase());
      }

      const ts = timestamp ? chalk.gray(timestamp) : '';
      const ctx = context ? '[' + safeStringify(context) + ']' : '';
      const base = `${ts} [${levelColored}] ${ctx} ${message}`;
      return base;
    });

    const dateFormat = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

    this.loggerInfo = createLogger({
      levels: customLevels.levels,
      level: 'info',
      format: format.combine(dateFormat, plainPrintf),
      transports: [
        new DailyRotateFile({
          filename: 'logs/info/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),
      ],
    });

    this.loggerWarning = createLogger({
      levels: customLevels.levels,
      level: 'warn',
      format: format.combine(dateFormat, plainPrintf),
      transports: [
        new DailyRotateFile({
          filename: 'logs/warning/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),
      ],
    });

    this.loggerSuccess = createLogger({
      levels: customLevels.levels,
      level: 'silly',
      format: format.combine(dateFormat, plainPrintf),
      transports: [
        new DailyRotateFile({
          filename: 'logs/success/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),
      ],
    });

    this.loggerError = createLogger({
      levels: customLevels.levels,
      level: 'error',
      format: format.combine(dateFormat, plainPrintf),
      transports: [
        new DailyRotateFile({
          filename: 'logs/error/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),
      ],
    });

    this.loggerAll = createLogger({
      levels: customLevels.levels,
      level: 'silly',
      // global logger will use plain format for files; console transport will override
      format: format.combine(dateFormat, plainPrintf),
      transports: [
        new DailyRotateFile({
          filename: 'logs/global/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),
        new transports.Console({
          format: format.combine(dateFormat, consolePrintf),
        }),
      ],
    });
  }
}

function formatMessage(message: any, params: any = null): string {
  const base = typeof message === 'string' ? message : safeStringify(message);
  if (params) return base + ' ' + safeStringify(params);
  return base;
}

function safeStringify(obj: any) {
  try {
    return typeof obj === 'string' ? obj : JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}
