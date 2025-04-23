import fs from "fs";
import path from "path";
import DiscordEventListener from "./DiscordEventListener";
import Bot from "@src/Bot";

const listeners: Array<new (bot: Bot) => DiscordEventListener> = [];

const dir = path.join(__dirname, "discord");
fs.readdirSync(dir)
  .filter((file) => file.endsWith(".ts"))
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const listener = require(path.join(dir, file)).default;

    listeners.push(listener);
  });

export default listeners;
