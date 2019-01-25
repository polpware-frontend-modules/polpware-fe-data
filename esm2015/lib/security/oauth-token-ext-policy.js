/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';
export class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    /**
     * @param {?} settings
     * @param {?} payload
     */
    constructor(settings, payload) {
        super(settings);
        this._payload = Object.assign({}, payload);
    }
    /**
     * @return {?}
     */
    get payload() {
        return this._payload;
    }
    // override
    /**
     * @return {?}
     */
    getParams() {
        /** @type {?} */
        const p = super.getParams();
        return Object.assign({}, p, this._payload);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    OAuthTokenExtPolicy.prototype._payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tZXh0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3NlY3VyaXR5L29hdXRoLXRva2VuLWV4dC1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7Ozs7O0lBSXJELFlBQVksUUFBc0MsRUFBRSxPQUFlO1FBQy9ELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoQixJQUFJLENBQUMsUUFBUSxxQkFBUSxPQUFPLENBQUUsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7Ozs7O0lBR0QsU0FBUzs7Y0FDQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUMzQix5QkFBWSxDQUFDLEVBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRztJQUN2QyxDQUFDO0NBQ0o7Ozs7OztJQWpCRyx1Q0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgSU9BdXRoVG9rZW5Qb2xpY3lDdG9yT3B0aW9uc1xyXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBPQXV0aFRva2VuUG9saWN5IH0gZnJvbSAnLi9vYXV0aC10b2tlbi1wb2xpY3knO1xyXG5leHBvcnQgeyBhZGFwdFRvT0F1dGhUb2tlbiB9IGZyb20gJy4vb2F1dGgtdG9rZW4tcG9saWN5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBPQXV0aFRva2VuRXh0UG9saWN5IGV4dGVuZHMgT0F1dGhUb2tlblBvbGljeSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGF5bG9hZDogb2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zLCBwYXlsb2FkOiBvYmplY3QpIHtcclxuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSB7IC4uLnBheWxvYWQgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBheWxvYWQoKTogb2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvdmVycmlkZVxyXG4gICAgZ2V0UGFyYW1zKCk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgcCA9IHN1cGVyLmdldFBhcmFtcygpO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnAsIC4uLiB0aGlzLl9wYXlsb2FkIH07XHJcbiAgICB9XHJcbn1cclxuIl19