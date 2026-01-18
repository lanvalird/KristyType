import { Client, ClientOptions, PresenceUpdateStatus } from 'discord.js';
import { isEmpty } from '../lib/utils.js';
import { IModule } from '../modules/base.module.js';

/** It wraps the client class with `discord.js` for a better experience */
export class Bot extends Client {
  private _modules: Map<string, IModule>;
  private _customEventHandlers: Map<string, Function[]>;

  constructor(options: ClientOptions) {
    super(options);
    this._modules = new Map();
    this._customEventHandlers = new Map();
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

  public onCustomEvent(eventName: string, handler: Function): void {
    if (!this._customEventHandlers.has(eventName)) {
      this._customEventHandlers.set(eventName, []);
    }
    this._customEventHandlers.get(eventName)!.push(handler);
  }

  public offCustomEvent(eventName: string, handler: Function): void {
    const handlers = this._customEventHandlers.get(eventName);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this._customEventHandlers.delete(eventName);
    }
  }

  public clearCustomEventHandlers(eventName?: string): void {
    if (eventName) {
      this._customEventHandlers.delete(eventName);
    } else {
      this._customEventHandlers.clear();
    }
  }

  public dispatchCustomEvent(eventName: string, ...args: any[]): void {
    const handlers = this._customEventHandlers.get(eventName);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        const result = handler(...args);
        if (result instanceof Promise) {
          result.catch(console.error);
        }
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    }
  }
}
