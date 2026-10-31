import { createCommand, createResponder } from "#base";
import { env } from "#env";
import { notice } from "#functions";
import { ResponderType } from "@constatic/base";
import {
    brBuilder, createCheckbox, createContainer, createLabel, createModal,
    createRadioGroup, createSeparator, createTextInput, modalFieldsToRecord
} from "@magicyan/discord";
import { ApplicationCommandType, TextInputStyle } from "discord.js";

const categories = {
    feature: "💡 Nova funcionalidade",
    improvement: "🔧 Melhoria",
    other: "📌 Outro",
} as const;

createCommand({
    name: "suggest",
    description: "Envia uma sugestão para o servidor 💡",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        // Modals now support labels, radio groups, checkboxes and file uploads, not only text inputs
        await interaction.showModal(
            createModal("/suggest/modal", "Nova sugestão",
                createLabel("Título", createTextInput({
                    customId: "title",
                    style: TextInputStyle.Short,
                    maxLength: 80,
                    required: true,
                })),
                createLabel("Descrição", "Explique sua ideia com detalhes", createTextInput({
                    customId: "description",
                    style: TextInputStyle.Paragraph,
                    maxLength: 1000,
                    required: true,
                })),
                createLabel("Categoria", createRadioGroup({
                    customId: "category",
                    options: Object.entries(categories).map(([value, label], index) => ({
                        value, label, default: index === 0,
                    })),
                })),
                createLabel("Enviar de forma anônima?", createCheckbox("anonymous")),
            )
        );
    }
});

createResponder({
    customId: "/suggest/modal",
    types: [ResponderType.Modal], cache: "cached",
    async run(interaction) {
        const { title, description, category, anonymous } = modalFieldsToRecord<{
            title: string; description: string; category: keyof typeof categories; anonymous: boolean;
        }>(interaction);

        const channel = env.SUGGESTIONS_CHANNEL_ID
            ? interaction.guild.channels.cache.get(env.SUGGESTIONS_CHANNEL_ID)
            : interaction.channel;

        if (!channel?.isSendable()) {
            await interaction.reply(notice("error", "Não encontrei o canal de sugestões. Avise a equipe do servidor."));
            return;
        }

        const container = createContainer(constants.colors.primary,
            `## ${title}`,
            description,
            createSeparator(),
            brBuilder(
                `**Categoria:** ${categories[category] ?? categories.other}`,
                `**Enviada por:** ${anonymous ? "Anônimo" : interaction.user}`,
            ),
        );

        try {
            const message = await channel.send({
                flags: ["IsComponentsV2"],
                components: [container],
                allowedMentions: { parse: [] },
            });
            await message.react("👍");
            await message.react("👎");
        } catch {
            await interaction.reply(notice("error", "Não consegui enviar a sugestão. Verifique minhas permissões no canal."));
            return;
        }

        await interaction.reply(notice("success", "Sugestão enviada! Obrigado pela contribuição."));
    },
});
