import "dotenv/config";

import { Bot } from "./bot";
import { ErrorListener } from "./listeners/code";
import getCommands from "./utils/commands";
import { GatewayIntentBits } from "discord.js";
import { ReadyListener } from "./listeners/discord/client";

new ErrorListener();

if (!process.env.BOT_TOKEN) throw new Error("Hey! Your token... void.");
const token = process.env.BOT_TOKEN;

(async () => {
  const commands = await getCommands();
  const bot = new Bot({
    token,
    commands,
    config: { name: "Kristy", path: "./src/config.json" },
    createOptions: {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
    },
  });

  bot.listeners.add(new ReadyListener(bot));
})();
