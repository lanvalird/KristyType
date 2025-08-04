import { IConfigFile } from "@src/interfaces/IConfigFile";
import { readFile } from "fs/promises";
import { join } from "path";

export class Config {
  private config: IConfigFile | null = null;
  private configPath: string;

  /**
   * Creates a new Config instance
   * @param path Path to the config file
   * @throws {Error} If config file is invalid or cannot be read
   */
  constructor(path: string) {
    this.configPath = join(process.cwd(), path);
  }

  /**
   * Loads and validates the configuration file
   * @throws {Error} If config file is invalid or cannot be read
   */
  public async load(): Promise<void> {
    try {
      const fileContent = await readFile(this.configPath, "utf-8");
      const parsedConfig = JSON.parse(fileContent) as Partial<IConfigFile>;

      if (!parsedConfig) {
        throw new Error("Config file is empty");
      }

      // Basic validation
      if (!parsedConfig.author?.name || !parsedConfig.bot?.clientId) {
        throw new Error("Config file is missing required fields");
      }

      this.config = parsedConfig as IConfigFile;
    } catch (error) {
      throw new Error(
        `Failed to load config from ${this.configPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Gets the entire config object
   * @throws {Error} If config is not loaded
   */
  public getConfig(): IConfigFile {
    if (!this.config) {
      throw new Error("Config not loaded. Call load() first.");
    }
    return this.config;
  }

  // Author section getters
  public getAuthorName(): string {
    return this.getConfig().author.name;
  }

  public getAuthorUsername(): string {
    return this.getConfig().author.username;
  }

  public getAuthorDiscordId(): string {
    return this.getConfig().author.discordId;
  }

  // Bot section getters
  public getBotClientId(): string {
    return this.getConfig().bot.clientId;
  }

  public getBotVersion(): string {
    return this.getConfig().bot.version;
  }

  public getBotStatus(): string {
    return this.getConfig().bot.status;
  }

  public getBotGuildId(): string {
    return this.getConfig().bot.guild.id;
  }

  public getBotGuildLink(): string {
    return this.getConfig().bot.guild.link;
  }

  public getBotWebsite(): string {
    return this.getConfig().bot.website;
  }

  // API section getters
  public getApiUrl(): string {
    return this.getConfig().api.url;
  }

  /**
   * Reloads the configuration from file
   * @throws {Error} If config file is invalid or cannot be read
   */
  public async reload(): Promise<void> {
    this.config = null;
    await this.load();
  }
}
