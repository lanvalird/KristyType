// src/core/ListenerManager.ts
import { Client, Events } from "discord.js";
import { Logger } from "../utils/Logger";

export interface EventListener {
  event: Events;
  once?: boolean;
  execute: (...args: any[]) => void | Promise<void>;
}

export class ListenerManager {
  private readonly listeners: Map<string, EventListener[]> = new Map();

  constructor(
    private readonly client: Client,
    private readonly logger: Logger
  ) { }

  public register(listener: EventListener): this {
    const { event, once = false, execute } = listener;

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const method = once ? 'once' : 'on';
    this.client[method](event, execute);
    this.listeners.get(event)!.push(listener);

    this.logger.debug(`Registered listener for ${event} (once: ${once})`);
    return this;
  }

  public remove(event: Events, execute: Function): this {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return this;

    const index = eventListeners.findIndex(l => l.execute === execute);
    if (index !== -1) {
      this.client.off(event, execute);
      eventListeners.splice(index, 1);
      this.logger.debug(`Removed listener from ${event}`);
    }

    return this;
  }

  public removeAll(): void {
    for (const [event, listeners] of this.listeners) {
      for (const listener of listeners) {
        this.client.off(event, listener.execute);
      }
    }
    this.listeners.clear();
    this.logger.info("All listeners removed");
  }
}