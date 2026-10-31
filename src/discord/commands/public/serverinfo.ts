import { createCommand } from "#base";
import { serverInfoMenu } from "#menus";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "serverinfo",
    description: "Mostra informações do servidor 🏠",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.reply(serverInfoMenu(interaction.guild));
    }
});
