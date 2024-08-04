import Bot from "@src/Bot";
import { IListener } from "@interfaces/IListener";
import { IInteractionListener } from "@src/interfaces/IInteractionListener";
import { Interaction, Message } from "discord.js";
import { IMessageListener } from "@src/interfaces/IMessageListener";

export abstract class DiscordListener implements IListener {
  protected bot: Bot;
  public event = "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public action = async (...args: any[]) => {};

  public constructor(bot: Bot) {
    this.bot = bot;

    return this;
  }

  public get object(): IListener {
    return {
      event: this.event,
      action: this.action,
    };
  }
}

export abstract class InteractionListener
  extends DiscordListener
  implements IInteractionListener
{
  protected bot: Bot;
  public event = "";
  public action = async (interaction: Interaction) => {
    interaction;
  };

  public constructor(bot: Bot) {
    super(bot);
    this.bot = bot;

    return this;
  }

  public get object(): IListener {
    return {
      event: this.event,
      action: this.action,
    };
  }
}

export abstract class MessageListener
  extends DiscordListener
  implements IMessageListener
{
  protected bot: Bot;
  public event = "";
  public action = async (message: Message) => {
    message;
  };

  public constructor(bot: Bot) {
    super(bot);
    this.bot = bot;

    return this;
  }

  public get object(): IListener {
    return {
      event: this.event,
      action: this.action,
    };
  }
}
