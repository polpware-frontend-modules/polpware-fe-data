import { IPolicy } from './interfaces';
export declare class NullPolicy implements IPolicy {
    getTokenInternal(): PromiseLike<string>;
    applyTo(options: any): void;
    isExpired(): boolean;
    readFrom(settings: {}): void;
    persistent(): any;
    applyToV2(options: any): void;
    applyToV3(options: any): void;
    getTokenP(): PromiseLike<string>;
    reset(): void;
}
