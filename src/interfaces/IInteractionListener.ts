import { Interaction } from "discord.js";
import { IListener } from "./IListener";

export interface IInteractionListener extends IListener {
  action: (interaction: Interaction) => Promise<void>;
}
