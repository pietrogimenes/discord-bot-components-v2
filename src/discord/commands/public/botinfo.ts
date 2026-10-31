import { createCommand } from "#base";
import { formatDuration, v2 } from "#functions";
import { version as baseVersion } from "@constatic/base";
import { brBuilder, createContainer, createLinkButton, createRow, createSection, createSeparator } from "@magicyan/discord";
import { ApplicationCommandType, version as discordJsVersion } from "discord.js";

createCommand({
    name: "botinfo",
    description: "Mostra informações e estatísticas do bot 🤖",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { client } = interaction;
        const memory = process.memoryUsage().heapUsed / 1024 / 1024;

        const container = createContainer(constants.colors.azoxo,
            createSection({
                content: [`## ${client.user.displayName}`, "-# Feito com Constatic Base e Components V2"],
                thumbnail: client.user.displayAvatarURL({ size: 256 }),
            }),
            createSeparator(),
            brBuilder(
                `**Servidores:** ${client.guilds.cache.size}`,
                `**Online há:** ${formatDuration(client.uptime ?? 0)}`,
                `**Memória:** ${memory.toFixed(1)} MB`,
                `**WebSocket:** ${client.ws.ping}ms`,
            ),
            createSeparator(),
            brBuilder(
                `**Node.js:** ${process.version}`,
                `**discord.js:** v${discordJsVersion}`,
                `**Constatic Base:** v${baseVersion}`,
            ),
            createSeparator(),
            createRow(
                createLinkButton("https://constatic-docs.vercel.app", "Documentação do Constatic", "📚"),
            ),
        );

        await interaction.reply(v2(container));
    }
});
