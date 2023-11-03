import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";

export const SuggestIdeaCmd: Command = {
  name: "idea",
  description: "Suggest your idea.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      type: ApplicationCommandOptionType.String,
      description: "Heading for your idea",
      required: true,
      maxLength: 24,
    },
    {
      name: "idea",
      type: ApplicationCommandOptionType.String,
      description: "Your idea",
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setTitle(interaction.options.get("title")?.value?.toString() || "Oops!")
      .setDescription(
        interaction.options.get("idea")?.value?.toString() || "Oops!",
      )
      .setThumbnail(interaction.guild?.iconURL() || null)
      .addFields([
        {
          name: "ВНИМАНИЕ",
          value:
            "Эта функция в ранней разработке, что значит - в данный момент она не работает... Да, это пустышка...\nv2.0",
        },
      ]);

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  },
};
