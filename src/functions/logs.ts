import type { ContainerBuilder, Guild } from "discord.js";

/** Sends a Components V2 log card to a channel of the guild. Does nothing if the channel is missing. */
export async function sendLog(guild: Guild, channelId: string | undefined, container: ContainerBuilder) {
    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel?.isSendable()) return;

    await channel.send({
        flags: ["IsComponentsV2"],
        components: [container],
        allowedMentions: { parse: [] },
    }).catch(() => null);
}
