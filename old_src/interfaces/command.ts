import {
  CommandInteraction,
  ChatInputApplicationCommandData,
} from "discord.js";
import { KristyCommandConfig } from "./kristy-command-config";

export interface ICommand {
  action: (interaction: CommandInteraction) => void;
  discord: ChatInputApplicationCommandData;
  kristy?: KristyCommandConfig;
}
