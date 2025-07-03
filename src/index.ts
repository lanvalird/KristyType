import "dotenv/config";

import Bot from "./Bot";
import ErrorListener from "./listeners/code/ErrorListener";
import rawListeners from "./listeners";
import getCommands from "./utils/commands";
import DiscordEventListener from "./listeners/DiscordEventListener";

new ErrorListener();

if (!process.env.BOT_TOKEN) throw new Error("Hey! Your token... void.");
const token = process.env.BOT_TOKEN;

(async () => {
  const commands = await getCommands();
  const bot = new Bot({
    token,
    commands,
    config: { name: "Kristy", path: "./src/config.json" },
  });

  (await rawListeners).forEach(
    (listener: new (bot: Bot) => DiscordEventListener) =>
      bot.registerListener(new listener(bot)),
  );
})();
