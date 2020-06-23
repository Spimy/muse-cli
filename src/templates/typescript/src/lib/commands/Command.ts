import { client } from '../../index';
import { CommandInfo } from './CommandInfo';
import { CommandExecutor } from './CommandExecutor';

export function Command(info: CommandInfo) {

    return function (target: { new(): CommandExecutor }) {

        info = { ...info, name: info.name.toLowerCase() }

        target.prototype.info = { ...info };
        client.$commands.set(info.name, { info, executor: new target() });

        info.aliases?.forEach(alias => {
            client.$aliases.set(alias, info.name);
        });

    }

}