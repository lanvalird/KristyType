import Bot from "@src/Bot";
import { readdirSync } from "fs";
import { join } from "path";

import type DiscordEventListener from "./DiscordEventListener";

type Listener = Array<new (bot: Bot) => DiscordEventListener>;

const dir = join(__dirname, "discord");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));

const listeners: Promise<Listener> = Promise.all(
  files.map(async (file) => {
    const path = join(dir, file);
    const listener = await import(path);

    return listener.default as new (bot: Bot) => DiscordEventListener;
  }),
);

export default listeners;
