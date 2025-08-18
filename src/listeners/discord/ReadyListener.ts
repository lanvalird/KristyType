import { IListener } from "@interfaces/IListener";
import DiscordBaseEventListener from "@listeners/DiscordEventListener";
import Bot from "@src/bot/Bot";
import { ActivityListController } from "@src/libs/ActivityListController";
import { PrinterColors } from "@src/libs/Printer";
import { ActivityType, Events } from "discord.js";
import { join } from "node:path";

export default class ReadyListener
  extends DiscordBaseEventListener
  implements IListener
{
  private intervalId: NodeJS.Timeout | null = null;

  protected bot: Bot;

  public event = Events.ClientReady;
  public action = async (): Promise<void> => {
    const bot = this.bot;

    // Бот авторизован?
    if (!bot.client.user || !bot.client.application) return;

    bot.printer.print(
      `произведён вход от лица ${bot.client.user.username}. Подготавливаюсь…`,
      PrinterColors.Primary,
    );

    bot.printer.print(`обновляю список команд.`, PrinterColors.Primary);

    bot.client.application.commands.set(
      bot.commands
        .filter(
          (c) =>
            c.kristy?.commandType === "global" ||
            c.kristy?.commandType === undefined,
        )
        .map((c) => c.discord),
    );
    bot.printer.print(
      `обновил(-а) глобальный список команд.`,
      PrinterColors.Success,
    );

    bot.printer.print(
      `проверяю наличие команд для конкретной гильдии, если есть.`,
    );
    if (process.env.BOT_GUILD_ID) {
      bot.printer.print(
        `обновляю список локальных команд (гильдия).`,
        PrinterColors.Primary,
      );

      bot.client.application.commands
        .set(
          bot.commands
            .filter((c) => c.kristy?.commandType === "guild")
            .map((c) => c.discord),
          process.env.BOT_GUILD_ID,
        )
        .catch(() =>
          bot.printer.error(
            `Не удалось выставить команды гильдии. Сервер: ${
              process.env.BOT_GUILD_ID
            }`,
          ),
        );

      bot.printer.print(
        `процесс обновления команд окончен.`,
        PrinterColors.Success,
      );
    }

    this.setInitialActivity();

    const activityManager = await this.initActivityManager();

    this.intervalId = setInterval(
      async () => {
        bot.client.user?.setActivity(
          await activityManager.getRandomActivity(),
          {
            type: ActivityType.Custom,
          },
        );
        bot.printer.print(
          `сменил(-а) активность: "${bot.client.user?.presence.activities.map((act) => act.state)}".`,
          PrinterColors.Primary,
        );
      },
      1_000 * 60 * 1, // 1 minute
    );
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }

  private setInitialActivity(): void {
    const botUser = this.bot.client.user;
    botUser.setStatus("dnd");
    botUser.setActivity("🔥 HotDev | Рефакторная версия", {
      type: ActivityType.Custom,
    });
    this.bot.printer.print(
      `сменил(-а) статус (${botUser.presence.status}), и поставил(-а) базовую активность: "${botUser.presence.activities.map(
        (act) => act.state,
      )}".`,
      PrinterColors.Success,
    );
  }

  private async initActivityManager(): ActivityListController {
    const activityManager = new ActivityListController();
    await activityManager.registerActivityLists(
      join("src", "assets", "activities", "files"),
    );

    return activityManager;
  }

  public async destroy(): Promise<void> {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
