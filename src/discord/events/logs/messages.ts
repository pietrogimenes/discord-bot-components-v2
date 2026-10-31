import { createEvent } from "#base";
import { env } from "#env";
import { clip, sendLog } from "#functions";
import { brBuilder, createContainer, createSeparator } from "@magicyan/discord";
import { blockQuote, time } from "discord.js";

// Needs EVENT_LOG_CHANNEL_ID. The message text only appears with LOG_MESSAGE_CONTENT=true (see README)
const unavailable = "-# Conteúdo indisponível (ative LOG_MESSAGE_CONTENT ou a mensagem não estava em cache)";

createEvent({
    name: "Log deleted messages",
    event: "messageDelete",
    async run(message) {
        if (!message.inGuild() || message.author?.bot) return;

        const container = createContainer(constants.colors.danger,
            "## 🗑️ Mensagem apagada",
            createSeparator(),
            brBuilder(
                `**Autor:** ${message.author ? `${message.author} (\`${message.author.id}\`)` : "Desconhecido"}`,
                `**Canal:** ${message.channel}`,
                message.attachments.size > 0 && `**Anexos:** ${message.attachments.size}`,
            ),
            message.content ? blockQuote(clip(message.content, 1500)) : unavailable,
            `-# ${time(new Date(), "f")}`,
        );
        await sendLog(message.guild, env.EVENT_LOG_CHANNEL_ID, container);
    },
});

createEvent({
    name: "Log edited messages",
    event: "messageUpdate",
    async run(oldMessage, newMessage) {
        if (!newMessage.inGuild() || newMessage.author?.bot) return;
        // Ignores updates that did not change the text (embeds loading, pins...)
        if (oldMessage.content === newMessage.content) return;

        const container = createContainer(constants.colors.warning,
            "## ✏️ Mensagem editada",
            createSeparator(),
            brBuilder(
                `**Autor:** ${newMessage.author ? `${newMessage.author} (\`${newMessage.author.id}\`)` : "Desconhecido"}`,
                `**Canal:** ${newMessage.channel} • [Ir para a mensagem](${newMessage.url})`,
            ),
            `**Antes:**\n${oldMessage.content ? blockQuote(clip(oldMessage.content, 900)) : unavailable}`,
            `**Depois:**\n${newMessage.content ? blockQuote(clip(newMessage.content, 900)) : unavailable}`,
            `-# ${time(new Date(), "f")}`,
        );
        await sendLog(newMessage.guild, env.EVENT_LOG_CHANNEL_ID, container);
    },
});
