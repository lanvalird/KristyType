import { Command } from "./Command";
import { BotCmd } from "./commands/global/BotCmd";
import { HelloCmd } from "./commands/global/HelloCmd";
import { KillCmd } from "./commands/guild/KillCmd";
import { MailToServerCmd } from "./commands/global/MailToServerCmd";
import { ServerCmd } from "./commands/global/ServerCmd";
import { IdeaCmd } from "./commands/global/IdeaCmd";
import { UserCmd } from "./commands/global/UserCmd";

export const Commands: Command[] = [
    HelloCmd,
    ServerCmd,
    UserCmd,
    IdeaCmd,
    MailToServerCmd,
    BotCmd,

];

export const GuildCommands: Command[] = [
    KillCmd,
];