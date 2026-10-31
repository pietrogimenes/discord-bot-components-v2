import { v2 } from "#functions";
import { createContainer, createSection } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function pingMenu<R>(wsLatency: number, apiLatency: number): R {
    const container = createContainer(constants.colors.success,
        createSection(
            `## 🏓 Pong!\n**API:** \`${apiLatency}ms\`\n**WebSocket:** \`${wsLatency < 0 ? "..." : `${wsLatency}ms`}\``,
            new ButtonBuilder({
                customId: "/ping/refresh",
                label: "Atualizar",
                emoji: "🔄",
                style: ButtonStyle.Secondary,
            })
        ),
    );

    return v2<R>(container, false);
}
