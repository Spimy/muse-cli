import { PermissionResolvable } from 'discord.js';

export interface CommandInfo {
    name: String;
    description?: String;
    aliases?: [];
    usage?: String;
    permissions: Array<PermissionResolvable>;
}