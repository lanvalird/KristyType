import {
    CommandInteraction,
    Client,
    ApplicationCommandType,
    EmbedBuilder,
} from "discord.js";
import { ICommand } from "@interfaces/ICommand";
import { AUTHOR, BOT_VERSION, BOT_VERSION_STATUS } from "../../../Bot";

const command: ICommand = {
    name: "bot",
    description: "Returns info about bot.",
    nameLocalizations: {
        "ru": "бот",
    },
    descriptionLocalizations: {
        "ru": "Возвращает инфу о боте.",
    },
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = new EmbedBuilder()
            .setColor("#7f7f7f")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTitle(
                client.user?.displayName
                || client.user?.username
                || "Kristy?"
            )
            .setDescription(
                client.application?.description || "Не найдено описание бота",
            )
            .setThumbnail(client.user?.avatarURL() || null)
            .addFields([
                {
                    name: "Тип версии",
                    value: "```KristyType```",
                    inline: true,
                },
                {
                    name: "Версия",
                    value: `\`\`\`${BOT_VERSION}-${BOT_VERSION_STATUS}\`\`\``,
                    inline: true,
                },
                {
                    name: "Автор",
                    value: `\`\`\`${AUTHOR}\`\`\``,
                    inline: true,
                },
                {
                    name: "Языки",
                    value: "```WIP```",
                    inline: true,
                },
                {
                    name: "Последнее обновление",
                    value: "```Команда [/idea]```",
                    inline: true,
                },
                {
                    name: "Благодарность",
                    value: "```@fockusty```",
                    inline: true,
                },
            ]);

        await interaction.reply({
            ephemeral: true,
            embeds: [content],
        });
    },
}
export default command;
