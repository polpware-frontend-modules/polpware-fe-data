/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';
var OAuthTokenExtPolicy = /** @class */ (function (_super) {
    tslib_1.__extends(OAuthTokenExtPolicy, _super);
    function OAuthTokenExtPolicy(settings, payload) {
        var _this = _super.call(this, settings) || this;
        _this._payload = tslib_1.__assign({}, payload);
        return _this;
    }
    Object.defineProperty(OAuthTokenExtPolicy.prototype, "payload", {
        get: /**
         * @return {?}
         */
        function () {
            return this._payload;
        },
        enumerable: true,
        configurable: true
    });
    // override
    // override
    /**
     * @return {?}
     */
    OAuthTokenExtPolicy.prototype.getParams = 
    // override
    /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var p = _super.prototype.getParams.call(this);
        return tslib_1.__assign({}, p, this._payload);
    };
    return OAuthTokenExtPolicy;
}(OAuthTokenPolicy));
export { OAuthTokenExtPolicy };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OAuthTokenExtPolicy.prototype._payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tZXh0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3NlY3VyaXR5L29hdXRoLXRva2VuLWV4dC1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV6RDtJQUF5QywrQ0FBZ0I7SUFJckQsNkJBQVksUUFBc0MsRUFBRSxPQUFlO1FBQW5FLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBR2xCO1FBREcsS0FBSSxDQUFDLFFBQVEsd0JBQVEsT0FBTyxDQUFFLENBQUM7O0lBQ25DLENBQUM7SUFFRCxzQkFBVyx3Q0FBTzs7OztRQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVELFdBQVc7Ozs7O0lBQ1gsdUNBQVM7Ozs7O0lBQVQ7O1lBQ1UsQ0FBQyxHQUFHLGlCQUFNLFNBQVMsV0FBRTtRQUMzQiw0QkFBWSxDQUFDLEVBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRztJQUN2QyxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBbkJELENBQXlDLGdCQUFnQixHQW1CeEQ7Ozs7Ozs7SUFqQkcsdUNBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIElPQXV0aFRva2VuUG9saWN5Q3Rvck9wdGlvbnNcclxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgT0F1dGhUb2tlblBvbGljeSB9IGZyb20gJy4vb2F1dGgtdG9rZW4tcG9saWN5JztcclxuZXhwb3J0IHsgYWRhcHRUb09BdXRoVG9rZW4gfSBmcm9tICcuL29hdXRoLXRva2VuLXBvbGljeSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT0F1dGhUb2tlbkV4dFBvbGljeSBleHRlbmRzIE9BdXRoVG9rZW5Qb2xpY3kge1xyXG5cclxuICAgIHByaXZhdGUgX3BheWxvYWQ6IG9iamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSU9BdXRoVG9rZW5Qb2xpY3lDdG9yT3B0aW9ucywgcGF5bG9hZDogb2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXlsb2FkID0geyAuLi5wYXlsb2FkIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXlsb2FkKCk6IG9iamVjdCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BheWxvYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3ZlcnJpZGVcclxuICAgIGdldFBhcmFtcygpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHAgPSBzdXBlci5nZXRQYXJhbXMoKTtcclxuICAgICAgICByZXR1cm4geyAuLi5wLCAuLi4gdGhpcy5fcGF5bG9hZCB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==