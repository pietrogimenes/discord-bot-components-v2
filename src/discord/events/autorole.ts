import { createEvent } from "#base";
import { env } from "#env";

// Gives a role to every new member. Needs AUTOROLE_ROLE_ID and the bot role above that role.
createEvent({
    name: "Give autorole",
    event: "guildMemberAdd",
    async run(member) {
        if (!env.AUTOROLE_ROLE_ID) return;

        const role = member.guild.roles.cache.get(env.AUTOROLE_ROLE_ID);
        if (!role?.editable) return;

        await member.roles.add(role, "Autorole").catch(() => null);
    },
});
