import { createCommand } from "#base";
import { v2 } from "#functions";
import { createContainer, createLinkButton, createMediaGallery, createRow, createSeparator } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "avatar",
    description: "Mostra o avatar de um usuário 🖼️",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Usuário (padrão: você)",
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(interaction) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        const member = interaction.options.getMember("user") ?? (user.id === interaction.user.id ? interaction.member : null);

        const avatar = (member ?? user).displayAvatarURL({ size: 1024 });
        const link = (extension: "png" | "webp" | "jpg") =>
            (member ?? user).displayAvatarURL({ size: 4096, extension });

        const container = createContainer(constants.colors.azoxo,
            `## 🖼️ Avatar de ${member?.displayName ?? user.displayName}`,
            createMediaGallery(avatar),
            createSeparator(),
            createRow(
                createLinkButton(link("png"), "PNG"),
                createLinkButton(link("webp"), "WEBP"),
                createLinkButton(link("jpg"), "JPG"),
            ),
        );

        await interaction.reply(v2(container, false));
    }
});
