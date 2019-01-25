/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IPolicyCtorOptions() { }
if (false) {
    /** @type {?} */
    IPolicyCtorOptions.prototype.url;
}
/**
 * @record
 */
export function IOAuthTokenPolicyCtorOptions() { }
if (false) {
    /** @type {?} */
    IOAuthTokenPolicyCtorOptions.prototype.clientId;
    /** @type {?} */
    IOAuthTokenPolicyCtorOptions.prototype.clientSecret;
    /** @type {?} */
    IOAuthTokenPolicyCtorOptions.prototype.scope;
}
/**
 * @record
 */
export function IAntiForgeryKeyCtorOptions() { }
if (false) {
    /** @type {?} */
    IAntiForgeryKeyCtorOptions.prototype.antiForgeryKey;
    /** @type {?} */
    IAntiForgeryKeyCtorOptions.prototype.elementTag;
}
/**
 * @record
 */
export function IOAuthParams() { }
if (false) {
    /** @type {?} */
    IOAuthParams.prototype.client_id;
    /** @type {?} */
    IOAuthParams.prototype.client_secret;
    /** @type {?} */
    IOAuthParams.prototype.scope;
    /** @type {?} */
    IOAuthParams.prototype.grant_type;
}
/**
 * @record
 */
export function IOAuthToken() { }
if (false) {
    /** @type {?} */
    IOAuthToken.prototype.expiresIn;
    /** @type {?} */
    IOAuthToken.prototype.createdOn;
    /** @type {?} */
    IOAuthToken.prototype.token;
    /** @type {?} */
    IOAuthToken.prototype.refreshToken;
}
/**
 * @record
 */
export function IOpenIDToken() { }
if (false) {
    /** @type {?} */
    IOpenIDToken.prototype.openId;
}
/**
 * @record
 */
