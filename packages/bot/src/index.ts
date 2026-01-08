import 'dotenv/config';

import { Application } from './app/index.js';

const botToken = process.env.DISCORD_BOT_TOKEN || '';
const app = new Application(botToken);
app.run();
