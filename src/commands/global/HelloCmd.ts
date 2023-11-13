import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../../Command";

export const HelloCmd: Command = {
  name: "hello",
  description: "Returns a greeting",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = "Hello there!";

    await interaction.reply({
      ephemeral: true,
      content,
    });
  },
};
