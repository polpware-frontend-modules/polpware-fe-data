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
const $ = dependencies.jquery;
const defaultAntiForgeryKey = '__RequestVerificationToken';
const defaultElementTag = '';
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
        let doc, token, elm;
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
export class AntiForgeryKeyPolicy extends PolicyBase {
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    constructor(settings) {
        super(settings);
        this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        this._elementTag = settings.elementTag || defaultElementTag;
        this._expired = true;
    }
    isExpired() {
        return this._expired;
    }
    inputField() {
        return 'input[name="' + this._antiForgeryKey + '"]';
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    readFrom(settings) {
        this.token = settings.token;
    }
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    persistent() {
        return {
            token: this.token
        };
    }
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
    getTokenInternal() {
        const ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        const p = liftWithGuard(ret, function (token) {
            const isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    }
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    applyTo(options) {
        const data = options.data;
        data[this._antiForgeryKey] = this.token;
    }
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    applyToV2(options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    }
    // TODO:
    applyToV3(options) {
    }
    /**
     * Resets the token and expired flag
     * @function reset
     */
    reset() {
        super.reset();
        this._expired = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW50aWZvcmdlcnlrZXktcG9saWN5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvYW50aWZvcmdlcnlrZXktcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSXZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUM5QixNQUFNLHFCQUFxQixHQUFHLDRCQUE0QixDQUFDO0FBQzNELE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTdCOzs7R0FHRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsR0FBVyxFQUFFLFVBQWtCLEVBQUUsVUFBa0I7SUFDekUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUFRLEVBQUUsV0FBVztLQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtRQUNqQixxQkFBcUI7UUFDckIsSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUNwQixLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RCxJQUFJLFVBQVUsRUFBRTtZQUNaLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hCLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxD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RyxJQUFJLENBQUM7SUFDekIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyB0aGUgYW50aS1mb3JnZXJ5IHNlY3VyaXR5IHBvbGljeS5cbiAqIEBuYW1lIEFudGlGb3JnZXJ5S2V5UG9saWN5LmpzXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IGxpZnRXaXRoR3VhcmQgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgSUFudGlGb3JnZXJ5S2V5Q3Rvck9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5pbXBvcnQgeyBQb2xpY3lCYXNlIH0gZnJvbSAnLi9wb2xpY3ktYmFzZSc7XG5cbmNvbnN0ICQgPSBkZXBlbmRlbmNpZXMuanF1ZXJ5O1xuY29uc3QgZGVmYXVsdEFudGlGb3JnZXJ5S2V5ID0gJ19fUmVxdWVzdFZlcmlmaWNhdGlvblRva2VuJztcbmNvbnN0IGRlZmF1bHRFbGVtZW50VGFnID0gJyc7XG5cbi8qXG4gPGlucHV0IG5hbWU9XCJfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlblwiIHR5cGU9XCJoaWRkZW5cIlxuIHZhbHVlPVwiSjhrbDZ3N0thQkF0ZUtPUGVIVzFJbEc5UlM3YWJDa2J2UWYyR3dCbE1WWlpPWDlGRi1CaGM1bVltcVh3NHFlME1McmF1Y1F0S0MtVEFWaDFySkVaMFNEZmVMZnFwLUw1SnJ0aElNOVYwZ3A3Ni1qblZ6OUotcmRZRmhWZVRUNFkwXCI+XG4gKi9cbmZ1bmN0aW9uIGdldFRva2VuSW50ZXJuYWwodXJsOiBzdHJpbmcsIGVsZW1lbnRUYWc6IHN0cmluZywgaW5wdXRGaWVsZDogc3RyaW5nKTogUHJvbWlzZUxpa2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLCAvLyBBIHBhZ2UgY29udGFpbmluZyByZXF1aXJlZCB0b2tlbnNcbiAgICAgICAgZGF0YVR5cGU6ICdodG1sIHRleHQnXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8qZ2xvYmFsIERPTVBhcnNlciAqL1xuICAgICAgICBsZXQgZG9jLCB0b2tlbiwgZWxtO1xuICAgICAgICB0b2tlbiA9ICcnO1xuICAgICAgICBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGRhdGEsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgaWYgKGVsZW1lbnRUYWcpIHtcbiAgICAgICAgICAgIGVsbSA9ICQoZG9jKS5maW5kKGVsZW1lbnRUYWcpO1xuICAgICAgICAgICAgaWYgKGVsbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZWxtID0gJChkb2MpLmZpbmQoaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGVsbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsbSA9IGVsbS5lcSgwKTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBlbG0uYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbG0gPSAkKGRvYykuZmluZChpbnB1dEZpZWxkKTtcbiAgICAgICAgICAgIGlmIChlbG0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGVsbSA9IGVsbS5lcSgwKTtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGVsbS5hdHRyKCd2YWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGNsYXNzIEFudGlGb3JnZXJ5S2V5UG9saWN5IGV4dGVuZHMgUG9saWN5QmFzZSB7XG5cbiAgICBwcml2YXRlIF9hbnRpRm9yZ2VyeUtleTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VsZW1lbnRUYWc6IHN0cmluZztcbiAgICBwcml2YXRlIF9leHBpcmVkOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yIEFudGlGb3JnZXJ5S2V5UG9saWN5XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gQSBzZXQgb2Ygc2V0dGluZ3MuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IElBbnRpRm9yZ2VyeUtleUN0b3JPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5fYW50aUZvcmdlcnlLZXkgPVxuICAgICAgICAgICAgc2V0dGluZ3MuYW50aUZvcmdlcnlLZXkgfHwgZGVmYXVsdEFudGlGb3JnZXJ5S2V5O1xuICAgICAgICB0aGlzLl9lbGVtZW50VGFnID0gc2V0dGluZ3MuZWxlbWVudFRhZyB8fCBkZWZhdWx0RWxlbWVudFRhZztcbiAgICAgICAgdGhpcy5fZXhwaXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaXNFeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhwaXJlZDtcbiAgICB9XG5cbiAgICBpbnB1dEZpZWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnaW5wdXRbbmFtZT1cIicgKyB0aGlzLl9hbnRpRm9yZ2VyeUtleSArICdcIl0nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlZWRzIHRoZSBwb2xpY3kgd2l0aCBzb21lIHNldHRpbmdzIGZyb20gb3V0c2lkZSxcbiAgICAgKiB1c3VhbGx5IGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAqIEBmdW5jdGlvbiByZWFkRnJvbVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgcmVhZEZyb20oc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHNldHRpbmdzLnRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdCB0aGF0IGFyZSBwZXJzaXN0ZW50YWJsZS5cbiAgICAgKiBAZnVuY3Rpb24gcGVyc2lzdGVudFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgcGVyc2lzdGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLnRva2VuXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYW50aS1mb3JnZXJ5IHRva2VuIGZyb20gdGhlIGdpdmVuIHVybFxuICAgICAqIG9yIHRoZSBpbnN0YW5jZSB1cmwuXG4gICAgICogQGZ1bmN0aW9uIGdldFRva2VuUFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfVt1cmxdIFRoZSBVUkwgd2hlcmUgdGhlIHJlc3BvbnNlIGZyb20gaXQgbWF5IGNvbnRhaW5cbiAgICAgKiB0aGUgYW50aS1mb3JnZXJ5IHRva2VuOyBpdCBpcyBvcHRpb25hbCBhbmQgdXNlZCB3aGVuIHlvdSB3YW50IHRvXG4gICAgICogb3ZlcndyaXRlIHRoZSBpbnN0YW5jZSB1cmwuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHRocm93cyB7fVxuICAgICAqL1xuICAgIGdldFRva2VuSW50ZXJuYWwoKTogUHJvbWlzZUxpa2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldFRva2VuSW50ZXJuYWwodGhpcy51cmwsIHRoaXMuX2VsZW1lbnRUYWcsIHRoaXMuaW5wdXRGaWVsZCgpKTtcbiAgICAgICAgY29uc3QgcCA9IGxpZnRXaXRoR3VhcmQocmV0LCBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgICAgY29uc3QgaXNHb29kVG9rZW4gPSB0b2tlbiAmJiB0b2tlbi5sZW5ndGggPiAwO1xuICAgICAgICAgICAgdGhpcy5fZXhwaXJlZCA9ICFpc0dvb2RUb2tlbjtcbiAgICAgICAgICAgIHJldHVybiBpc0dvb2RUb2tlbjtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbHlzIHRoZSBhbnRpLWZvcmdlcnkga2V5IGFuZCBpdHMgdmFsdWUgdG8gdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgICogQGZ1bmN0aW9uIGFwcGx5XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gYmUgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBhcHBseVRvKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgICAgZGF0YVt0aGlzLl9hbnRpRm9yZ2VyeUtleV0gPSB0aGlzLnRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHNlY3VyaXR5IHBvbGljeSB0byB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKiBAZnVuY3Rpb24gYXBwbHlUb1YyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBwYXJhbXMgZmllbGQgaXMgZXhwZWN0ZWQuXG4gICAgICovXG4gICAgYXBwbHlUb1YyKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5wYXJhbXNbdGhpcy5fYW50aUZvcmdlcnlLZXldID0gdGhpcy50b2tlbjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOlxuICAgIGFwcGx5VG9WMyhvcHRpb25zKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSB0b2tlbiBhbmQgZXhwaXJlZCBmbGFnXG4gICAgICogQGZ1bmN0aW9uIHJlc2V0XG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX2V4cGlyZWQgPSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==