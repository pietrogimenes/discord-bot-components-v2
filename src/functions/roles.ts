import type { GuildMember, Role } from "discord.js";

/**
 * Validates if the member can hand out the role (hierarchy) and if the bot can edit it.
 * Returns an error message, or null when everything is fine.
 */
export function checkRole(member: GuildMember, role: Role): string | null {
    if (role.id === role.guild.id) return "Não é possível usar o cargo @everyone.";
    if (role.managed) return "Este cargo é gerenciado por uma integração e não pode ser atribuído manualmente.";

    const isOwner = member.id === role.guild.ownerId;
    if (!isOwner && role.position >= member.roles.highest.position) {
        return "Você não pode gerenciar um cargo igual ou superior ao seu maior cargo.";
    }
    if (!role.editable) return "Meu cargo precisa estar acima deste cargo para eu conseguir gerenciá-lo.";
    return null;
}

/** Roles with these permissions cannot be offered in self-service panels */
const dangerousPermissions = ["Administrator", "ManageGuild", "ManageRoles", "ManageChannels", "BanMembers", "KickMembers", "ModerateMembers"] as const;

export function isDangerousRole(role: Role): boolean {
    return dangerousPermissions.some(permission => role.permissions.has(permission));
}
