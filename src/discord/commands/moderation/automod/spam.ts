import { auditReason, notice, setAutomodRule } from "#functions";
import { ApplicationCommandOptionType, AutoModerationRuleTriggerType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "spam",
    description: "Bloqueia mensagens de spam (detecção do Discord)",
    options: [
        {
            name: "enabled",
            description: "Ativar ou desativar",
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
    ],
    async run(interaction) {
        const enabled = interaction.options.getBoolean("enabled", true);
        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            await setAutomodRule(
                interaction.guild, "spam",
                enabled ? { triggerType: AutoModerationRuleTriggerType.Spam } : null,
                auditReason(interaction.user)
            );
        } catch {
            await interaction.editReply(notice("error", "Não consegui alterar a regra. Verifique se tenho a permissão **Gerenciar servidor**.", false));
            return;
        }

        await interaction.editReply(notice("success", enabled ? "Anti-spam ativado." : "Anti-spam desativado.", false));
    },
});
