import { PermissionResolvable } from 'discord.js';

export interface CommandInfo {
    name: string;
    description?: string;
    aliases?: string[];
    usage?: string;
    permissions?: PermissionResolvable[];
}