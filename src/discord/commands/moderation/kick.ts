import { createCommand } from "#base";
import { auditReason, checkTarget, notice, notifyUser, sendModLog } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "kick",
    description: "Expulsa um membro do servidor 👢",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["KickMembers"],
    options: [
        {
            name: "member",
            description: "Membro que será expulso",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "Motivo da expulsão",
            type: ApplicationCommandOptionType.String,
            maxLength: 400,
        },
    ],
    async run(interaction) {
        const { options, guild, member: moderator } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason");

        if (!target) {
            await interaction.reply(notice("error", "Este usuário não está no servidor."));
            return;
        }

        const problem = checkTarget(moderator, target, "kickable");
        if (problem) {
            await interaction.reply(notice("error", problem));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        await notifyUser(target.user, guild, "👢 Você foi expulso", reason, constants.colors.danger);

        try {
            await target.kick(auditReason(interaction.user, reason));
        } catch {
            await interaction.editReply(notice("error", "Não consegui expulsar este membro. Verifique minhas permissões.", false));
            return;
        }

        await interaction.editReply(notice("success", `${target.user} foi expulso.`, false));
        await sendModLog(guild, {
            action: "Membro expulso", emoji: "👢", color: constants.colors.danger,
            target: target.user, moderator: interaction.user, reason,
        });
    }
});
