import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import Bot from "@src/bot/Bot";

export default class ServerCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "server",
    description: "Returns info about server.",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public async action(interaction: CommandInteraction) {
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
  }
}
