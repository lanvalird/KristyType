import Bot from "@src/Bot";
import { readdirSync } from "fs";
import { join } from "path";

import type DiscordEventListener from "./DiscordEventListener";

type Listener = Array<new (bot: Bot) => DiscordEventListener>;

const dir = join(__dirname, "discord");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));

const listeners: Listener = [];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const path = join(dir, file);
  const listener = import(path);

  async () => listeners.push(await listener);
}

export default listeners;
