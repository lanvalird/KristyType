import { IConfigFile } from "@src/interfaces/IConfigFile";
import { readFile } from "fs";

export class Config {
  private config: IConfigFile | undefined;

  getConfig() {
    return this.config;
  }

  constructor(path: string) {
    readFile(path, (err, file) => {
      if (err instanceof Error)
        throw new Error(
          "Не удалось открыть файл конфигурации по пути: " + path,
        );

      const data = JSON.parse(file.toString());
      if (data !== undefined) this.config = data;
      else throw new Error("Файл конфигурации пуст");

      return;
    });
  }
}
