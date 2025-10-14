import 'dotenv/config';

import { Bot } from './core/Bot';
import { config } from './config/Config';
import { Logger } from './utils/Logger';

class Application {
  private readonly logger = new Logger('Application');
  private bot: Bot | null = null;

  constructor() {
    this.setupProcessHandlers();
  }

  public async run(): Promise<void> {
    try {
      this.logger.info('Starting application...');

      await config.load();

      this.bot = new Bot(config);

      // Регистрируем слушатели
      this.registerListeners();

      await this.bot.start(process.env.BOT_TOKEN!);

    } catch (error) {
      this.logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  private registerListeners(): void {
    // Здесь будут слушатели
    // bot.listeners.register({ event: 'ready', execute: () => {...} });
  }

  private setupProcessHandlers(): void {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  private async shutdown(): Promise<void> {
    this.logger.info('Shutting down...');
    await this.bot?.shutdown();
    process.exit(0);
  }
}

new Application().run();