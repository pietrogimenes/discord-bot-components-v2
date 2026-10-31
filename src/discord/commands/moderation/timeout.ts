import { createCommand } from "#base";
import { auditReason, checkTarget, formatDuration, notice, notifyUser, parseDuration, sendModLog } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, time } from "discord.js";

const MAX_TIMEOUT = 28 * 24 * 60 * 60 * 1000; // Discord limit: 28 days

createCommand({
    name: "timeout",
    description: "Silencia um membro temporariamente ⏳",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ModerateMembers"],
    options: [
        {
            name: "member",
            description: "Membro que será silenciado",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "duration",
            description: "Duração, por exemplo: 30s, 10m, 2h, 1d, 1w (máximo 28 dias)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "Motivo do timeout",
            type: ApplicationCommandOptionType.String,
            maxLength: 400,
        },
    ],
    async run(interaction) {
        const { options, guild, member: moderator } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason");
        const duration = parseDuration(options.getString("duration", true));

        if (!target) {
            await interaction.reply(notice("error", "Este usuário não está no servidor."));
            return;
        }
        if (!duration || duration > MAX_TIMEOUT) {
            await interaction.reply(notice("error", "Duração inválida. Use valores como `30s`, `10m`, `2h`, `1d` ou `1w` (máximo 28 dias)."));
            return;
        }

        const problem = checkTarget(moderator, target, "moderatable");
        if (problem) {
            await interaction.reply(notice("error", problem));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            await target.timeout(duration, auditReason(interaction.user, reason));
        } catch {
            await interaction.editReply(notice("error", "Não consegui silenciar este membro. Verifique minhas permissões.", false));
            return;
        }

        const until = new Date(Date.now() + duration);
        await notifyUser(target.user, guild, "⏳ Você foi silenciado", reason);
        await interaction.editReply(notice("success", `${target.user} foi silenciado por **${formatDuration(duration)}** (até ${time(until, "f")}).`, false));
        await sendModLog(guild, {
            action: "Membro silenciado", emoji: "⏳", color: constants.colors.warning,
            target: target.user, moderator: interaction.user, reason,
            details: [`**Duração:** ${formatDuration(duration)} (até ${time(until, "f")})`],
        });
    }
});
