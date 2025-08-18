import {
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ChatInputApplicationCommandData,
} from "discord.js";
import { ICommand } from "@src/interfaces/command";
import { KristyCommandConfig } from "@src/interfaces/kristy-command-config";
import Bot from "@src/bot/bot";

export default class ServersCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "servers",
    description: "Returns top 10 servers with bot.",
    type: ApplicationCommandType.ChatInput,
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public async action(interaction: CommandInteraction) {
    const content = new EmbedBuilder()
      .setColor("#7f7f7f")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setTitle("Топ серверов")
      .setDescription("Лучшие сервера по количеству участников в нём");

    const guilds = await this.bot.client.guilds.cache.sort(
      (a: { memberCount: number }, b: { memberCount: number }) =>
        b.memberCount - a.memberCount,
    );

    for (let i = 0; i < 10 && i < guilds.size; i++) {
      const g = await guilds.at(i)?.fetch();
      if (g) {
        const field = {
          name: g.name,
          value: `(${g.memberCount}) ${g.description || "Без описания."}`,
          inline: false,
        };

        if (i === 0) field.name = `🥇 ${field.name}`;
        else if (i === 1) field.name = `🥈 ${field.name}`;
        else if (i === 2) field.name = `🥉 ${field.name}`;

        content.addFields(field);
      }
    }

    await interaction.reply({
      ephemeral: true,
      embeds: [content],
    });
  }
}
