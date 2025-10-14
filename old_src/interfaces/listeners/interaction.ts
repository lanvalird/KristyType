import { Interaction } from "discord.js";
import { IListener } from "./index";

export interface IInteractionListener extends IListener {
  action: (interaction: Interaction) => Promise<void>;
}
