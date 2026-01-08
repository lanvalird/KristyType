import { Client, PresenceUpdateStatus } from 'discord.js';

export class Bot extends Client {
  public static onReady(readyClient: Client<true>) {
    readyClient.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
    console.log(`I successfully logined as ${readyClient.user.tag}`);
  }
}
