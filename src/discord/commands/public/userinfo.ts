import { createCommand } from "#base";
import { userInfoMenu } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "userinfo",
    description: "Mostra informações de um usuário 👤",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Usuário (padrão: você)",
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(interaction) {
        // fetch() is needed to receive the user banner
        const user = await (interaction.options.getUser("user") ?? interaction.user).fetch();
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        await interaction.reply(userInfoMenu(user, member));
    }
});
