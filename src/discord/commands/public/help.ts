import { createCommand, createResponder } from "#base";
import { helpMenu, isHelpCategory } from "#menus";
import { ResponderType } from "@constatic/base";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "help",
    description: "Mostra todos os comandos do bot 📖",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.reply(helpMenu(interaction.guild, "general", true));
    }
});

createResponder({
    customId: "/help/category",
    types: [ResponderType.StringSelect], cache: "cached",
    async run(interaction) {
        const [value] = interaction.values;
        if (!isHelpCategory(value)) return;

        await interaction.update(helpMenu(interaction.guild, value));
    },
});
