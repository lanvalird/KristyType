import {
    CommandInteraction,
    Client,
    ApplicationCommandType,
    EmbedBuilder,
    ActivityType,
} from "discord.js";
import { Command } from "../Command";
import { printLog, printLogColorType } from "../utils/console";
import { AUTHOR_DISCORD_ID } from "../Bot";

export const KillCmd: Command = {
    name: "kill",
    description: "Kill bot...",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = new EmbedBuilder()
            .setColor("#df7f7f")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTitle((client.user?.username || "Kristy") + " ложится спать...")
            .setDescription(
                "Она устала...",
            )
            .setThumbnail(client.user?.avatarURL() || null);

        if (interaction.user.id != AUTHOR_DISCORD_ID) {
            await interaction.reply({
                content: `Ты не похож на <#${AUTHOR_DISCORD_ID}>! Уйди!!!!!!!`
            });

            return;
        }
        await interaction.reply({
            ephemeral: true,
            embeds: [content],
        });

        let exitSeconds = 30;
        printLog(`бот выключится после ${exitSeconds}-секундного бездействия!`, printLogColorType.getError());

        setInterval(async () => {
            if (exitSeconds <= 0) {
                await client.user?.setActivity(`🚫 Отключусь прямо сейчас`, {
                    type: ActivityType.Custom,
                });
                await client.destroy();
                printLog("клиент уничтожен!", printLogColorType.getError());
                printLog("закрытие программы...");
                process.exit();
            }

            client.user?.setActivity(`🚫 Отключусь через ${exitSeconds} секунд`, {
                type: ActivityType.Custom,
            });

            exitSeconds -= 5;
        }, 5000);
    },
};
