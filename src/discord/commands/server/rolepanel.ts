import { createCommand, createResponder } from "#base";
import { checkRole, isDangerousRole, notice } from "#functions";
import { ResponderType } from "@constatic/base";
import { createContainer, createRow, createSeparator } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, type Role } from "discord.js";

const channelTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement] as const;

const roleOption = (n: number, required = false) => ({
    name: `role${n}`,
    description: `Cargo ${n}`,
    type: ApplicationCommandOptionType.Role,
    required,
}) as const;

// A role panel is a message with buttons. Clicking a button gives or removes the role,
// even after the bot restarts, because the responder reads the role id from the customId.
createCommand({
    name: "rolepanel",
    description: "Envia um painel para os membros escolherem cargos 🎭",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageRoles"],
    options: [
        {
            name: "title",
            description: "Título do painel",
            type: ApplicationCommandOptionType.String,
            maxLength: 100,
            required: true,
        },
        roleOption(1, true),
        roleOption(2),
        roleOption(3),
        roleOption(4),
        roleOption(5),
        {
            name: "description",
            description: "Texto explicativo do painel",
            type: ApplicationCommandOptionType.String,
            maxLength: 500,
        },
        {
            name: "channel",
            description: "Canal onde o painel será enviado (padrão: o canal atual)",
            type: ApplicationCommandOptionType.Channel,
            channelTypes,
        },
    ],
    async run(interaction) {
        const { options, member, guild } = interaction;

        // getRole may return a raw API role, so the full role is read from the guild
        const roles = [1, 2, 3, 4, 5]
            .map(n => options.getRole(`role${n}`))
            .map(role => role && guild.roles.cache.get(role.id))
            .filter((role): role is Role => !!role);

        for (const role of roles) {
            const problem = checkRole(member, role)
                ?? (isDangerousRole(role) ? `O cargo ${role} tem permissões administrativas e não pode ficar em um painel público.` : null);
            if (problem) {
                await interaction.reply(notice("error", problem));
                return;
            }
        }

        const channel = options.getChannel("channel", false, channelTypes) ?? interaction.channel;
        if (!channel?.isSendable()) {
            await interaction.reply(notice("error", "Não consigo enviar mensagens neste canal."));
            return;
        }

        const container = createContainer(constants.colors.azoxo,
            `## ${options.getString("title", true)}`,
            options.getString("description") ?? "Clique nos botões para receber ou remover um cargo.",
            createSeparator(),
            createRow(
                ...roles.map(role => new ButtonBuilder({
                    customId: `/roles/toggle/${role.id}`,
                    label: role.name.slice(0, 80),
                    style: ButtonStyle.Secondary,
                }))
            ),
        );

        try {
            await channel.send({
                flags: ["IsComponentsV2"],
                components: [container],
                allowedMentions: { parse: [] },
            });
        } catch {
            await interaction.reply(notice("error", "Não consegui enviar o painel. Verifique minhas permissões no canal."));
            return;
        }

        await interaction.reply(notice("success", `Painel enviado em ${channel}.`));
    }
});

createResponder({
    customId: "/roles/toggle/:roleId",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { roleId }) {
        const { member, guild } = interaction;

        const role = guild.roles.cache.get(roleId);
        if (!role || !role.editable || isDangerousRole(role)) {
            await interaction.reply(notice("error", "Este cargo não está mais disponível."));
            return;
        }

        const has = member.roles.cache.has(role.id);
        try {
            await (has ? member.roles.remove(role, "Painel de cargos") : member.roles.add(role, "Painel de cargos"));
        } catch {
            await interaction.reply(notice("error", "Não consegui alterar seu cargo. Avise a equipe do servidor."));
            return;
        }

        await interaction.reply(notice("success", has ? `Cargo ${role} removido.` : `Cargo ${role} adicionado.`));
    },
});
