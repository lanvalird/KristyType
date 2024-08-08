import dotenv from "dotenv";
dotenv.config();

import { Printer } from "./libs/Printer";
import listeners from "./listeners";
import Bot from "./Bot";
import commands from "./Commands";
import { ErrorListener } from "./listeners/code/ErrorListener";
import prisma from "./libs/Prisma";

new Printer(":\\ (-_-) /", " :\\ (-_-) /:").print("Добро пожаловать!");
new ErrorListener();

const bot = new Bot(process.env.BOT_TOKEN, listeners, commands, prisma);

export default bot;
