import { GatewayIntentBits } from "discord.js";

export const DEFAULT_BOT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.Guilds,
];
