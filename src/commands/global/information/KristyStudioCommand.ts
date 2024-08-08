import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@interfaces/ICommand";
import { KristyCommandConfig } from "@src/types/KristyCommandConfigType";
import Bot from "@src/Bot";

export default class KristyStudioCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "kristy-studio",
    description: "You uses KristySudio?",
    type: ApplicationCommandType.ChatInput,
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public async action(interaction: CommandInteraction) {
    const client = this.bot.client;

    const user = await this.bot.prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setTitle(client.user?.displayName || client.user?.username || "Kristy")
      .setDescription(
        "Информация о том, пользуешься ли ты панелью управления от Kristy",
      )
      .setThumbnail(client.user?.avatarURL() || null)
      .setImage(
        "https://repository-images.githubusercontent.com/713889312/9fb97cae-1f60-4810-9301-378530c41387",
      );

    if (user) {
      content.addFields([
        {
          name: "Ваш Kristy ID",
          value: user.id,
          inline: true,
        },
        {
          name: "Ваше имя",
          value: user.name || "*Нет имени*",
          inline: true,
        },
        {
          name: "Белый список",
          value: user.isWhitelist + "",
          inline: true,
        },
      ]);
    } else {
      content.addFields([
        {
          name: "Пользователь?",
          value: "Нет",
        },
      ]);
    }

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  }
}
