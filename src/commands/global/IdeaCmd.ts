import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  ModalActionRowComponentBuilder,
  TextInputStyle,
  ActionRowBuilder,
  TextInputBuilder,
} from "discord.js";
import { Command } from "../../Command";

export const IdeaCmd: Command = {
  name: "idea",
  description: "Suggest your idea.",
  nameLocalizations: {
    "ru": "идея",
  },
  descriptionLocalizations: {
    "ru": "Предложи свою идею.",
  },
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      type: ApplicationCommandOptionType.String,
      description: "Заголовок твоей идеи",
      required: true,
      maxLength: 70,
      minLength: 20
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
            .setStyle(TextInputStyle.Short)
            .setMaxLength(70)
            .setMinLength(20)
        ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .addComponents(
          new TextInputBuilder()
            .setCustomId('ideaContent')
            .setLabel("Напиши подробно о своей идее")
            .setPlaceholder("Добавить команду, которая будет заставлять бота есть чипсы.")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(600)
            .setMinLength(20)
        )
    );

    await interaction.showModal(modal)
  },
};
