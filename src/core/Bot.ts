import { Client, ClientOptions, GatewayIntentBits } from "discord.js";
import { Config } from "../config/Config";
import { Logger } from "../utils/Logger";
import { ListenerManager } from "./ListenerManager";

export class Bot {
  public readonly client: Client;
  public readonly config: Config;
  public readonly listeners: ListenerManager;
  public readonly logger: Logger;

  private _commands: Map<string, any> = new Map();

  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger("Bot");
    
    this.client = this.createClient();
    this.listeners = new ListenerManager(this.client, this.logger);
  }

  public async start(token: string): Promise<void> {
    try {
      await this.client.login(token);
      this.logger.info("Bot successfully started");
    } catch (error) {
      this.logger.error("Failed to start bot:", error);
      throw error;
    }
  }

  private createClient(): Client {
    return new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }

  public async shutdown(): Promise<void> {
    this.listeners.removeAll();
    this.client.destroy();
    this.logger.info("Bot shutdown complete");
  }
}