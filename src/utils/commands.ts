import { lstatSync, readdirSync } from "fs";
import { join } from "path";

import type { ICommand } from "../interfaces/ICommand";

const dir = join(__dirname, "../", "commands");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));
const commands: Array<ICommand> = [];

async function addCommands(dir: string) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = join(dir, file);
    const command = await import(path);

    commands.push(command);
  }

  readdirSync(dir)
    .filter((folder) => lstatSync(join(dir, folder)).isDirectory())
    .forEach((folder) => addCommands(join(dir, folder)));
}

addCommands(dir);

export default commands;
