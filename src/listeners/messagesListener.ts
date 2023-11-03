import {
  Client,
  ColorResolvable,
  EmbedBuilder,
  Events,
  Message,
  PartialMessage,
  TextChannel,
} from "discord.js";
import { guildId, logChannelId } from "../config.json";

export default (client: Client): void => {
  try {
    client.on(Events.MessageCreate, (m) => sendMsgLogs(m, "send"));
    client.on(Events.MessageUpdate, (m, nm) => sendMsgLogs(m, "update", nm));
    client.on(Events.MessageDelete, (m) => sendMsgLogs(m, "delete"));
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
      value: `\`\`\`${m.content ? m.content
        .replaceAll("```", "<kr_code>")
        .replaceAll("``", "<kr_qq>")
        .replaceAll("`", "<kr_q>")
        :
        "<Пусто>"
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
      value: `\`\`\`${m2.content ? m2.content
        .replaceAll("```", "<kr_code>")
        .replaceAll("``", "<kr_qq>")
        .replaceAll("`", "<kr_q>")
        :
        "<Пусто>"
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

  (m.client.channels.cache.get(logChannelId) as TextChannel).send({
    embeds: [
      new EmbedBuilder()
        .setColor(color)
        .setAuthor({
          name: `${m.author?.username} (${m.author?.id})`,
          iconURL: m.author?.avatarURL() || m.author?.defaultAvatarURL,
        })
        .setTitle(`${m.client.guilds.cache.get(guildId)?.name}, встречай!`)
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
