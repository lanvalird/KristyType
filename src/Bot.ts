import { Client, GatewayIntentBits } from "discord.js";
import { Printer } from "./libs/Printer";
import { ICommand } from "./interfaces/ICommand";

export default class Bot {
  public client: Client;
  public printer: Printer;
  public commands: ICommand[] = [];

  public destroy() {
    this.client.destroy();
  }

  constructor(
    token: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listeners: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: any[],
    config?: { name: string },
  ) {
    this.printer = new Printer(config?.name && config.name);

    this.printer.print("инициализация экземпляра…");

    for (let i = 0; i < commands.length; i++) {
      const c = commands[i];

      this.commands.push(new c(this));
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

    // РЕГИСТРАЦИЯ СЛУШАТЕЛЕЙ
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
