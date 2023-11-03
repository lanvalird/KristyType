import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreateListener";
import messagesListener from "./listeners/messagesListener";
import { printLog, printLogColorType } from "./utils/console";
import dotenv = require('dotenv');

dotenv.config()

// IMPORT CONSTANTS FROM .env
// Author
export const AUTHOR = process.env.AUTHOR
  || "undefined";
export const AUTHOR_DISCORD_ID = process.env.AUTHOR_DISCORD_ID
  || "undefined";
// Bot
const BOT_TOKEN = process.env.BOT_TOKEN
  || "undefined";
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID
  || "undefined";
export const BOT_VERSION = process.env.BOT_VERSION
  || "undefined";
export const BOT_VERSION_STATUS = process.env.BOT_VERSION_STATUS
  || "undefined";
// Guild
export const BOT_GUILD_ID = process.env.BOT_GUILD_ID
  || "undefined";
export const BOT_GUILD_INVITE_URL = process.env.BOT_GUILD_INVITE_URL
  || "undefined";
// Log
export const BOT_LOG_CHANNEL_ID = process.env.BOT_LOG_CHANNEL_ID
  || "undefined";
export const BOT_LOG_PREFIX = process.env.BOT_LOG_PREFIX
  || "undefined";

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

export const printStartError = (invalidArg: string, error?: Error) => {
  if (error) {
    printLog(`получила ошибку: ${error.name}`, printLogColorType.getError())
    printLog(` | ${error.message}`, printLogColorType.getError())
  }
  printLog(`невалидный ${invalidArg}?`, printLogColorType.getError())
  printLog("завершение процесса...")

  process.exit();
}

printLog("проверяю ENV файл (BOT_GUILD_ID и BOT_LOG_CHANNEL_ID)...");
if (BOT_LOG_CHANNEL_ID == "undefined" || BOT_GUILD_ID == "undefined") {
  printLog("Проверьте ENV файл на наличие ошибок!", printLogColorType.getError());
  printStartError('BOT_GUILD_ID или BOT_LOG_CHANNEL_ID');
}

printLog("вхожу...");
client.login(BOT_TOKEN).catch(e => printStartError("токен", e));

export { printLog };
