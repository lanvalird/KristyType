import Bot from "@src/bot";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  ApplicationCommandType,
} from "discord.js";

export default class TestCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "test",
    description: "Test command…",
    type: ApplicationCommandType.ChatInput,
  };
  public readonly kristy?: KristyCommandConfig = {
    commandType: "guild",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  action = async (interaction: CommandInteraction) => {
    interaction.reply({
      content: "Not content.",
      ephemeral: true,
    });
  };
}
