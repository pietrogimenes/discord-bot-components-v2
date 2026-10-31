const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Converts text like `30s`, `10m`, `2h`, `1d`, `1w` or `1h30m` to milliseconds.
 * Returns null when the text is not a valid duration.
 */
export function parseDuration(input: string): number | null {
    const text = input.toLowerCase().replaceAll(" ", "");
    if (!/^(\d+[smhdw])+$/.test(text)) return null;

    let total = 0;
    for (const [, amount, unit] of text.matchAll(/(\d+)([smhdw])/g)) {
        total += Number(amount) * units[unit as keyof typeof units];
    }
    return total > 0 ? total : null;
}

/** Converts milliseconds to a short text like `1d 2h 30m` */
export function formatDuration(ms: number): string {
    const parts: string[] = [];
    for (const [unit, size] of Object.entries(units).reverse()) {
        const amount = Math.floor(ms / size);
        if (amount < 1) continue;
        parts.push(`${amount}${unit}`);
        ms -= amount * size;
    }
    return parts.length ? parts.join(" ") : "0s";
}
