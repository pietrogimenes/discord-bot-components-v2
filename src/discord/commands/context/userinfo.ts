import { createCommand } from "#base";
import { userInfoMenu } from "#menus";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "User info",
    type: ApplicationCommandType.User,
    async run(interaction) {
        const user = await interaction.targetUser.fetch();
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        await interaction.reply(userInfoMenu(user, member));
    }
});
