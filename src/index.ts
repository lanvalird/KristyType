import "dotenv/config";

import listeners from "./listeners";
import Bot from "./Bot";
import commands from "./utils/commands";
import ErrorListener from "./listeners/code/ErrorListener";

new ErrorListener();

if (!!process.env.BOT_TOKEN === false)
  throw new Error("Hey! Your token... void.");
const token = process.env.BOT_TOKEN;

new Bot({
  token,
  commands,
  listeners,
  config: {
    name: "Kristy",
    path: "./src/config.json",
  },
});
