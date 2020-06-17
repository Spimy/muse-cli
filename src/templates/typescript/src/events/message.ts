import { Message } from 'discord.js';
import { client } from '../index';
import { Event } from '../lib/events/Event';
import { EventListener } from '../lib/events/EventListener';

@Event('message')
class MessageEvent implements EventListener {

    listen = async (message: Message) => {

        if (message.author.bot || message.channel.type === 'dm') return;

        const prefix = client.$config.prefix;
        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift()!.toLowerCase();

        if (!message.content.startsWith(prefix) || command === '') return;

        let cmd = client.$commands.get(command);
        if (!cmd) {
            cmd = client.$commands.get(client.$aliases.get(command)!);
        }

        if (cmd) await cmd.executor.execute(message, args);

    }

}