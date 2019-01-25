export interface IEventArgs<T> {
    data: T;
    type: string;
    preventDefault: () => void;
    stopPropagation: () => void;
    stopImmediatePropagation: () => void;
    isDefaultPrevented: () => boolean;
    isPropagationStopped: () => boolean;
    isImmediatePropagationStopped: () => boolean;
}
