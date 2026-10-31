import { automodRuleNames, v2 } from "#functions";
import { brBuilder, createContainer } from "@magicyan/discord";
import command from "./command.js";

command.subcommand({
    name: "status",
    description: "Mostra quais regras do AutoMod do bot estão ativas",
    async run(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });

        const rules = await interaction.guild.autoModerationRules.fetch();

        const lines = Object.values(automodRuleNames).map(name => {
            const rule = rules.find(rule => rule.name === name);
            return `${rule?.enabled ? "🟢" : "⚫"} ${name.replace("[Bot] ", "")}`;
        });

        await interaction.editReply(v2(
            createContainer(constants.colors.azoxo,
                "## 🤖 AutoMod",
                brBuilder(...lines),
                "-# Regras criadas por outros apps ou manualmente não aparecem aqui.",
            ),
            false
        ));
    },
});
