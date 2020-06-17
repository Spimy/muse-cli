import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandProps } from './commands/CommandProps';
import { Utils } from './utils';
import { Config } from './Config';

const { muse } = require('../../muse.json');

export default class MuseClient extends Client {

    private commands: Collection<string, CommandProps> = new Collection();
    private aliases: Collection<string, string> = new Collection();
    private utils: Utils = new Utils();
    private config: Config = muse;

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

    /**
     * Getter $config
     * @return {any}
     */
    public get $config(): Config {
        return this.config;
    }

}