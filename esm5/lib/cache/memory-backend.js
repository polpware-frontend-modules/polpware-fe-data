/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
var /**
 * @template T
 */
MemoryBackend = /** @class */ (function () {
    function MemoryBackend() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     */
    /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    MemoryBackend.prototype.set = /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        this._store[key] = value;
        return value;
    };
    /**
     * Gets the value for a given key.
     */
    /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.get = /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._store[key] || null;
    };
    /**
     * Removes the given key and its corresponding value.
     */
    /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.remove = /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        delete this._store[key];
    };
    /**
     * Returns the number of stored items.
     */
    /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.length = /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return Object.keys(this._store).length;
    };
    /**
     * Retuns the ith key in the store table.
     */
    /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    MemoryBackend.prototype.key = /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    };
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    MemoryBackend.prototype.enabled = /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    function () {
        return true;
    };
    return MemoryBackend;
}());
/**
 * @template T
 */
export { MemoryBackend };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MemoryBackend.prototype._store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWJhY2tlbmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9jYWNoZS9tZW1vcnktYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7Ozs7SUFJSTtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRzs7Ozs7OztJQUNILDJCQUFHOzs7Ozs7SUFBSCxVQUFJLEdBQVcsRUFBRSxLQUFpQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILDJCQUFHOzs7OztJQUFILFVBQUksR0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDcEMsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCw4QkFBTTs7Ozs7SUFBTixVQUFPLEdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCw4QkFBTTs7Ozs7SUFBTixVQUFPLEdBQVc7UUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILDJCQUFHOzs7OztJQUFILFVBQUksS0FBYTs7WUFDUCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXJDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7O0lBQ0gsK0JBQU87Ozs7O0lBQVA7UUFDSSxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDLEFBekRELElBeURDOzs7Ozs7Ozs7O0lBdkRHLCtCQUE4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDYWNoZUJhY2tlbmQgfSBmcm9tICcuL2NhY2hlLWJhY2tlbmQuaW50ZXJmYWNlJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTWVtb3J5QmFja2VuZDxUPiBpbXBsZW1lbnRzIElDYWNoZUJhY2tlbmQ8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0b3JlOiB7IFtrZXk6IHN0cmluZ106IFQgfCBudW1iZXIgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9zdG9yZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhIGtleS12YWx1ZSBwYWlyXHJcbiAgICAgKi9cclxuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQgfCBudW1iZXIpOiBUIHwgbnVtYmVyIHtcclxuICAgICAgICB0aGlzLl9zdG9yZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBnZXQoa2V5OiBzdHJpbmcpOiBUIHwgbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlW2tleV0gfHwgbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIGtleSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZShrZXk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZVtrZXldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHN0b3JlZCBpdGVtcy5cclxuICAgICAqL1xyXG4gICAgbGVuZ3RoKGtleTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVucyB0aGUgaXRoIGtleSBpbiB0aGUgc3RvcmUgdGFibGUuXHJcbiAgICAgKi9cclxuICAgIGtleShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXlzW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgaWYgdGhpcyBzdG9yYWdlIGlzIGVuYWJsZWQuXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyByZXF1aXJlZCBieSBsb2NhY2hlanMuXHJcbiAgICAgKi9cclxuICAgIGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==