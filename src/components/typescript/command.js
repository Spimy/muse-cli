export const commandTemplate = (name, counter, category) => {
    const command =
        `
import { Message } from 'discord.js';
import { Command } from '${'../'.repeat(counter)}lib/commands/Command';
import { CommandExecutor } from '${'../'.repeat(counter)}lib/commands/CommandExecutor';

@Command({
    name: '${name}'${typeof category !== 'undefined' ? `, \n    category: '${category}'` : ''}
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {
        return true;
    }

}
`
    return command;
}