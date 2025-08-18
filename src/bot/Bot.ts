import { Client, ClientOptions, GatewayIntentBits } from "discord.js";
import { ICommand } from "../interfaces/command";
import { Config } from "../libs/config";
import { Printer, PrinterColors } from "../libs/printer";
import ListenersManager from "./listeners-manager";

export default class Bot {
  private readonly _config: Config;

  protected readonly listenersManager: ListenersManager;

  public readonly printer: Printer;
  public readonly client: Client;
  public readonly commands: ICommand[] = [];

  constructor({
    token,
    commands = [],
    config,
    createOptions,
  }: {
    token: string;
    commands: any[];
    config?: { name: string; path: string };
    createOptions?: ClientOptions;
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

    this.client = this.create(
      createOptions || {
        intents: [GatewayIntentBits.Guilds],
      },
    );

    this.login(token);

    this.listenersManager = new ListenersManager(this);
  }

  private create(options: ClientOptions): Client<boolean> {
    const client = new Client({ ...options });
    return client;
  }

  private login(token: string) {
    this.printer.print("производится вход…");
    this.client.login(token).catch((err) => {
      if (err instanceof Error)
        this.printer.error("Произошла ошибка :::>   " + err.name);
    });
  }

  public get config() {
    return this._config?.getConfig();
  }

  public getConfigClass() {
    return this._config;
  }

  public get listeners() {
    return this.listenersManager;
  }

  public destroy() {
    this.listenersManager.removeAll();

    this.client.destroy();
  }
}
