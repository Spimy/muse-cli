import { ClientEvents } from 'discord.js';
import { Music } from './lib/music/Music';

export type EventType = keyof ClientEvents;
export type Pages = Music[][];
