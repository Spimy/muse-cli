import { Music } from './Music';
import { VoiceConnection, TextChannel, VoiceChannel } from 'discord.js';

export interface Queue {

    current?: Music;
    upcoming: Music[];
    volume: number;
    loop: boolean;
    playing: boolean;

    connection?: VoiceConnection;
    textChannel?: TextChannel;
    voiceChannel?: VoiceChannel;

    userCountskip: boolean;

}