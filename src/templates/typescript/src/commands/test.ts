import { Message } from 'discord.js';
import { Command } from '../lib/commands/Command';
import { CommandExecutor } from '../lib/commands/CommandExecutor';

@Command({
    name: 'test',
    aliases: ['t']
})
default class implements CommandExecutor {

    execute = async (message: Message): Promise<boolean> => {
        message.channel.send('test');
        return true;
    }

}