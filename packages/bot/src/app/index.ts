import type { IBot } from '../interfaces/bot.js';
import type { GatewayIntentBits } from 'discord.js';
import { Events } from 'discord.js';
import { DEFAULT_BOT_INTENTS } from '../lib/constants.js';
import { Bot } from '../client/index.js';

/** The root application class for launching the bot */
export class Application {
  private bot: IBot;
  private botToken: string;

  constructor(
    botToken: string,
    botIntents: GatewayIntentBits[] = DEFAULT_BOT_INTENTS
  ) {
    Bot.validateToken(botToken);
    this.botToken = botToken;
    this.bot = new Bot({ intents: botIntents });
  }

  public run() {
    this.bot.client.on(Events.ClientReady, Bot.onReady);
    this.bot.client.login(this.botToken);
  }

  public stop() {
    this.bot.client.destroy();
  }
}
