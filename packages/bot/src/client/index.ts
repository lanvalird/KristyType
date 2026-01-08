import { Client, PresenceUpdateStatus } from 'discord.js';

/** It wraps the client class with `discord.js` for a better experience */
export class Bot extends Client {
  public static onReady(readyClient: Client<true>) {
    readyClient.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
    console.log(`I successfully logged in as ${readyClient.user.tag}`);
  }

  public static validateToken(botToken: string): boolean {
    if (!botToken || botToken.trim() === ' ') {
      throw new Error('Token is not valid (empty)');
    }

    return true;
  }
}
