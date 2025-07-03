import "dotenv/config";

import Bot from "./Bot";
import ErrorListener from "./listeners/code/ErrorListener";
import DiscordEventListener from "./listeners/DiscordEventListener";
import commands from "./utils/commands";
import rawListeners from "./listeners";

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

const listeners: DiscordEventListener[] = [];

rawListeners.then((loadedListeners) => {
  for (let i = 0; i < loadedListeners.length; i++) {
    listeners.push(new loadedListeners[i](bot));
  }

  for (let i = 0; i < listeners.length; i++) {
    bot.registerListener(listeners[i]);
  }
});
