import { createEvent } from "#base";
import { env } from "#env";
import { sendLog } from "#functions";
import { brBuilder, createContainer, createSection } from "@magicyan/discord";
import { time } from "discord.js";

createEvent({
    name: "Log member join",
    event: "guildMemberAdd",
    async run(member) {
        const container = createContainer(constants.colors.success,
            createSection({
                content: [
                    "## 📥 Membro entrou",
                    brBuilder(
                        `${member.user} (\`${member.id}\`)`,
                        `**Conta criada:** ${time(member.user.createdAt, "R")}`,
                        `**Total de membros:** ${member.guild.memberCount}`,
                    ),
                ],
                thumbnail: member.displayAvatarURL({ size: 128 }),
            }),
        );
        await sendLog(member.guild, env.EVENT_LOG_CHANNEL_ID, container);
    },
});

createEvent({
    name: "Log member leave",
    event: "guildMemberRemove",
    async run(member) {
        const roles = member.roles?.cache.filter(role => role.id !== member.guild.id);

        const container = createContainer(constants.colors.danger,
            createSection({
                content: [
                    "## 📤 Membro saiu",
                    brBuilder(
                        `${member.user} (\`${member.id}\`)`,
                        member.joinedAt && `**Entrou:** ${time(member.joinedAt, "R")}`,
                        roles?.size && `**Cargos:** ${roles.map(role => role.name).join(", ")}`,
                    ),
                ],
                thumbnail: member.displayAvatarURL({ size: 128 }),
            }),
        );
        await sendLog(member.guild, env.EVENT_LOG_CHANNEL_ID, container);
    },
});
