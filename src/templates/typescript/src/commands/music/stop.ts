import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';
import { Message } from 'discord.js';

@Command({
    name: 'stop',
    aliases: ['end', 'leave'],
    category: 'Music',
    description:
        'Tired of musics? I don\'t think anyone would ever say that! But if you truly are then ' +
        'stop the music playback using this command!'
})
default class implements CommandExecutor {

    execute = async (message: Message): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;

        queue.upcoming = [];
        if (queue.loop) queue.loop = false;
        if (queue.current.loop) queue.current.loop = false;

        queue.connection?.dispatcher.emit('finish');
        return true;

    }

}