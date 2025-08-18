import Bot from "@src/bot/bot";
import { readdirSync } from "fs";
import { join } from "path";

import type { IListener } from "@interfaces/listeners";

export abstract class DiscordEventListener implements IListener {
  protected bot: Bot;
  public event = "";
  // action()
  public abstract action(event?: any): Promise<void>;
  public abstract action(...args: any[]): Promise<void>;
  public async destroy(): Promise<void> {}

  public constructor(bot: Bot) {
    this.bot = bot;

    return this;
  }

  public get object(): IListener {
    return {
      event: this.event,
      action: this.action,
      destroy: this.destroy,
    };
  }
}

type Listener = Array<new (bot: Bot) => DiscordEventListener>;

const dir = join(__dirname, "discord");
const files = readdirSync(dir).filter((file) => file.endsWith(".ts"));

const listeners: Promise<Listener> = Promise.all(
  files.map(async (file) => {
    const path = join(dir, file);
    const listener = await import(path);

    return listener.default as new (bot: Bot) => DiscordEventListener;
  }),
);

export default listeners;
