import { v2 } from "#functions";
import { brBuilder, createContainer, createMediaGallery, createSection, createSeparator, createTextDisplay } from "@magicyan/discord";
import { time, type GuildMember, type User } from "discord.js";

export function userInfoMenu<R>(user: User, member: GuildMember | null): R {
    const container = createContainer(member?.displayColor ? member.displayHexColor : constants.colors.azoxo,
        createSection({
            content: [
                `## ${member?.displayName ?? user.displayName}`,
                `@${user.username}${user.bot ? " • 🤖 Bot" : ""}`,
            ],
            thumbnail: (member ?? user).displayAvatarURL({ size: 256 }),
        }),
        createSeparator(),
        brBuilder(
            `**ID:** \`${user.id}\``,
            `**Conta criada:** ${time(user.createdAt, "D")} (${time(user.createdAt, "R")})`,
            member?.joinedAt && `**Entrou no servidor:** ${time(member.joinedAt, "D")} (${time(member.joinedAt, "R")})`,
            member?.premiumSince && `**Impulsionando desde:** ${time(member.premiumSince, "D")}`,
            member?.communicationDisabledUntil && `**Em timeout até:** ${time(member.communicationDisabledUntil, "f")}`,
        ),
    );

    if (member) {
        const roles = member.roles.cache
            .filter(role => role.id !== member.guild.id)
            .sort((a, b) => b.position - a.position);

        const shown = roles.first(10).join(" ");
        const extra = roles.size > 10 ? ` e mais ${roles.size - 10}` : "";
        container.addSeparatorComponents(createSeparator());
        container.addTextDisplayComponents(
            createTextDisplay(`**Cargos (${roles.size}):** ${roles.size ? shown + extra : "Nenhum"}`)
        );
    }

    const banner = user.bannerURL({ size: 1024 });
    if (banner) container.addMediaGalleryComponents(createMediaGallery(banner));

    return v2<R>(container);
}
