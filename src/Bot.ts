import { Client, GatewayIntentBits } from "discord.js";
import { Printer, PrinterColors } from "./libs/Printer";
import { Config } from "./libs/Config";
import { ICommand } from "./interfaces/ICommand";
import DiscordBaseEventListener from "./listeners/DiscordEventListener";
import { listeners } from "node:process";
import DiscordEventListener from "./listeners/DiscordEventListener";

export default class Bot {
  private _config: Config;
  private _listeners: DiscordBaseEventListener[] = [];

  public printer: Printer;
  public client: Client;
  public commands: ICommand[] = [];

  constructor({
    token,
    commands = [],
    config,
  }: {
    token: string;
    commands: any[];
    config?: { name: string; path: string };
  }) {
    this.printer = new Printer(config && config.name);

    this.printer.print("загрузка конфигурации…");
    this._config = new Config(config?.path || "./src/config.json");

    this.printer.print("инициализация экземпляра…");

    for (let i = 0; i < commands.length; i++) {
      const c = commands[i];
      try {
        this.commands.push(new c(this));
      } catch (err) {
        this.printer.print(
          "Весь список загруженных команд:\n" +
            this.commands
              .flatMap(
                (c, ni) =>
                  `    ${ni + 1}. ${c.discord.name} – ${c.discord.description}`,
              )
              .join("\n"),
          PrinterColors.success,
        );
        this.printer.error(`${commands[i]} (${i}) – ${err}`);
      }
    }

    this.client = this.create();

    this.login(token);
  }

  public get config() {
    return this._config?.getConfig();
  }

  private create() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
    });
    return client;
  }

  private login(token: string) {
    this.printer.print("производится вход…");
    this.client
      .login(token)
      .catch(() => this.printer.error("Невалидный токен!"));
  }

  public registerListener(listener: DiscordBaseEventListener) {
    this.printer.print(
      `регистрирую слушатель событий ${listener.object.event} (#${
        this._listeners.length + 1
      })…`,
    );
    this.client.on(listener.object.event, listener.object.action);
    this._listeners.push(listener);
    return this;
  }

  public removeListener(listener: DiscordBaseEventListener) {
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

  public destroy() {
    const repeat = this._listeners.length;
    for (let i = repeat; i > 0; i--) {
      const listener = this._listeners[0];
      this.removeListener(listener);
    }
    this._listeners = [];
    this.client.removeAllListeners();
    this.client.destroy();
  }
}
