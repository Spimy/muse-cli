import { Message } from 'discord.js';
import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

@Command({
    name: 'clear',
    aliases: ['clearqueue'],
    category: 'Music',
    usage: '[index:number]',
    description: 'Accidentally added a playlist or music? Clear the queue completely or remove a music at a specific index!'
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;

        if (args[0]) {

            const index = parseInt(args[0]) - 1;
            if (isNaN(index)) return false;

            const video = queue.upcoming[index];
            queue.upcoming.splice(index, 1);
            message.channel.send(`🗑️ **${video.title}** has been removed from the queue!`);

            return true;

        }

        queue.upcoming = [];
        message.channel.send('🗑️ The queue has been cleared! Add more songs or the playback will end after the current song!');
        return true;

    }

}