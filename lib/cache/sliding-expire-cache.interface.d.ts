import { IEventArgs } from '../interfaces/event-args.interface';
export interface ISlidingExpireCache<T> {
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>): any;
    get(key: string, seconds?: number): T | null;
    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
}
