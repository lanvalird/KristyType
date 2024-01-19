import {
  ActivityType,
  Client,
  ColorResolvable,
  EmbedBuilder,
  Events,
  Message,
  PartialMessage,
  TextChannel,
} from "discord.js";
import { BOT_GUILD_ID, BOT_LOG_CHANNEL_ID, randomIntFromInterval } from "../Bot";
import activities from "../db/activities.json";
import krCodeTranslator from "../utils/krCodeTranslator";


export default (client: Client): void => {
  try {
    client.on(Events.MessageCreate, (m) => sendMsgLogs(m, "send"));
    client.on(Events.MessageUpdate, (m, nm) => sendMsgLogs(m, "update", nm));
    client.on(Events.MessageDelete, (m) => sendMsgLogs(m, "delete"));

    client.on(Events.MessageCreate, (m) => {
      if (m.channelId !== "1175738843203391550") return; // та-самая-пати
      if (m.author.id !== "1122199797449904179" /* TheVoid */) {
        return;
      }

      sendActivityForTheVoid(m)
    });
  } catch (e: unknown) {
    console.log(e);
  }
};

const sendMsgLogs = (
  m: Message | PartialMessage,
  reasonType: string,
  m2?: Message | PartialMessage,
) => {
  if (m.author?.bot) return;

  let color: ColorResolvable;
  let reason: string;

  switch (reasonType) {
    case "send":
      reason = "отправлено";
      color = "#7fdf7f";
      break;

    case "update":
      reason = "обновлено";
      color = "#7f7f7f";
      break;

    case "delete":
      reason = "удалено";
      color = "#df7f7f";
      break;

    default:
      reason = "||`{ошибка в коде}`||";
      color = "#7f7f7f";
      break;
  }

  const fields = [
    {
      name: `${m2 ? "Старое с" : "С"}одержание`,
      value: `\`\`\`${m.content
        ? krCodeTranslator("StringToKrCode", m.content, m.client)
        : "<Пусто>"
        }\`\`\``,
      inline: false,
    },
  ];
  if (m.attachments.size > 0) {
    fields.push({
      name: `${m2 ? "Старые в" : "В"}ложения`,
      value: m.attachments
        .map((att) => `\`\`\`${att.url}\`\`\``)
        .join(`\n&&\n`),
      inline: false,
    });
  }

  if (m2) {
    fields.push({
      name: "Новое содержание",
      value: `\`\`\`${m2.content
        ? krCodeTranslator("StringToKrCode", m2.content, m.client)
        : "<Пусто>"
        }\`\`\``,
      inline: false,
    });
    if (m2.attachments.size > 0) {
      fields.push({
        name: "Новые вложения",
        value: `${m2.attachments
          .map((att) => `\`\`\`${att.url}\`\`\``)
          .join(`\n&&\n`)}`,
        inline: false,
      });
    }
  }

  (m.client.channels.cache.get(BOT_LOG_CHANNEL_ID) as TextChannel).send({
    embeds: [
      new EmbedBuilder()
        .setColor(color)
        .setAuthor({
          name: `${m.author?.username} (${m.author?.id})`,
          iconURL: m.author?.avatarURL() || m.author?.defaultAvatarURL,
        })
        .setTitle(`${m.client.guilds.cache.get(BOT_GUILD_ID)?.name}, встречай!`)
        .setDescription(
          `Я узнала, что было __*${reason}*__ сообщение от ${m.author} на *${m.guild
          }* (${m.guildId}) в канале "[${(m.channel as TextChannel).name}](${m.url
          })".`,
        )
        .setThumbnail(m.guild?.iconURL() || null)
        .setTimestamp(new Date())
        .addFields(fields),
    ],
  });
};

let theVoidChatting = false;
const theVoidChattingBlocked = false;

const sendActivityForTheVoid = async (m: Message) => {
  if (theVoidChatting || theVoidChattingBlocked) return;
  theVoidChatting = true;

  m.channel.sendTyping();

  let activity = activities[randomIntFromInterval(0, activities.length - 1)];
  let activityType: ActivityType = 0;
  if (activity.startsWith("playing ")) {
    activity = activity.replace("playing ", "Играю в ");
    activityType = ActivityType.Playing;
  } else if (activity.startsWith("watching ")) {
    activity = activity.replace("watching ", "Смотрю ");
    activityType = ActivityType.Watching;
  } else if (activity.startsWith("listening ")) {
    activity = activity.replace("listening ", "Слушаю ");
    activityType = ActivityType.Listening;
  } else if (activity.startsWith("competing ")) {
    activity = activity.replace("competing ", "Соревнуюсь в ");
    activityType = ActivityType.Competing;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activityType = ActivityType.Custom;
  }

  activity = krCodeTranslator("KrCodeToString", activity, m.client);

  setTimeout(() => {
    (m.channel as TextChannel).send({
      content: `${activity}`,
      reply: {
        messageReference: m
      }
    });
    theVoidChatting = false;
  },
    2000
  )
}