import { notice } from "#functions";
import { createContainer, createSection } from "@magicyan/discord";
import { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from "discord.js";
import command from "./command.js";

const channelTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement] as const;

command.subcommand({
    name: "panel",
    description: "Envia o painel para os membros abrirem tickets (requer Gerenciar servidor)",
    options: [
        {
            name: "channel",
            description: "Canal onde o painel será enviado (padrão: o canal atual)",
            type: ApplicationCommandOptionType.Channel,
            channelTypes,
        },
    ],
    async run(interaction) {
        // Subcommands share the permission of the main command, so it is checked here
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
            await interaction.reply(notice("error", "Você precisa da permissão **Gerenciar servidor** para usar este comando."));
            return;
        }

        const channel = interaction.options.getChannel("channel", false, channelTypes) ?? interaction.channel;
        if (!channel?.isSendable()) {
            await interaction.reply(notice("error", "Não consigo enviar mensagens neste canal."));
            return;
        }

        const container = createContainer(constants.colors.primary,
            createSection(
                "## 🎫 Central de suporte\nPrecisa de ajuda? Clique no botão para abrir um ticket privado com a nossa equipe.",
                new ButtonBuilder({
                    customId: "/ticket/open",
                    label: "Abrir ticket",
                    emoji: "📩",
                    style: ButtonStyle.Primary,
                })
            ),
        );

        try {
            await channel.send({ flags: ["IsComponentsV2"], components: [container] });
        } catch {
            await interaction.reply(notice("error", "Não consegui enviar o painel. Verifique minhas permissões no canal."));
            return;
        }

        await interaction.reply(notice("success", `Painel enviado em ${channel}.`));
    },
});
