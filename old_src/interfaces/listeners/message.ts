import { Message } from "discord.js";
import { IListener } from "./index";

export interface IMessageListener extends IListener {
  action: (message: Message) => Promise<void>;
}
