import { GatewayIntentBits } from 'discord.js';

/** The Application class uses this constant to create an instance of the bot */
export const DEFAULT_BOT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.MessageContent,
] as const;
