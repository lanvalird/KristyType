import { Client, GatewayIntentBits } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { Config } from "../libs/Config";
import { Printer, PrinterColors } from "../libs/Printer";
import DiscordBaseEventListener from "../listeners/DiscordEventListener";
import RegisterListeners from "./RegisterListeners";

export default class Bot {
  private readonly _config: Config;

  protected readonly registerListeners: RegisterListeners;

  public readonly printer: Printer;
  public readonly client: Client;
  public readonly commands: ICommand[] = [];

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
    this._config
      .load()
      .catch((reason) =>
        this.printer.error(
          "конфиг не загружен (приложение продолжает работать): " + reason,
        ),
      );

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
          PrinterColors.Success,
        );
        this.printer.error(`${commands[i]} (${i}) – ${err}`);
      }
    }

    this.client = this.create();

    this.login(token);

    this.registerListeners = new RegisterListeners(this.client, this.printer);
  }

  public get config() {
    return this._config?.getConfig();
  }

  public getConfig() {
    return this._config;
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
    this.client.login(token).catch((err) => {
      if (err instanceof Error)
        this.printer.error("Произошла ошибка :::>   " + err.name);
    });
  }

  public addListener(listener: DiscordBaseEventListener) {
    this.registerListeners.add(listener);
    return this;
  }

  public removeListener(listener: DiscordBaseEventListener) {
    this.registerListeners.remove(listener);

    return this;
  }

  public destroy() {
    this.registerListeners.removeAll();

    this.client.destroy();
  }
}
