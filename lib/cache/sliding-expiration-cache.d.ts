import { IEventArgs } from '../interfaces/event-args.interface';
import { IObservable } from '../interfaces/observable.interface';
import { INgZoneLike } from '../interfaces/ng-zone-like.interface';
import { ISlidingExpireCache } from './sliding-expire-cache.interface';
export declare class SlidingExpirationCache<T> implements ISlidingExpireCache<T> {
    private _defaultSeconds;
    private _cache;
    private _timeInterval;
    constructor(_defaultSeconds: number, scheduleInterval?: number, ngZone?: INgZoneLike);
    private onExpireEventName;
    private afterRemoveEventName;
    private resetExpireKey;
    get asObservable(): IObservable;
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>): any;
    get(key: string, seconds?: number): T | null;
    invalidate(key: string): void;
    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    get count(): number;
    reset(): void;
    private resetInternal;
    destroy(): void;
}
