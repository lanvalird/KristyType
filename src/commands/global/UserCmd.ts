import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import { Command } from "../../Command";

export const UserCmd: Command = {
  name: "user",
  description: "Returns info about user.",
  nameLocalizations: {
    "ru": "пользователь",
  },
  descriptionLocalizations: {
    "ru": "Возвращает инфу о пользователе.",
  },
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "User?",
      required: false,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const member = interaction.options.getMember("user") as GuildMember || interaction.member;
    if (!member) {
      await interaction.reply({
        content: "Oops! Пользователь не был найден!"
      })

      return;
    };

    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.guild?.name || "Инфа от Kristy",
        iconURL: interaction.guild?.iconURL() || undefined,
      })
      .setTitle(member.user.globalName || "Не найдено глобальное имя")
      .setDescription(!(member.user.bot) ? "Пользователь..." : "Бот...")
      .setThumbnail(
        member.user.avatarURL({
          size: 512
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

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("openRoles")
        .setLabel("Открыть список ролей")
        .setStyle(ButtonStyle.Secondary),
    );

    const response = await interaction.reply({
      ephemeral: true,
      embeds: [content],
      components: [row],
    });

    const collectorFilter = (i: { user: { id: string; }; }) => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000
      });
      await confirmation.deferReply({
        ephemeral: true
      });

      if (confirmation.customId == "openRoles") {
        let roles: string[] = [];

        const pageNumber = 1;

        // const rowPagesNav = new ActionRowBuilder<ButtonBuilder>().addComponents(
        //   new ButtonBuilder()
        //     .setCustomId("prevPage")
        //     .setLabel(`Назад (${pageNumber - 1})`)
        //     .setStyle(ButtonStyle.Secondary)
        //     .setEmoji("⏪")
        //     .setDisabled(
        //       pageNumber <= 1
        //         ? true
        //         : false
        //     ),
        //   new ButtonBuilder()
        //     .setCustomId("nextPage")
        //     .setLabel(`Далее (${pageNumber + 1})`)
        //     .setStyle(ButtonStyle.Secondary)
        //     .setEmoji("⏩")
        //     .setDisabled(pageNumber * 15 <= (member.roles as GuildMemberRoleManager).cache.size
        //       ? false
        //       : true
        //     )
        // );

        roles = []
        for (let i: number = (pageNumber - 1) * 15; i <= (pageNumber - 1) * 15 + 15; i++) {
          const role = member.roles.cache.at(i);

          if (role != undefined) {
            roles.push(role.name);
          }
        }

        await confirmation.editReply({
          content:
            `Вывожу до 15 ролей пользователя ${member.displayName}: ${(
              roles.length > 1
                ? `\`\`\`${roles.toString()}\`\`\``
                : "их нет... Не считая `@everyone`")}`,
          embeds: [],
          // components: [rowPagesNav],
        });
      }
    } catch (e) {
      console.error(e);

      await interaction.editReply({
        embeds: [content]
      });
    }
  },
};
