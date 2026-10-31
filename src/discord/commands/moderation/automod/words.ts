import { auditReason, notice, setAutomodRule } from "#functions";
import { ApplicationCommandOptionType, AutoModerationRuleTriggerType, inlineCode } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "words",
    description: "Bloqueia uma lista de palavras ou frases",
    options: [
        {
            name: "enabled",
            description: "Ativar ou desativar",
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
        {
            name: "words",
            description: "Palavras separadas por vírgula. Use * como coringa, por exemplo: *spam*, palavra",
            type: ApplicationCommandOptionType.String,
            maxLength: 1000,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        const enabled = options.getBoolean("enabled", true);
        const words = (options.getString("words") ?? "")
            .split(",")
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0 && word.length <= 60);

        if (enabled && !words.length) {
            await interaction.reply(notice("error", "Informe ao menos uma palavra em `words`."));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            await setAutomodRule(
                interaction.guild, "words",
                enabled
                    ? {
                        triggerType: AutoModerationRuleTriggerType.Keyword,
                        triggerMetadata: { keywordFilter: words },
                    }
                    : null,
                auditReason(interaction.user)
            );
        } catch {
            await interaction.editReply(notice("error", "Não consegui alterar a regra. Verifique se tenho a permissão **Gerenciar servidor**.", false));
            return;
        }

        await interaction.editReply(notice("success", enabled
            ? `Bloqueando: ${words.map(inlineCode).join(", ")}`
            : "Bloqueio de palavras desativado.", false));
    },
});
