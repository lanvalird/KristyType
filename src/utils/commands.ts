import { lstatSync, readdirSync } from "fs";
import { join } from "path";

import type { ICommand } from "../interfaces/command";

const dir = join(__dirname, "../", "commands");
const commands: Array<ICommand> = [];

async function addCommands(dir: string) {
  const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = join(dir, file);
    const command = await import(path);

    commands.push(command.default);
  }

  readdirSync(dir)
    .filter((folder) => lstatSync(join(dir, folder)).isDirectory())
    .forEach((folder) => addCommands(join(dir, folder)));
}

async function getCommands(): Promise<Array<ICommand>> {
  await addCommands(dir);

  return commands;
}

export default getCommands;
