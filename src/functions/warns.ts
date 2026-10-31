import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface Warn {
    id: number;
    guildId: string;
    userId: string;
    moderatorId: string;
    reason: string;
    createdAt: string;
}

interface WarnsFile {
    nextId: number;
    warns: Warn[];
}

// Simple JSON storage so the bot works without any database.
// For bigger bots, swap these functions for a real database (see the Constatic database presets).
const filePath = resolve(process.cwd(), "data", "warns.json");

function load(): WarnsFile {
    if (!existsSync(filePath)) return { nextId: 1, warns: [] };
    try {
        return JSON.parse(readFileSync(filePath, "utf-8")) as WarnsFile;
    } catch {
        return { nextId: 1, warns: [] };
    }
}

function save(data: WarnsFile) {
    mkdirSync(dirname(filePath), { recursive: true });
    const temp = `${filePath}.tmp`;
    writeFileSync(temp, JSON.stringify(data, null, 2));
    renameSync(temp, filePath);
}

export function addWarn(data: Omit<Warn, "id" | "createdAt">): Warn {
    const file = load();
    const warn: Warn = { ...data, id: file.nextId++, createdAt: new Date().toISOString() };
    file.warns.push(warn);
    save(file);
    return warn;
}

export function getWarns(guildId: string, userId: string): Warn[] {
    return load().warns.filter(warn => warn.guildId === guildId && warn.userId === userId);
}

export function removeWarn(guildId: string, id: number): Warn | null {
    const file = load();
    const index = file.warns.findIndex(warn => warn.guildId === guildId && warn.id === id);
    if (index === -1) return null;
    const [removed] = file.warns.splice(index, 1);
    save(file);
    return removed;
}

export function clearWarns(guildId: string, userId: string): number {
    const file = load();
    const before = file.warns.length;
    file.warns = file.warns.filter(warn => !(warn.guildId === guildId && warn.userId === userId));
    save(file);
    return before - file.warns.length;
}
