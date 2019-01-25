/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
export class MemoryBackend {
    constructor() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    set(key, value) {
        this._store[key] = value;
        return value;
    }
    /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    get(key) {
        return this._store[key] || null;
    }
    /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    remove(key) {
        delete this._store[key];
    }
    /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    length(key) {
        return Object.keys(this._store).length;
    }
    /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    key(index) {
        /** @type {?} */
        const keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    }
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    enabled() {
        return true;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    MemoryBackend.prototype._store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWJhY2tlbmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9jYWNoZS9tZW1vcnktYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0EsTUFBTSxPQUFPLGFBQWE7SUFJdEI7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDOzs7Ozs7O0lBS0QsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFpQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDOzs7Ozs7SUFLRCxHQUFHLENBQUMsR0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBS0QsTUFBTSxDQUFDLEdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Ozs7O0lBS0QsTUFBTSxDQUFDLEdBQVc7UUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMzQyxDQUFDOzs7Ozs7SUFLRCxHQUFHLENBQUMsS0FBYTs7Y0FDUCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7O0lBTUQsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjs7Ozs7O0lBdkRHLCtCQUE4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDYWNoZUJhY2tlbmQgfSBmcm9tICcuL2NhY2hlLWJhY2tlbmQuaW50ZXJmYWNlJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTWVtb3J5QmFja2VuZDxUPiBpbXBsZW1lbnRzIElDYWNoZUJhY2tlbmQ8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0b3JlOiB7IFtrZXk6IHN0cmluZ106IFQgfCBudW1iZXIgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9zdG9yZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhIGtleS12YWx1ZSBwYWlyXHJcbiAgICAgKi9cclxuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQgfCBudW1iZXIpOiBUIHwgbnVtYmVyIHtcclxuICAgICAgICB0aGlzLl9zdG9yZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBnZXQoa2V5OiBzdHJpbmcpOiBUIHwgbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlW2tleV0gfHwgbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIGtleSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZShrZXk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZVtrZXldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHN0b3JlZCBpdGVtcy5cclxuICAgICAqL1xyXG4gICAgbGVuZ3RoKGtleTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVucyB0aGUgaXRoIGtleSBpbiB0aGUgc3RvcmUgdGFibGUuXHJcbiAgICAgKi9cclxuICAgIGtleShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXlzW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgaWYgdGhpcyBzdG9yYWdlIGlzIGVuYWJsZWQuXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyByZXF1aXJlZCBieSBsb2NhY2hlanMuXHJcbiAgICAgKi9cclxuICAgIGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==