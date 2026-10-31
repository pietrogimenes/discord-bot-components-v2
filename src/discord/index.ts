import { notice } from "#functions";
import { setupCreators } from "@constatic/base";
import type { InteractionReplyOptions } from "discord.js";

export const { createCommand, createEvent, createResponder } = setupCreators({
    commands: {
        async onError(error, interaction) {
            const message = notice<InteractionReplyOptions>("error", "Algo deu errado ao executar este comando. Tente novamente mais tarde.");
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(message).catch(() => null);
            } else {
                await interaction.reply(message).catch(() => null);
            }
            // Lets the base error handler print it (and send it to WEBHOOK_LOGS_URL)
            void Promise.reject(error);
        },
    },
    responders: {
        async onError(error, interaction) {
            const message = notice<InteractionReplyOptions>("error", "Algo deu errado ao processar esta interação.");
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(message).catch(() => null);
            } else {
                await interaction.reply(message).catch(() => null);
            }
            void Promise.reject(error);
        },
    },
});
