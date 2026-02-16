import { Client } from 'discord.js';
import type { IModule } from '../modules/base.module.js';

export interface IBot {
  registerModule: (module: IModule) => Promise<void>;
  unregisterModule: (name: string) => Promise<void>;
  getModule: <T extends IModule>(name: string) => T | undefined;

  registerAppEvent: (
    eventName: string,
    handler: (...args: never[]) => void
  ) => void;
  unregisterAppEvent: (
    eventName: string,
    handler: (...args: never[]) => void
  ) => void;
  clearAppEvents: (eventName?: string) => void;
  dispatchCustomEvent: (eventName: string, ...args: never[]) => void;

  client: Client<true>;
}
