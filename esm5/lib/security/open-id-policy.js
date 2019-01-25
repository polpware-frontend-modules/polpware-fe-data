/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
    var r = adaptToOAuthToken(data);
    return tslib_1.__assign({}, r, { openId: data.openId || '' });
}
var OpenIDPolicy = /** @class */ (function (_super) {
    tslib_1.__extends(OpenIDPolicy, _super);
    function OpenIDPolicy() {
        var _this = _super.call(this, DummyOAuthTokenCtorParams) || this;
        _this._openId = '';
        return _this;
    }
    /**
     * Returns the necessary information for peristence.
     */
    /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    OpenIDPolicy.prototype.persistent = /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var r = _super.prototype.persistent.call(this);
        return tslib_1.__assign({}, r, { openId: this._openId });
    };
    /**
     * Reads credential from the given settings.
     */
    /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    OpenIDPolicy.prototype.readFrom = /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    function (settings) {
        _super.prototype.readFrom.call(this, settings);
        (/** @type {?} */ (this))._openId = settings.openId;
        return (/** @type {?} */ (this));
    };
    return OpenIDPolicy;
}(OAuthTokenPolicy));
export { OpenIDPolicy };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OpenIDPolicy.prototype._openId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Blbi1pZC1wb2xpY3kuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9vcGVuLWlkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQSxPQUFPLEVBRUgseUJBQXlCLEVBQzVCLE1BQU0sY0FBYyxDQUFDO0FBRXRCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7OztBQUUzRSxNQUFNLFVBQVUsa0JBQWtCLENBQUMsSUFBSTtJQUNuQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7UUFFWixDQUFDLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0lBQ2pDLDRCQUFZLENBQUMsSUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUc7QUFDL0MsQ0FBQztBQUVEO0lBQWtDLHdDQUFnQjtJQUk5QztRQUFBLFlBQ0ksa0JBQU0seUJBQXlCLENBQUMsU0FFbkM7UUFERyxLQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7SUFDdEIsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNILGlDQUFVOzs7O0lBQVY7O1lBQ1UsQ0FBQyxHQUFHLGlCQUFNLFVBQVUsV0FBRTtRQUM1Qiw0QkFBWSxDQUFDLElBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUc7SUFDMUMsQ0FBQztJQUVEOztPQUVHOzs7Ozs7OztJQUNILCtCQUFROzs7Ozs7O0lBQVIsVUFBUyxRQUFzQjtRQUMzQixpQkFBTSxRQUFRLFlBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsbUJBQUEsSUFBSSxFQUFBLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztJQUNoQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBekJELENBQWtDLGdCQUFnQixHQXlCakQ7Ozs7Ozs7SUF2QkcsK0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBmaWxlT3ZlcnZpZXdcclxuICogT3BlbklEIHRva2VuIHBvbGljeSwgYnVpbHQgdXBvbiBPQXV0aDIgdG9rZW4gcG9saWN5XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIElPcGVuSURUb2tlbixcclxuICAgIER1bW15T0F1dGhUb2tlbkN0b3JQYXJhbXNcclxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgT0F1dGhUb2tlblBvbGljeSwgYWRhcHRUb09BdXRoVG9rZW4gfSBmcm9tICcuL29hdXRoLXRva2VuLXBvbGljeSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRUb09wZW5JRFRva2VuKGRhdGEpOiBJT3BlbklEVG9rZW4ge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307XHJcblxyXG4gICAgY29uc3QgciA9IGFkYXB0VG9PQXV0aFRva2VuKGRhdGEpO1xyXG4gICAgcmV0dXJuIHsgLi4uciwgb3BlbklkOiBkYXRhLm9wZW5JZCB8fCAnJyB9O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3BlbklEUG9saWN5IGV4dGVuZHMgT0F1dGhUb2tlblBvbGljeSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfb3BlbklkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoRHVtbXlPQXV0aFRva2VuQ3RvclBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5fb3BlbklkID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBuZWNlc3NhcnkgaW5mb3JtYXRpb24gZm9yIHBlcmlzdGVuY2UuXHJcbiAgICAgKi9cclxuICAgIHBlcnNpc3RlbnQoKTogSU9wZW5JRFRva2VuIHtcclxuICAgICAgICBjb25zdCByID0gc3VwZXIucGVyc2lzdGVudCgpO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnIsIG9wZW5JZDogdGhpcy5fb3BlbklkIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWFkcyBjcmVkZW50aWFsIGZyb20gdGhlIGdpdmVuIHNldHRpbmdzLlxyXG4gICAgICovXHJcbiAgICByZWFkRnJvbShzZXR0aW5nczogSU9wZW5JRFRva2VuKSB7XHJcbiAgICAgICAgc3VwZXIucmVhZEZyb20oc2V0dGluZ3MpO1xyXG4gICAgICAgIHRoaXMuX29wZW5JZCA9IHNldHRpbmdzLm9wZW5JZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iXX0=