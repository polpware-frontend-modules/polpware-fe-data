/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { safeParseInt } from '@polpware/fe-utilities';
import { PolicyBase } from './policy-base';
/** @type {?} */
const _ = dependencies.underscore;
/** @type {?} */
const $ = dependencies.jquery;
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
export class OAuthTokenPolicy extends PolicyBase {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        super(settings);
        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope;
        this.expiresIn = null;
        this.createdOn = null;
        this.refreshToken = '';
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    readFrom(settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    }
    /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    persistent() {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    }
    /**
     * @return {?}
     */
    getParams() {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    }
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    getTokenInternal() {
        /** @type {?} */
        const params = this.getParams();
        return $.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then((resp) => {
            this.createdOn = new Date().getTime();
            this.expiresIn = resp.expires_in;
            this.refreshToken = resp.refreshToken || '';
            return (resp.access_token);
        });
    }
    /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    isExpired() {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        /** @type {?} */
        const expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        /** @type {?} */
        const now = new Date();
        /** @type {?} */
        const diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    }
    /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    applyTo(options) {
        options.beforeSend = (xhr) => {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(this.token)));
        };
    }
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    applyToV2(options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    }
    /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
     */
    applyToV3(options) {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    }
    /**
     * Resets the token and its assoicated information.
     * @return {?}
     */
    reset() {
        super.reset();
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tcG9saWN5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvb2F1dGgtdG9rZW4tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNdEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7TUFFckMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVOztNQUMzQixDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU07Ozs7O0FBRTdCLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxJQUFJO0lBQ2xDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7SUFFNUMsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxVQUFVOzs7O0lBVTVDLFlBQVksUUFBc0M7UUFDOUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7Ozs7SUFNRCxRQUFRLENBQUMsUUFBcUI7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQzlDLENBQUM7Ozs7O0lBS0QsVUFBVTtRQUNOLE9BQU87WUFDSCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDbEMsQ0FBQztJQUNOLENBQUM7Ozs7SUFFRCxTQUFTO1FBQ0wsT0FBTztZQUNILFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN4QixhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUztTQUM3QixDQUFDO0lBQ04sQ0FBQzs7Ozs7SUFHRCxnQkFBZ0I7O2NBQ04sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDL0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7WUFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBS0QsU0FBUztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN0QyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZjs7Y0FDSyxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDOUMsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7O2NBQ0ssR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFOztjQUNoQixJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTO1FBQzNDLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLEVBQUU7WUFDekIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7SUFLRCxPQUFPLENBQUMsT0FBWTtRQUNoQixPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekIsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDLENBQUM7SUFDTixDQUFDOzs7Ozs7SUFLRCxTQUFTLENBQUMsT0FBWTtRQUNsQixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxPQUFPLEdBQUc7WUFDZCxhQUFhLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzlDLENBQUM7SUFDTixDQUFDOzs7Ozs7SUFLRCxTQUFTLENBQUMsT0FBWTtRQUNsQixPQUFPLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQ3hCLEdBQUcsRUFBRSxlQUFlO1lBQ3BCLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDdEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7SUFLRCxLQUFLO1FBQ0QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztDQUNKOzs7Ozs7SUEvSEcsb0NBQTJCOzs7OztJQUMzQix3Q0FBK0I7Ozs7O0lBQy9CLGlDQUF3Qjs7Ozs7SUFDeEIscUNBQTRCOzs7OztJQUM1QixxQ0FBNEI7Ozs7O0lBQzVCLHdDQUErQjs7SUFDL0IscUNBQTZGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBEZWZpbmVzIGEgYmFzZSBjbGFzcyBmb3IgcmV0cmlldmluZyBPQXV0aDIgdG9rZW5zLlxuICovXG5cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IHsgc2FmZVBhcnNlSW50IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5pbXBvcnQge1xuICAgIElPQXV0aFRva2VuUG9saWN5Q3Rvck9wdGlvbnMsXG4gICAgSU9BdXRoVG9rZW4sXG4gICAgSU9BdXRoUGFyYW1zXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQb2xpY3lCYXNlIH0gZnJvbSAnLi9wb2xpY3ktYmFzZSc7XG5cbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcbmNvbnN0ICQgPSBkZXBlbmRlbmNpZXMuanF1ZXJ5O1xuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRUb09BdXRoVG9rZW4oZGF0YSk6IElPQXV0aFRva2VuIHtcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICBkYXRhLmV4cGlyZXNJbiA9IGRhdGEuZXhwaXJlc0luIHx8IDA7XG4gICAgZGF0YS5jcmVhdGVkT24gPSBkYXRhLmNyZWF0ZWRPbiB8fCAwO1xuICAgIGRhdGEudG9rZW4gPSBkYXRhLnRva2VuIHx8ICcnO1xuICAgIGRhdGEucmVmcmVzaFRva2VuID0gZGF0YS5yZWZyZXNoVG9rZW4gfHwgJyc7XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuZXhwb3J0IGNsYXNzIE9BdXRoVG9rZW5Qb2xpY3kgZXh0ZW5kcyBQb2xpY3lCYXNlIHtcblxuICAgIHByb3RlY3RlZCBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBjbGllbnRTZWNyZXQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc2NvcGU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgZXhwaXJlc0luOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIGNyZWF0ZWRPbjogbnVtYmVyO1xuICAgIHByb3RlY3RlZCByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgZ3JhbnRUeXBlOiAnYXV0aG9yaXphdGlvbl9jb2RlJyB8ICdyZWZyZXNoX3Rva2VuJyB8ICdwYXNzd29yZCcgfCAnY2xpZW50X2NyZWRlbnRpYWxzJztcblxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcblxuICAgICAgICB0aGlzLmNsaWVudElkID0gc2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gc2V0dGluZ3MuY2xpZW50U2VjcmV0O1xuICAgICAgICB0aGlzLnNjb3BlID0gc2V0dGluZ3Muc2NvcGU7XG4gICAgICAgIHRoaXMuZXhwaXJlc0luID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlZWRzIHRoZSBwb2xpY3kgd2l0aCBzb21lIHNldHRpbmdzIGZyb20gb3V0c2lkZSxcbiAgICAgKiB1c3VhbGx5IGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAqL1xuICAgIHJlYWRGcm9tKHNldHRpbmdzOiBJT0F1dGhUb2tlbikge1xuICAgICAgICB0aGlzLmV4cGlyZXNJbiA9IHNldHRpbmdzLmV4cGlyZXNJbjtcbiAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBzZXR0aW5ncy5jcmVhdGVkT247XG4gICAgICAgIHRoaXMudG9rZW4gPSBzZXR0aW5ncy50b2tlbjtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBzZXR0aW5ncy5yZWZyZXNoVG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGF0YSB0aGF0IGFyZSBwZXJzaXN0ZW50YWJsZS5cbiAgICAgKi9cbiAgICBwZXJzaXN0ZW50KCk6IElPQXV0aFRva2VuIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGV4cGlyZXNJbjogdGhpcy5leHBpcmVzSW4sXG4gICAgICAgICAgICBjcmVhdGVkT246IHRoaXMuY3JlYXRlZE9uLFxuICAgICAgICAgICAgdG9rZW46IHRoaXMudG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHRoaXMucmVmcmVzaFRva2VuXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UGFyYW1zKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLmNsaWVudFNlY3JldCxcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLnNjb3BlLFxuICAgICAgICAgICAgZ3JhbnRfdHlwZTogdGhpcy5ncmFudFR5cGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBTdXBwb3J0IHByb2dyZXNzIGxvYWRpbmdcbiAgICBnZXRUb2tlbkludGVybmFsKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldFBhcmFtcygpO1xuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9KS50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZWRPbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGhpcy5leHBpcmVzSW4gPSByZXNwLmV4cGlyZXNfaW47XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHJlc3AucmVmcmVzaFRva2VuIHx8ICcnO1xuICAgICAgICAgICAgcmV0dXJuIChyZXNwLmFjY2Vzc190b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIHRva2VuIGlzIGV4cGlyZWQgb3Igbm90LlxuICAgICAqL1xuICAgIGlzRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuIHx8IHRoaXMudG9rZW4ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmNyZWF0ZWRPbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gc2FmZVBhcnNlSW50KHRoaXMuZXhwaXJlc0luKTtcbiAgICAgICAgaWYgKGV4cGlyZXNJbiA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBkaWZmID0gbm93LmdldFRpbWUoKSAtIHRoaXMuY3JlYXRlZE9uO1xuICAgICAgICBpZiAoZGlmZiA8IGV4cGlyZXNJbiAqIDEwMDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBseXMgdGhlIHRva2VuIHRvIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgICAqL1xuICAgIGFwcGx5VG8ob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIG9wdGlvbnMuYmVmb3JlU2VuZCA9ICh4aHIpID0+IHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgKCdCZWFyZXIgJy5jb25jYXQodGhpcy50b2tlbikpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBseSBzZWN1cml0eSBwb2xpY3kgdG8gdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgICovXG4gICAgYXBwbHlUb1YyKG9wdGlvbnM6IGFueSk6IHZvaWQge1xuICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge307XG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJy5jb25jYXQodGhpcy50b2tlbilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHAgc2VjdXJpdHkgcG9saWN5IHRoZSBnaXZlbiBvcHRpb25zLCB1c2VkIGZvciBvdXIgY3VzdG9taXplZCBYSFIuXG4gICAgICovXG4gICAgYXBwbHlUb1YzKG9wdGlvbnM6IGFueSk6IHZvaWQge1xuICAgICAgICBvcHRpb25zLnJlcXVlc3RoZWFkZXJzID0gb3B0aW9ucy5yZXF1ZXN0aGVhZGVycyB8fCBbXTtcbiAgICAgICAgb3B0aW9ucy5yZXF1ZXN0aGVhZGVycy5wdXNoKHtcbiAgICAgICAgICAgIGtleTogJ0F1dGhvcml6YXRpb24nLFxuICAgICAgICAgICAgdmFsdWU6ICdCZWFyZXIgJy5jb25jYXQodGhpcy50b2tlbilcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSB0b2tlbiBhbmQgaXRzIGFzc29pY2F0ZWQgaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gJyc7XG4gICAgICAgIHRoaXMuZXhwaXJlc0luID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcmVhdGVkT24gPSBudWxsO1xuICAgIH1cbn1cbiJdfQ==