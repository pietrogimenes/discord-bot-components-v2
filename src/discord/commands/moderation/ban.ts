import { createCommand } from "#base";
import { auditReason, checkTarget, notice, notifyUser, sendModLog } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "ban",
    description: "Bane um membro do servidor 🔨",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["BanMembers"],
    options: [
        {
            name: "user",
            description: "Usuário que será banido",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "Motivo do banimento",
            type: ApplicationCommandOptionType.String,
            maxLength: 400,
        },
        {
            name: "delete_messages",
            description: "Apagar as mensagens recentes do usuário",
            type: ApplicationCommandOptionType.Integer,
            choices: [
                { name: "Não apagar", value: 0 },
                { name: "Última hora", value: 60 * 60 },
                { name: "Últimas 24 horas", value: 60 * 60 * 24 },
                { name: "Últimos 7 dias", value: 60 * 60 * 24 * 7 },
            ],
        },
    ],
    async run(interaction) {
        const { options, guild, member: moderator } = interaction;

        const user = options.getUser("user", true);
        const target = options.getMember("user");
        const reason = options.getString("reason");

        // The user may not be in the server anymore, in this case we can still ban by id
        const problem = target
            ? checkTarget(moderator, target, "bannable")
            : user.id === moderator.id ? "Você não pode banir a si mesmo." : null;

        if (problem) {
            await interaction.reply(notice("error", problem));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        // Must be sent before the ban, since the user stops sharing a server with the bot
        if (target) await notifyUser(user, guild, "🔨 Você foi banido", reason, constants.colors.danger);

        try {
            await guild.members.ban(user, {
                reason: auditReason(interaction.user, reason),
                deleteMessageSeconds: options.getInteger("delete_messages") ?? 0,
            });
        } catch {
            await interaction.editReply(notice("error", "Não consegui banir este usuário. Verifique minhas permissões.", false));
            return;
        }

        await interaction.editReply(notice("success", `${user} foi banido.`, false));
        await sendModLog(guild, {
            action: "Membro banido", emoji: "🔨", color: constants.colors.danger,
            target: user, moderator: interaction.user, reason,
        });
    }
});
