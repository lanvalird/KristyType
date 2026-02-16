import type { ClientOptions } from 'discord.js';
import type { IModule } from '../modules/base.module.js';
import { Client, PresenceUpdateStatus } from 'discord.js';
import { isEmpty } from '../lib/utils.js';

interface IBot {
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

/** It wraps the client class with `discord.js` for a better experience */
export class Bot implements IBot {
  private _client: Client<true>;
  private _modules: Map<string, IModule>;
  private _handlers: Map<string, Array<(...args: never[]) => void>>;

  constructor(clientOptions: ClientOptions) {
    this._modules = new Map();
    this._handlers = new Map();

    this._client = new Client(clientOptions);
  }

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

  get client() {
    return this._client;
  }

  public async registerModule(module: IModule): Promise<void> {
    if (this._modules.has(module.name)) {
      throw new Error(`Module with '${module.name}' already registered`);
    }

    module.dependencies?.forEach((dep) => {
      if (!this._modules.get(dep)) {
        throw new Error(`Dependency of ${module.name} is not found: ${dep}`);
      }
    });

    await module.initialize(this);
    this._modules.set(module.name, module);
    console.log(`Successfull register module: ${module.name}`);
  }

  public async unregisterModule(name: string): Promise<void> {
    const module = this.getModule(name);
    if (!module) {
      return;
    }
    module.destroy();
    this._modules.delete(name);
    console.log(`Module ${name} unregistered`);
  }

  public getModule<T extends IModule>(name: string): T | undefined {
    return this._modules.get(name) as T;
  }

  public registerAppEvent(eventName: string, handler: (...args: never[]) => void): void {
    if (!this._handlers.has(eventName)) {
      this._handlers.set(eventName, []);
    }
    this._handlers.get(eventName)!.push(handler);
  }

  public unregisterAppEvent(eventName: string, handler: (...args: never[]) => void): void {
    const handlers = this._handlers.get(eventName);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this._handlers.delete(eventName);
    }
  }

  public clearAppEvents(eventName?: string): void {
    if (eventName) {
      this._handlers.delete(eventName);
    } else {
      this._handlers.clear();
    }
  }

  public dispatchCustomEvent(eventName: string, ...args: never[]): void {
    const handlers = this._handlers.get(eventName);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        const result = handler(...args);
        if ((result as unknown) instanceof Promise) {
          (result as unknown as Promise<unknown>).catch(console.error);
        }
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    }
  }
}
