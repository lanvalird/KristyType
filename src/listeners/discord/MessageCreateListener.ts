import DiscordBaseEventListener from "@listeners/DiscordEventListener";
import { Events, Message, PermissionsBitField, TextChannel } from "discord.js";
import Bot from "@src/bot";
import { IMessageListener } from "@src/interfaces/IMessageListener";

export default class MessageCreateListener
  extends DiscordBaseEventListener
  implements IMessageListener
{
  protected bot: Bot;
  public event = Events.MessageCreate;
  public action = async (message: Message): Promise<void> => {
    if (!this.bot.client.user?.id) return;

    const botPermissions = (message.channel as TextChannel).permissionsFor(
      this.bot.client.user?.id,
    );

    if (
      botPermissions?.has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.SendMessagesInThreads,
      ])
    ) {
      // Для локальной шутки
      if (
        new RegExp(/\/скинь([-_]*)ножки/gm).test(message.content.toLowerCase())
      )
        message.reply("Извращенец!");

      // Просто чтобы было
      if (message.mentions.has(this.bot.client.user?.id)) {
        setTimeout(() => message.reply("Я тебя не понимаю."), 1000);

        (message.channel as TextChannel)?.sendTyping();
      }
    }
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }
}
