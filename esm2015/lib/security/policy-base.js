/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * A base class for defining security plicies.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { lift } from '@polpware/fe-utilities';
/** @type {?} */
const _ = dependencies.underscore;
/**
 * @abstract
 */
export class PolicyBase {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     * @return {?}
     */
    getTokenP() {
        if (!_.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }
        return this.getTokenInternal()
            .then((token) => {
            return this.token = token;
        });
    }
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     * @return {?}
     */
    reset() {
        this.token = '';
    }
}
if (false) {
    /**
     * @type {?}
     * @protected
     */
    PolicyBase.prototype.url;
    /**
     * @type {?}
     * @protected
     */
    PolicyBase.prototype.token;
    /**
     * @abstract
     * @return {?}
     */
    PolicyBase.prototype.getTokenInternal = function () { };
    /**
     * @abstract
     * @param {?} options
     * @return {?}
     */
    PolicyBase.prototype.applyTo = function (options) { };
    /**
     * @abstract
     * @return {?}
     */
    PolicyBase.prototype.isExpired = function () { };
    /**
     * @abstract
     * @param {?} settings
     * @return {?}
     */
    PolicyBase.prototype.readFrom = function (settings) { };
    /**
     * @abstract
     * @return {?}
     */
    PolicyBase.prototype.persistent = function () { };
    /**
     * @abstract
     * @param {?} options
     * @return {?}
     */
    PolicyBase.prototype.applyToV2 = function (options) { };
    /**
     * @abstract
     * @param {?} options
     * @return {?}
     */
    PolicyBase.prototype.applyToV3 = function (options) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9wb2xpY3ktYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUtBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDOztNQUl4QyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVU7Ozs7QUFFakMsTUFBTSxPQUFnQixVQUFVOzs7O0lBSzVCLFlBQVksUUFBNEI7UUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Ozs7Ozs7SUFzQkQsU0FBUztRQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7YUFDekIsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7Ozs7O0lBTUQsS0FBSztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjs7Ozs7O0lBOUNHLHlCQUFzQjs7Ozs7SUFDdEIsMkJBQXdCOzs7OztJQU94Qix3REFBaUQ7Ozs7OztJQUVqRCxzREFBcUM7Ozs7O0lBRXJDLGlEQUE4Qjs7Ozs7O0lBRTlCLHdEQUFnQzs7Ozs7SUFFaEMsa0RBQTJCOzs7Ozs7SUFFM0Isd0RBQXVDOzs7Ozs7SUFFdkMsd0RBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBBIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIHNlY3VyaXR5IHBsaWNpZXMuXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBsaWZ0IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmltcG9ydCB7IElQb2xpY3lDdG9yT3B0aW9ucywgSVBvbGljeSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBvbGljeUJhc2UgaW1wbGVtZW50cyBJUG9saWN5IHtcblxuICAgIHByb3RlY3RlZCB1cmw6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgdG9rZW46IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJUG9saWN5Q3Rvck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy51cmwgPSBzZXR0aW5ncy51cmw7XG4gICAgICAgIHRoaXMudG9rZW4gPSAnJztcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRUb2tlbkludGVybmFsKCk6IFByb21pc2VMaWtlPHN0cmluZz47XG5cbiAgICBhYnN0cmFjdCBhcHBseVRvKG9wdGlvbnM6IGFueSk6IHZvaWQ7XG5cbiAgICBhYnN0cmFjdCBpc0V4cGlyZWQoKTogYm9vbGVhbjtcblxuICAgIGFic3RyYWN0IHJlYWRGcm9tKHNldHRpbmdzOiB7fSk7XG5cbiAgICBhYnN0cmFjdCBwZXJzaXN0ZW50KCk6IGFueTtcblxuICAgIGFic3RyYWN0IGFwcGx5VG9WMihvcHRpb25zOiBhbnkpOiB2b2lkO1xuXG4gICAgYWJzdHJhY3QgYXBwbHlUb1YzKG9wdGlvbnM6IGFueSk6IHZvaWQ7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmZhY2UgZm9yIHJldHJpZXZpbmcgdGhlIHRva2VuIGZyb20gYSByZW1vdGUgc2VydmVyLlxuICAgICAqIFRoaXMgbWV0aG9kIGludGVybmFsbHkgZGlzcGF0Y2hlcyB0aGUgY2FsbCB0byBhbm90aGVyIG1ldGhvZFxuICAgICAqIGFuZCBjYWNoZSB0aGUgdG9rZW4uXG4gICAgICovXG4gICAgZ2V0VG9rZW5QKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLnRva2VuKSAmJiAhdGhpcy5pc0V4cGlyZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpZnQodGhpcy50b2tlbiwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2tlbkludGVybmFsKClcbiAgICAgICAgICAgIC50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgc2VjdXJpdHkgcG9saWN5LCBlLmcuLFxuICAgICAqIHJlbW92aW5nIGVzdGFibGlzaGVkIHRva2VuLlxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnRva2VuID0gJyc7XG4gICAgfVxufVxuIl19