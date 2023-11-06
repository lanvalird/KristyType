import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
  ModalBuilder,
  ModalActionRowComponentBuilder,
  TextInputStyle,
  ActionRowBuilder,
  TextInputBuilder,
  Events,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { Command } from "../Command";

export const IdeaCmd: Command = {
  name: "idea",
  description: "Suggest your idea.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      type: ApplicationCommandOptionType.String,
      description: "Заголовок твоей идеи",
      required: true,
      maxLength: 56,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const modal = new ModalBuilder()
      .setCustomId('ideaModal')
      .setTitle('Твоя офуфенная идея!');;

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .addComponents(
          new TextInputBuilder()
            .setCustomId('ideaTitle')
            .setLabel("Заголовок твоей идеи (кратко)")
            .setPlaceholder("Добавить команду `/чипсы`")
            .setValue(interaction.options.get("title")?.value?.toString() || "")
            .setStyle(TextInputStyle.Short)),
      new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .addComponents(
          new TextInputBuilder()
            .setCustomId('ideaContent')
            .setLabel("Напиши подробно о своей идее")
            .setPlaceholder("Добавить команду, которая будет заставлять бота есть чипсы.")
            .setStyle(TextInputStyle.Paragraph)
        )
    );

    await interaction.showModal(modal)

    client.on(Events.InteractionCreate, interaction => {
      if (!interaction.isModalSubmit()) return;

      const embed = new EmbedBuilder()
        .setColor("#7f7f7f")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setTitle(
          interaction.fields.getTextInputValue('ideaTitle') || "Oops!"
        )
        .setDescription(
          interaction.fields.getTextInputValue('ideaContent') || "Oops!",
        )
        .setThumbnail(interaction.guild?.iconURL() || null)
        .addFields([
          {
            name: "Участник",
            value:
              `<@${interaction.user.id}>`
          },
        ]);

      (client.channels.cache.get("1171067195611164724") as TextChannel).send({
        embeds: [embed]
      }).then(async msg => {
        await msg.react("👍");
        await msg.react("👎");
        await msg.react("💘");
        await (msg.channel as TextChannel).threads.create({
          name: interaction.fields.getTextInputValue('ideaTitle'),
          autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
          startMessage: msg
        })
        interaction.reply({
          content: `Сообщение было отправлено (${msg.url})`,
          ephemeral: true
        });
      })

      return;
    });
  },
};
