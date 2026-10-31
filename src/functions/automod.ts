import { env } from "#env";
import {
    AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType,
    type AutoModerationActionOptions, type AutoModerationTriggerMetadataOptions, type Guild
} from "discord.js";

export const automodRuleNames = {
    spam: "[Bot] Anti-spam",
    mentions: "[Bot] Spam de menções",
    words: "[Bot] Palavras bloqueadas",
    presets: "[Bot] Listas prontas do Discord",
} as const;

export type AutomodRuleKey = keyof typeof automodRuleNames;

type RuleTrigger = {
    triggerType: AutoModerationRuleTriggerType;
    triggerMetadata?: AutoModerationTriggerMetadataOptions;
};

/** Creates, updates or removes (when `trigger` is null) one of the AutoMod rules managed by the bot */
export async function setAutomodRule(
    guild: Guild, key: AutomodRuleKey, trigger: RuleTrigger | null, reason: string
): Promise<"created" | "updated" | "removed" | "unchanged"> {
    const rules = await guild.autoModerationRules.fetch();
    const existing = rules.find(rule => rule.name === automodRuleNames[key]);

    if (!trigger) {
        if (!existing) return "unchanged";
        await existing.delete(reason);
        return "removed";
    }

    const actions: AutoModerationActionOptions[] = [
        {
            type: AutoModerationActionType.BlockMessage,
            metadata: { customMessage: "Esta mensagem foi bloqueada pelo AutoMod do servidor." },
        },
    ];
    // Sends an alert to the moderation log channel, when it is set
    if (env.MOD_LOG_CHANNEL_ID && guild.channels.cache.has(env.MOD_LOG_CHANNEL_ID)) {
        actions.push({
            type: AutoModerationActionType.SendAlertMessage,
            metadata: { channel: env.MOD_LOG_CHANNEL_ID },
        });
    }

    if (existing) {
        await existing.edit({ triggerMetadata: trigger.triggerMetadata, actions, enabled: true, reason });
        return "updated";
    }

    await guild.autoModerationRules.create({
        name: automodRuleNames[key],
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: trigger.triggerType,
        triggerMetadata: trigger.triggerMetadata,
        actions,
        enabled: true,
        reason,
    });
    return "created";
}
