import { Message, MessageEmbed } from 'discord.js';
import { client } from '../../index';
import { Command } from '../../lib/commands/Command';
import { CommandExecutor } from '../../lib/commands/CommandExecutor';

const COMMAND_NAME = client.$config.helpCommand;

@Command({
    name: COMMAND_NAME,
    usage: '[command:string]',
    description: 'Need some help with commands because they are too complicated? Look no further! I am here to your aid!',
    category: 'Miscellaneous'
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {

        const prefix = client.$config.prefix;
        const help = client.$commands.get(COMMAND_NAME);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(client.user!.avatarURL()!)
            .setFooter(`Requested by ${message.author.tag}`)
            .setTimestamp();

        if (args.length === 0) {

            const categories = [...new Set(client.$commands.map(command => command.info.category))];

            embed.setTitle('-= COMMAND LIST =-');
            embed.setDescription([
                `**Prefix:** \`${prefix}\``,
                `<> : Required | [] : Optional`,
                `Use \`${prefix}${help?.info.name} ${help?.info.usage}\` to view command help with more detail.`
            ].join('\n'));

            let categorisedCommands;
            let uncategorised: { info: string, commands: string };

            for (const category of categories) {
                categorisedCommands = client.$commands.filter(cmd => cmd.info.category === category);

                const info = category || 'Uncategorised'
                const commands = categorisedCommands.map(cmd => `\`${cmd.info.name}\``).join(', ');

                if (info === 'Uncategorised') uncategorised = { info, commands };
                else embed.addField(category || 'Uncategorised', commands);
            }

            if (uncategorised!) embed.addField(uncategorised!.info, uncategorised!.commands);

            message.channel.send(embed);
            return true;

        }

        const command = client.$commands.get(args[0]) || client.$commands.get(client.$aliases.get(args[0])!);
        if (!command) return await this.execute(message, []);

        const aliasesPresent = typeof command.info.aliases !== 'undefined' && command.info.aliases.length > 0;
        const permissionsRequired = typeof command.info.permissions !== 'undefined' && command.info.permissions.length > 0;

        embed.setTitle(`${command.info.name.toUpperCase()} COMMAND`);
        embed.setDescription([
            `${command.info.description || 'No description has been set'}`,
            `Permissions required: ${permissionsRequired ? `\`${command.info.permissions!.join(' | ')}\`` : '`None`'}`
        ].join('\n'));

        embed.addField('Usage', `\`${prefix}${command.info.name}${command.info.usage !== '' ? ` ${command.info.usage}` : ''}\``);
        embed.addField('Aliases', `${aliasesPresent ? command.info.aliases!.map(alias => `\`${alias}\``).join(', ') : '\`None\`'}`);

        message.channel.send(embed);

        return true;
    }

}