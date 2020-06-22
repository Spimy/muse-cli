import { Message, VoiceConnection } from 'discord.js';
import { Music } from '../../lib/music/Music';
import { Command } from '../../lib/commands/Command';
import { CommandInfo } from '../../lib/commands/CommandInfo';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

@Command({
    name: 'volume',
    aliases: ['vol'],
    category: 'Music',
    usage: '[volume:number (0-100)]',
    description: 'The volume is too loud? Or is it too quiet? Change it using this command! Alternatively, view the current volume!'
})
default class implements CommandExecutor {


    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;

        let volumeEmoji;

        if (!args[0]) {
            volumeEmoji = queue.volume > 50 ? '🔊' : (queue.volume <= 0 ? '🔈' : '🔉');
            message.channel.send(`${volumeEmoji} Current Volume: **${queue.volume}/100**`);
            return true;
        }

        const volume = parseFloat(parseFloat(args[0]).toFixed(2));
        if (isNaN(volume) || volume < 0 || volume > 100) return false;

        queue.volume = volume;
        queue.connection?.dispatcher.setVolumeLogarithmic(volume / 100);

        volumeEmoji = queue.volume > 50 ? '🔊' : (queue.volume <= 0 ? '🔈' : '🔉');
        message.channel.send(`${volumeEmoji} Volume has now been set to **${queue.volume}/100**`);

        return true;

    }

}