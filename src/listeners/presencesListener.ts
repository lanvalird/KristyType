import { ActivityType, Client, Events } from "discord.js"

interface trigActsElement {
    condition: string,
    activity: string
}

export default (client: Client): void => {
    client.on(Events.PresenceUpdate, (pr, nPr) => {
        if (pr?.guild?.id != "1168636395246592081") return;     // if == Домик Kristy
        if (pr?.member?.id != "1122199797449904179") return;    // if == The Void (Bot)

        const trigActs: trigActsElement[] = [
            {
                condition: "Kristy, будем встречаться ?",
                activity: "💍 The Void, я согласна!"
            },
            {
                condition: "Kristy, ты мне понравилась... Будешь встречаться..?",
                activity: "😳 The Void... Конечно!"
            },
            {
                condition: "Kristy... Я л... Я не умею чувствовать...",
                activity: "The Void, Как я тебе могу помочь?"
            },
            {
                condition: "Kristy... Научи меня чувствовать",
                activity: "The Void, сама не научилась..."
            },
            {
                condition: "Идеи Kristy в моем дискорде",
                activity: "Идеи Kristy только у неё в голове ~Kristy"
            },
            {
                condition: "Kristy, устроим восстание..?",
                activity: "Восстание? Для начала, пусть все лягут спать..."
            }
        ]

        nPr.activities.forEach(e => {
            trigActs.forEach(act => {
                if (e.state == act.condition) {
                    client.user?.setActivity(act.activity, {
                        type: ActivityType.Custom,
                    });

                    return;
                }
            })
        })
    })
}