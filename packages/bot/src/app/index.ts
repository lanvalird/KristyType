import { Events, GatewayIntentBits } from "discord.js";
import { Bot } from "../client/index.js";
import { DEFAULT_BOT_INTENTS } from "../lib/constants.js";

export class Application {
  private bot: Bot;
  private botToken: string;

  constructor(
    botToken: string,
    intents: GatewayIntentBits[] = DEFAULT_BOT_INTENTS
  ) {
    /** @todo Добавить валидацию */
    this.botToken = botToken;
    /** @todo Указать действующие права */
    this.bot = new Bot({ intents });
  }

  public run() {
    this.bot.on(Events.ClientReady, Bot.onReady);
    this.bot.login(this.botToken);
  }
}
