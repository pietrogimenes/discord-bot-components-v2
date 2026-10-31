import { createCommand } from "#base";
import { auditReason, notice, sendModLog } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "unban",
    description: "Remove o banimento de um usuário 🔓",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["BanMembers"],
    options: [
        {
            name: "user",
            description: "Usuário banido (busque pelo nome ou ID)",
            type: ApplicationCommandOptionType.String,
            required: true,
            async autocomplete(interaction) {
                const search = interaction.options.getFocused().toLowerCase();
                const bans = await interaction.guild.bans.fetch();

                return bans
                    .filter(ban => ban.user.id.includes(search) || ban.user.username.toLowerCase().includes(search))
                    .first(25)
                    .map(ban => ({ name: `${ban.user.username} (${ban.user.id})`, value: ban.user.id }));
            },
        },
        {
            name: "reason",
            description: "Motivo do desbanimento",
            type: ApplicationCommandOptionType.String,
            maxLength: 400,
        },
    ],
    async run(interaction) {
        const { options, guild } = interaction;

        const userId = options.getString("user", true);
        const reason = options.getString("reason");

        await interaction.deferReply({ flags: ["Ephemeral"] });

        const ban = await guild.bans.fetch(userId).catch(() => null);
        if (!ban) {
            await interaction.editReply(notice("error", "Este usuário não está banido.", false));
            return;
        }

        try {
            await guild.members.unban(userId, auditReason(interaction.user, reason));
        } catch {
            await interaction.editReply(notice("error", "Não consegui remover o banimento. Verifique minhas permissões.", false));
            return;
        }

        await interaction.editReply(notice("success", `${ban.user} foi desbanido.`, false));
        await sendModLog(guild, {
            action: "Membro desbanido", emoji: "🔓", color: constants.colors.success,
            target: ban.user, moderator: interaction.user, reason,
        });
    }
});
