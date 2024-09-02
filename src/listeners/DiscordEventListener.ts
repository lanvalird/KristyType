import Bot from "@src/Bot";
import { IListener } from "@interfaces/IListener";

export default abstract class DiscordEventListener implements IListener {
  protected bot: Bot;
  public event = "";
  // action()
  public abstract action(event?: any): Promise<void>;
  public abstract action(...args: any[]): Promise<void>;

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
