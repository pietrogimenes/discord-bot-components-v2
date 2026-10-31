import { createCommand } from "#base";

// Uses the native Discord AutoMod, so the rules keep working even when the bot is offline
export default createCommand({
    name: "automod",
    description: "Configura o AutoMod nativo do Discord 🤖",
    defaultMemberPermissions: ["ManageGuild"],
});
