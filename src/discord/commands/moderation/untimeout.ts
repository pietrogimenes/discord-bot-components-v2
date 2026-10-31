import { createCommand } from "#base";
import { auditReason, checkTarget, notice, sendModLog } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "untimeout",
    description: "Remove o silenciamento de um membro 🔊",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ModerateMembers"],
    options: [
        {
            name: "member",
            description: "Membro silenciado",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "Motivo",
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
        if (!target.isCommunicationDisabled()) {
            await interaction.reply(notice("warning", "Este membro não está silenciado."));
            return;
        }

        const problem = checkTarget(moderator, target, "moderatable");
        if (problem) {
            await interaction.reply(notice("error", problem));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            await target.timeout(null, auditReason(interaction.user, reason));
        } catch {
            await interaction.editReply(notice("error", "Não consegui remover o silenciamento. Verifique minhas permissões.", false));
            return;
        }

        await interaction.editReply(notice("success", `${target.user} não está mais silenciado.`, false));
        await sendModLog(guild, {
            action: "Silenciamento removido", emoji: "🔊", color: constants.colors.success,
            target: target.user, moderator: interaction.user, reason,
        });
    }
});
