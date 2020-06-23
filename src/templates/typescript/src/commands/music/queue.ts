import { Queue } from '../../lib/music/Queue';
import { Pages } from '../../types';
import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';
import { Message, MessageEmbed, User, MessageReaction, Guild, ReactionCollector } from 'discord.js';


@Command({
    name: 'queue',
    aliases: ['q', 'list'],
    description:
        'Excited about the next music? View a list of songs in the queue to be even more excited...' +
        'or disappointed by someone\'s poor taste in music!',
    category: 'Music'
})
default class implements CommandExecutor {
    private readonly itemsPerPage = 5;
    private readonly reactionTime = 60;
    private readonly next = '⏩';
    private readonly previous = '⏪';

    execute = async (message: Message): Promise<boolean> => {

        const { queue } = message.guild!;
        if (typeof queue.current === 'undefined') return false;
        if (message.member!.voice.channel !== queue.voiceChannel) return false;

        const currentPage = 1;

        const embed = new MessageEmbed().setColor('RANDOM');
        await this.setEmbed(message.author, embed, message.guild!, currentPage);

        const msg = await message.channel.send(embed);
        await this.paginate(message.author, msg, embed, currentPage);
        return true;

    }

    private setupPages = async (queue: Queue): Promise<Pages> => {

        const upcoming = [...queue.upcoming];
        const pages: Pages = [];

        while (upcoming.length > 0) {
            pages.push(upcoming.splice(0, this.itemsPerPage));
        }

        return pages;

    }

    private setEmbed = async (author: User, embed: MessageEmbed, guild: Guild, currentPage: number, pages?: Pages) => {

        const { queue, queue: { current, upcoming, loop } } = guild;
        pages = pages ? pages : await this.setupPages(queue);

        const title = upcoming.length > 0 ? `Upcoming - Next ${upcoming.length}` : 'Currently Playing';

        const description: string[] = [
            `Looping queue: ${String(loop)[0].toUpperCase() + String(loop).substring(1)}`
        ];

        const currentListNum = (currentPage * this.itemsPerPage) - this.itemsPerPage;

        if (pages.length > 0) {
            description.push(`${pages[currentPage - 1].map((music, index) =>
                `**[${currentListNum + (index + 1)}]:** [${music.title}](${music.url})`
            ).join('\n')}`);
        }
        description.push(`🎵 **Currently Playing:** [${current?.title}](${current?.url})`);

        embed
            .setTitle(title)
            .setThumbnail(current!.thumbnail)
            .setDescription(description.join('\n\n'))
            .setFooter(`Page ${currentPage} of ${pages.length === 0 ? 1 : pages.length} | Requested by ${author.tag}`)
            .setTimestamp();

    }

    private paginate = async (author: User, message: Message, embed: MessageEmbed, currentPage: number) => {

        await message.react(this.previous);
        await message.react(this.next);

        const filter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === this.next || reaction.emoji.name === this.previous) && !user.bot;
        };
        const collector = message.createReactionCollector(filter, { time: this.reactionTime * 1000 });

        collector.on('collect', async (reaction: MessageReaction, user: User) => {

            const pages = await this.setupPages(message.guild!.queue);

            if (pages.length < 2) {
                currentPage = 1;
                await this.setEmbed(author, embed, message.guild!, currentPage, pages);
                message.edit(embed);
            }

            const action = reaction.emoji.name;
            switch (action) {
                case this.next: currentPage === pages.length ? currentPage = 1 : currentPage++; break;
                case this.previous: currentPage === 1 ? currentPage = pages.length : currentPage--; break;
            }

            await this.setEmbed(author, embed, message.guild!, currentPage, pages);
            message.edit(embed);
            reaction.users.remove(user);

        });

        collector.on('end', () => message.reactions.removeAll());

    }

}