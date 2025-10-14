/**
 * ANSI color codes for console output
 */
export enum PrinterColors {
  Primary = "\x1b[0;35m",
  Success = "\x1b[0;32m",
  Warning = "\x1b[0;33m",
  Error = "\x1b[0;31m",
  Reset = "\x1b[0m",
}

/**
 * Utility class for formatted console output with colors
 */
export class Printer {
  private static readonly DEFAULT_PREFIX = "Kristy";
  private static readonly DEFAULT_SUFFIX = "";
  private static readonly LINE_WIDTH = 100;
  private static readonly NOTIFICATION_SYMBOL = "⋄";
  private static readonly BULLET_SYMBOL = "•";

  constructor(
    public prefix: string = Printer.DEFAULT_PREFIX,
    public suffix: string = Printer.DEFAULT_SUFFIX,
  ) {}

  /**
   * Prints a formatted message to the console with optional color
   * @param message The message to print
   * @param color Optional color for the message
   */
  public print(message: string, color?: PrinterColors): void {
    const coloredBullet = color
      ? `${color}${Printer.BULLET_SYMBOL} ${PrinterColors.Reset}`
      : "";

    console.log(
      `${coloredBullet}${PrinterColors.Primary}${this.prefix}: ` +
        `${PrinterColors.Reset}${message}${PrinterColors.Primary}${this.suffix}`,
      PrinterColors.Reset,
    );
  }

  /**
   * Prints a formatted notification message to the console
   * @param message The notification message
   * @param color Optional color for the notification (defaults to primary)
   */
  public notify(
    message: string,
    color: PrinterColors = PrinterColors.Primary,
  ): void {
    const title = `ОПОВЕЩЕНИЕ (${this.prefix})`;
    const dividerLength = 13 + this.prefix.length;
    const divider = `${Printer.NOTIFICATION_SYMBOL} `.repeat(dividerLength);

    const formattedMessage = this.formatMessage(message)
      .map((line) => (line.endsWith("\n") ? `${line}    ` : line))
      .join(`${color}\n${Printer.NOTIFICATION_SYMBOL} ${PrinterColors.Reset}`);

    console.log(
      `${color}\n${divider}\n` +
        `${Printer.NOTIFICATION_SYMBOL} ${title}\n` +
        `${divider} ${Printer.NOTIFICATION_SYMBOL}>\n` +
        `${Printer.NOTIFICATION_SYMBOL} ${PrinterColors.Reset}${formattedMessage}` +
        `${color}\n${divider}\n${PrinterColors.Reset}`,
    );
  }

  /**
   * Prints an error message to the console in error color
   * @param message The error message
   */
  public error(message: string): void {
    console.error(
      `${PrinterColors.Error}--- ERROR ${PrinterColors.Reset}– ` +
        `${PrinterColors.Primary}${this.prefix}${PrinterColors.Reset}\n` +
        `    ${message}\n` +
        `${PrinterColors.Error}--- ERROR${PrinterColors.Reset}`,
    );
  }

  /**
   * Formats a message by splitting it into lines of appropriate width
   * @param message The message to format
   * @returns An array of formatted lines
   */
  private formatMessage(message: string): string[] {
    const words = message.replace(/\r/g, "").split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if (word.includes("\n")) {
        const [firstPart, ...remainingParts] = word.split("\n");

        if (firstPart) {
          this.addWordToLine(firstPart, currentLine, lines);
          currentLine = "";
        }

        for (const part of remainingParts) {
          if (part) {
            lines.push(currentLine);
            currentLine = part;
          } else {
            lines.push(currentLine);
            currentLine = "";
          }
        }
      } else {
        this.addWordToLine(word, currentLine, lines);
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Adds a word to the current line or starts a new line if needed
   * @param word The word to add
   * @param currentLine The current line being built
   * @param lines The array of completed lines
   */
  private addWordToLine(
    word: string,
    currentLine: string,
    lines: string[],
  ): void {
    const potentialLine = currentLine ? `${currentLine} ${word}` : word;

    if (potentialLine.length <= Printer.LINE_WIDTH) {
      currentLine = potentialLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
}
