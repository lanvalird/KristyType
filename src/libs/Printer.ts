export enum PrinterColors {
  primary = "\x1b[0;35m",
  success = "\x1b[0;32m",
  warning = "\x1b[0;33m",
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

  public notify(message: string, color?: PrinterColors) {
    if (!color) color = PrinterColors.primary;
    const title = "\n⋄ ОПОВЕЩЕНИЕ (" + this.prefix + ")";
    const divider = "\n⋄ " + "⋄".repeat(13 + this.prefix.length) + " ⋄>";
    const result = this.cut(message);

    result.forEach(
      (s, i) => s.endsWith("\n") && (result[i + 1] = "    " + result[i + 1]),
    );

    console.log(
      color +
        divider +
        title +
        divider +
        "\n⋄ " +
        PrinterColors.reset +
        result.join(color + "\n⋄ " + PrinterColors.reset) +
        color +
        divider +
        "\n" +
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

  private cut(message: string) {
    const strokes: string[] = message.replaceAll("\r", "").split(" ");
    const result: string[] = [];

    for (let i = 0; i < strokes.length; i++) {
      const el = strokes[i];

      if (el.includes("\n")) {
        strokes.splice(
          i,
          1,
          ...el.split("\n").map((s, ni) => {
            if (ni === 0) return s;

            i++;

            return (s = "\n" + s);
          }),
        );
      }
    }

    for (let i = 0; i < strokes.length; i++) {
      let str = strokes[i];

      while (str.length < 100) {
        if (!strokes[i + 1] || strokes[i + 1].startsWith("\n")) break;
        if (str.startsWith("\n")) str = str.slice(1);

        str = str + " " + strokes[i + 1];
        i++;
      }

      result.push(str);
    }

    return result;
  }
}
