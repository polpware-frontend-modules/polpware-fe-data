/**
 * @fileOverview
 * A base class for defining security plicies.
 */
import { IPolicyCtorOptions, IPolicy } from './interfaces';
export declare abstract class PolicyBase implements IPolicy {
    protected url: string;
    protected token: string;
    constructor(settings: IPolicyCtorOptions);
    abstract getTokenInternal(): PromiseLike<string>;
    abstract applyTo(options: any): void;
    abstract isExpired(): boolean;
    abstract readFrom(settings: {}): any;
    abstract persistent(): any;
    abstract applyToV2(options: any): void;
    abstract applyToV3(options: any): void;
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP(): PromiseLike<string>;
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    reset(): void;
}
