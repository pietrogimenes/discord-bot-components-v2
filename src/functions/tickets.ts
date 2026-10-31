import { env } from "#env";
import { brBuilder, createContainer } from "@magicyan/discord";
import { ChannelType, time, type Guild, type GuildBasedChannel, type GuildMember, type TextChannel, type User } from "discord.js";
import { setTimeout as sleep } from "node:timers/promises";
import { sendLog } from "./logs.js";

// Tickets are stateless: the ticket owner is saved in the channel topic as `ticket:<userId> ...`
const topicPrefix = "ticket:";

export function ticketTopic(userId: string, subject: string) {
    return `${topicPrefix}${userId} • ${subject}`.slice(0, 1000);
}

export function ticketOwnerId(channel: GuildBasedChannel | null): string | null {
    if (channel?.type !== ChannelType.GuildText || !channel.topic?.startsWith(topicPrefix)) return null;
    return channel.topic.slice(topicPrefix.length).split(" ")[0] || null;
}

export function findOpenTicket(guild: Guild, userId: string) {
    return guild.channels.cache.find(channel => ticketOwnerId(channel) === userId);
}

export function isTicketStaff(member: GuildMember) {
    return member.permissions.has("ManageChannels")
        || (!!env.TICKETS_STAFF_ROLE_ID && member.roles.cache.has(env.TICKETS_STAFF_ROLE_ID));
}

/** Logs and deletes a ticket channel after a short delay, so the members can read the last message */
export async function closeTicket(channel: TextChannel, closedBy: User) {
    const ownerId = ticketOwnerId(channel);

    await sendLog(channel.guild, env.MOD_LOG_CHANNEL_ID, createContainer(constants.colors.primary,
        "## 🎫 Ticket fechado",
        brBuilder(
            `**Canal:** #${channel.name}`,
            ownerId && `**Aberto por:** <@${ownerId}>`,
            `**Fechado por:** ${closedBy}`,
            time(new Date(), "f"),
        ),
    ));

    await sleep(5000);
    await channel.delete(`Ticket fechado por ${closedBy.username}`).catch(() => null);
}
