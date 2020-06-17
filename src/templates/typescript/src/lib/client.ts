import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandExecutor } from './commands/CommandExecutor';
import { CommandInfo } from './commands/CommandInfo';

export default class MuseClient extends Client {

    private commands: Collection<CommandInfo, { new(): CommandExecutor }> = new Collection();

    constructor(options?: ClientOptions) {
        super(options);
    }

    /**
     * Getter $commands
     * @return {Collection<CommandInfo, { new(): CommandExecutor }}
     */
    public get $commands(): Collection<CommandInfo, { new(): CommandExecutor }> {
        return this.commands;
    }

}