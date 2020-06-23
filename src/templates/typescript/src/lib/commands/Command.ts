import { client } from '../../index';
import { CommandInfo } from './CommandInfo';
import { CommandExecutor } from './CommandExecutor';

export function Command(info: CommandInfo) {

    return function (target: { new(): CommandExecutor }) {

        info = { ...info, name: info.name.toLowerCase() };
        info.aliases = info.aliases?.map(alias => alias.toLowerCase());

        target.prototype.info = { ...info };

        if (client.$commands.get(info.name)) return console.error(`⚠️ Duplicate command names found: ${info.name}`);
        client.$commands.set(info.name, { info, executor: new target() });

        info.aliases?.forEach(alias => {
            if (client.$aliases.get(alias)) return console.error(`⚠️ Duplicate command aliases found: ${alias}`);

            if (client.$aliases.get(info.name) || client.$commands.get(alias)) {
                return console.error(`⚠️ Command name clashing with command alias: ${alias}`);
            }

            client.$aliases.set(alias, info.name);
        });

    }

}