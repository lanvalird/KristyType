import "dotenv/config";

import rawListeners from "./listeners";
import Bot from "./Bot";
import commands from "./utils/commands";
import ErrorListener from "./listeners/code/ErrorListener";
import DiscordEventListener from "./listeners/DiscordEventListener";

new ErrorListener();

if (!!process.env.BOT_TOKEN === false)
  throw new Error("Hey! Your token... void.");
const token = process.env.BOT_TOKEN;

const bot = new Bot({
  token,
  commands,
  config: {
    name: "Kristy",
    path: "./src/config.json",
  },
});

const listeners: DiscordEventListener[] = []
for (let i = 0; i < rawListeners.length; i++) {
 listeners.push(new rawListeners[i](bot))
}

for (let i = 0; i < listeners.length; i++) {
  bot.registerListener(listeners[i]);
}

