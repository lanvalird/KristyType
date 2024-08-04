import { ClientEvents } from "discord.js";

export interface IListener {
  event: keyof ClientEvents | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => Promise<void>;
}
