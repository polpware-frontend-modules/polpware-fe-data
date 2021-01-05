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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWJhY2tlbmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9jYWNoZS9tZW1vcnktYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLE9BQU8sYUFBYTtJQUl0QjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBaUI7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDekIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsR0FBRyxDQUFDLEdBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxHQUFXO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxHQUFXO1FBQ2QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDM0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsR0FBRyxDQUFDLEtBQWE7UUFDYixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNhY2hlQmFja2VuZCB9IGZyb20gJy4vY2FjaGUtYmFja2VuZC5pbnRlcmZhY2UnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBNZW1vcnlCYWNrZW5kPFQ+IGltcGxlbWVudHMgSUNhY2hlQmFja2VuZDxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RvcmU6IHsgW2tleTogc3RyaW5nXTogVCB8IG51bWJlciB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX3N0b3JlID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGEga2V5LXZhbHVlIHBhaXJcclxuICAgICAqL1xyXG4gICAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogVCB8IG51bWJlcik6IFQgfCBudW1iZXIge1xyXG4gICAgICAgIHRoaXMuX3N0b3JlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIGdldChrZXk6IHN0cmluZyk6IFQgfCBudW1iZXIgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmVba2V5XSB8fCBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4ga2V5IGFuZCBpdHMgY29ycmVzcG9uZGluZyB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3N0b3JlW2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc3RvcmVkIGl0ZW1zLlxyXG4gICAgICovXHJcbiAgICBsZW5ndGgoa2V5OiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9zdG9yZSkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dW5zIHRoZSBpdGgga2V5IGluIHRoZSBzdG9yZSB0YWJsZS5cclxuICAgICAqL1xyXG4gICAga2V5KGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9zdG9yZSk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGtleXNbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBpZiB0aGlzIHN0b3JhZ2UgaXMgZW5hYmxlZC5cclxuICAgICAqIFRoaXMgbWV0aG9kIGlzIHJlcXVpcmVkIGJ5IGxvY2FjaGVqcy5cclxuICAgICAqL1xyXG4gICAgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuIl19