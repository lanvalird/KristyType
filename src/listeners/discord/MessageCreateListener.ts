import DiscordBaseEventListener from "@listeners/DiscordEventListener";
import { Events, Message, PermissionsBitField, TextChannel } from "discord.js";
import Bot from "@src/bot";
import { IMessageListener } from "@src/interfaces/IMessageListener";
import { ActivityListController } from "@src/libs/ActivityListController";
import { join } from "path";

export default class MessageCreateListener
  extends DiscordBaseEventListener
  implements IMessageListener
{
  protected bot: Bot;
  public event = Events.MessageCreate;

  private _loverId = process.env.KRISTY_LOVER_ID;

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

      if (!this._loverId) return;

      if (message.author.id !== this._loverId) {
        setTimeout(
          () => message.reply(`Я намерена общаться только с ${this._loverId}`),
          1000,
        );

        (message.channel as TextChannel)?.sendTyping();
      } else {
        // Временное решение
        const alc = new ActivityListController();
        const path = join(__dirname, "../", "activities", "files", "love");
        await alc.registerActivityList(path);

        setTimeout(
          async () => message.reply(await alc.getRandomActivity()),
          1000,
        );

        (message.channel as TextChannel)?.sendTyping();
      }
    }
  };

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
  }
}
