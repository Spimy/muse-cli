import { client } from '../../index';
import { Music } from '../../lib/music/Music';
import { Command } from "../../lib/commands/Command";
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

import { Video } from 'popyt';
import { Message, TextChannel, GuildMember } from 'discord.js';

@Command({
    name: 'play',
    description: 'Bored? How about playing some music from youtube? Be sure to be in a voice channel before running this command!',
    category: 'Music',
    usage: '<URL:string | query:string>'
})
default class implements CommandExecutor {

    private readonly urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    private readonly videoRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    private readonly playlistRegex = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;

    private setMusicInfo = async (video: Video, member: GuildMember) => {
        const channel = await client.$youtube.getChannel(video.channelId);
        const music: Music = {
            title: video.title,
            url: video.url,
            paused: false,
            loop: false,
            duration: (video.minutes * 60) + video.seconds,
            thumbnail: video.thumbnails.maxres?.url || video.thumbnails.default?.url!,
            author: channel.name,
            authorUrl: channel.url,
            requester: member,
        }
        return music;
    }

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        if (args.length === 0 || !message.member?.voice.channel) return false;

        const { player } = message.guild!;
        const member = message.member;
        const textChannel = <TextChannel>message.channel!;
        const voiceChannel = message.member.voice.channel;

        if (this.urlRegex.test(args[0])) {

            if (this.videoRegex.test(args[0])) {

                try {

                    const result = await client.$youtube.getVideo(args[0]);
                    const music = await this.setMusicInfo(result, member);
                    player.addToQueue({ music, textChannel, voiceChannel, playlist: false });

                } catch {
                    return false;
                }

                return true;
            }

            if (this.playlistRegex.test(args[0])) {
                const msg = await message.channel.send('🔄 Processing playlist...');

                const playlist = await client.$youtube.getPlaylist(args[0]);
                const results = await playlist.fetchVideos(0);
                if (results.length === 0) return false;

                results.forEach(async result => {
                    if (result.private) return;
                    const video = await client.$youtube.getVideo(result);
                    const music = await this.setMusicInfo(video, member);
                    player.addToQueue({ music, textChannel, voiceChannel, playlist: true });
                });

                msg.edit(`✅ Successfully added **${playlist.title}** to the queue`);

                return true;
            }

            return false;

        }

        const result = await client.$youtube.getVideo(args.join(' '));
        if (!result) return false;

        const music = await this.setMusicInfo(result, member);
        player.addToQueue({ music, textChannel, voiceChannel, playlist: false });

        return true;

    }

}