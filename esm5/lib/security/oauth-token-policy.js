/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */
import * as tslib_1 from "tslib";
import * as dependencies from '@polpware/fe-dependencies';
import { safeParseInt } from '@polpware/fe-utilities';
import { PolicyBase } from './policy-base';
var _ = dependencies.underscore;
var $ = dependencies.jquery;
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
        _this.response = null;
        return _this;
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    OAuthTokenPolicy.prototype.readFrom = function (settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    };
    /**
     * Returns the data that are persistentable.
     */
    OAuthTokenPolicy.prototype.persistent = function () {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    };
    OAuthTokenPolicy.prototype.getParams = function () {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    };
    // TODO: Support progress loading
    OAuthTokenPolicy.prototype.getTokenInternal = function () {
        var _this = this;
        var params = this.getParams();
        return $.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then(function (resp) {
            // Put down the response
            _this.response = resp;
            _this.createdOn = new Date().getTime();
            _this.expiresIn = resp.expires_in;
            _this.refreshToken = resp.refreshToken || '';
            resp.scope && (_this.scope = resp.scope);
            return (resp.access_token);
        });
    };
    /**
     * Returns if the token is expired or not.
     */
    OAuthTokenPolicy.prototype.isExpired = function () {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        var expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        var now = new Date();
        var diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    };
    /**
     * Applys the token to the given options.
     */
    OAuthTokenPolicy.prototype.applyTo = function (options) {
        var _this = this;
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(_this.token)));
        };
    };
    /**
     * Apply security policy to the given options.
     */
    OAuthTokenPolicy.prototype.applyToV2 = function (options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    };
    /**
     * App security policy the given options, used for our customized XHR.
     */
    OAuthTokenPolicy.prototype.applyToV3 = function (options) {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    };
    /**
     * Resets the token and its assoicated information.
     */
    OAuthTokenPolicy.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    };
    return OAuthTokenPolicy;
}(PolicyBase));
export { OAuthTokenPolicy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tcG9saWN5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvb2F1dGgtdG9rZW4tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU10RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLElBQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDbEMsSUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUU5QixNQUFNLFVBQVUsaUJBQWlCLENBQUMsSUFBSTtJQUNsQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO0lBRTVDLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRDtJQUFzQyw0Q0FBVTtJQVk1QywwQkFBWSxRQUFzQztRQUFsRCxZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQVVsQjtRQVJHLEtBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsS0FBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFD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IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGJhc2UgY2xhc3MgZm9yIHJldHJpZXZpbmcgT0F1dGgyIHRva2Vucy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IHNhZmVQYXJzZUludCB9IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuaW1wb3J0IHtcbiAgICBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zLFxuICAgIElPQXV0aFRva2VuLFxuICAgIElPQXV0aFBhcmFtc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUG9saWN5QmFzZSB9IGZyb20gJy4vcG9saWN5LWJhc2UnO1xuXG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5jb25zdCAkID0gZGVwZW5kZW5jaWVzLmpxdWVyeTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0VG9PQXV0aFRva2VuKGRhdGEpOiBJT0F1dGhUb2tlbiB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS5leHBpcmVzSW4gPSBkYXRhLmV4cGlyZXNJbiB8fCAwO1xuICAgIGRhdGEuY3JlYXRlZE9uID0gZGF0YS5jcmVhdGVkT24gfHwgMDtcbiAgICBkYXRhLnRva2VuID0gZGF0YS50b2tlbiB8fCAnJztcbiAgICBkYXRhLnJlZnJlc2hUb2tlbiA9IGRhdGEucmVmcmVzaFRva2VuIHx8ICcnO1xuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmV4cG9ydCBjbGFzcyBPQXV0aFRva2VuUG9saWN5IGV4dGVuZHMgUG9saWN5QmFzZSB7XG5cbiAgICBwcm90ZWN0ZWQgY2xpZW50SWQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHNjb3BlOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGV4cGlyZXNJbjogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBjcmVhdGVkT246IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGdyYW50VHlwZTogJ2F1dGhvcml6YXRpb25fY29kZScgfCAncmVmcmVzaF90b2tlbicgfCAncGFzc3dvcmQnIHwgJ2NsaWVudF9jcmVkZW50aWFscyc7XG5cbiAgICBwdWJsaWMgcmVzcG9uc2U6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcblxuICAgICAgICB0aGlzLmNsaWVudElkID0gc2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gc2V0dGluZ3MuY2xpZW50U2VjcmV0O1xuICAgICAgICB0aGlzLnNjb3BlID0gc2V0dGluZ3Muc2NvcGU7XG4gICAgICAgIHRoaXMuZXhwaXJlc0luID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9ICcnO1xuXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlZWRzIHRoZSBwb2xpY3kgd2l0aCBzb21lIHNldHRpbmdzIGZyb20gb3V0c2lkZSxcbiAgICAgKiB1c3VhbGx5IGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAqL1xuICAgIHJlYWRGcm9tKHNldHRpbmdzOiBJT0F1dGhUb2tlbikge1xuICAgICAgICB0aGlzLmV4cGlyZXNJbiA9IHNldHRpbmdzLmV4cGlyZXNJbjtcbiAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBzZXR0aW5ncy5jcmVhdGVkT247XG4gICAgICAgIHRoaXMudG9rZW4gPSBzZXR0aW5ncy50b2tlbjtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBzZXR0aW5ncy5yZWZyZXNoVG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGF0YSB0aGF0IGFyZSBwZXJzaXN0ZW50YWJsZS5cbiAgICAgKi9cbiAgICBwZXJzaXN0ZW50KCk6IElPQXV0aFRva2VuIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGV4cGlyZXNJbjogdGhpcy5leHBpcmVzSW4sXG4gICAgICAgICAgICBjcmVhdGVkT246IHRoaXMuY3JlYXRlZE9uLFxuICAgICAgICAgICAgdG9rZW46IHRoaXMudG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHRoaXMucmVmcmVzaFRva2VuXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UGFyYW1zKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLmNsaWVudFNlY3JldCxcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLnNjb3BlLFxuICAgICAgICAgICAgZ3JhbnRfdHlwZTogdGhpcy5ncmFudFR5cGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBTdXBwb3J0IHByb2dyZXNzIGxvYWRpbmdcbiAgICBnZXRUb2tlbkludGVybmFsKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldFBhcmFtcygpO1xuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9KS50aGVuKChyZXNwKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIFB1dCBkb3duIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3A7XG5cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlZE9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZXNJbiA9IHJlc3AuZXhwaXJlc19pbjtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gcmVzcC5yZWZyZXNoVG9rZW4gfHwgJyc7XG4gICAgICAgICAgICByZXNwLnNjb3BlICYmICh0aGlzLnNjb3BlID0gcmVzcC5zY29wZSk7XG4gICAgICAgICAgICByZXR1cm4gKHJlc3AuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgdG9rZW4gaXMgZXhwaXJlZCBvciBub3QuXG4gICAgICovXG4gICAgaXNFeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4gfHwgdGhpcy50b2tlbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY3JlYXRlZE9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSBzYWZlUGFyc2VJbnQodGhpcy5leHBpcmVzSW4pO1xuICAgICAgICBpZiAoZXhwaXJlc0luIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBub3cuZ2V0VGltZSgpIC0gdGhpcy5jcmVhdGVkT247XG4gICAgICAgIGlmIChkaWZmIDwgZXhwaXJlc0luICogMTAwMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5cyB0aGUgdG9rZW4gdG8gdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgICovXG4gICAgYXBwbHlUbyhvcHRpb25zOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kID0gKHhocikgPT4ge1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAoJ0JlYXJlciAnLmNvbmNhdCh0aGlzLnRva2VuKSkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHNlY3VyaXR5IHBvbGljeSB0byB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKi9cbiAgICBhcHBseVRvVjIob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnLmNvbmNhdCh0aGlzLnRva2VuKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcCBzZWN1cml0eSBwb2xpY3kgdGhlIGdpdmVuIG9wdGlvbnMsIHVzZWQgZm9yIG91ciBjdXN0b21pemVkIFhIUi5cbiAgICAgKi9cbiAgICBhcHBseVRvVjMob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIG9wdGlvbnMucmVxdWVzdGhlYWRlcnMgPSBvcHRpb25zLnJlcXVlc3RoZWFkZXJzIHx8IFtdO1xuICAgICAgICBvcHRpb25zLnJlcXVlc3RoZWFkZXJzLnB1c2goe1xuICAgICAgICAgICAga2V5OiAnQXV0aG9yaXphdGlvbicsXG4gICAgICAgICAgICB2YWx1ZTogJ0JlYXJlciAnLmNvbmNhdCh0aGlzLnRva2VuKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIHRva2VuIGFuZCBpdHMgYXNzb2ljYXRlZCBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgc3VwZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSAnJztcbiAgICAgICAgdGhpcy5leHBpcmVzSW4gPSBudWxsO1xuICAgICAgICB0aGlzLmNyZWF0ZWRPbiA9IG51bGw7XG4gICAgfVxufVxuIl19