import { v2 } from "#functions";
import { brBuilder, createContainer, createMediaGallery, createSection, createSeparator } from "@magicyan/discord";
import { ChannelType, GuildVerificationLevel, time, type Guild } from "discord.js";

export function serverInfoMenu<R>(guild: Guild): R {
    const channels = guild.channels.cache;
    const count = (...types: ChannelType[]) => channels.filter(channel => types.includes(channel.type)).size;

    const container = createContainer(constants.colors.azoxo,
        createSection({
            content: [
                `## ${guild.name}`,
                guild.description ?? "-# Este servidor não tem descrição.",
            ],
            thumbnail: guild.iconURL({ size: 256 }) ?? guild.client.user.displayAvatarURL({ size: 256 }),
        }),
        createSeparator(),
        brBuilder(
            `**ID:** \`${guild.id}\``,
            `**Dono:** <@${guild.ownerId}>`,
            `**Criado em:** ${time(guild.createdAt, "D")} (${time(guild.createdAt, "R")})`,
            `**Verificação:** ${GuildVerificationLevel[guild.verificationLevel]}`,
        ),
        createSeparator(),
        brBuilder(
            `**Membros:** ${guild.memberCount}`,
            `**Canais:** ${channels.size} (${count(ChannelType.GuildText, ChannelType.GuildAnnouncement)} texto, ${count(ChannelType.GuildVoice, ChannelType.GuildStageVoice)} voz)`,
            `**Cargos:** ${guild.roles.cache.size - 1}`,
            `**Emojis:** ${guild.emojis.cache.size}`,
            `**Impulsos:** ${guild.premiumSubscriptionCount ?? 0} (nível ${guild.premiumTier})`,
        ),
    );

    const banner = guild.bannerURL({ size: 1024 });
    if (banner) container.addMediaGalleryComponents(createMediaGallery(banner));

    return v2<R>(container);
}
