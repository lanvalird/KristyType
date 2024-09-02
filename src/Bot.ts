import { Client, GatewayIntentBits } from "discord.js";
import { Printer, PrinterColors } from "./libs/Printer";
import { ICommand } from "./interfaces/ICommand";
import { Config } from "./libs/Config";
export default class Bot {
  public client: Client;
  public printer: Printer;
  public commands: ICommand[] = [];
  private _config: Config | undefined;

  get config() {
    return this._config?.getConfig();
  }
  public destroy() {
    this.client.destroy();
  }

  constructor(
    token: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listeners: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: any[],
    config?: { name: string; path: string },
  ) {
    this.printer = new Printer(config?.name && config.name);

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

    this.client = new Client({
      // ПРИСВАЕМ БОТУ ПРАВА
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
    });

    // РЕГИСТРАЦИЯ ПРОСЛУШАТЕЛЕЙ
    this.printer.print("регистрация слушателей…");
    listeners.forEach((listener) => {
      const l = new listener(this).object;
      this.client.on(l.event, l.action);
    });

    // ЛОГГИНЕМСЯ
    this.printer.print("производится вход…");
    this.client
      .login(token)
      .catch(() => this.printer.error("Невалидный токен!"));
  }
}
