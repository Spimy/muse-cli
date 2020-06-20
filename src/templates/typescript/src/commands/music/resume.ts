import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';
import { Message, MessageEmbed } from 'discord.js';

@Command({
    name: 'resume',
    description: 'You\'re back? Use this command to resume a paused music!\nOnly works if music playback is paused!',
    category: 'Music'
})
default class implements CommandExecutor {

    execute = async (message: Message): Promise<boolean> => {

        const { queue, queue: { current, connection }, player } = message.guild!;

        if (typeof current === 'undefined' || !current?.paused) return false;

        current.paused = false;
        connection?.dispatcher.resume();

        const [durationBar, timeString] = player.durationBar(queue);

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Successfully Resumed")
            .setThumbnail(current.thumbnail)
            .setDescription(`▶️ [${current.title}](${current.url}) has been resumed\n\`\`\`${durationBar} ${timeString}\`\`\``)
            .setFooter(`Requested by ${message.author.tag}`)
            .setTimestamp()

        message.channel.send(embed);
        return true;
    }

}