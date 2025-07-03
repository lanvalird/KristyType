
import Bot from "@src/Bot";
import { readdirSync } from "fs";
import { join } from "path";

import type DiscordEventListener from "./DiscordEventListener";

type Listener = Array<new (bot: Bot) => DiscordEventListener>;

const dir = join(import.meta.dirname, "discord");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));

const listeners: Listener = [];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const path = [dir, file];

  const listener = await import(join(...path));

  listeners.push(listener);
}

export default listeners;
