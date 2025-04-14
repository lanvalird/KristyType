import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import Bot from "@src/Bot";

export default class BotCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "bot",
    description: "Returns info about bot.",
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
        client.application?.description || "Твоя лучшая подруга 😅",
      )
      .setThumbnail(client.user?.avatarURL() || null)
      .addFields([
        {
          name: "Тип версии",
          value: "``` KristyType ```",
          inline: true,
        },
        {
          name: "Версия",
          value:
            "``` " +
            this.bot.config?.bot.version +
            "-" +
            this.bot.config?.bot.status +
            " ```",
          inline: true,
        },
        {
          name: "Последнее обновление",
          value: "``` Code Refactor ```",
          inline: false,
        },
        {
          name: "Автор",
          value: "``` " + this.bot.config?.author.name + " ```",
          inline: true,
        },
        {
          name: "Благодарность",
          value: "``` @fockusty ```",
          inline: true,
        },
        {
          name: "Языки",
          value: "``` WIP ```",
          inline: false,
        },
      ])
      .setImage(
        "https://repository-images.githubusercontent.com/713889312/9fb97cae-1f60-4810-9301-378530c41387",
      );

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  }
}
