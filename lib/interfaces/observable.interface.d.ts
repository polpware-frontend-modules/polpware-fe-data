import { IEventArgs } from './event-args.interface';
export interface IObservable {
    fire<U>(name: string, data: U, bubble?: boolean): IEventArgs<U>;
    on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any;
    off(name: string, callback: (...args: any[]) => any): any;
    once(name: string, callback: (...args: any[]) => any): any;
    hasEventListeners(name: string): boolean;
}
