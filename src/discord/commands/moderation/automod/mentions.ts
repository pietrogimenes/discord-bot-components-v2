import { auditReason, notice, setAutomodRule } from "#functions";
import { ApplicationCommandOptionType, AutoModerationRuleTriggerType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "mentions",
    description: "Bloqueia mensagens com menções demais",
    options: [
        {
            name: "enabled",
            description: "Ativar ou desativar",
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
        {
            name: "limit",
            description: "Máximo de menções diferentes por mensagem (padrão: 5)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 50,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        const enabled = options.getBoolean("enabled", true);
        const limit = options.getInteger("limit") ?? 5;

        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            await setAutomodRule(
                interaction.guild, "mentions",
                enabled
                    ? {
                        triggerType: AutoModerationRuleTriggerType.MentionSpam,
                        triggerMetadata: { mentionTotalLimit: limit },
                    }
                    : null,
                auditReason(interaction.user)
            );
        } catch {
            await interaction.editReply(notice("error", "Não consegui alterar a regra. Verifique se tenho a permissão **Gerenciar servidor**.", false));
            return;
        }

        await interaction.editReply(notice("success", enabled
            ? `Mensagens com mais de **${limit}** menções serão bloqueadas.`
            : "Bloqueio de spam de menções desativado.", false));
    },
});
