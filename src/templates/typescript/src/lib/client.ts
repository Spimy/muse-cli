import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandExecutor } from './commands/CommandExecutor';
import { CommandInfo } from './commands/CommandInfo';
import { Utils } from './utils';

interface CommandProps {
    info: CommandInfo,
    executor: CommandExecutor
}

export default class MuseClient extends Client {

    private commands: Collection<string, CommandProps> = new Collection();
    private aliases: Collection<string, string> = new Collection();
    private utils: Utils = new Utils(this);

    constructor(options?: ClientOptions) {
        super(options);
    }

    async login(token: string) {
        super.login(token);
        await this.utils.loadModules('../commands');
        await this.utils.loadModules('../events');
        return token;
    }

    /**
     * Getter $commands
     * @return {Collection<string, CommandProps}
     */
    public get $commands(): Collection<string, CommandProps> {
        return this.commands;
    }

    /**
     * Getter $aliases
     * @return {Collection<string, string>}
     */
    public get $aliases(): Collection<string, string> {
        return this.aliases;
    }

    /**
     * Getter $utils
     * @return {Utils}
     */
    public get $utils(): Utils {
        return this.utils;
    }

}