import { createEvent } from "#base";
import { ActivityType } from "discord.js";

createEvent({
    name: "Set bot presence",
    event: "clientReady",
    async run(client) {
        client.user.setPresence({
            status: "online",
            activities: [{ type: ActivityType.Custom, name: "Use /help para ver os comandos" }],
        });
    },
});
