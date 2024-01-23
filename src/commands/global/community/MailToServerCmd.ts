import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
  TextChannel,
} from "discord.js";
import { ICommand } from "@interfaces/ICommand";

const command: ICommand = {
    name: "mailtoserver",
    description: "Send message... On another server!",
    nameLocalizations: {
      "ru": "письмонасервер",
    },
    descriptionLocalizations: {
      "ru": "Отправить сообщение... На другой сервер!",
    },
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "message",
        type: ApplicationCommandOptionType.String,
        description: "Message?",
        required: true,
      },
      {
        name: "channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Кто сказал мороженое?",
        required: true,
      },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
      const content = new EmbedBuilder()
        .setColor("#7f7f7f")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setTitle("Сообщение было отправлено!")
        .setDescription(
          interaction.options.get("message")?.value?.toString() || "Oops!",
        )
        .setThumbnail(interaction.guild?.iconURL() || null)
        .addFields([
          {
            name: "ВНИМАНИЕ",
            value:
              "Эта функция в ранней разработке, что значит - в данный момент она может работать некоррекно!",
          },
        ]);

      if (interaction.user.id != interaction.guild?.ownerId) {
        interaction.reply({
          content: "Только владелец сервера в праве использовать данный тип комманд!"
        });

        return;
      }
      await (interaction.client.channels.cache.get(
        interaction.options.get("channel")?.channel?.id || interaction.channelId
      ) as TextChannel).send({
        content: interaction.options.get("message")?.value?.toString() || "Вам пытались отправить сообщение, но этот формат не поддерживается"
      });

      interaction.reply({
        embeds: [content],
        ephemeral: true,
      });
    },
  }
export default command;