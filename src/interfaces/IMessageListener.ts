import { Message } from "discord.js";
import { IListener } from "./IListener";

export interface IMessageListener extends IListener {
  action: (message: Message) => Promise<void>;
}
