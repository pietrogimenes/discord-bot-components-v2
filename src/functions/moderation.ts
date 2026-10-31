import { env } from "#env";
import { brBuilder, createContainer, createSeparator } from "@magicyan/discord";
import { time, type Guild, type GuildMember, type User } from "discord.js";
import { sendLog } from "./logs.js";

type Capability = "bannable" | "kickable" | "moderatable";

/**
 * Validates if the moderator can apply an action in the target member.
 * Returns an error message, or null when everything is fine.
 */
export function checkTarget(moderator: GuildMember, target: GuildMember, capability: Capability): string | null {
    const { guild } = moderator;

    if (target.id === moderator.id) return "Você não pode aplicar essa ação em si mesmo.";
    if (target.id === guild.client.user.id) return "Eu não posso aplicar essa ação em mim mesmo.";
    if (target.id === guild.ownerId) return "Não é possível aplicar essa ação no dono do servidor.";

    const isOwner = moderator.id === guild.ownerId;
    if (!isOwner && target.roles.highest.position >= moderator.roles.highest.position) {
        return "Você não pode moderar alguém com cargo igual ou superior ao seu.";
    }
    if (!target[capability]) {
        return "Não consigo moderar este membro. Meu cargo precisa estar acima do dele e com a permissão necessária.";
    }
    return null;
}

/** Text saved in the server audit log */
export function auditReason(moderator: User, reason?: string | null) {
    return `${reason ?? "Sem motivo informado"} • por ${moderator.username}`.slice(0, 512);
}

interface ModLogData {
    action: string;
    emoji: string;
    color: string;
    target: User;
    moderator: User;
    reason?: string | null;
    details?: string[];
}

/** Sends a log card to the channel set in MOD_LOG_CHANNEL_ID (if any) */
export async function sendModLog(guild: Guild, data: ModLogData) {
    const container = createContainer(data.color,
        `## ${data.emoji} ${data.action}`,
        createSeparator(),
        brBuilder(
            `**Membro:** ${data.target} (\`${data.target.id}\`)`,
            `**Moderador:** ${data.moderator}`,
            ...(data.details ?? []),
            `**Motivo:** ${data.reason ?? "Não informado"}`,
        ),
        `-# ${time(new Date(), "f")}`
    );

    await sendLog(guild, env.MOD_LOG_CHANNEL_ID, container);
}

/** Tries to notify the user by DM. Silently ignores users with closed DMs. */
export async function notifyUser(user: User, guild: Guild, title: string, reason?: string | null, color: string = constants.colors.warning) {
    const container = createContainer(color,
        `## ${title}`,
        `**Servidor:** ${guild.name}\n**Motivo:** ${reason ?? "Não informado"}`
    );
    await user.send({ flags: ["IsComponentsV2"], components: [container] }).catch(() => null);
}
