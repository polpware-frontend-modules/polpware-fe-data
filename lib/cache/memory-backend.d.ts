import { ICacheBackend } from './cache-backend.interface';
export declare class MemoryBackend<T> implements ICacheBackend<T> {
    private _store;
    constructor();
    /**
     * Sets a key-value pair
     */
    set(key: string, value: T | number): T | number;
    /**
     * Gets the value for a given key.
     */
    get(key: string): T | number | null;
    /**
     * Removes the given key and its corresponding value.
     */
    remove(key: string): void;
    /**
     * Returns the number of stored items.
     */
    length(key: string): number;
    /**
     * Retuns the ith key in the store table.
     */
    key(index: number): string;
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    enabled(): boolean;
}
