import { ClientEvents } from 'discord.js';
import { Music } from './lib/music/Music';

type EventType = keyof ClientEvents;
type Pages = Music[][];

export {
    EventType,
    Pages
}