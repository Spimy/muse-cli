import { Message, VoiceConnection } from 'discord.js';
import { Music } from '../../lib/music/Music';
import { Command } from '../../lib/commands/Command';
import { CommandInfo } from '../../lib/commands/CommandInfo';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

@Command({
    name: 'skip',
    category: 'Music',
    usage: '[userCount:boolean]',
    description: [
        'Don\'t like the current music? Skip it! No-one enjoys horrible musics! Requires votes if user is not admin!',
        'The second argument is used to set whether or not to use the number of users in the voice channel to skip a music',
        'Note: same user cannot vote more than once.'
    ].join('\n\n'),
    permissions: ['ADMINISTRATOR'],
    overrideDefaultPermCheck: true
})
default class implements CommandExecutor {

    private readonly skipCount = 3;

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;

        const { current, connection, voiceChannel } = queue;

        // @ts-ignore
        const skip = this.info as CommandInfo;
        const hasPerm: boolean | undefined = skip.permissions?.some(perm => message.member?.permissions.has(perm));

        if (!hasPerm && typeof hasPerm !== 'undefined') {

            if (current.votes.includes(message.member!)) {
                message.channel.send(`⚠️ ${message.author}, you have already voted!`);
                return true;
            }

            current.votes.push(message.member!)
            const skipCount = !queue.userCountskip ? this.skipCount : voiceChannel.members.size - 1;

            message.channel.send(`⏩ ${message.author}, you have voted to skip! **${current.votes.length}/${skipCount}** votes`);

            if (current.votes.length >= skipCount) this.skipMusic(current, connection!);
            return true;

        }

        if (args[0]) {
            const bool = args[0] === 'true' ? true : (args[0] === 'false' ? false : args[0]);
            if (typeof bool != 'boolean') return false;

            queue.userCountskip = bool;
            message.reply(`⏩ Skip count will now be ${bool ? '' : 'not '}equivalent to the number of users in the voice channel!`);
            return true;
        }

        this.skipMusic(current, connection!);
        return true;

    }

    private skipMusic = (current: Music, connection: VoiceConnection) => {

        if (current.paused) {
            current.paused = false;
            connection.dispatcher.resume();
        }

        if (current.loop) current.loop = false;

        connection.dispatcher.emit('finish');

    }

}