export function IPolicy() { }
if (false) {
    /**
     * @return {?}
     */
    IPolicy.prototype.getTokenInternal = function () { };
    /**
     * @param {?} options
     * @return {?}
     */
    IPolicy.prototype.applyTo = function (options) { };
    /**
     * @return {?}
     */
    IPolicy.prototype.isExpired = function () { };
    /**
     * @param {?} settings
     * @return {?}
     */
    IPolicy.prototype.readFrom = function (settings) { };
    /**
     * @return {?}
     */
    IPolicy.prototype.persistent = function () { };
    /**
     * @param {?} options
     * @return {?}
     */
    IPolicy.prototype.applyToV2 = function (options) { };
    /**
     * @param {?} options
     * @return {?}
     */
    IPolicy.prototype.applyToV3 = function (options) { };
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     * @return {?}
     */
    IPolicy.prototype.getTokenP = function () { };
    /**
     * @return {?}
     */
    IPolicy.prototype.reset = function () { };
}
/** @type {?} */
export var DummyOAuthTokenCtorParams = {
    url: 'dummy',
    clientId: 'dummy',
    clientSecret: 'dummy',
    scope: 'all'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3NlY3VyaXR5L2ludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLHdDQUVDOzs7SUFERyxpQ0FBWTs7Ozs7QUFHaEIsa0RBSUM7OztJQUhHLGdEQUFpQjs7SUFDakIsb0RBQXFCOztJQUNyQiw2Q0FBYzs7Ozs7QUFHbEIsZ0RBR0M7OztJQUZHLG9EQUF1Qjs7SUFDdkIsZ0RBQW1COzs7OztBQUd2QixrQ0FLQzs7O0lBSkcsaUNBQWtCOztJQUNsQixxQ0FBc0I7O0lBQ3RCLDZCQUFjOztJQUNkLGtDQUFnQjs7Ozs7QUFHcEIsaUNBS0M7OztJQUpHLGdDQUFrQjs7SUFDbEIsZ0NBQWtCOztJQUNsQiw0QkFBYzs7SUFDZCxtQ0FBcUI7Ozs7O0FBR3pCLGtDQUVDOzs7SUFERyw4QkFBZTs7Ozs7QUFHbkIsNkJBdUJDOzs7OztJQXRCRyxxREFBd0M7Ozs7O0lBRXhDLG1EQUE0Qjs7OztJQUU1Qiw4Q0FBcUI7Ozs7O0lBRXJCLHFEQUF1Qjs7OztJQUV2QiwrQ0FBa0I7Ozs7O0lBRWxCLHFEQUE4Qjs7Ozs7SUFFOUIscURBQThCOzs7Ozs7O0lBTzlCLDhDQUFpQzs7OztJQUVqQywwQ0FBUTs7O0FBR1osTUFBTSxLQUFPLHlCQUF5QixHQUFpQztJQUNuRSxHQUFHLEVBQUUsT0FBTztJQUNaLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLFlBQVksRUFBRSxPQUFPO0lBQ3JCLEtBQUssRUFBRSxLQUFLO0NBQ2YiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElQb2xpY3lDdG9yT3B0aW9ucyB7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zIGV4dGVuZHMgSVBvbGljeUN0b3JPcHRpb25zIHtcclxuICAgIGNsaWVudElkOiBzdHJpbmc7XHJcbiAgICBjbGllbnRTZWNyZXQ6IHN0cmluZztcclxuICAgIHNjb3BlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFudGlGb3JnZXJ5S2V5Q3Rvck9wdGlvbnMgZXh0ZW5kcyBJUG9saWN5Q3Rvck9wdGlvbnMge1xyXG4gICAgYW50aUZvcmdlcnlLZXk6IHN0cmluZztcclxuICAgIGVsZW1lbnRUYWc6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJT0F1dGhQYXJhbXMge1xyXG4gICAgY2xpZW50X2lkOiBzdHJpbmc7XHJcbiAgICBjbGllbnRfc2VjcmV0OiBzdHJpbmc7XHJcbiAgICBzY29wZTogc3RyaW5nO1xyXG4gICAgZ3JhbnRfdHlwZTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElPQXV0aFRva2VuIHtcclxuICAgIGV4cGlyZXNJbjogbnVtYmVyO1xyXG4gICAgY3JlYXRlZE9uOiBudW1iZXI7XHJcbiAgICB0b2tlbjogc3RyaW5nO1xyXG4gICAgcmVmcmVzaFRva2VuOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU9wZW5JRFRva2VuIGV4dGVuZHMgSU9BdXRoVG9rZW4ge1xyXG4gICAgb3BlbklkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBvbGljeSB7XHJcbiAgICBnZXRUb2tlbkludGVybmFsKCk6IFByb21pc2VMaWtlPHN0cmluZz47XHJcblxyXG4gICAgYXBwbHlUbyhvcHRpb25zOiBhbnkpOiB2b2lkO1xyXG5cclxuICAgIGlzRXhwaXJlZCgpOiBib29sZWFuO1xyXG5cclxuICAgIHJlYWRGcm9tKHNldHRpbmdzOiB7fSk7XHJcblxyXG4gICAgcGVyc2lzdGVudCgpOiBhbnk7XHJcblxyXG4gICAgYXBwbHlUb1YyKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcblxyXG4gICAgYXBwbHlUb1YzKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgaW50ZXJmYWNlIGZvciByZXRyaWV2aW5nIHRoZSB0b2tlbiBmcm9tIGEgcmVtb3RlIHNlcnZlci5cclxuICAgICAqIFRoaXMgbWV0aG9kIGludGVybmFsbHkgZGlzcGF0Y2hlcyB0aGUgY2FsbCB0byBhbm90aGVyIG1ldGhvZFxyXG4gICAgICogYW5kIGNhY2hlIHRoZSB0b2tlbi5cclxuICAgICAqL1xyXG4gICAgZ2V0VG9rZW5QKCk6IFByb21pc2VMaWtlPHN0cmluZz47XHJcblxyXG4gICAgcmVzZXQoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IER1bW15T0F1dGhUb2tlbkN0b3JQYXJhbXM6IElPQXV0aFRva2VuUG9saWN5Q3Rvck9wdGlvbnMgPSB7XHJcbiAgICB1cmw6ICdkdW1teScsXHJcbiAgICBjbGllbnRJZDogJ2R1bW15JyxcclxuICAgIGNsaWVudFNlY3JldDogJ2R1bW15JyxcclxuICAgIHNjb3BlOiAnYWxsJ1xyXG59O1xyXG4iXX0=