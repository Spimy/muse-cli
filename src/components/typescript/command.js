export const commandTemplate = (name, counter) => {
    const command =
        `
import { Message } from 'discord.js';
import { Command } from '${'../'.repeat(counter)}lib/commands/Command';
import { CommandExecutor } from '${'../'.repeat(counter)}lib/commands/CommandExecutor';

@Command({
    name: '${name}',
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {
        return true;
    }

}
`
    return command;
}