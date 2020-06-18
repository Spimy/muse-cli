import { Queue } from './lib/music/Queue';
import { MusicPlayer } from './lib/music/MusicPlayer';

declare module 'discord.js' {
    interface Guild {
        queue: Queue,
        player: MusicPlayer
    }
}