import { client } from '../../index';
import { Music } from '../../lib/music/Music';
import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

import { Video } from 'popyt';
import { Message, TextChannel, GuildMember, MessageEmbed } from 'discord.js';

@Command({
    name: 'search',
    description: 'Bored? How about playing some music from youtube? Be sure to be in a voice channel before running this command!',
    category: 'Music',
    usage: '<URL:string | query:string>'
})
default class implements CommandExecutor {

    private readonly selectionTime = 10;
    private readonly urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        if (args.length === 0 || !message.member?.voice.channel) return false;
        if (this.urlRegex.test(args[0])) {
            return await client.$commands.get('play')?.executor.execute(message, args)!;
        }

        const { player } = message.guild!;
        const member = message.member;
        const textChannel = <TextChannel>message.channel!;
        const voiceChannel = message.member.voice.channel;

        const results = (await client.$youtube.searchVideos(args.join(' '))).results.slice(0, 10);
        if (results.length === 0) return false;

        const thumbnail = client.user?.displayAvatarURL({
            dynamic: false,
            format: 'png',
            size: 2048,
        })!

        const description = [
            results.map((video, index) => `**${index + 1} -** ${video.title}`).join('\n'),
            '🎵 Select a music from above between **1** and **10** within **10 seconds**'
        ].join('\n\n');

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('-= Music Search =-')
            .setThumbnail(thumbnail)
            .setDescription(description);

        const msg = await message.channel.send(embed);

        message.channel.awaitMessages(m => m.content > 0 && m.content < 11, {
            max: 1,
            time: this.selectionTime * 1000,
            errors: ['time']
        }).then(async response => {

            const videoIndex = parseInt(response.first()!.content) - 1;
            const music = await player.setMusicInfo(await results[videoIndex].fetch(), member)
            player.addToQueue({ music, textChannel, voiceChannel, playlist: false });

            msg.delete();
            response.first()!.delete();

        }).catch((err) => {
            if (err) undefined;
            msg.delete();
            return message.reply('⚠ You have exceeded the 10 seconds selection time!');
        });

        return true;

    }

}