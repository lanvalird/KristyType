import { Client, EmbedBuilder, Events, TextChannel, ThreadAutoArchiveDuration } from "discord.js";

export default (client: Client): void => {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "ideaModal") {

      await interaction.reply({
        content: `Сообщение доставляется...`,
        ephemeral: true
      });

      const embed = new EmbedBuilder()
        .setColor("#7f7f7f")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setTitle(
          interaction.fields.getTextInputValue('ideaTitle') || "Oops!"
        )
        .setDescription(
          interaction.fields.getTextInputValue('ideaContent') || "Oops!",
        )
        .setThumbnail(interaction.guild?.iconURL() || null)
        .addFields([
          {
            name: "Участник",
            value: `<@${interaction.user.id}>`,
            inline: true
          },
          {
            name: "Сервер",
            value: interaction.guild?.name || "Неизвестная гильдия",
            inline: true
          },
        ]);

      (client.channels.cache.get("1168953688799313981") as TextChannel).send({
        embeds: [embed]
      }).then(async msg => {
        await msg.react("👍");
        await msg.react("👎");
        await msg.react("💘");
        await (msg.channel as TextChannel).threads.create({
          name: interaction.fields.getTextInputValue('ideaTitle'),
          autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
          startMessage: msg
        })

        await interaction.editReply({
          content: `Сообщение было отправлено (${msg.url})`
        });
      })

      return;
    }
  });
}