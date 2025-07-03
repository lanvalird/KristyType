import { lstatSync, readdirSync } from "fs";
import { join } from "path";

import type { ICommand } from "../interfaces/ICommand";

const dir = join(import.meta.dirname, "../", "commands");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));
const commands: Array<ICommand> = [];

async function addCommands(dir: string) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = [dir, file];

    const command = await import(join(...path));

    commands.push(command);
  }

  console.log(dir);
  readdirSync(dir)
    .filter((folder) => lstatSync(join(dir, folder)).isDirectory())
    .forEach((folder) => addCommands(join(dir, folder)));
}

addCommands(dir);

export default commands;
