import { client } from '../..';
import { Music } from './Music';
import { Queue } from './Queue';
import { defaultQueue } from './DefaultQueue';
import { Video } from 'popyt';
import { MessageEmbed, TextChannel, VoiceChannel, Guild, Message, GuildMember } from 'discord.js';

import ytdl from 'discord-ytdl-core';

interface QueueInfo {
    music: Music;
    textChannel: TextChannel;
    voiceChannel: VoiceChannel;
    playlist: boolean;
}

interface NowPlayingInfo {
    message: Message;
    embed: MessageEmbed;
    interval: NodeJS.Timeout;
}

export class MusicPlayer {

    private nowPlayingInfo: NowPlayingInfo[] = [];
    private readonly embed = new MessageEmbed();

    setMusicInfo = async (video: Video, member: GuildMember) => {
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
            votes: [],
            requester: member,
        }
        return music;
    }

    public addToQueue({ music, textChannel, voiceChannel, playlist }: QueueInfo) {

        const queue = textChannel.guild.queue;

        queue.upcoming.push(music);

        if (typeof queue.current === 'undefined') {
            queue.current = queue.upcoming.shift();
        }

        if (typeof queue.voiceChannel === 'undefined') {
            queue.voiceChannel = voiceChannel;
        }

        if (typeof queue.textChannel === 'undefined') {
            queue.textChannel = textChannel;
        }

        if (!playlist && queue.upcoming.length > 0) {
            const addedVideoIndex = queue.upcoming.indexOf(music);
            const position = addedVideoIndex == 0 ? 'Up Next' : addedVideoIndex + 1;

            this.embed
                .setColor('RANDOM')
                .setTitle('Added Video to Queue')
                .setDescription(`\`\`\`${music.title}\`\`\``)
                .setThumbnail(music.thumbnail)
                .addField('Position:', position, true)
                .addField('Requested By:', music.requester.user.tag, true)
                .setTimestamp();

            textChannel.send(this.embed);
            this.embed.spliceFields(0, this.embed.fields.length);
        }

        if (!queue.playing) {
            queue.playing = true;
            voiceChannel.join().then(connection => {
                queue.connection = connection;
                this.playMusic(textChannel.guild);
            }).catch(console.error);
        }

    }

    public playMusic(guild: Guild) {

        const { queue } = guild;

        if (typeof queue.current === 'undefined') {
            queue.voiceChannel?.leave();
            queue.textChannel?.send('🎵 Music playback has ended');
            return guild.queue = { ...defaultQueue };
        }

        const stream = ytdl(queue.current?.url!, {
            filter: 'audioonly',
            opusEncoded: false,
            fmt: 'mp3',
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
            highWaterMark: 1 << 25
        });
        stream.on('error', console.error);

        const dispatcher = queue.connection?.play(stream, {
            type: 'unknown',
            highWaterMark: 1
        });

        dispatcher?.on('finish', () => {
            while (this.nowPlayingInfo.length > 0) {
                const item = this.nowPlayingInfo.shift()!;

                clearInterval(item.interval);
                const durationBar = this.durationBar(queue, true);

                item.embed.setTitle('Was Playing:');
                item.embed.setDescription(durationBar);
                item.embed.spliceFields(1, 1, { name: 'Remaining Time:', value: 'Ended', inline: true });

                item.message.edit(item.embed);
            }

            if (!queue.current?.loop) {
                if (queue.loop) {
                    queue.upcoming.push(queue.current!);
                }
                queue.current = queue.upcoming.shift();
            }

            setTimeout(() => {
                this.playMusic(guild);
            }, 1000);
        });

        dispatcher?.setVolumeLogarithmic(queue.volume / 100);

        this.embed
            .setColor('RANDOM')
            .setTitle('Now Playing:')
            .setDescription(`[${queue.current.title}](${queue.current.url})`)
            .setThumbnail(queue.current.thumbnail)
            .addField('Duration:', `${client.$utils.formatSeconds(queue.current.duration)}`, true)
            .addField('Requested By:', queue.current.requester.user.tag, true)
            .setTimestamp();

        queue.textChannel?.send(this.embed);
        this.embed.spliceFields(0, this.embed.fields.length);

        dispatcher?.on('error', console.error);

    }

    public durationBar = (queue: Queue, ended?: boolean) => {

        const { current, connection } = queue;
        const { duration } = current!;

        const counter = 33;
        const bar = '━'.repeat(counter);
        const indicator = '⚪';

        const streamTime = connection?.dispatcher?.streamTime;
        const currentTime = ended ? '' : client.$utils.formatSeconds(streamTime! / 1000);
        const timeString = ended ? 'Ended' : `${currentTime} / ${client.$utils.formatSeconds(duration)}`;
        const position = ended ? counter : Math.floor(((streamTime! / 1000) / duration) * counter);

        const durationBar = `\`\`\`${client.$utils.replaceStrChar(bar, position, indicator)} ${timeString}\`\`\``;
        return durationBar;

    }

    /**
     * Getter $durationMessages
     * @return {NowPlayingInfo[]}
     */
    public get $nowPlayingInfo(): NowPlayingInfo[] {
        return this.nowPlayingInfo;
    }

}
