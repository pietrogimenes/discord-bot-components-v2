import { createCommand } from "#base";
import { auditReason, formatDuration, notice } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

const channelTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread] as const;

createCommand({
    name: "slowmode",
    description: "Define o modo lento de um canal 🐌",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageChannels"],
    options: [
        {
            name: "seconds",
            description: "Segundos entre mensagens (0 desativa, máximo 21600)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 0,
            maxValue: 21600,
            required: true,
        },
        {
            name: "channel",
            description: "Canal (padrão: o canal atual)",
            type: ApplicationCommandOptionType.Channel,
            channelTypes,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel", false, channelTypes) ?? interaction.channel;
        const seconds = options.getInteger("seconds", true);

        if (!channel || !("setRateLimitPerUser" in channel)) {
            await interaction.reply(notice("error", "Este canal não suporta modo lento."));
            return;
        }

        try {
            await channel.setRateLimitPerUser(seconds, auditReason(interaction.user));
        } catch {
            await interaction.reply(notice("error", "Não consegui alterar o modo lento. Verifique minhas permissões."));
            return;
        }

        await interaction.reply(notice("success", seconds
            ? `Modo lento de ${channel} definido para **${formatDuration(seconds * 1000)}**.`
            : `Modo lento de ${channel} desativado.`
        ));
    }
});
