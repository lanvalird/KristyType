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

import { Client, Events, ChannelType } from "discord.js";

export default (client: Client): void => {
  client.on(Events.VoiceStateUpdate, async (voiceState) => {
    console.log("Зафиксировала изменения в войс-каналах");

    // if (voiceState) {}

    const whereToCreate = voiceState.channel?.parent?.id;
    if (!whereToCreate) return;

    const newChannel = voiceState.guild.channels.create({
      type: ChannelType.GuildVoice,
      name: `${client.user?.username}'s channel`,
    });

    voiceState.guild.channels.cache.get((await newChannel).id)?.edit({
      parent: whereToCreate,
    });

    //     dbVoiceChannels.guildId.channelId;

    //     fs.writeFile('db/voiceChannels.json', JSON.stringify(dbVoiceChannels), (err: any) => {
    //         if (err) throw err;
    //         console.log('The file has been saved!');
    //     });
  });
};
