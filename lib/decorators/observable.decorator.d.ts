import { IEventArgs } from '../interfaces/event-args.interface';
export declare function observableDecorator<T extends {
    new (...args: any[]): any;
}>(constructor: T): {
    new (...args: any[]): {
        [x: string]: any;
        fire<U>(name: string, evt: IEventArgs<U>, bubble?: boolean): IEventArgs<U>;
        on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any;
        off(name: string, callback: (...args: any[]) => any): any;
        once(name: string, callback: (...args: any[]) => any): any;
        hasEventListeners(name: string): boolean;
    };
} & T;
