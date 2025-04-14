import {
  CommandInteraction,
  ChatInputApplicationCommandData,
} from "discord.js";
import { KristyCommandConfig } from "../interfaces/IKristyCommandConfig";

export interface ICommand {
  action: (interaction: CommandInteraction) => void;
  discord: ChatInputApplicationCommandData;
  kristy?: KristyCommandConfig;
}
