import { createContainer } from "@magicyan/discord";
import type { ContainerBuilder, InteractionReplyOptions } from "discord.js";

const noticeStyles = {
    success: { emoji: "✅", color: constants.colors.success },
    error: { emoji: "❌", color: constants.colors.danger },
    warning: { emoji: "⚠️", color: constants.colors.warning },
    info: { emoji: "ℹ️", color: constants.colors.primary },
} as const;

/**
 * Wraps containers in a Components V2 message payload.
 * Use `ephemeral = false` when editing or updating an existing message.
 */
export function v2<R>(components: ContainerBuilder | ContainerBuilder[], ephemeral = true): R {
    return ({
        flags: ephemeral ? ["Ephemeral", "IsComponentsV2"] : ["IsComponentsV2"],
        components: Array.isArray(components) ? components : [components],
    } satisfies InteractionReplyOptions) as R;
}

/** A small colored card with an emoji and a text, for quick feedback messages */
export function notice<R>(type: keyof typeof noticeStyles, text: string, ephemeral = true): R {
    const { emoji, color } = noticeStyles[type];
    return v2<R>(createContainer(color, `${emoji} ${text}`), ephemeral);
}

/** Cuts a text to fit in a component (text displays share a 4000 characters limit per message) */
export function clip(text: string, max: number): string {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
