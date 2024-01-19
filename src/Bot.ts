import dotenv from 'dotenv';
dotenv.config()

import { Client, GatewayIntentBits } from "discord.js";
import { printLog, printLogColorType } from "./utils/console";
import ready from "./listeners/ready";
import messagesListener from "./listeners/messagesListener";
import slashListener from "./listeners/slashListener";
import voiceChannelsListener from "./listeners/voiceChannelsListener";
import modalListener from "./listeners/modalListener";
import presencesListener from './listeners/presencesListener';


// ИМПОРТ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ИЗ .env
// Автор
export const AUTHOR = process.env.AUTHOR || "<kr_err:notvar>";
export const AUTHOR_DISCORD_ID = process.env.AUTHOR_DISCORD_ID || "<kr_err:notvar>";
// Бот
const BOT_TOKEN = process.env.BOT_TOKEN || "<kr_err:notvar>";
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID || "<kr_err:notvar>";
export const BOT_VERSION = process.env.BOT_VERSION || "<kr_err:notvar>";
export const BOT_VERSION_STATUS = process.env.BOT_VERSION_STATUS || "<kr_err:notvar>";
// Гильдия
export const BOT_GUILD_ID = process.env.BOT_GUILD_ID || "<kr_err:notvar>";
export const BOT_GUILD_INVITE_URL = process.env.BOT_GUILD_INVITE_URL || "<kr_err:notvar>";
// Логирование
export const BOT_LOG_CHANNEL_ID = process.env.BOT_LOG_CHANNEL_ID || "<kr_err:notvar>";
export const BOT_LOG_PREFIX = process.env.BOT_LOG_PREFIX || "<kr_err:notvar>";

printLog("запускаю...");

// СОЗДАЁМ КЛИЕНТ
const client = new Client({
  // ПРИСВАЕМ БОТУ ПРАВА
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});
export default client;

// TRY CATCH ТОЧНО РАБОТАЕТ?
try {
  ready(client);

  slashListener(client);
  modalListener(client);

  messagesListener(client);
  // For ~ The Void
  presencesListener(client);

  // Нужны фиксы
  voiceChannelsListener(client);
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
export const randomIntFromInterval = (min: number, max: number): number => {
  // min = Math.ceil(min);
  // max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min)
}