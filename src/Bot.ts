import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreateListener";
import messagesListener from "./listeners/messagesListener";
import { printLog, printLogColorType } from "./utils/console";
import dotenv = require('dotenv');

dotenv.config()

// IMPORT CONSTANTS FROM .env
// Bot
const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_VERSION = process.env.BOT_VERSION;
export const BOT_VERSION_STATUS = process.env.BOT_VERSION_STATUS;
export const BOT_AUTHOR = process.env.BOT_AUTHOR;
// Author
export const AUTHOR_DISCORD_ID = process.env.AUTHOR_DISCORD_ID;

printLog("запускаю...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

try {
  ready(client);
  interactionCreate(client);
  messagesListener(client);
  // voiceChannelsListener(client);
} catch (e) {
  console.error(e);
}

printLog("вхожу...");
client.login(BOT_TOKEN).catch(() => {
  printLog("невалидный токен?", printLogColorType.getError())
  printLog("завершаю выполнение через 3 секунды...", printLogColorType.getError())
  setTimeout(() => {
    printLog("завершение процесса...")

    process.exit();
  }, 3000)
})

export { printLog };
