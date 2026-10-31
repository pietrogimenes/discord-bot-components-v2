import { auditReason, checkRole, notice } from "#functions";
import { ApplicationCommandOptionType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "remove",
    description: "Remove um cargo de um membro",
    options: [
        {
            name: "member",
            description: "Membro",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "role",
            description: "Cargo",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    async run(interaction) {
        const { options, member: moderator } = interaction;

        const target = options.getMember("member");
        const role = options.getRole("role", true);

        if (!target) {
            await interaction.reply(notice("error", "Este usuário não está no servidor."));
            return;
        }

        const problem = checkRole(moderator, role);
        if (problem) {
            await interaction.reply(notice("error", problem));
            return;
        }
        if (!target.roles.cache.has(role.id)) {
            await interaction.reply(notice("warning", `${target.user} não possui o cargo ${role}.`));
            return;
        }

        try {
            await target.roles.remove(role, auditReason(interaction.user));
        } catch {
            await interaction.reply(notice("error", "Não consegui remover o cargo. Verifique minhas permissões."));
            return;
        }

        await interaction.reply(notice("success", `Cargo ${role} removido de ${target.user}.`));
    },
});
