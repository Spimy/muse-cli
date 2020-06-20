import { client } from '../../index';
import { Command } from "../../lib/commands/Command";
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

import { Message, MessageEmbed, User, MessageReaction } from 'discord.js';
import { Queue } from '../../lib/music/Queue';
import { Music } from '../../lib/music/Music';

interface pageInfo {
    pages: Music[][];
    currentPage: number;
    currentListNum: number;
}

@Command({
    name: 'queue',
    aliases: ['q', 'list'],
    description: 'View music queue',
    category: 'Music'
})
default class implements CommandExecutor {

    private readonly itemsPerPage = 5;
    private readonly reactionTime = 60;
    private readonly next = '⏩';
    private readonly previous = '⏪';

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;

        const info = await this.setupPages(queue);

        const embed = new MessageEmbed().setColor('RANDOM');
        await this.setEmbed(message.author, embed, queue, info);

        const msg = await message.channel.send(embed);
        if (info.pages.length > 1) await this.paginate(message.author, msg, embed, queue, info);
        return true;

    }

    private setupPages = async (queue: Queue): Promise<pageInfo> => {

        const upcoming = [...queue.upcoming];
        const pages: Music[][] = [];

        while (upcoming.length > 0) {
            pages.push(upcoming.splice(0, this.itemsPerPage));
        }

        const currentPage = 1;
        const currentListNum = (currentPage * this.itemsPerPage) - this.itemsPerPage;

        return { pages, currentPage, currentListNum };

    }

    private setEmbed = async (author: User, embed: MessageEmbed, queue: Queue, info: pageInfo) => {

        const title = queue.upcoming.length > 0 ? `Upcoming - Next ${queue.upcoming.length}` : "Currently Playing";

        const descriptionArray: string[] = [
            `Looping queue: ${String(queue.loop)[0].toUpperCase() + String(queue.loop).substring(1)}`
        ];

        info.currentListNum = (info.currentPage * this.itemsPerPage) - this.itemsPerPage;

        if (info.pages.length > 0) {
            descriptionArray.push(`${info.pages[info.currentPage - 1].map((music, index) =>
                `**[${info.currentListNum + (index + 1)}]:** [${music.title}](${music.url})`
            ).join('\n')}`);
        }
        descriptionArray.push(`🎵 **Currently Playing:** [${queue.current?.title}](${queue.current?.url})`);

        const description = descriptionArray.join('\n\n');
        embed
            .setTitle(title)
            .setThumbnail(queue.current!.thumbnail)
            .setDescription(description)
            .setFooter(`Page ${info.currentPage} of ${info.pages.length === 0 ? 1 : info.pages.length} | Requested by ${author.tag}`)
            .setTimestamp();

    }

    private paginate = async (author: User, message: Message, embed: MessageEmbed, queue: Queue, info: pageInfo) => {

        await message.react(this.previous);
        await message.react(this.next);

        const filter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === this.next || reaction.emoji.name === this.previous) && !user.bot;
        };
        const collector = message.createReactionCollector(filter, { time: this.reactionTime * 1000 });

        collector.on('collect', async (reaction: MessageReaction, user: User) => {

            const action = reaction.emoji.name;

            switch (action) {
                case this.next: info.currentPage === info.pages.length ? info.currentPage = 1 : info.currentPage++; break;
                case this.previous: info.currentPage === 1 ? info.currentPage = info.pages.length : info.currentPage--; break;
            }

            await this.setEmbed(author, embed, queue, info);
            message.edit(embed);
            reaction.users.remove(user);

        });

        collector.on('end', (collected) => collected.first()?.message.reactions.removeAll());

    }

}