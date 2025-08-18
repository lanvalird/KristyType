import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
  GuildMember,
  GuildMemberRoleManager,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import Bot from "@src/bot/Bot";

export default class UserCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "user",
    description: "Returns info about user.",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "User?",
        required: false,
      },
    ],
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public async action(interaction: CommandInteraction) {
    const member =
      (interaction.options.get("user")?.member as GuildMember) ||
      interaction.member;
    if (!member) {
      await interaction.reply({
        content: "Oops! Пользователь не был найден!",
      });

      return;
    }

    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.guild?.name || "Инфа от Kristy",
        iconURL: interaction.guild?.iconURL() || undefined,
      })
      .setTitle(member.user.globalName || "Не найдено глобальное имя")
      .setDescription(!member.user.bot ? "Пользователь…" : "Бот…")
      .setThumbnail(
        member.user.avatarURL({
          size: 512,
        }) || member.user.defaultAvatarURL,
      )
      .addFields([
        {
          name: "Имя пользователя",
          value: `\`\`\` ${member.user.username || "-"} \`\`\``,
          inline: true,
        },
        {
          name: "Глобальное имя",
          value: `\`\`\` ${member.user.globalName || "-"} \`\`\``,
          inline: true,
        },
        {
          name: "Ролей",
          value: `\`\`\` ${(member.roles as GuildMemberRoleManager).cache.size || "-"} \`\`\``,
          inline: true,
        },
        {
          name: "Идентификатор",
          value: `\`\`\` ${member.user.id || "-"} \`\`\``,
          inline: true,
        },
      ]);

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  }
}
