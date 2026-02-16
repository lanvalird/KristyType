import type { IBot } from '../interfaces/bot.js';

export interface IModule {
  readonly name: string;
  readonly dependencies?: string[];

  initialize(bot: IBot): Promise<void>;
  destroy(): Promise<void>;
}

/** @todo WIP */
interface IEvent {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => void;
}

export abstract class BaseModule implements IModule {
  public abstract readonly name: string;
  public readonly dependencies: string[] = [];
  protected bot!: IBot;
  protected events: IEvent[] = [];

  public async initialize(bot: IBot): Promise<void> {
    this.bot = bot;
    await this.setup();
    await this.registerEvents();
  }

  abstract setup(): Promise<void>;

  public async registerEvents(): Promise<void> {}

  public async destroy(): Promise<void> {}
}
