import dotenv from "dotenv";
dotenv.config();

import listeners from "./listeners";
import Bot from "./Bot";
import commands from "./Commands";
import { ErrorListener } from "./listeners/code/ErrorListener";
import welcomer from "./utils/welcomer";

new ErrorListener();

welcomer();

const bot = new Bot(process.env.BOT_TOKEN, listeners, commands);
export default bot;
