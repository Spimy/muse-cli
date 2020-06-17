import { client } from '../../index';
import { CommandInfo } from './CommandInfo';
import { CommandExecutor } from './CommandExecutor';

export function Command(commandInfo: CommandInfo) {

    return function (target: { new(): CommandExecutor }) {
        client.$commands.set(commandInfo.name, { info: commandInfo, executor: new target() });

        if (commandInfo.aliases) {
            commandInfo.aliases.forEach(alias => {
                client.$aliases.set(alias, commandInfo.name);
            });
        }

    }

}