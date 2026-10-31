import { createCommand } from "#base";
import { notice } from "#functions";
import { createContainer } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

const channelTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement] as const;

// Replaces the old "embed builder" of classic bots: a Components V2 container with your text
createCommand({
    name: "announce",
    description: "Envia um anúncio em um canal 📢",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageGuild"],
    options: [
        {
            name: "message",
            description: "Texto do anúncio (aceita Markdown; use \\n para quebrar linha)",
            type: ApplicationCommandOptionType.String,
            maxLength: 2000,
            required: true,
        },
        {
            name: "title",
            description: "Título do anúncio",
            type: ApplicationCommandOptionType.String,
            maxLength: 100,
        },
        {
            name: "channel",
            description: "Canal do anúncio (padrão: o canal atual)",
            type: ApplicationCommandOptionType.Channel,
            channelTypes,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel", false, channelTypes) ?? interaction.channel;
        if (!channel?.isSendable()) {
            await interaction.reply(notice("error", "Não consigo enviar mensagens neste canal."));
            return;
        }

        const title = options.getString("title");
        const message = options.getString("message", true).replaceAll("\\n", "\n");

        const container = createContainer(constants.colors.azoxo,
            title && `## ${title}`,
            message,
        );

        try {
            // Mentions are disabled so the command cannot be used to ping @everyone
            await channel.send({
                flags: ["IsComponentsV2"],
                components: [container],
                allowedMentions: { parse: [] },
            });
        } catch {
            await interaction.reply(notice("error", "Não consegui enviar o anúncio. Verifique minhas permissões no canal."));
            return;
        }

        await interaction.reply(notice("success", `Anúncio enviado em ${channel}.`));
    },
});
