import { validateEnv } from "@constatic/base";
import { z } from "zod";
import "./constants.js";

// Empty values in the .env file (KEY=) are treated as "not set"
const optional = z.string().trim().optional().transform(value => value || undefined);

export const env = await validateEnv(z.looseObject({
    BOT_TOKEN: z.string("Discord Bot Token is required").min(1),
    WEBHOOK_LOGS_URL: z.union([z.url(), z.literal("")]).optional().transform(value => value || undefined),
    GUILD_ID: optional,
    MOD_LOG_CHANNEL_ID: optional,
    EVENT_LOG_CHANNEL_ID: optional,
    LOG_MESSAGE_CONTENT: z.string().trim().optional().transform(value => value?.toLowerCase() === "true"),
    WELCOME_CHANNEL_ID: optional,
    AUTOROLE_ROLE_ID: optional,
    SUGGESTIONS_CHANNEL_ID: optional,
    TICKETS_CATEGORY_ID: optional,
    TICKETS_STAFF_ROLE_ID: optional,
}));
