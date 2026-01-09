import { Events, type GatewayIntentBits } from 'discord.js';
import { Bot } from '../client/index.js';
import { DEFAULT_BOT_INTENTS } from '../lib/constants.js';

/** The root application class for launching the bot */
export class Application {
  private bot: Bot;
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
    this.bot.on(Events.ClientReady, Bot.onReady);
    this.bot.login(this.botToken);
  }

  public stop() {
    this.bot.destroy();
  }
}
