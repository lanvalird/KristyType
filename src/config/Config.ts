import { IConfigFile } from "../interfaces/config-file";
import { Logger } from "../utils/Logger";

import { readFile, watch } from "fs/promises";
import { join } from "path";

export class Config {
  private config: IConfigFile | null = null;
  private readonly configPath: string;
  private readonly logger: Logger;
  private watcher: AbortController | null = null;

  constructor(path: string) {
    this.configPath = join(process.cwd(), path);
    this.logger = new Logger("Config");
  }

  /**
   * Loads and validates the configuration file with hot reload support
   */
  public async load(): Promise<void> {
    try {
      const fileContent = await readFile(this.configPath, "utf-8");
      const parsedConfig = JSON.parse(fileContent);
      
      this.validateConfig(parsedConfig);
      this.config = this.deepFreeze(parsedConfig);
      
      this.logger.info(`Configuration loaded from ${this.configPath}`);
      
      // Enable hot reload in development
      if (process.env.NODE_ENV === 'development') {
        this.enableHotReload();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to load config: ${errorMessage}`);
      throw new Error(`Config loading failed: ${errorMessage}`);
    }
  }

  /**
   * Comprehensive config validation
   */
  private validateConfig(config: any): asserts config is IConfigFile {
    const errors: string[] = [];

    // Author validation
    if (!config.author?.name) errors.push("author.name is required");
    if (!config.author?.username) errors.push("author.username is required");
    if (!config.author?.discordId) errors.push("author.discordId is required");

    // Bot validation
    if (!config.bot?.clientId) errors.push("bot.clientId is required");
    if (!config.bot?.version) errors.push("bot.version is required");
    if (!config.bot?.guild?.id) errors.push("bot.guild.id is required");

    // Validate Discord ID format
    const discordIdRegex = /^\d{17,20}$/;
    if (config.author.discordId && !discordIdRegex.test(config.author.discordId)) {
      errors.push("author.discordId must be a valid Discord ID");
    }
    if (config.bot.guild.id && !discordIdRegex.test(config.bot.guild.id)) {
      errors.push("bot.guild.id must be a valid Discord ID");
    }

    if (errors.length > 0) {
      throw new Error(`Config validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Deep freeze object to prevent mutations
   */
  private deepFreeze<T>(obj: T): T {
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach(prop => {
        this.deepFreeze((obj as any)[prop]);
      });
    }
    return obj;
  }

  /**
   * Enable hot reload for config file in development
   */
  private async enableHotReload(): Promise<void> {
    if (this.watcher) {
      this.watcher.abort();
    }

    this.watcher = new AbortController();
    
    try {
      const watcher = watch(this.configPath, {
        signal: this.watcher.signal
      });

      this.logger.debug("Hot reload enabled for config file");
      
      for await (const event of watcher) {
        if (event.eventType === 'change') {
          this.logger.info("Config file changed, reloading...");
          await this.reload();
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        this.logger.error("Config file watch error:", error);
      }
    }
  }

  /**
   * Get entire config with type safety
   */
  public getConfig(): IConfigFile {
    if (!this.config) {
      throw new Error("Config not loaded. Call load() first.");
    }
    return this.config;
  }

  /**
   * Get specific config section with type safety
   */
  public getSection<T extends keyof IConfigFile>(section: T): IConfigFile[T] {
    const config = this.getConfig();
    return config[section];
  }

  // Convenience getters with memoization
  public get author() {
    return this.getSection('author');
  }

  public get bot() {
    return this.getSection('bot');
  }

  public get api() {
    return this.getSection('api');
  }

  /**
   * Reload configuration
   */
  public async reload(): Promise<void> {
    this.logger.debug("Reloading configuration...");
    const previousConfig = this.config;
    
    try {
      await this.load();
      this.logger.info("Configuration reloaded successfully");
    } catch (error) {
      this.config = previousConfig; // Restore previous config on failure
      this.logger.error("Failed to reload config, using previous version");
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.watcher) {
      this.watcher.abort();
      this.watcher = null;
    }
    this.logger.debug("Config resources cleaned up");
  }

  /**
   * Check if config is loaded
   */
  public isLoaded(): boolean {
    return this.config !== null;
  }
}

// Singleton instance for global access
export const config = new Config("./config.json");