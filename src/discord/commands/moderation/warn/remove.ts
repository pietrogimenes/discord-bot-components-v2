import { notice, removeWarn, sendModLog } from "#functions";
import { ApplicationCommandOptionType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "remove",
    description: "Remove uma advertência pelo ID",
    options: [
        {
            name: "id",
            description: "ID da advertência (veja em /warn list)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            required: true,
        },
    ],
    async run(interaction) {
        const { guild } = interaction;

        const warn = removeWarn(guild.id, interaction.options.getInteger("id", true));
        if (!warn) {
            await interaction.reply(notice("error", "Advertência não encontrada neste servidor."));
            return;
        }

        const user = await interaction.client.users.fetch(warn.userId);
        await interaction.reply(notice("success", `Advertência \`#${warn.id}\` de ${user} removida.`, false));
        await sendModLog(guild, {
            action: "Advertência removida", emoji: "✅", color: constants.colors.success,
            target: user, moderator: interaction.user, reason: warn.reason,
            details: [`**ID:** #${warn.id}`],
        });
    },
});
