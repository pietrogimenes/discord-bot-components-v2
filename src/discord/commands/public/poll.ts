import { createCommand } from "#base";
import { notice } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

const answerOption = (n: number, required = false) => ({
    name: `option${n}`,
    description: `Opção ${n}`,
    type: ApplicationCommandOptionType.String,
    maxLength: 55,
    required,
}) as const;

// Native Discord polls. They cannot be mixed with Components V2 in the same message,
// so this is the one place where we send a regular message.
createCommand({
    name: "poll",
    description: "Cria uma enquete nativa do Discord 📊",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "question",
            description: "Pergunta da enquete",
            type: ApplicationCommandOptionType.String,
            maxLength: 300,
            required: true,
        },
        answerOption(1, true),
        answerOption(2, true),
        answerOption(3),
        answerOption(4),
        answerOption(5),
        {
            name: "duration",
            description: "Duração da enquete (padrão: 24 horas)",
            type: ApplicationCommandOptionType.Integer,
            choices: [
                { name: "1 hora", value: 1 },
                { name: "4 horas", value: 4 },
                { name: "24 horas", value: 24 },
                { name: "3 dias", value: 72 },
                { name: "7 dias", value: 168 },
            ],
        },
        {
            name: "multiple",
            description: "Permitir escolher mais de uma opção",
            type: ApplicationCommandOptionType.Boolean,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        const answers = [1, 2, 3, 4, 5]
            .map(n => options.getString(`option${n}`))
            .filter((text): text is string => !!text)
            .map(text => ({ text }));

        try {
            await interaction.reply({
                poll: {
                    question: { text: options.getString("question", true) },
                    answers,
                    duration: options.getInteger("duration") ?? 24,
                    allowMultiselect: options.getBoolean("multiple") ?? false,
                },
            });
        } catch {
            await interaction.reply(notice("error", "Não consegui criar a enquete. Verifique se tenho a permissão **Enviar enquetes** neste canal."));
        }
    }
});
