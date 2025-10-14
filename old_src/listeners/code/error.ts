import { Printer } from "@src/libs/printer";

export class ErrorListener {
  public printer = new Printer("ОТЛАДЧИК");
  private handler = (error: Error) => {
    if (error instanceof Error) {
      this.printer.error(error.name + " – " + error.message);
    }
  };

  public destroy() {
    process.off("unhandledRejection", this.handler);
  }

  constructor() {
    process.on("unhandledRejection", this.handler);
  }
}
