import { CommandInfo } from './CommandInfo';
import { CommandExecutor } from './CommandExecutor';

export interface CommandProps {
    info: CommandInfo;
    executor: CommandExecutor;
}
