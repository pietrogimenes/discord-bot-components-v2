import { addWarn, getWarns, notice, notifyUser, sendModLog } from "#functions";
import { ApplicationCommandOptionType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "add",
    description: "Adverte um membro",
    options: [
        {
            name: "member",
            description: "Membro que será advertido",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "Motivo da advertência",
            type: ApplicationCommandOptionType.String,
            maxLength: 400,
            required: true,
        },
    ],
    async run(interaction) {
        const { options, guild } = interaction;

        const user = options.getUser("member", true);
        const reason = options.getString("reason", true);

        if (user.bot || user.id === interaction.user.id) {
            await interaction.reply(notice("error", "Você não pode advertir bots nem a si mesmo."));
            return;
        }

        const warn = addWarn({
            guildId: guild.id,
            userId: user.id,
            moderatorId: interaction.user.id,
            reason,
        });
        const total = getWarns(guild.id, user.id).length;

        await notifyUser(user, guild, "⚠️ Você recebeu uma advertência", reason);
        await interaction.reply(notice("success", `${user} foi advertido (ID \`#${warn.id}\`). Total de advertências: **${total}**.`, false));
        await sendModLog(guild, {
            action: "Advertência aplicada", emoji: "⚠️", color: constants.colors.warning,
            target: user, moderator: interaction.user, reason,
            details: [`**ID:** #${warn.id} • **Total:** ${total}`],
        });
    },
});
