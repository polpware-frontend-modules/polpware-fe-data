export interface ICacheBackend<T> {
    set(key: string, value: T | number): any;
    get(key: string): T | number | null;
    remove(key: string): any;
    length(key: string): number;
    key(index: number): string;
    enabled(): boolean;
}
