import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandExecutor } from './commands/CommandExecutor';
import { CommandInfo } from './commands/CommandInfo';
import { Utils } from './utils';

export default class MuseClient extends Client {

    private commands: Collection<CommandInfo, { new(): CommandExecutor }> = new Collection();
    private utils: Utils = new Utils(this);

    constructor(options?: ClientOptions) {
        super(options);
    }

    async login(token: string) {
        super.login(token);
        await this.utils.loadModules('../commands', true);
        return token;
    }

    /**
     * Getter $commands
     * @return {Collection<CommandInfo, { new(): CommandExecutor }}
     */
    public get $commands(): Collection<CommandInfo, { new(): CommandExecutor }> {
        return this.commands;
    }

}