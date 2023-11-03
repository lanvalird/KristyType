import { Command } from "./Command";
import { BotCmd } from "./commands/BotCmd";
import { HelloCmd } from "./commands/HelloCmd";
import { KillCmd } from "./commands/KillCmd";
import { MailToServerCmd } from "./commands/MailToServerCmd";
import { ServerCmd } from "./commands/ServerCmd";
import { SuggestIdeaCmd } from "./commands/SuggestIdeaCmd";
import { UserCmd } from "./commands/UserCmd";

export const Commands: Command[] = [
    HelloCmd,
    ServerCmd,
    UserCmd,
    SuggestIdeaCmd,
    MailToServerCmd,
    BotCmd,
    KillCmd
];

export const GuildCommands: Command[] = [];