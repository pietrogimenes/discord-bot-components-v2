import { auditReason, notice, setAutomodRule } from "#functions";
import {
    ApplicationCommandOptionType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType
} from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "presets",
    description: "Bloqueia ofensas usando as listas prontas do Discord",
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
                interaction.guild, "presets",
                enabled
                    ? {
                        triggerType: AutoModerationRuleTriggerType.KeywordPreset,
                        triggerMetadata: {
                            presets: [
                                AutoModerationRuleKeywordPresetType.Profanity,
                                AutoModerationRuleKeywordPresetType.SexualContent,
                                AutoModerationRuleKeywordPresetType.Slurs,
                            ],
                        },
                    }
                    : null,
                auditReason(interaction.user)
            );
        } catch {
            await interaction.editReply(notice("error", "Não consegui alterar a regra. Verifique se tenho a permissão **Gerenciar servidor**.", false));
            return;
        }

        await interaction.editReply(notice("success", enabled
            ? "Listas prontas ativadas: palavrões, conteúdo sexual e ofensas."
            : "Listas prontas desativadas.", false));
    },
});
