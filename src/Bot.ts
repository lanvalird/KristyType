import { Client, GatewayIntentBits } from "discord.js";
import { printLog, printLogColorType } from "./utils/console";
import dotenv from 'dotenv';
import ready from "./listeners/ready";
import messagesListener from "./listeners/messagesListener";
import interactionCreate from "./listeners/interactionCreateListener";
// import voiceChannelsListener from "./listeners/voiceChannelsListener";

dotenv.config()

// IMPORT CONSTANTS FROM .env
// Author
export const AUTHOR = process.env.AUTHOR || "<kr_err:notvar>";
export const AUTHOR_DISCORD_ID = process.env.AUTHOR_DISCORD_ID || "<kr_err:notvar>";
// Bot
const BOT_TOKEN = process.env.BOT_TOKEN || "<kr_err:notvar>";
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID || "<kr_err:notvar>";
export const BOT_VERSION = process.env.BOT_VERSION || "<kr_err:notvar>";
export const BOT_VERSION_STATUS = process.env.BOT_VERSION_STATUS || "<kr_err:notvar>";
// Guild
export const BOT_GUILD_ID = process.env.BOT_GUILD_ID || "<kr_err:notvar>";
export const BOT_GUILD_INVITE_URL = process.env.BOT_GUILD_INVITE_URL || "<kr_err:notvar>";
// Log
export const BOT_LOG_CHANNEL_ID = process.env.BOT_LOG_CHANNEL_ID || "<kr_err:notvar>";
export const BOT_LOG_PREFIX = process.env.BOT_LOG_PREFIX || "<kr_err:notvar>";

printLog("запускаю...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

try {
  ready(client);
  interactionCreate(client);
  messagesListener(client);
  // Реализовать при помощи команды
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
export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}