import { closeTicket, isTicketStaff, notice, ticketOwnerId } from "#functions";
import { ChannelType } from "discord.js";
import command from "./command.js";

command.subcommand({
    name: "close",
    description: "Fecha o ticket deste canal",
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
