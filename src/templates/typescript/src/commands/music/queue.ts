import { client } from '../../index';
import { Command } from "../../lib/commands/Command";
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

import { Message, MessageEmbed } from 'discord.js';

@Command({
    name: 'queue',
    description: 'View music queue',
    category: "Music"
})
class Play implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;

        const title = queue.upcoming.length > 0 ? `Upcoming - Next ${queue.upcoming.length}` : "Currently Playing";

        const description = [
            `Looping queue: ${String(queue.loop)[0].toUpperCase() + String(queue.loop).substring(1)}`,
            `${queue.upcoming.map((music, index) => `**[${++index}]:** [${music.title}](${music.url})`).join('\n')}`,
            `🎵 **Currently Playing:** [${queue.current?.title}](${queue.current?.url})`
        ].join('\n\n');

        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor('RANDOM')
            .setThumbnail(queue.current!.thumbnail)
            .setDescription(description)
            .setFooter(`Requested by ${message.author.tag}`)
            .setTimestamp();

        await message.channel.send(embed);
        return true;
    }

}