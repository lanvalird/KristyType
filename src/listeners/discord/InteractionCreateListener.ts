import Bot from "@src/Bot";
import { IInteractionListener } from "@src/interfaces/IInteractionListener";
import { InteractionListener } from "../DiscordListener";
import { Events, Interaction } from "discord.js";
import { PrinterColors } from "@src/libs/Printer";

export default class InteractionCreateListener
  extends InteractionListener
  implements IInteractionListener
{
  protected bot: Bot;
  public event = Events.InteractionCreate;
  public action = async (interaction: Interaction): Promise<void> => {
    const bot = this.bot;

    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      try {
        const command = bot.commands.find(
          (c) => c.discord.name === interaction.commandName,
        );
        command?.action(interaction);
      } catch (e) {
        if (e instanceof Error) {
          this.bot.printer.print(
            `Обнаружена ошибка! (${interaction.commandId})`,
            PrinterColors.error,
          );
          this.bot.printer.error(e.name + " – " + e.message);
        }
      }
    }
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }
}
