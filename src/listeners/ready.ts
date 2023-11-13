import { ActivityType, Client, Events } from "discord.js";
import { Commands, GuildCommands } from "../Commands";
import { BOT_GUILD_ID, printLog, randomIntFromInterval } from "../Bot";
import { printLogColorType } from "../utils/console";
import activities from "../db/activities.json"
// import activities from "../db/lbd_activities.json"
import krCodeTranslator from "../utils/krCodeTranslator";

export default (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    // Бот авторизовался?
    if (!client.user || !client.application) return;

    printLog(`вошла... ${client.user.username}... Подготавливаюсь...`);

    // printLog("Я на вот таких серверах...")
    // client.guilds.cache.forEach(e => {
    //   printLog("  " + e.name, printLogColorType.getSuccess());
    // })

    // РЕГИСТРАЦИЯ КОМАНД
    client.application.commands.set(Commands);
    client.application.commands.set(GuildCommands, BOT_GUILD_ID);

    // СМЕНА НА ПЕРВИЧНЫЙ СТАТУС
    client.user.setStatus("dnd");
    client.user?.setActivity("🦢 KristyType", {
      type: ActivityType.Custom,
    });
    printLog(
      `сменила статус (${client.user.presence.status}), сбросила список команд и поставила базовую активность: "${client.user.presence.activities}".`,
    );

    // КАЖДЫЕ N-СЕКУНДЫ СМЕНЯЕТ АКТИВНОСТЬ ИЗ СПИСКА АКТВИНОСТЕЙ
    setInterval(
      () => {

        let activity = activities[randomIntFromInterval(0, activities.length - 1)];
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
        } else if (activity.startsWith("competing ")) {
          activity = activity.replace("competing ", "");
          activityType = ActivityType.Competing;
        } else {
          activityType = ActivityType.Custom;
        }

        activity = krCodeTranslator("KrCodeToString", activity, client);

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
      } серверах, где в среднем ~${(
        client.guilds.cache.forEach(
          (g) => {
            allMembersCount += g.memberCount;
          }
        ),
        Math.round(allMembersCount / client.guilds.cache.size)
      )
      } участников`,
      printLogColorType.getSuccess(),
    );
  });
};
