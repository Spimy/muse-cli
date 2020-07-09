import { client } from '../../index';
import { Music } from '../../lib/music/Music';
import { Command } from '../../lib/commands/Command';
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

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        if (args.length === 0 || !message.member?.voice.channel) return false;

        const { regex } = client.$settings;
        const { player } = message.guild!;
        const member = message.member;
        const textChannel = <TextChannel>message.channel!;
        const voiceChannel = message.member.voice.channel;

        if (regex.url.test(args[0])) {

            if (regex.youtubeVideo.test(args[0])) {

                const status = await client.$youtube.getVideo(args[0])
                    .then(async video => {
                        const music = await player.setMusicInfo(video, member);
                        player.addToQueue({ music, textChannel, voiceChannel, playlist: false });
                        return true;
                    })
                    .catch(() => { return false; });


                return status;
            }

            if (regex.youtubePlaylist.test(args[0])) {

                const status = await client.$youtube.getPlaylist(args[0])
                    .then(async playlist => {
                        const msg = await message.channel.send('🔄 Processing playlist...');

                        const results = await playlist.fetchVideos(0);
                        if (results.length === 0) return false;

                        for (let i = 0; i < results.length; i++) {
                            if (results[i].private) continue;
                            const music = await player.setMusicInfo(await results[i].fetch(), member);
                            player.addToQueue({ music, textChannel, voiceChannel, playlist: true });
                        }

                        msg.edit(`✅ Successfully added **${playlist.title}** to the queue`);
                        return true;
                    })
                    .catch(() => { return false; });

                return status;
            }

            return false;

        }

        const result = await client.$youtube.getVideo(args.join(' '));
        if (!result) return false;

        const music = await player.setMusicInfo(result, member);
        player.addToQueue({ music, textChannel, voiceChannel, playlist: false });

        return true;

    }

}