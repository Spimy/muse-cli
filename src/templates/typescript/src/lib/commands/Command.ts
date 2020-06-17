import { client } from '../../index';
import { CommandInfo } from './CommandInfo';
import { CommandExecutor } from './CommandExecutor';

export function Command(commandInfo: CommandInfo) {

    return function (target: { new(): CommandExecutor }) {
        client.$commands.set(commandInfo, target);
    }

}