import { createCommand } from "#base";

export default createCommand({
    name: "warn",
    description: "Gerencia as advertências dos membros ⚠️",
    defaultMemberPermissions: ["ModerateMembers"],
});
