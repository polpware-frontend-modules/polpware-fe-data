/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */
import { DummyOAuthTokenCtorParams } from './interfaces';
import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';
/**
 * @param {?} data
 * @return {?}
 */
export function adaptToOpenIDToken(data) {
    data = data || {};
    /** @type {?} */
    const r = adaptToOAuthToken(data);
    return Object.assign({}, r, { openId: data.openId || '' });
}
export class OpenIDPolicy extends OAuthTokenPolicy {
    constructor() {
        super(DummyOAuthTokenCtorParams);
        this._openId = '';
    }
    /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    persistent() {
        /** @type {?} */
        const r = super.persistent();
        return Object.assign({}, r, { openId: this._openId });
    }
    /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    readFrom(settings) {
        super.readFrom(settings);
        (/** @type {?} */ (this))._openId = settings.openId;
        return (/** @type {?} */ (this));
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    OpenIDPolicy.prototype._openId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Blbi1pZC1wb2xpY3kuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9vcGVuLWlkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUtBLE9BQU8sRUFFSCx5QkFBeUIsRUFDNUIsTUFBTSxjQUFjLENBQUM7QUFFdEIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBRTNFLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxJQUFJO0lBQ25DLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztVQUVaLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDakMseUJBQVksQ0FBQyxJQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsSUFBRztBQUMvQyxDQUFDO0FBRUQsTUFBTSxPQUFPLFlBQWEsU0FBUSxnQkFBZ0I7SUFJOUM7UUFDSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7OztJQUtELFVBQVU7O2NBQ0EsQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUU7UUFDNUIseUJBQVksQ0FBQyxJQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFHO0lBQzFDLENBQUM7Ozs7Ozs7O0lBS0QsUUFBUSxDQUFDLFFBQXNCO1FBQzNCLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsbUJBQUEsSUFBSSxFQUFBLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztJQUNoQixDQUFDO0NBQ0o7Ozs7OztJQXZCRywrQkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVPdmVydmlld1xyXG4gKiBPcGVuSUQgdG9rZW4gcG9saWN5LCBidWlsdCB1cG9uIE9BdXRoMiB0b2tlbiBwb2xpY3lcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSU9wZW5JRFRva2VuLFxyXG4gICAgRHVtbXlPQXV0aFRva2VuQ3RvclBhcmFtc1xyXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBPQXV0aFRva2VuUG9saWN5LCBhZGFwdFRvT0F1dGhUb2tlbiB9IGZyb20gJy4vb2F1dGgtdG9rZW4tcG9saWN5JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFRvT3BlbklEVG9rZW4oZGF0YSk6IElPcGVuSURUb2tlbiB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuXHJcbiAgICBjb25zdCByID0gYWRhcHRUb09BdXRoVG9rZW4oZGF0YSk7XHJcbiAgICByZXR1cm4geyAuLi5yLCBvcGVuSWQ6IGRhdGEub3BlbklkIHx8ICcnIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPcGVuSURQb2xpY3kgZXh0ZW5kcyBPQXV0aFRva2VuUG9saWN5IHtcclxuXHJcbiAgICBwcml2YXRlIF9vcGVuSWQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihEdW1teU9BdXRoVG9rZW5DdG9yUGFyYW1zKTtcclxuICAgICAgICB0aGlzLl9vcGVuSWQgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBmb3IgcGVyaXN0ZW5jZS5cclxuICAgICAqL1xyXG4gICAgcGVyc2lzdGVudCgpOiBJT3BlbklEVG9rZW4ge1xyXG4gICAgICAgIGNvbnN0IHIgPSBzdXBlci5wZXJzaXN0ZW50KCk7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4uciwgb3BlbklkOiB0aGlzLl9vcGVuSWQgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlYWRzIGNyZWRlbnRpYWwgZnJvbSB0aGUgZ2l2ZW4gc2V0dGluZ3MuXHJcbiAgICAgKi9cclxuICAgIHJlYWRGcm9tKHNldHRpbmdzOiBJT3BlbklEVG9rZW4pIHtcclxuICAgICAgICBzdXBlci5yZWFkRnJvbShzZXR0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5fb3BlbklkID0gc2V0dGluZ3Mub3BlbklkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==