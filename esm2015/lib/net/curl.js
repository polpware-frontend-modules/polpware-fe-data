/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Provides a bunch of utilties on network communication.
 * @name Curl.js
 * @module hypercom/util/Curl
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
const tools = dependencies.Tools;
/** @type {?} */
const $ = dependencies.jquery;
/**
 * Load a local json file from the given url.
 * This method encapsulates the behavior of loading a local json
 * file, in order that changing its behavior in the future
 * will not impact other modules.
 * We currently leaverage the cache capability of a browser.
 * In the future, we may use memory cache.
 * Also this method returns a promise compatible project, and
 * therefore, please use "then" to go future.
 * @param {?} url
 * @return {?}
 */
export function loadJsonUriP(url) {
    /** @type {?} */
    const deferred = $.ajax({
        url: url,
        /* 'lang/options.json', */
        cache: true,
        dataType: 'json'
    });
    return deferred;
}
/**
 * Tests if a url is reachable.
 * @param {?} url
 * @param {?} options
 * @return {?}
 */
export function pingP(url, options) {
    options = options || {};
    /** @type {?} */
    const ajaxParams = tools.extend({ url: url }, options);
    return $.ajax(ajaxParams);
}
/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @param {?} url
 * @return {?}
 */
export function loadHtmlP(url) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data) {
        /*global DOMParser */
        /** @type {?} */
        const doc = new DOMParser().parseFromString(data, 'text/html');
        return $(doc);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL25ldC9jdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7O01BRXBELEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSzs7TUFFMUIsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNOzs7Ozs7Ozs7Ozs7O0FBZTdCLE1BQU0sVUFBVSxZQUFZLENBQUMsR0FBRzs7VUFDdEIsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEIsR0FBRyxFQUFFLEdBQUc7O1FBQ1IsS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUUsTUFBTTtLQUNuQixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQzs7Ozs7OztBQVNELE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU87SUFDOUIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O1VBQ2xCLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQztJQUN0RCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQzs7Ozs7OztBQVNELE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBRztJQUN6QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJOzs7Y0FFWCxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztRQUM5RCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGEgYnVuY2ggb2YgdXRpbHRpZXMgb24gbmV0d29yayBjb21tdW5pY2F0aW9uLlxuICogQG5hbWUgQ3VybC5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS91dGlsL0N1cmxcbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuY29uc3QgdG9vbHMgPSBkZXBlbmRlbmNpZXMuVG9vbHM7XG5cbmNvbnN0ICQgPSBkZXBlbmRlbmNpZXMuanF1ZXJ5O1xuXG4vKipcbiAqIExvYWQgYSBsb2NhbCBqc29uIGZpbGUgZnJvbSB0aGUgZ2l2ZW4gdXJsLlxuICogVGhpcyBtZXRob2QgZW5jYXBzdWxhdGVzIHRoZSBiZWhhdmlvciBvZiBsb2FkaW5nIGEgbG9jYWwganNvblxuICogZmlsZSwgaW4gb3JkZXIgdGhhdCBjaGFuZ2luZyBpdHMgYmVoYXZpb3IgaW4gdGhlIGZ1dHVyZVxuICogd2lsbCBub3QgaW1wYWN0IG90aGVyIG1vZHVsZXMuXG4gKiBXZSBjdXJyZW50bHkgbGVhdmVyYWdlIHRoZSBjYWNoZSBjYXBhYmlsaXR5IG9mIGEgYnJvd3Nlci5cbiAqIEluIHRoZSBmdXR1cmUsIHdlIG1heSB1c2UgbWVtb3J5IGNhY2hlLlxuICogQWxzbyB0aGlzIG1ldGhvZCByZXR1cm5zIGEgcHJvbWlzZSBjb21wYXRpYmxlIHByb2plY3QsIGFuZFxuICogdGhlcmVmb3JlLCBwbGVhc2UgdXNlIFwidGhlblwiIHRvIGdvIGZ1dHVyZS5cbiAqIEBmdW5jdGlvbiBsb2FkSnNvblVyaVBcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEpzb25VcmlQKHVybCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwsIC8qICdsYW5nL29wdGlvbnMuanNvbicsICovXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgdXJsIGlzIHJlYWNoYWJsZS5cbiAqIEBmdW5jdGlvbiBwaW5nUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgdXJsIHRvIGJlIHRlc3RlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gIEEgc2V0IG9mIGFqYXggcGFyYW1ldGVycy5cbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGluZ1AodXJsLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgYWpheFBhcmFtcyA9IHRvb2xzLmV4dGVuZCh7IHVybDogdXJsIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiAkLmFqYXgoYWpheFBhcmFtcyk7XG59XG5cbi8qKlxuICogUmVhZHMgYSB0aGUgcmVzcG9uc2UgZnJvbSBhIGdpdmVuIHVybCBhbmRcbiAqIHBhcnNlcyBpdCBpbnRvIGEganF1ZXJ5IG9iamVjdC5cbiAqIEBmdW5jdGlvbiBsb2FkSHRtbFBcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEh0bWxQKHVybCkge1xuICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YVR5cGU6ICdodG1sIHRleHQnXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8qZ2xvYmFsIERPTVBhcnNlciAqL1xuICAgICAgICBjb25zdCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGRhdGEsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgcmV0dXJuICQoZG9jKTtcbiAgICB9KTtcbn1cbiJdfQ==