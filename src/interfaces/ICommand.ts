import {
  CommandInteraction,
  ChatInputApplicationCommandData,
} from "discord.js";
import { KristyCommandConfig } from "../types/KristyCommandConfigType";

export interface ICommand {
  action: (interaction: CommandInteraction) => void;
  discord: ChatInputApplicationCommandData;
  kristy?: KristyCommandConfig;
}
