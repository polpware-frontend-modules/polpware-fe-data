import { IObservable } from '../interfaces/observable.interface';
import { IEventArgs } from '../interfaces/event-args.interface';
import { IPolicy } from './interfaces';
export interface IUserProfile {
    username?: string;
    email?: string;
    role?: string;
    displayName?: string;
}
export declare class UserCredential<T extends IPolicy> {
    authPolicy: T;
    private _security;
    private _user;
    /**
     * @constructor Credential
     */
    constructor(authPolicy: T);
    get asObservable(): IObservable;
    security(value?: T): T;
    readFrom<U extends IUserProfile>(data: U): void;
    setUser<U extends IUserProfile>(data: U): void;
    extendUser<U extends IUserProfile>(data: U): void;
    getUser<U extends IUserProfile>(): U;
    subscribe<U extends IUserProfile>(handler: (evt: IEventArgs<U>) => IEventArgs<U>, likeBehaviorSubject?: boolean): void;
    unSubscribe(handler: (evt: any) => any): void;
    isUserKnown(): boolean;
    isAuthenticated(): boolean;
}
