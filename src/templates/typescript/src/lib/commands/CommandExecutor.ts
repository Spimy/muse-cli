import { Message } from 'discord.js';

export interface CommandExecutor {
    execute: (message: Message, args: string[]) => Promise<boolean>;
}
