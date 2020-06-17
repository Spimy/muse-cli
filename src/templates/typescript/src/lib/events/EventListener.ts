export interface EventListener {
    listen: (...args: any) => Promise<any>;
}