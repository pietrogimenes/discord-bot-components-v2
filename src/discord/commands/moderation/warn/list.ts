import { getWarns, v2 } from "#functions";
import { brBuilder, createContainer, createSeparator, createTextDisplay } from "@magicyan/discord";
import { ApplicationCommandOptionType, time } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "list",
    description: "Lista as advertências de um membro",
    options: [
        {
            name: "member",
            description: "Membro",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    async run(interaction) {
        const user = interaction.options.getUser("member", true);
        const warns = getWarns(interaction.guild.id, user.id);

        const container = createContainer(constants.colors.warning,
            `## ⚠️ Advertências de ${user.displayName}`,
            `${warns.length} advertência(s) registrada(s).`,
        );

        if (warns.length) {
            container.addSeparatorComponents(createSeparator());
            container.addTextDisplayComponents(
                // Last 10 only, a message can hold up to 4000 characters of text
                ...warns.slice(-10).reverse().map(warn => createTextDisplay(
                    brBuilder(
                        `**#${warn.id}** • ${time(new Date(warn.createdAt), "R")} • por <@${warn.moderatorId}>`,
                        warn.reason,
                    )
                ))
            );
        }

        await interaction.reply(v2(container));
    },
});
