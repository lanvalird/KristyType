import { ICommand, IFileCommand } from "@interfaces/ICommand";
import KillCmd from "./commands/guild/KillCmd";
import fs from "node:fs";
import path from "node:path";

export const Commands: ICommand[] = [];
const foldersPath = path.join(__dirname, 'commands/global');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command: IFileCommand = require(filePath);
        Commands.push(command.default)
    }
}

// специально оставил, чтобы вручную вносить нужные мне команды
export const GuildCommands: ICommand[] = [
    KillCmd()]