/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { safeParseInt } from '@polpware/fe-utilities';
import { PolicyBase } from './policy-base';
/** @type {?} */
var _ = dependencies.underscore;
/** @type {?} */
var $ = dependencies.jquery;
/**
 * @param {?} data
 * @return {?}
 */
export function adaptToOAuthToken(data) {
    data = data || {};
    data.expiresIn = data.expiresIn || 0;
    data.createdOn = data.createdOn || 0;
    data.token = data.token || '';
    data.refreshToken = data.refreshToken || '';
    return data;
}
var OAuthTokenPolicy = /** @class */ (function (_super) {
    tslib_1.__extends(OAuthTokenPolicy, _super);
    function OAuthTokenPolicy(settings) {
        var _this = _super.call(this, settings) || this;
        _this.clientId = settings.clientId;
        _this.clientSecret = settings.clientSecret;
        _this.scope = settings.scope;
        _this.expiresIn = null;
        _this.createdOn = null;
        _this.refreshToken = '';
        return _this;
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    OAuthTokenPolicy.prototype.readFrom = /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    function (settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    };
    /**
     * Returns the data that are persistentable.
     */
    /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.persistent = /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    function () {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    };
    /**
     * @return {?}
     */
    OAuthTokenPolicy.prototype.getParams = /**
     * @return {?}
     */
    function () {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    };
    // TODO: Support progress loading
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    OAuthTokenPolicy.prototype.getTokenInternal = 
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var params = this.getParams();
        return $.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then(function (resp) {
            _this.createdOn = new Date().getTime();
            _this.expiresIn = resp.expires_in;
            _this.refreshToken = resp.refreshToken || '';
            return (resp.access_token);
        });
    };
    /**
     * Returns if the token is expired or not.
     */
    /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.isExpired = /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    function () {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        /** @type {?} */
        var expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        /** @type {?} */
        var now = new Date();
        /** @type {?} */
        var diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    };
    /**
     * Applys the token to the given options.
     */
    /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyTo = /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(_this.token)));
        };
    };
    /**
     * Apply security policy to the given options.
     */
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyToV2 = /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    };
    /**
     * App security policy the given options, used for our customized XHR.
     */
    /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyToV3 = /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    };
    /**
     * Resets the token and its assoicated information.
     */
    /**
     * Resets the token and its assoicated information.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.reset = /**
     * Resets the token and its assoicated information.
     * @return {?}
     */
    function () {
        _super.prototype.reset.call(this);
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    };
    return OAuthTokenPolicy;
}(PolicyBase));
export { OAuthTokenPolicy };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.clientId;
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.clientSecret;
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.scope;
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.expiresIn;
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.createdOn;
    /**
     * @type {?}
     * @protected
     */
    OAuthTokenPolicy.prototype.refreshToken;
    /** @type {?} */
    OAuthTokenPolicy.prototype.grantType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tcG9saWN5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvb2F1dGgtdG9rZW4tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBTXRELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0lBRXJDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVTs7SUFDM0IsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNOzs7OztBQUU3QixNQUFNLFVBQVUsaUJBQWlCLENBQUMsSUFBSTtJQUNsQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO0lBRTVDLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRDtJQUFzQyw0Q0FBVTtJQVU1QywwQkFBWSxRQUFzQztRQUFsRCxZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQVFsQjtRQU5HLEtBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsS0FBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVCLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDOztJQUMzQixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gsbUNBQVE7Ozs7OztJQUFSLFVBQVMsUUFBcUI7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxxQ0FBVTs7OztJQUFWO1FBQ0ksT0FBTztZQUNILFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNsQyxDQUFDO0lBQ04sQ0FBQzs7OztJQUVELG9DQUFTOzs7SUFBVDtRQUNJLE9BQU87WUFDSCxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDeEIsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDN0IsQ0FBQztJQUNOLENBQUM7SUFFRCxpQ0FBaUM7Ozs7O0lBQ2pDLDJDQUFnQjs7Ozs7SUFBaEI7UUFBQSxpQkFZQzs7WUFYUyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUMvQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDVixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJO1lBQ1QsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsb0NBQVM7Ozs7SUFBVDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN0QyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFDSyxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDOUMsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7O1lBQ0ssR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFOztZQUNoQixJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTO1FBQzNDLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLEVBQUU7WUFDekIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILGtDQUFPOzs7OztJQUFQLFVBQVEsT0FBWTtRQUFwQixpQkFJQztRQUhHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBQyxHQUFHO1lBQ3JCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxvQ0FBUzs7Ozs7SUFBVCxVQUFVLE9BQVk7UUFDbEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLENBQUMsT0FBTyxHQUFHO1lBQ2QsYUFBYSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM5QyxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxvQ0FBUzs7Ozs7SUFBVCxVQUFVLE9BQVk7UUFDbEIsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztRQUN0RCxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUN4QixHQUFHLEVBQUUsZUFBZTtZQUNwQixLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3RDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxnQ0FBSzs7OztJQUFMO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBaklELENBQXNDLFVBQVUsR0FpSS9DOzs7Ozs7O0lBL0hHLG9DQUEyQjs7Ozs7SUFDM0Isd0NBQStCOzs7OztJQUMvQixpQ0FBd0I7Ozs7O0lBQ3hCLHFDQUE0Qjs7Ozs7SUFDNUIscUNBQTRCOzs7OztJQUM1Qix3Q0FBK0I7O0lBQy9CLHFDQUE2RiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGJhc2UgY2xhc3MgZm9yIHJldHJpZXZpbmcgT0F1dGgyIHRva2Vucy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IHNhZmVQYXJzZUludCB9IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuaW1wb3J0IHtcbiAgICBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zLFxuICAgIElPQXV0aFRva2VuLFxuICAgIElPQXV0aFBhcmFtc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUG9saWN5QmFzZSB9IGZyb20gJy4vcG9saWN5LWJhc2UnO1xuXG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5jb25zdCAkID0gZGVwZW5kZW5jaWVzLmpxdWVyeTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0VG9PQXV0aFRva2VuKGRhdGEpOiBJT0F1dGhUb2tlbiB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS5leHBpcmVzSW4gPSBkYXRhLmV4cGlyZXNJbiB8fCAwO1xuICAgIGRhdGEuY3JlYXRlZE9uID0gZGF0YS5jcmVhdGVkT24gfHwgMDtcbiAgICBkYXRhLnRva2VuID0gZGF0YS50b2tlbiB8fCAnJztcbiAgICBkYXRhLnJlZnJlc2hUb2tlbiA9IGRhdGEucmVmcmVzaFRva2VuIHx8ICcnO1xuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmV4cG9ydCBjbGFzcyBPQXV0aFRva2VuUG9saWN5IGV4dGVuZHMgUG9saWN5QmFzZSB7XG5cbiAgICBwcm90ZWN0ZWQgY2xpZW50SWQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHNjb3BlOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGV4cGlyZXNJbjogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBjcmVhdGVkT246IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGdyYW50VHlwZTogJ2F1dGhvcml6YXRpb25fY29kZScgfCAncmVmcmVzaF90b2tlbicgfCAncGFzc3dvcmQnIHwgJ2NsaWVudF9jcmVkZW50aWFscyc7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSU9BdXRoVG9rZW5Qb2xpY3lDdG9yT3B0aW9ucykge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IHNldHRpbmdzLmNsaWVudElkO1xuICAgICAgICB0aGlzLmNsaWVudFNlY3JldCA9IHNldHRpbmdzLmNsaWVudFNlY3JldDtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNldHRpbmdzLnNjb3BlO1xuICAgICAgICB0aGlzLmV4cGlyZXNJbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY3JlYXRlZE9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZWVkcyB0aGUgcG9saWN5IHdpdGggc29tZSBzZXR0aW5ncyBmcm9tIG91dHNpZGUsXG4gICAgICogdXN1YWxseSBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgKi9cbiAgICByZWFkRnJvbShzZXR0aW5nczogSU9BdXRoVG9rZW4pIHtcbiAgICAgICAgdGhpcy5leHBpcmVzSW4gPSBzZXR0aW5ncy5leHBpcmVzSW47XG4gICAgICAgIHRoaXMuY3JlYXRlZE9uID0gc2V0dGluZ3MuY3JlYXRlZE9uO1xuICAgICAgICB0aGlzLnRva2VuID0gc2V0dGluZ3MudG9rZW47XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gc2V0dGluZ3MucmVmcmVzaFRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRhdGEgdGhhdCBhcmUgcGVyc2lzdGVudGFibGUuXG4gICAgICovXG4gICAgcGVyc2lzdGVudCgpOiBJT0F1dGhUb2tlbiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBleHBpcmVzSW46IHRoaXMuZXhwaXJlc0luLFxuICAgICAgICAgICAgY3JlYXRlZE9uOiB0aGlzLmNyZWF0ZWRPbixcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLnRva2VuLFxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0aGlzLnJlZnJlc2hUb2tlblxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBhcmFtcygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3NlY3JldDogdGhpcy5jbGllbnRTZWNyZXQsXG4gICAgICAgICAgICBzY29wZTogdGhpcy5zY29wZSxcbiAgICAgICAgICAgIGdyYW50X3R5cGU6IHRoaXMuZ3JhbnRUeXBlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogU3VwcG9ydCBwcm9ncmVzcyBsb2FkaW5nXG4gICAgZ2V0VG9rZW5JbnRlcm5hbCgpOiBQcm9taXNlTGlrZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5nZXRQYXJhbXMoKTtcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSkudGhlbigocmVzcCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlc0luID0gcmVzcC5leHBpcmVzX2luO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSByZXNwLnJlZnJlc2hUb2tlbiB8fCAnJztcbiAgICAgICAgICAgIHJldHVybiAocmVzcC5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSB0b2tlbiBpcyBleHBpcmVkIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0V4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbiB8fCB0aGlzLnRva2VuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jcmVhdGVkT24pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHNhZmVQYXJzZUludCh0aGlzLmV4cGlyZXNJbik7XG4gICAgICAgIGlmIChleHBpcmVzSW4gPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5vdy5nZXRUaW1lKCkgLSB0aGlzLmNyZWF0ZWRPbjtcbiAgICAgICAgaWYgKGRpZmYgPCBleHBpcmVzSW4gKiAxMDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbHlzIHRoZSB0b2tlbiB0byB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKi9cbiAgICBhcHBseVRvKG9wdGlvbnM6IGFueSk6IHZvaWQge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVNlbmQgPSAoeGhyKSA9PiB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICgnQmVhcmVyICcuY29uY2F0KHRoaXMudG9rZW4pKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbHkgc2VjdXJpdHkgcG9saWN5IHRvIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgICAqL1xuICAgIGFwcGx5VG9WMihvcHRpb25zOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcuY29uY2F0KHRoaXMudG9rZW4pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwIHNlY3VyaXR5IHBvbGljeSB0aGUgZ2l2ZW4gb3B0aW9ucywgdXNlZCBmb3Igb3VyIGN1c3RvbWl6ZWQgWEhSLlxuICAgICAqL1xuICAgIGFwcGx5VG9WMyhvcHRpb25zOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgb3B0aW9ucy5yZXF1ZXN0aGVhZGVycyA9IG9wdGlvbnMucmVxdWVzdGhlYWRlcnMgfHwgW107XG4gICAgICAgIG9wdGlvbnMucmVxdWVzdGhlYWRlcnMucHVzaCh7XG4gICAgICAgICAgICBrZXk6ICdBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiAnQmVhcmVyICcuY29uY2F0KHRoaXMudG9rZW4pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgdG9rZW4gYW5kIGl0cyBhc3NvaWNhdGVkIGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9ICcnO1xuICAgICAgICB0aGlzLmV4cGlyZXNJbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY3JlYXRlZE9uID0gbnVsbDtcbiAgICB9XG59XG4iXX0=