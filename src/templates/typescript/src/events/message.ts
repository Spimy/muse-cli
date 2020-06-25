import { Message } from 'discord.js';
import { client } from '../index';
import { Event } from '../lib/events/Event';
import { EventListener } from '../lib/events/EventListener';

@Event('message')
default class implements EventListener {

    listen = async (message: Message) => {

        if (message.author.bot || message.channel.type === 'dm') return;

        const { prefixes } = client.$config;
        const prefix = prefixes.find(prefix => message.content.startsWith(prefix)) || prefixes[0];

        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift()!.toLowerCase();

        if (!message.content.startsWith(prefix) || command === '') return;

        let cmd = client.$commands.get(command);
        if (!cmd) cmd = client.$commands.get(client.$aliases.get(command)!);

        if (cmd) {
            const hasPerm: boolean | undefined = cmd.info.permissions?.some(perm => message.member?.permissions.has(perm));

            if (!hasPerm && typeof hasPerm !== 'undefined' && !cmd.info.overrideDefaultPermCheck) {
                return await client.$commands.get('help')!.executor.execute(message, [cmd.info.name]);
            }

            const success = await cmd.executor.execute(message, args);
            if (!success) return await client.$commands.get('help')!.executor.execute(message, [cmd.info.name]);
        }

    }

}