import { v2 } from "#functions";
import { brBuilder, createContainer, createRow, createSeparator } from "@magicyan/discord";
import { ApplicationCommandOptionType, StringSelectMenuBuilder, type Guild } from "discord.js";

const categories = {
    general: {
        label: "Geral",
        emoji: "✨",
        commands: ["help", "ping", "avatar", "userinfo", "serverinfo", "botinfo", "poll", "suggest"],
    },
    moderation: {
        label: "Moderação",
        emoji: "🛡️",
        commands: ["ban", "unban", "kick", "timeout", "untimeout", "warn", "purge", "slowmode", "lock", "unlock", "automod"],
    },
    server: {
        label: "Servidor",
        emoji: "🏠",
        commands: ["role", "rolepanel", "ticket", "announce"],
    },
} as const;

export type HelpCategory = keyof typeof categories;

export function isHelpCategory(value: string): value is HelpCategory {
    return value in categories;
}

/** Reads the registered commands, so the help never gets outdated */
function describeCommand(guild: Guild, name: string) {
    const command = guild.client.application.commands.cache.find(c => c.name === name)
        ?? guild.commands.cache.find(c => c.name === name);

    if (!command) return `\`/${name}\``;

    const subcommands = command.options.filter(o => o.type === ApplicationCommandOptionType.Subcommand);
    if (!subcommands.length) return `</${name}:${command.id}> — ${command.description}`;

    return subcommands
        .map(sub => `</${name} ${sub.name}:${command.id}> — ${sub.description}`)
        .join("\n");
}

export function helpMenu<R>(guild: Guild, selected: HelpCategory = "general", ephemeral = false): R {
    const category = categories[selected];

    const container = createContainer(constants.colors.azoxo,
        `## 📖 Central de ajuda`,
        "Escolha uma categoria no menu abaixo para ver os comandos disponíveis.",
        createSeparator(),
        `### ${category.emoji} ${category.label}`,
        brBuilder(...category.commands.map(name => describeCommand(guild, name))),
        createSeparator(),
        createRow(
            new StringSelectMenuBuilder({
                customId: "/help/category",
                placeholder: "Selecione uma categoria",
                options: Object.entries(categories).map(([value, data]) => ({
                    label: data.label,
                    emoji: data.emoji,
                    value,
                    default: value === selected,
                })),
            })
        ),
    );

    return v2<R>(container, ephemeral);
}
