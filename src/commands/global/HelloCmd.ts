import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../../Command";

export const HelloCmd: Command = {
  name: "greeting",
  description: "Returns a greeting",
  nameLocalizations: {
    "ru": "приветствие",
  },
  descriptionLocalizations: {
    "ru": "Возвращает приветствие.",
  },
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = "Привет, люди!";

    await interaction.reply({
      ephemeral: true,
      content,
    });
  },
};
