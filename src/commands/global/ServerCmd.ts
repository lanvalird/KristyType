import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Command";

export const ServerCmd: Command = {
  name: "server",
  description: "Returns info about server.",
  nameLocalizations: {
    "ru": "сервер",
  },
  descriptionLocalizations: {
    "ru": "Возвращает инфу о сервере.",
  },
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setTitle(interaction.guild?.name || "Не найдено имя гильдии")
      .setDescription(
        interaction.guild?.description || "Не найдено описание гильдии",
      )
      .setThumbnail(interaction.guild?.iconURL() || null)
      .addFields([
        {
          name: "Участники",
          value: interaction.guild?.memberCount.toString() || "?",
          inline: true,
        },
        {
          name: "Роли",
          value: interaction.guild?.roles.cache.size.toString() || "?",
          inline: true,
        },
        {
          name: "Владелец",
          value: `<@${interaction.guild?.ownerId.toString() || "error"}>`,
          inline: true,
        },
      ]);

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  },
};
