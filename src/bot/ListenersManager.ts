import { Client } from "discord.js";
import { Printer } from "../libs/Printer";
import DiscordBaseEventListener from "../listeners/DiscordEventListener";
import Bot from "./Bot";

export default class RegisterListeners {
  private _listeners: DiscordBaseEventListener[] = [];
  protected readonly client: Client;
  protected readonly printer: Printer;

  constructor(bot: Bot) {
    this.client = bot.client;
    this.printer = bot.printer;
  }

  public add(listener: DiscordBaseEventListener) {
    this.printer.print(
      `регистрирую слушатель событий ${listener.object.event} (#${
        this._listeners.length + 1
      })…`,
    );
    this.client.on(listener.object.event, listener.object.action);
    this._listeners.push(listener);
    return this;
  }

  public remove(listener: DiscordBaseEventListener) {
    const index = this._listeners.findIndex(
      (l) =>
        l.object.event === listener.object.event &&
        l.object.action === listener.object.action,
    );

    if (index || index === 0) {
      this.printer.print(
        `удаляю слушатель событий ${listener.object.event} (#${index + 1})…`,
      );
      this.client.off(listener.object.event, listener.object.action);
      this._listeners[0].destroy();
      this._listeners.splice(index, 1);
    } else
      this.printer.error(`слушатель ${listener.object.event} не был найден`);

    return this;
  }

  public removeAll() {
    const repeat = this._listeners.length;
    for (let i = repeat; i > 0; i--) {
      const listener = this._listeners[0];
      this.remove(listener);
    }
    this._listeners = [];
    this.client.removeAllListeners();
  }
}
