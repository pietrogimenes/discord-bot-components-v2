import { createCommand } from "#base";

export default createCommand({
    name: "role",
    description: "Adiciona ou remove cargos de membros 🎭",
    defaultMemberPermissions: ["ManageRoles"],
});
