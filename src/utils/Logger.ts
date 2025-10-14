// src/utils/Logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static readonly COLORS = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m',  // Green
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
    reset: '\x1b[0m'
  };

  constructor(
    private readonly context: string,
    private minLevel: LogLevel = LogLevel.INFO
  ) {}

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    if (level < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const color = Logger.COLORS[level];
    const levelName = LogLevel[level];
    
    console.log(
      `${color}[${timestamp}] [${levelName}] [${this.context}]${Logger.COLORS.reset} ${message}`,
      ...args
    );
  }
}