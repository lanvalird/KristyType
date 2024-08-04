import { DiscordListener } from "@listeners/DiscordListener";
import { ActivityType, Events } from "discord.js";
import Bot from "@src/Bot";
import { IListener } from "@interfaces/IListener";
import { PrinterColors } from "@src/libs/Printer";

export default class ReadyListener
  extends DiscordListener
  implements IListener
{
  protected bot: Bot;
  public event = Events.ClientReady;
  public action = async (): Promise<void> => {
    const bot = this.bot;

    // Бот авторизован?
    if (!bot.client.user || !bot.client.application) return;

    bot.printer.print(
      `произведён вход от лица ${bot.client.user.username}. Подготавливаюсь…`,
      PrinterColors.primary,
    );

    bot.client.application.commands.set(
      bot.commands
        .filter((c) => c.kristy?.commandType === "global")
        .map((c) => c.discord),
    );
    if (process.env.BOT_GUILD_ID)
      bot.client.application.commands
        .set(
          bot.commands
            .filter((c) => c.kristy?.commandType === "guild")
            .map((c) => c.discord),
          process.env.BOT_GUILD_ID,
        )
        .catch(() =>
          bot.printer.error(
            "Не удалось выставить команды гильдии. Сервер " +
              process.env.BOT_GUILD_ID,
          ),
        );

    // СМЕНА НА ПЕРВИЧНЫЙ СТАТУС
    bot.client.user.setStatus("dnd");
    bot.client.user?.setActivity("🔥 HotDev | Рефакторная версия", {
      type: ActivityType.Custom,
    });
    bot.printer.print(
      `сменил(-а) статус (${bot.client.user.presence.status}), сбросил(-а) список команд и поставил(-а) базовую активность: "${bot.client.user.presence.activities.map((act) => act.state)}".`,
      PrinterColors.success,
    );
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }
}
