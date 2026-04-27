import winston from 'winston';
import path from 'path';
import { LoggingConfig } from '../types/index.js';

export class Logger {
  private logger: winston.Logger;

  constructor(config: LoggingConfig) {
    const logDir = path.dirname(config.file);
    
    this.logger = winston.createLogger({
      level: config.level,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'search-agent' },
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: config.file,
        }),
      ],
    });

    // 非生产环境添加控制台输出
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...metadata }) => {
              let msg = `${timestamp} [${level}]: ${message}`;
              if (Object.keys(metadata).length > 0 && metadata.service) {
                msg += ` ${JSON.stringify(metadata)}`;
              }
              return msg;
            })
          ),
        })
      );
    }
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }
}

// 默认logger实例
let defaultLogger: Logger | null = null;

export function createLogger(config: LoggingConfig): Logger {
  defaultLogger = new Logger(config);
  return defaultLogger;
}

export function getLogger(): Logger {
  if (!defaultLogger) {
    throw new Error('Logger not initialized. Call createLogger first.');
  }
  return defaultLogger;
}
