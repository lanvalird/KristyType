import dotenv from "dotenv";
dotenv.config();

import listeners from "./listeners";
import Bot from "./Bot";
import commands from "./utils/commands";
import { ErrorListener } from "./listeners/code/ErrorListener";
import welcomer from "./utils/welcomer";

new ErrorListener();

welcomer();

new Bot(process.env.BOT_TOKEN, listeners, commands, {
  name: "Kristy",
  path: "./src/config.json",
});
