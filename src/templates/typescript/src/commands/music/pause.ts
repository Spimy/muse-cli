import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';
import { Message, MessageEmbed } from 'discord.js';

@Command({
    name: 'pause',
    description: 'Busy and don\'t want to miss a music? Pause it! I\'ll wait till you come back!',
    category: 'Music',
})
default class implements CommandExecutor {

    execute = async (message: Message): Promise<boolean> => {

        const { queue, queue: { current, connection }, player } = message.guild!;

        if (typeof current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;
        if (current.paused) return false;

        current.paused = true;
        connection?.dispatcher.pause();

        const durationBar = player.durationBar(queue);

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Successfully Paused')
            .setThumbnail(current.thumbnail)
            .setDescription(`⏸️ [${current.title}](${current.url}) has been paused\n${durationBar}`)
            .setFooter(`Requested by ${message.author.tag}`)
            .setTimestamp()

        message.channel.send(embed);
        return true;
    }

}