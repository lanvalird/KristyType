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

import { AudioPlayerStatus, NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { AUTHOR_DISCORD_ID, randomIntFromInterval } from "../Bot";
import { Client, Events, VoiceState } from "discord.js";
import fs from 'node:fs';
import path from 'node:path';


export default (client: Client): void => {
  client.on(Events.VoiceStateUpdate, async (oldVS, vs) => {
    if (vs.member?.id != AUTHOR_DISCORD_ID) return;

    if (oldVS.channelId === null) connectionHelper(vs)
    else if (vs.channelId === null) connectionHelper(oldVS, true)
    else if (!(vs.channelId === oldVS.channelId)) {
      connectionHelper(oldVS, true);
      connectionHelper(vs);
    }
  });
};

const connectionHelper = (vs: VoiceState, off?: boolean) => {
  if (vs.guild.id && vs.channel?.id) {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    const musicsPath = path.join(__dirname, '../assets/music');
    const formatsFile: string[] = [".mpeg", ".mp3", ".mp4", ".opus", ".acc"]
    const musicsFiles: string[] = [];
    for (let i = 0; i < formatsFile.length; i++) {
      fs.readdirSync(musicsPath).filter(
        file => file
          .endsWith(formatsFile[i])
      )
        .forEach(
          e => {
            musicsFiles.push(e);
          }
        )
    }
    player.play(
      createAudioResource(
        path.join(
          musicsPath,
          musicsFiles.at(
            randomIntFromInterval(0, musicsFiles.length - 1)
          )
          ??
          "../lMusic/Wait.mp3"
        )
      )
    );

    player.on('error', error => {
      console.error(error);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      player.stop()
      connection.destroy()
    });

    const connection = joinVoiceChannel({
      channelId: vs.channel.id,
      guildId: vs.channel.guild.id,
      adapterCreator: vs.channel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    if (off === true) {
      if (player) player.stop()
      if (connection) connection.destroy()
    }
  }
}