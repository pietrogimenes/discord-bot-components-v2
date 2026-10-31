import { clearWarns, notice, sendModLog } from "#functions";
import { ApplicationCommandOptionType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "clear",
    description: "Remove todas as advertências de um membro",
    options: [
        {
            name: "member",
            description: "Membro",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    async run(interaction) {
        const user = interaction.options.getUser("member", true);
        const removed = clearWarns(interaction.guild.id, user.id);

        if (!removed) {
            await interaction.reply(notice("warning", `${user} não possui advertências.`));
            return;
        }

        await interaction.reply(notice("success", `**${removed}** advertência(s) de ${user} removida(s).`, false));
        await sendModLog(interaction.guild, {
            action: "Advertências limpas", emoji: "🧼", color: constants.colors.success,
            target: user, moderator: interaction.user,
            details: [`**Removidas:** ${removed}`],
        });
    },
});
