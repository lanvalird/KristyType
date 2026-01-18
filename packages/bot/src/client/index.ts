import { Client, PresenceUpdateStatus } from 'discord.js';
import { isEmpty } from '../lib/utils.js';

/** It wraps the client class with `discord.js` for a better experience */
export class Bot extends Client {
  public static onReady(readyClient: Client<true>) {
    readyClient.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
    console.log(`I successfully logged in as ${readyClient.user.tag}`);
  }

  public static validateToken(botToken: string): boolean {
    const jwtRegex = /^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/;

    try {
      if (isEmpty(botToken)) {
        throw 'Empty';
      }
      if (!jwtRegex.test(botToken)) {
        throw 'Not JWT';
      }
    } catch (e) {
      throw new Error(`Invalid Token: ${e}`);
    }

    return true;
  }
}
