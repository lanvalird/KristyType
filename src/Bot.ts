import { Client, GatewayIntentBits } from "discord.js";
import { Printer, PrinterColors } from "./libs/Printer";
import { Config } from "./libs/Config";
import { ICommand } from "./interfaces/ICommand";

export default class Bot {
  private _config: Config;

  public printer: Printer;
  public client: Client;
  public commands: ICommand[] = [];

  constructor({
    token,
    listeners,
    commands = [],
    config,
  }: {
    token: string;
    listeners: any[];
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

    // РЕГИСТРАЦИЯ ПРОСЛУШАТЕЛЕЙ
    this.printer.print("регистрация слушателей…");
    listeners.forEach((listener) => {
      const l = new listener(this).object;
      this.client.on(l.event, l.action);
    });

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
    // ЛОГГИНЕМСЯ
    this.printer.print("производится вход…");
    this.client
      .login(token)
      .catch(() => this.printer.error("Невалидный токен!"));
  }

  public destroy() {
    this.client.removeAllListeners();
    this.client.destroy();
  }
}
