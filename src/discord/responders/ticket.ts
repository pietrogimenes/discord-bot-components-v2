import { createResponder } from "#base";
import { env } from "#env";
import { closeTicket, findOpenTicket, isTicketStaff, notice, ticketOwnerId, ticketTopic } from "#functions";
import { ResponderType } from "@constatic/base";
import {
    brBuilder, createContainer, createLabel, createModal, createRadioGroup,
    createRow, createSeparator, createTextInput, modalFieldsToRecord
} from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType, TextInputStyle, type OverwriteResolvable } from "discord.js";

const categories = {
    question: "❓ Dúvida",
    problem: "🛠️ Problema",
    partnership: "🤝 Parceria",
    other: "📌 Outro",
} as const;

// Panel button: opens the form
createResponder({
    customId: "/ticket/open",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction) {
        const existing = findOpenTicket(interaction.guild, interaction.user.id);
        if (existing) {
            await interaction.reply(notice("warning", `Você já tem um ticket aberto: ${existing}`));
            return;
        }

        await interaction.showModal(
            createModal("/ticket/create", "Abrir ticket",
                createLabel("Assunto", createTextInput({
                    customId: "subject",
                    style: TextInputStyle.Short,
                    maxLength: 80,
                    required: true,
                })),
                createLabel("Categoria", createRadioGroup({
                    customId: "category",
                    options: Object.entries(categories).map(([value, label], index) => ({
                        value, label, default: index === 0,
                    })),
                })),
                createLabel("Descreva o que você precisa", createTextInput({
                    customId: "description",
                    style: TextInputStyle.Paragraph,
                    maxLength: 1000,
                    required: true,
                })),
            )
        );
    },
});

// Form submit: creates the private channel.
// The modal is opened by a button, so it is submitted as a ModalComponent (a command would be Modal)
createResponder({
    customId: "/ticket/create",
    types: [ResponderType.ModalComponent], cache: "cached",
    async run(interaction) {
        const { guild, user } = interaction;

        const { subject, category, description } = modalFieldsToRecord<{
            subject: string; category: keyof typeof categories; description: string;
        }>(interaction);

        const existing = findOpenTicket(guild, user.id);
        if (existing) {
            await interaction.reply(notice("warning", `Você já tem um ticket aberto: ${existing}`));
            return;
        }

        await interaction.deferReply({ flags: ["Ephemeral"] });

        const permissionOverwrites: OverwriteResolvable[] = [
            { id: guild.roles.everyone, deny: ["ViewChannel"] },
            { id: user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AttachFiles"] },
            { id: guild.client.user.id, allow: ["ViewChannel", "SendMessages", "ManageChannels", "ReadMessageHistory"] },
        ];
        if (env.TICKETS_STAFF_ROLE_ID && guild.roles.cache.has(env.TICKETS_STAFF_ROLE_ID)) {
            permissionOverwrites.push({
                id: env.TICKETS_STAFF_ROLE_ID,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AttachFiles"],
            });
        }

        const parent = env.TICKETS_CATEGORY_ID && guild.channels.cache.get(env.TICKETS_CATEGORY_ID)?.type === ChannelType.GuildCategory
            ? env.TICKETS_CATEGORY_ID
            : undefined;

        try {
            const channel = await guild.channels.create({
                name: `ticket-${user.username}`.slice(0, 90),
                type: ChannelType.GuildText,
                topic: ticketTopic(user.id, subject),
                parent,
                permissionOverwrites,
                reason: `Ticket aberto por ${user.username}`,
            });

            const staffMention = env.TICKETS_STAFF_ROLE_ID && guild.roles.cache.has(env.TICKETS_STAFF_ROLE_ID)
                ? ` <@&${env.TICKETS_STAFF_ROLE_ID}>` : "";

            await channel.send({
                flags: ["IsComponentsV2"],
                allowedMentions: { users: [user.id], roles: staffMention ? [env.TICKETS_STAFF_ROLE_ID!] : [] },
                components: [
                    createContainer(constants.colors.primary,
                        `## 🎫 ${subject}`,
                        `${user}${staffMention}`,
                        createSeparator(),
                        brBuilder(
                            `**Categoria:** ${categories[category] ?? categories.other}`,
                            `**Aberto por:** ${user}`,
                        ),
                        description,
                        createSeparator(),
                        createRow(
                            new ButtonBuilder({
                                customId: "/ticket/close",
                                label: "Fechar ticket",
                                emoji: "🔒",
                                style: ButtonStyle.Danger,
                            })
                        ),
                    ),
                ],
            });

            await interaction.editReply(notice("success", `Ticket criado: ${channel}`, false));
        } catch {
            await interaction.editReply(notice("error", "Não consegui criar o ticket. Avise a equipe do servidor (o bot precisa da permissão **Gerenciar canais**).", false));
        }
    },
});

// Button inside the ticket: closes it
createResponder({
    customId: "/ticket/close",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction) {
        const { channel, member } = interaction;

        const ownerId = ticketOwnerId(channel);
        if (channel?.type !== ChannelType.GuildText || !ownerId) {
            await interaction.reply(notice("error", "Este canal não é um ticket."));
            return;
        }
        if (interaction.user.id !== ownerId && !isTicketStaff(member)) {
            await interaction.reply(notice("error", "Só quem abriu o ticket ou a equipe pode fechá-lo."));
            return;
        }

        await interaction.reply(notice("info", "Este ticket será fechado em 5 segundos...", false));
        await closeTicket(channel, interaction.user);
    },
});
