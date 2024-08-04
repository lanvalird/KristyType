import fs from "fs";
import path from "path";
import { ICommand } from "./interfaces/ICommand";

const commands: Array<ICommand> = [];

const dir = path.join(__dirname, "commands");
function addFiles(dir: string) {
  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".ts"))
    .forEach((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command = require(path.join(dir, file)).default;

      commands.push(command);
    });

  fs.readdirSync(dir)
    .filter((folder) => fs.lstatSync(path.join(dir, folder)).isDirectory())
    .forEach((folder) => addFiles(path.join(dir, folder)));
}

addFiles(dir);

export default commands;
