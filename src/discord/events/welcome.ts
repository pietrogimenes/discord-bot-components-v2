import { createEvent } from "#base";
import { env } from "#env";
import { createContainer, createSection } from "@magicyan/discord";

// Only runs when WELCOME_CHANNEL_ID is set (it also enables the GuildMembers intent, see src/index.ts)
createEvent({
    name: "Welcome new members",
    event: "guildMemberAdd",
    async run(member) {
        if (!env.WELCOME_CHANNEL_ID || member.user.bot) return;

        const channel = member.guild.channels.cache.get(env.WELCOME_CHANNEL_ID);
        if (!channel?.isSendable()) return;

        const container = createContainer(constants.colors.green,
            createSection({
                content: [
                    `## 👋 Bem-vindo(a), ${member.displayName}!`,
                    `Você é o membro **#${member.guild.memberCount}** de **${member.guild.name}**.`,
                ],
                thumbnail: member.displayAvatarURL({ size: 256 }),
            }),
        );

        await channel.send({
            flags: ["IsComponentsV2"],
            components: [container],
            allowedMentions: { users: [member.id] },
        });
    },
});
