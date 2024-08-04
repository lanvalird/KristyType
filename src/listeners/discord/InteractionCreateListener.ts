import Bot from "@src/Bot";
import { IInteractionListener } from "@src/interfaces/IInteractionListener";
import { InteractionListener } from "../DiscordListener";
import { Events, Interaction } from "discord.js";

export default class InteractionCreateListener
  extends InteractionListener
  implements IInteractionListener
{
  protected bot: Bot;
  public event = Events.InteractionCreate;
  public action = async (interaction: Interaction): Promise<void> => {
    const bot = this.bot;

    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      const command = bot.commands.find(
        (c) => c.discord.name === interaction.commandName,
      );
      command?.action(interaction);
    }
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }
}
