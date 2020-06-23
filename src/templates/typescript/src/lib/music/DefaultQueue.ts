import { Queue } from './Queue';

export const defaultQueue: Queue = {
    current: undefined,
    upcoming: [],
    volume: 50,
    loop: false,
    playing: false,
    connection: undefined,
    textChannel: undefined,
    voiceChannel: undefined,
    userCountskip: false
}