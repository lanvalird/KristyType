//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//
//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//
//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//
//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//
//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//
//
// В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.   В  Р А З Р А Б О Т К Е.
//

import { AudioPlayerStatus, NoSubscriberBehavior, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { printLog } from "../Bot";
import { Client, Events } from "discord.js";
import path from "path";

export default (client: Client): void => {
  client.on(Events.VoiceStateUpdate, async (oldVS, vs) => {
    if (vs.member?.id == client.user?.id) return;
    printLog("Зафиксировала изменения в войс-каналах");

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    player.on(AudioPlayerStatus.Idle, async () => {
      await player.stop();
    })

    if (vs.channelId === null) oldVS.channel?.send("Пока!")
      .catch();
    else if (oldVS.channelId === null) vs.channel?.send("Привет, ты не против, если я посижу тут с тобой?")
      .catch();
    else {
      try {
        vs.channel?.send("Ты переместился?");
      } catch (e) {
        const connection = getVoiceConnection(oldVS.guild.id);
        connection?.destroy();
      }
    }

    if (vs.channel) {
      const connection = joinVoiceChannel({
        channelId: vs.channel?.id,
        guildId: vs.channel?.guild.id,
        adapterCreator: vs.channel?.guild.voiceAdapterCreator,
      });
      player.play(createAudioResource(path.join(__dirname, '../lMusic/Summer.mp3')));
      connection.subscribe(player);

      player.on('error', error => {
        console.error(error);
      });

    } else {
      try {
        player.stop();

        const connection = getVoiceConnection(oldVS.guild.id);
        connection?.destroy();
      } catch (e) {

        const connection = getVoiceConnection(oldVS.guild.id);
        connection?.destroy();

        return;
      }
    }

    //     dbVoiceChannels.guildId.channelId;

    //     fs.writeFile('db/voiceChannels.json', JSON.stringify(dbVoiceChannels), (err: any) => {
    //         if (err) throw err;
    //         console.log('The file has been saved!');
    //     });
  });
};
