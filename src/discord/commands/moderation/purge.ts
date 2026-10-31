import { createCommand } from "#base";
import { notice } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "purge",
    description: "Apaga várias mensagens do canal 🧹",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageMessages"],
    options: [
        {
            name: "amount",
            description: "Quantidade de mensagens (1 a 100)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100,
            required: true,
        },
        {
            name: "user",
            description: "Apagar apenas as mensagens deste usuário",
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(interaction) {
        const { options, channel } = interaction;

        if (!channel || channel.isDMBased() || !channel.isTextBased() || !("bulkDelete" in channel)) {
            await interaction.reply(notice("error", "Não é possível apagar mensagens neste tipo de canal."));
            return;
        }

        const amount = options.getInteger("amount", true);
        const user = options.getUser("user");

        await interaction.deferReply({ flags: ["Ephemeral"] });

        try {
            let messages = await channel.messages.fetch({ limit: 100 });
            if (user) messages = messages.filter(message => message.author.id === user.id);

            // Messages older than 14 days cannot be bulk deleted, they are ignored
            const deleted = await channel.bulkDelete(messages.first(amount), true);

            await interaction.editReply(notice(
                deleted.size ? "success" : "warning",
                deleted.size
                    ? `**${deleted.size}** mensagens apagadas.`
                    : "Nenhuma mensagem foi apagada. Mensagens com mais de 14 dias não podem ser removidas em massa.",
                false
            ));
        } catch {
            await interaction.editReply(notice("error", "Não consegui apagar as mensagens. Verifique minhas permissões neste canal.", false));
        }
    }
});
