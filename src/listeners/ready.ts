import { ActivityType, Client, Events } from "discord.js";
import { Commands } from "../Commands";
import { BOT_AUTHOR, BOT_VERSION, BOT_VERSION_STATUS, printLog } from "../Bot";
import { printLogColorType } from "../utils/console";

export default (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    if (!client.user || !client.application) return;

    printLog(`вошла... ${client.user.username}... Подготавливаюсь...`);

    client.application.commands.set(Commands);

    client.user.setStatus("dnd");
    client.user?.setActivity("🦢 KristyBot (TS)", {
      type: ActivityType.Custom,
    });
    printLog(
      `сменила статус (${client.user.presence.status}), сбросила список команд и поставила базовую активность: "${client.user.presence.activities}".`,
    );

    setInterval(
      () => {
        const activities: string[] = [
          "TypeScript Edition",
          "watching Life, love, death... Loop...",
          "watching Жизнь, любовь, смерть... Круговорот...",
          "watching Неßа, Лайва, Вßерт... Цiкл...",
          "Lots of activities",
          "playing for you...",
          '🍬 "Candy-Candy"!"',
          "😒 Спрэйт...",
          "EXA! Oops...",
          "OwO",
          "Мб устроим пати?",
          "Горжусь тем, что из Банитеи",
          "Хэйле! Я - Крïстi, нектö Бот",
          "Привет! Я - Кристи, милый бот",
          "Hello! I am Kristy, the cute bot",
          "Spaaaaaaaaaaaaaaace stroke",
          "Ландыши, ландыши...",
          "Мне нравятся фиалки, Вам?",
          "Ой, а я забыла",
          "✊ Я сильная",
          "✊ Ты сильный",
          "✊ Ты сильная",
          "✊ Мотивируйся",
          "✊ Забудь о проблемах",
          `playing version ${BOT_VERSION}-${BOT_VERSION_STATUS} (last?)`,
          `By ${BOT_AUTHOR}`,
          `watching server "${client.guilds.cache.at(
            randomIntFromInterval(0, client.guilds.cache.size - 1),
          )?.name}"?`,
          `watching ${client.guilds.cache.size} servers...`,
        ];

        let activity =
          activities[randomIntFromInterval(0, activities.length - 1)];
        let activityType: ActivityType = 0;
        if (activity.startsWith("playing ")) {
          activity = activity.replace("playing ", "");
          activityType = ActivityType.Playing;
        } else if (activity.startsWith("watching ")) {
          activity = activity.replace("watching ", "");
          activityType = ActivityType.Watching;
        } else if (activity.startsWith("listening ")) {
          activity = activity.replace("listening ", "");
          activityType = ActivityType.Listening;
        } else {
          activityType = ActivityType.Custom;
        }

        client.user?.setActivity(activity, {
          type: activityType,
        });

        client.user?.setStatus;
        printLog(`изменила активность ("${activityType}: ${activity}")`);
      },
      (1000 * 60) * 1,
    );

    let allMembersCount: number = 0;
    printLog(
      `подготовилась и теперь готова к приключениям! Кстати, я на ${client.guilds.cache.size
      } серверах, где в общей сумме ${(client.guilds.cache.forEach((g) => {
        allMembersCount += g.memberCount;
      }),
        allMembersCount)
      } участников (участники могут повторяться)`,
      printLogColorType.getSuccess(),
    );
  });
};

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
