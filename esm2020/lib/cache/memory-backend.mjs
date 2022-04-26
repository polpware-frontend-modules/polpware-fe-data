export class MemoryBackend {
    constructor() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     */
    set(key, value) {
        this._store[key] = value;
        return value;
    }
    /**
     * Gets the value for a given key.
     */
    get(key) {
        return this._store[key] || null;
    }
    /**
     * Removes the given key and its corresponding value.
     */
    remove(key) {
        delete this._store[key];
    }
    /**
     * Returns the number of stored items.
     */
    length(key) {
        return Object.keys(this._store).length;
    }
    /**
     * Retuns the ith key in the store table.
     */
    key(index) {
        const keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    }
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    enabled() {
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWJhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvY2FjaGUvbWVtb3J5LWJhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLGFBQWE7SUFJdEI7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQWlCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxHQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsR0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsR0FBVztRQUNkLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxLQUFhO1FBQ2IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ25DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDYWNoZUJhY2tlbmQgfSBmcm9tICcuL2NhY2hlLWJhY2tlbmQuaW50ZXJmYWNlJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTWVtb3J5QmFja2VuZDxUPiBpbXBsZW1lbnRzIElDYWNoZUJhY2tlbmQ8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0b3JlOiB7IFtrZXk6IHN0cmluZ106IFQgfCBudW1iZXIgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9zdG9yZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhIGtleS12YWx1ZSBwYWlyXHJcbiAgICAgKi9cclxuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQgfCBudW1iZXIpOiBUIHwgbnVtYmVyIHtcclxuICAgICAgICB0aGlzLl9zdG9yZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBnZXQoa2V5OiBzdHJpbmcpOiBUIHwgbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlW2tleV0gfHwgbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIGtleSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZShrZXk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZVtrZXldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHN0b3JlZCBpdGVtcy5cclxuICAgICAqL1xyXG4gICAgbGVuZ3RoKGtleTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVucyB0aGUgaXRoIGtleSBpbiB0aGUgc3RvcmUgdGFibGUuXHJcbiAgICAgKi9cclxuICAgIGtleShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fc3RvcmUpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXlzW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgaWYgdGhpcyBzdG9yYWdlIGlzIGVuYWJsZWQuXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyByZXF1aXJlZCBieSBsb2NhY2hlanMuXHJcbiAgICAgKi9cclxuICAgIGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==