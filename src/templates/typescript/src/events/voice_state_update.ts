import { VoiceState } from 'discord.js';
import { client } from '../index';
import { Event } from '../lib/events/Event';
import { EventListener } from '../lib/events/EventListener';
import { defaultQueue } from '../lib/music/DefaultQueue';

@Event('voiceStateUpdate')
default class implements EventListener {

    listen = async (oldState: VoiceState, newState: VoiceState) => {

        const { queue } = oldState.guild;

        if (oldState.member?.user.bot && oldState.member.user === client.user) {

            if (newState.channel === null) {
                queue.textChannel?.send('🎵 Music playback has ended');
                oldState.guild.queue.upcoming.length = 0;
                return oldState.guild.queue = { ...defaultQueue };
            }

            queue.voiceChannel = newState.channel;

        }

        if (!oldState.member?.user.bot && newState.channel === null) {

            const { current } = queue;
            if (current?.votes.includes(oldState.member!)) {
                const index = current.votes.indexOf(oldState.member!);
                current.votes.splice(index, 1);
            }

        }

    }

}
