import { Event } from '../lib/events/Event';
import { EventListener } from '../lib/events/EventListener';
import { VoiceState } from 'discord.js';
import { client } from '../index';
import { defaultQueue } from '../lib/music/DefaultQueue';

@Event('voiceStateUpdate')
default class implements EventListener {

    listen = async (oldState: VoiceState, newState: VoiceState) => {

        if (oldState.member?.user.bot && oldState.member.user === client.user) {

            const { queue } = oldState.guild;

            if (typeof newState.channel === 'undefined' || newState.channel === null) {
                queue.textChannel?.send('🎵 Music playback has ended');
                oldState.guild.queue.upcoming.length = 0;
                return oldState.guild.queue = { ...defaultQueue };
            }

            queue.voiceChannel = newState.channel;

        }

    }

}
