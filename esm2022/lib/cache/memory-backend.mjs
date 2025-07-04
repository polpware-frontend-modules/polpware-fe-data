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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWJhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvY2FjaGUvbWVtb3J5LWJhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLGFBQWE7SUFJdEI7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQWlCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxHQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsR0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsR0FBVztRQUNkLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxLQUFhO1FBQ2IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ2FjaGVCYWNrZW5kIH0gZnJvbSAnLi9jYWNoZS1iYWNrZW5kLmludGVyZmFjZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIE1lbW9yeUJhY2tlbmQ8VD4gaW1wbGVtZW50cyBJQ2FjaGVCYWNrZW5kPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdG9yZTogeyBba2V5OiBzdHJpbmddOiBUIHwgbnVtYmVyIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RvcmUgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYSBrZXktdmFsdWUgcGFpclxyXG4gICAgICovXHJcbiAgICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUIHwgbnVtYmVyKTogVCB8IG51bWJlciB7XHJcbiAgICAgICAgdGhpcy5fc3RvcmVba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGtleS5cclxuICAgICAqL1xyXG4gICAgZ2V0KGtleTogc3RyaW5nKTogVCB8IG51bWJlciB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yZVtrZXldIHx8IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBrZXkgYW5kIGl0cyBjb3JyZXNwb25kaW5nIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICByZW1vdmUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fc3RvcmVba2V5XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzdG9yZWQgaXRlbXMuXHJcbiAgICAgKi9cclxuICAgIGxlbmd0aChrZXk6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX3N0b3JlKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1bnMgdGhlIGl0aCBrZXkgaW4gdGhlIHN0b3JlIHRhYmxlLlxyXG4gICAgICovXHJcbiAgICBrZXkoaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX3N0b3JlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCBrZXlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4ga2V5c1tpbmRleF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGlmIHRoaXMgc3RvcmFnZSBpcyBlbmFibGVkLlxyXG4gICAgICogVGhpcyBtZXRob2QgaXMgcmVxdWlyZWQgYnkgbG9jYWNoZWpzLlxyXG4gICAgICovXHJcbiAgICBlbmFibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=