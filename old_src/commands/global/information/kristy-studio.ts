import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@src/interfaces/command";
import { KristyCommandConfig } from "@src/interfaces/kristy-command-config";
import Bot from "@src/bot/bot";

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
      )
      .addFields({
        name: "Ошибка!",
        value: "```Пока что недоступно```",
      });

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  }
}
