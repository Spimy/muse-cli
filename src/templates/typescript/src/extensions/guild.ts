import { Structures } from 'discord.js';
import { Queue } from '../lib/music/Queue';
import { MusicPlayer } from '../lib/music/MusicPlayer';
import { defaultQueue } from '../lib/music/DefaultQueue';

export class MuseGuild extends Structures.get('Guild') {

    private musicPlayer: MusicPlayer = new MusicPlayer();
    private defaultQueue = { ...defaultQueue };

    /**
     * Getter queue
     * @return {Queue}
     */
    public get queue(): Queue {
        return this.defaultQueue;
    }

    /**
     * Setter queue
     * @param {Queue} queue
     */
    public set queue(queue: Queue) {
        this.defaultQueue = queue;
    }

    /**
     * Getter player
     * @return {MusicPlayer}
     */
    public get player(): MusicPlayer {
        return this.musicPlayer;
    }


}

Structures.extend('Guild', () => MuseGuild);