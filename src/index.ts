import { env } from "#env";
import { bootstrap } from "@constatic/base";
import { IntentsBitField } from "discord.js";

const intents = new IntentsBitField(["Guilds", "GuildModeration"]);

// Privileged intents are only requested when a feature that needs them is enabled.
// GuildMembers (Server Members Intent): welcome, autorole and member logs
if (env.WELCOME_CHANNEL_ID || env.AUTOROLE_ROLE_ID || env.EVENT_LOG_CHANNEL_ID) {
    intents.add("GuildMembers");
}
if (env.EVENT_LOG_CHANNEL_ID) {
    intents.add("GuildMessages");
}
// MessageContent (Message Content Intent): shows the text of deleted and edited messages in the logs
if (env.EVENT_LOG_CHANNEL_ID && env.LOG_MESSAGE_CONTENT) {
    intents.add("MessageContent");
}

await bootstrap({ meta: import.meta, env, intents });
