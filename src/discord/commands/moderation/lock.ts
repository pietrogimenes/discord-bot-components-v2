import { createCommand } from "#base";
import { auditReason, notice } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

const channelTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement] as const;

// Locking and unlocking share the same logic, only the permission value changes
for (const locked of [true, false]) {
    createCommand({
        name: locked ? "lock" : "unlock",
        description: locked ? "Impede membros de enviar mensagens em um canal 🔒" : "Libera o envio de mensagens em um canal 🔓",
        type: ApplicationCommandType.ChatInput,
        defaultMemberPermissions: ["ManageChannels"],
        options: [
            {
                name: "channel",
                description: "Canal (padrão: o canal atual)",
                type: ApplicationCommandOptionType.Channel,
                channelTypes,
            },
        ],
        async run(interaction) {
            const { options, guild } = interaction;

            const channel = options.getChannel("channel", false, channelTypes) ?? interaction.channel;

            if (!channel || !("permissionOverwrites" in channel)) {
                await interaction.reply(notice("error", "Não é possível alterar este canal."));
                return;
            }

            try {
                // null removes the overwrite, returning to the channel default
                await channel.permissionOverwrites.edit(
                    guild.roles.everyone,
                    { SendMessages: locked ? false : null },
                    { reason: auditReason(interaction.user) }
                );
            } catch {
                await interaction.reply(notice("error", "Não consegui alterar as permissões do canal. Verifique minhas permissões."));
                return;
            }

            await interaction.reply(notice(
                "success",
                locked ? `${channel} foi trancado 🔒` : `${channel} foi liberado 🔓`,
                false
            ));
        }
    });
}
