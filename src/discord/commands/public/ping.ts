import { createCommand, createResponder } from "#base";
import { pingMenu } from "#menus";
import { ResponderType } from "@constatic/base";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "ping",
    description: "Mostra a latência do bot 🏓",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const apiLatency = Date.now() - interaction.createdTimestamp;

        await interaction.editReply(pingMenu(interaction.client.ws.ping, apiLatency));
    }
});

createResponder({
    customId: "/ping/refresh",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction) {
        const apiLatency = Date.now() - interaction.createdTimestamp;
        await interaction.update(pingMenu(interaction.client.ws.ping, apiLatency));
    },
});
