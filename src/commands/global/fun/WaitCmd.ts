import {
    CommandInteraction,
    Client,
    ApplicationCommandType,
    EmbedBuilder,
    VoiceChannel,
} from "discord.js";
import { AudioPlayerStatus, NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { ICommand } from "../../../interfaces/ICommand";
import path from "node:path";

const command: ICommand = {
    name: "wait",
    description: "Plays relaxing music.",
    nameLocalizations: {
        "ru": "ожидать",
    },
    descriptionLocalizations: {
        "ru": "Воспроизводит расслабляющую музыку.",
    },
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = new EmbedBuilder()
            .setColor("#7fdf7f")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTitle((client.user?.username || "Kristy") + " начинает проигрывать Wait.mp3...")
            .setDescription(
                "Kristy подключилась к Вашему голосовому каналу и начала проигрывать расслабляющую музыка для ожидания. Она выйдет, как только файл полностью проиграется!",
            )
            .setThumbnail(client.user?.avatarURL() || null);

        if (interaction.user.id != interaction.guild?.ownerId) {
            await interaction.reply({
                content: `Ты не похож на <@${interaction.guild?.ownerId}>! Уйди!!!!!!!`,
                ephemeral: true
            });

            return;
        }

        const vsc = client.guilds.cache.get(interaction.guild.id)?.members.cache.get(interaction.user.id)?.voice.channel;
        if (vsc == undefined || vsc == null) {
            await interaction.reply({
                content: `Ты не в войсе!`,
                ephemeral: true
            });

            return;
        }

        connectionHelper(vsc as VoiceChannel)
        await interaction.reply({
            embeds: [content],
            ephemeral: true
        });
    }
}
export default command;

const connectionHelper = (voiceChannel: VoiceChannel) => {
    if (voiceChannel.guild.id && voiceChannel.id) {
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        player.play(
            createAudioResource(
                path.join(__dirname, '../../../assets/music/Wait.mp3')
            )
        );

        player.on('error', error => {
            console.error(error);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop()
            connection.destroy()
        });

        connection.subscribe(player);
    }
}