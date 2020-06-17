export interface CommandExecutor {
    execute(): Promise<boolean>;
}