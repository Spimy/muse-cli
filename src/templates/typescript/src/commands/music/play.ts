import { client } from '../../index';
import { Command } from "../../lib/commands/Command";
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

import ytdl from 'discord-ytdl-core';
import { Message, TextChannel, GuildMember } from 'discord.js';
import { Music } from '../../lib/music/Music';
import { Video } from 'popyt';

@Command({
    name: 'play',
    description: 'Bored? How about playing some music from youtube? Be sure to be in a voice channel before running this command!',
    category: "Music",
    usage: "<URL:string | query:string>"
})
class Play implements CommandExecutor {

    private readonly urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    private readonly videoRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    private readonly playlistRegex = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;

    private setMusicInfo = (video: Video, member: GuildMember) => {
        const music: Music = {
            title: video.title,
            url: video.url,
            loop: false,
            duration: (video.minutes * 60) + video.seconds,
            thumbnail: video.thumbnails.standard?.url!,
            requester: member
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
                const result = await client.$youtube.getVideo(args[0]);
                if (!result) return false;

                const music = this.setMusicInfo(result, member);
                player.addToQueue({ music, textChannel, voiceChannel, playlist: false });
                return true;
            }

            if (this.playlistRegex.test(args[0])) {
                const results = await client.$youtube.getPlaylistItems(args[0], 0);
                if (results.length === 0) return false;

                results.forEach(result => {
                    const music = this.setMusicInfo(result, member);
                    player.addToQueue({ music, textChannel, voiceChannel, playlist: true });
                });

                return true;
            }

            return false;

        }

        const result = await client.$youtube.getVideo(args.join(' '));
        if (!result) return false;

        const music = this.setMusicInfo(result, member);
        player.addToQueue({ music, textChannel, voiceChannel, playlist: false });

        return true;

    }

}