import * as tslib_1 from "tslib";
/**
 * @fileOverview
 * Provides the anti-forgery security policy.
 * @name AntiForgeryKeyPolicy.js
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';
import { liftWithGuard } from '@polpware/fe-utilities';
import { PolicyBase } from './policy-base';
var $ = dependencies.jquery;
var defaultAntiForgeryKey = '__RequestVerificationToken';
var defaultElementTag = '';
/*
 <input name="__RequestVerificationToken" type="hidden"
 value="J8kl6w7KaBAteKOPeHW1IlG9RS7abCkbvQf2GwBlMVZZOX9FF-Bhc5mYmqXw4qe0MLraucQtKC-TAVh1rJEZ0SDfeLfqp-L5JrthIM9V0gp76-jnVz9J-rdYFhVeTT4Y0">
 */
function getTokenInternal(url, elementTag, inputField) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data) {
        /*global DOMParser */
        var doc, token, elm;
        token = '';
        doc = new DOMParser().parseFromString(data, 'text/html');
        if (elementTag) {
            elm = $(doc).find(elementTag);
            if (elm.length > 0) {
                elm = $(doc).find(inputField);
                if (elm.length > 0) {
                    elm = elm.eq(0);
                    token = elm.attr('value');
                }
            }
        }
        else {
            elm = $(doc).find(inputField);
            if (elm.length > 0) {
                elm = elm.eq(0);
                token = elm.attr('value');
            }
        }
        return token;
    });
}
var AntiForgeryKeyPolicy = /** @class */ (function (_super) {
    tslib_1.__extends(AntiForgeryKeyPolicy, _super);
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    function AntiForgeryKeyPolicy(settings) {
        var _this = _super.call(this, settings) || this;
        _this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        _this._elementTag = settings.elementTag || defaultElementTag;
        _this._expired = true;
        return _this;
    }
    AntiForgeryKeyPolicy.prototype.isExpired = function () {
        return this._expired;
    };
    AntiForgeryKeyPolicy.prototype.inputField = function () {
        return 'input[name="' + this._antiForgeryKey + '"]';
    };
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    AntiForgeryKeyPolicy.prototype.readFrom = function (settings) {
        this.token = settings.token;
    };
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    AntiForgeryKeyPolicy.prototype.persistent = function () {
        return {
            token: this.token
        };
    };
    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * @function getTokenP
     * @param {String}[url] The URL where the response from it may contain
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @returns {Promise}
     * @throws {}
     */
    AntiForgeryKeyPolicy.prototype.getTokenInternal = function () {
        var ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        var p = liftWithGuard(ret, function (token) {
            var isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    };
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    AntiForgeryKeyPolicy.prototype.applyTo = function (options) {
        var data = options.data;
        data[this._antiForgeryKey] = this.token;
    };
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    AntiForgeryKeyPolicy.prototype.applyToV2 = function (options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    };
    // TODO:
    AntiForgeryKeyPolicy.prototype.applyToV3 = function (options) {
    };
    /**
     * Resets the token and expired flag
     * @function reset
     */
    AntiForgeryKeyPolicy.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._expired = true;
    };
    return AntiForgeryKeyPolicy;
}(PolicyBase));
export { AntiForgeryKeyPolicy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW50aWZvcmdlcnlrZXktcG9saWN5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvYW50aWZvcmdlcnlrZXktcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUl2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLElBQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7QUFDOUIsSUFBTSxxQkFBcUIsR0FBRyw0QkFBNEIsQ0FBQztBQUMzRCxJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxTQUFTLGdCQUFnQixDQUFDLEdBQVcsRUFBRSxVQUFrQixFQUFFLFVBQWtCO0lBQ3pFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLFdBQVc7S0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7UUFDakIscUJBQXFCO1FBQ3JCLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDcEIsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekQsSUFBSSxVQUFVLEVBQUU7WUFDWixHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQixHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUks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LEtBQUssV0FBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0FBQyxBQXBHRCxDQUEwQyxVQUFVLEdBb0duRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgdGhlIGFudGktZm9yZ2VyeSBzZWN1cml0eSBwb2xpY3kuXG4gKiBAbmFtZSBBbnRpRm9yZ2VyeUtleVBvbGljeS5qc1xuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBsaWZ0V2l0aEd1YXJkIH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmltcG9ydCB7IElBbnRpRm9yZ2VyeUtleUN0b3JPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuaW1wb3J0IHsgUG9saWN5QmFzZSB9IGZyb20gJy4vcG9saWN5LWJhc2UnO1xuXG5jb25zdCAkID0gZGVwZW5kZW5jaWVzLmpxdWVyeTtcbmNvbnN0IGRlZmF1bHRBbnRpRm9yZ2VyeUtleSA9ICdfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbic7XG5jb25zdCBkZWZhdWx0RWxlbWVudFRhZyA9ICcnO1xuXG4vKlxuIDxpbnB1dCBuYW1lPVwiX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW5cIiB0eXBlPVwiaGlkZGVuXCJcbiB2YWx1ZT1cIko4a2w2dzdLYUJBdGVLT1BlSFcxSWxHOVJTN2FiQ2tidlFmMkd3QmxNVlpaT1g5RkYtQmhjNW1ZbXFYdzRxZTBNTHJhdWNRdEtDLVRBVmgxckpFWjBTRGZlTGZxcC1MNUpydGhJTTlWMGdwNzYtam5WejlKLXJkWUZoVmVUVDRZMFwiPlxuICovXG5mdW5jdGlvbiBnZXRUb2tlbkludGVybmFsKHVybDogc3RyaW5nLCBlbGVtZW50VGFnOiBzdHJpbmcsIGlucHV0RmllbGQ6IHN0cmluZyk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xuICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCwgLy8gQSBwYWdlIGNvbnRhaW5pbmcgcmVxdWlyZWQgdG9rZW5zXG4gICAgICAgIGRhdGFUeXBlOiAnaHRtbCB0ZXh0J1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvKmdsb2JhbCBET01QYXJzZXIgKi9cbiAgICAgICAgbGV0IGRvYywgdG9rZW4sIGVsbTtcbiAgICAgICAgdG9rZW4gPSAnJztcbiAgICAgICAgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhkYXRhLCAndGV4dC9odG1sJyk7XG4gICAgICAgIGlmIChlbGVtZW50VGFnKSB7XG4gICAgICAgICAgICBlbG0gPSAkKGRvYykuZmluZChlbGVtZW50VGFnKTtcbiAgICAgICAgICAgIGlmIChlbG0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGVsbSA9ICQoZG9jKS5maW5kKGlucHV0RmllbGQpO1xuICAgICAgICAgICAgICAgIGlmIChlbG0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBlbG0gPSBlbG0uZXEoMCk7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gZWxtLmF0dHIoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxtID0gJChkb2MpLmZpbmQoaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICBpZiAoZWxtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG0uZXEoMCk7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBlbG0uYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBBbnRpRm9yZ2VyeUtleVBvbGljeSBleHRlbmRzIFBvbGljeUJhc2Uge1xuXG4gICAgcHJpdmF0ZSBfYW50aUZvcmdlcnlLZXk6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbGVtZW50VGFnOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZXhwaXJlZDogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvciBBbnRpRm9yZ2VyeUtleVBvbGljeVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdIEEgc2V0IG9mIHNldHRpbmdzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJQW50aUZvcmdlcnlLZXlDdG9yT3B0aW9ucykge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuX2FudGlGb3JnZXJ5S2V5ID1cbiAgICAgICAgICAgIHNldHRpbmdzLmFudGlGb3JnZXJ5S2V5IHx8IGRlZmF1bHRBbnRpRm9yZ2VyeUtleTtcbiAgICAgICAgdGhpcy5fZWxlbWVudFRhZyA9IHNldHRpbmdzLmVsZW1lbnRUYWcgfHwgZGVmYXVsdEVsZW1lbnRUYWc7XG4gICAgICAgIHRoaXMuX2V4cGlyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlzRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGlyZWQ7XG4gICAgfVxuXG4gICAgaW5wdXRGaWVsZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ2lucHV0W25hbWU9XCInICsgdGhpcy5fYW50aUZvcmdlcnlLZXkgKyAnXCJdJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZWVkcyB0aGUgcG9saWN5IHdpdGggc29tZSBzZXR0aW5ncyBmcm9tIG91dHNpZGUsXG4gICAgICogdXN1YWxseSBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgKiBAZnVuY3Rpb24gcmVhZEZyb21cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIHJlYWRGcm9tKHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSBzZXR0aW5ncy50b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvYmplY3QgdGhhdCBhcmUgcGVyc2lzdGVudGFibGUuXG4gICAgICogQGZ1bmN0aW9uIHBlcnNpc3RlbnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIHBlcnNpc3RlbnQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b2tlbjogdGhpcy50b2tlblxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGFudGktZm9yZ2VyeSB0b2tlbiBmcm9tIHRoZSBnaXZlbiB1cmxcbiAgICAgKiBvciB0aGUgaW5zdGFuY2UgdXJsLlxuICAgICAqIEBmdW5jdGlvbiBnZXRUb2tlblBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ31bdXJsXSBUaGUgVVJMIHdoZXJlIHRoZSByZXNwb25zZSBmcm9tIGl0IG1heSBjb250YWluXG4gICAgICogdGhlIGFudGktZm9yZ2VyeSB0b2tlbjsgaXQgaXMgb3B0aW9uYWwgYW5kIHVzZWQgd2hlbiB5b3Ugd2FudCB0b1xuICAgICAqIG92ZXJ3cml0ZSB0aGUgaW5zdGFuY2UgdXJsLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEB0aHJvd3Mge31cbiAgICAgKi9cbiAgICBnZXRUb2tlbkludGVybmFsKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRUb2tlbkludGVybmFsKHRoaXMudXJsLCB0aGlzLl9lbGVtZW50VGFnLCB0aGlzLmlucHV0RmllbGQoKSk7XG4gICAgICAgIGNvbnN0IHAgPSBsaWZ0V2l0aEd1YXJkKHJldCwgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGlzR29vZFRva2VuID0gdG9rZW4gJiYgdG9rZW4ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHRoaXMuX2V4cGlyZWQgPSAhaXNHb29kVG9rZW47XG4gICAgICAgICAgICByZXR1cm4gaXNHb29kVG9rZW47XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5cyB0aGUgYW50aS1mb3JnZXJ5IGtleSBhbmQgaXRzIHZhbHVlIHRvIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgICAqIEBmdW5jdGlvbiBhcHBseVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIHRvIGJlIHVzZWQgZm9yIG1ha2luZyBhIHJlcXVlc3QuXG4gICAgICovXG4gICAgYXBwbHlUbyhvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICAgIGRhdGFbdGhpcy5fYW50aUZvcmdlcnlLZXldID0gdGhpcy50b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBseSBzZWN1cml0eSBwb2xpY3kgdG8gdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgICogQGZ1bmN0aW9uIGFwcGx5VG9WMlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgcGFyYW1zIGZpZWxkIGlzIGV4cGVjdGVkLlxuICAgICAqL1xuICAgIGFwcGx5VG9WMihvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMucGFyYW1zID0gb3B0aW9ucy5wYXJhbXMgfHwge307XG4gICAgICAgIG9wdGlvbnMucGFyYW1zW3RoaXMuX2FudGlGb3JnZXJ5S2V5XSA9IHRoaXMudG9rZW47XG4gICAgfVxuXG4gICAgLy8gVE9ETzpcbiAgICBhcHBseVRvVjMob3B0aW9ucykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgdG9rZW4gYW5kIGV4cGlyZWQgZmxhZ1xuICAgICAqIEBmdW5jdGlvbiByZXNldFxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9leHBpcmVkID0gdHJ1ZTtcbiAgICB9XG59XG4iXX0=