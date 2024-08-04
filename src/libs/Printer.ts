export enum PrinterColors {
  primary = "\x1b[0;35m",
  success = "\x1b[0;32m",
  error = "\x1b[0;31m",
  reset = "\x1b[0m",
}

export class Printer {
  public prefix: string;
  public suffix: string;

  constructor(prefix?: string, suffix?: string) {
    this.prefix = prefix ?? "Kristy";
    this.suffix = suffix ?? "";

    return this;
  }

  public print(message: string, color?: PrinterColors) {
    let anons = "";
    if (color) anons = color + "• " + PrinterColors.reset;

    console.log(
      anons +
        PrinterColors.primary +
        this.prefix +
        ": " +
        PrinterColors.reset +
        message +
        PrinterColors.primary +
        this.suffix,
      PrinterColors.reset,
    );
  }

  public error(message: string) {
    try {
      throw new Error(message);
    } catch (e) {
      if (e instanceof Error) {
        const cp = PrinterColors.primary;
        const ce = PrinterColors.error;
        const cr = PrinterColors.reset;
        console.error(
          `${ce}--- ERROR ${cr}– ` +
            `${cp + this.prefix + cr}` +
            `\n    ${e.message}` +
            `\n${ce}--- ERROR` +
            PrinterColors.reset,
        );
      }
    }
  }
}
