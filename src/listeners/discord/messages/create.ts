import DiscordBaseEventListener from "@src/data/discord-event";
import { Events, Message, PermissionsBitField, TextChannel } from "discord.js";
import Bot from "@src/bot/bot";
import { IMessageListener } from "@src/interfaces/listeners";
import { ActivityListController } from "@src/libs/controllers/activity-list";
import { join } from "path";

export class MessageCreateListener
  extends DiscordBaseEventListener
  implements IMessageListener
{
  protected bot: Bot;
  public event = Events.MessageCreate;

  private _loverId = process.env.KRISTY_LOVER_ID;
  private theVoidChattingPause = false;

  // ВРЕМЕННО
  private _alc: ActivityListController = new ActivityListController();

  public action = async (message: Message): Promise<void> => {
    if (!this.bot.client.user?.id) return;
    if (message.author.id === this.bot.client.user.id) return;
    if (!message.mentions.has(this.bot.client.user.id)) return;

    const botPermissions = (message.channel as TextChannel).permissionsFor(
      this.bot.client.user?.id,
    );

    const hasSendMessagesPerms = botPermissions?.has([
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.SendMessagesInThreads,
    ]);

    if (hasSendMessagesPerms) {
      const nozhkiReg = new RegExp(/\/скинь([-_]*)ножки/gm);
      const lowerMessageContent = message.content.toLowerCase();

      // Для локальной шутки
      if (nozhkiReg.test(lowerMessageContent)) {
        message.reply("Извращенец!");
        return;
      }

      if (!this._loverId) return;

      if (message.author.id !== this._loverId) {
        setTimeout(
          () =>
            message.reply(`Я намерена общаться только с <@${this._loverId}>`),
          1000,
        );

        (message.channel as TextChannel)?.sendTyping();
      } else {
        if (this.theVoidChattingPause) return;
        this.theVoidChattingPause = true;

        setTimeout(
          // this._alc - ВРЕМЕННО
          async () => (
            message.reply(await this._alc.getRandomActivity()),
            (this.theVoidChattingPause = false)
          ),
          1000,
        );

        (message.channel as TextChannel)?.sendTyping();
      }
    }
  };

  private async registerVoidyChatting() {
    const path = join(__dirname, "../../", "assets", "activities", "files");
    await this._alc.registerActivityList(join(path, "love"));
    await this._alc.registerActivityList(join(path, "feeling"));
    await this._alc.registerActivityList(join(path, "music"));
  }

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;

    this.registerVoidyChatting();
  }
}
