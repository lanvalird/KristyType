import {
  CommandInteraction,
  Client,
  Interaction,
} from "discord.js";
import { Commands, GuildCommands } from "../Commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction,
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  const slashGuildCommand = GuildCommands.find((c) => c.name === interaction.commandName);

  if (slashCommand) {
    slashCommand.run(client, interaction);
  } else if (slashGuildCommand) {
    slashGuildCommand.run(client, interaction);
  } else {
    interaction.reply({ content: "oops!" });

    return;
  }
};
