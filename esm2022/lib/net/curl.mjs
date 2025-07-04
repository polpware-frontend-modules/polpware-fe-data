/**
 * @fileOverview
 * Provides a bunch of utilties on network communication.
 * @name Curl.js
 * @module hypercom/util/Curl
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';
const tools = dependencies.Tools;
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
 * @function loadJsonUriP
 * @param {String} url
 * @returns {Promise}
 */
export function loadJsonUriP(url) {
    const deferred = $.ajax({
        url: url, /* 'lang/options.json', */
        cache: true,
        dataType: 'json'
    });
    return deferred;
}
/**
 * Tests if a url is reachable.
 * @function pingP
 * @param {String} url The url to be tested.
 * @param {Object} [options]  A set of ajax parameters.
 * @returns {Promise}
 */
export function pingP(url, options) {
    options = options || {};
    const ajaxParams = tools.extend({ url: url }, options);
    return $.ajax(ajaxParams);
}
/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @function loadHtmlP
 * @param {String} url
 * @returns {Promise}
 */
export function loadHtmlP(url) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data) {
        /*global DOMParser */
        const doc = new DOMParser().parseFromString(data, 'text/html');
        return $(doc);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BvbHB3YXJlL2ZlLWRhdGEvc3JjL2xpYi9uZXQvY3VybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBRWpDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7QUFFOUI7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxHQUFHO0lBQzVCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEIsR0FBRyxFQUFFLEdBQUcsRUFBRSwwQkFBMEI7UUFDcEMsS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUUsTUFBTTtLQUNuQixDQUFDLENBQUM7SUFDSCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTztJQUM5QixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFHO0lBQ3pCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLFdBQVc7S0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7UUFDakIscUJBQXFCO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvRCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGEgYnVuY2ggb2YgdXRpbHRpZXMgb24gbmV0d29yayBjb21tdW5pY2F0aW9uLlxuICogQG5hbWUgQ3VybC5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS91dGlsL0N1cmxcbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuY29uc3QgdG9vbHMgPSBkZXBlbmRlbmNpZXMuVG9vbHM7XG5cbmNvbnN0ICQgPSBkZXBlbmRlbmNpZXMuanF1ZXJ5O1xuXG4vKipcbiAqIExvYWQgYSBsb2NhbCBqc29uIGZpbGUgZnJvbSB0aGUgZ2l2ZW4gdXJsLlxuICogVGhpcyBtZXRob2QgZW5jYXBzdWxhdGVzIHRoZSBiZWhhdmlvciBvZiBsb2FkaW5nIGEgbG9jYWwganNvblxuICogZmlsZSwgaW4gb3JkZXIgdGhhdCBjaGFuZ2luZyBpdHMgYmVoYXZpb3IgaW4gdGhlIGZ1dHVyZVxuICogd2lsbCBub3QgaW1wYWN0IG90aGVyIG1vZHVsZXMuXG4gKiBXZSBjdXJyZW50bHkgbGVhdmVyYWdlIHRoZSBjYWNoZSBjYXBhYmlsaXR5IG9mIGEgYnJvd3Nlci5cbiAqIEluIHRoZSBmdXR1cmUsIHdlIG1heSB1c2UgbWVtb3J5IGNhY2hlLlxuICogQWxzbyB0aGlzIG1ldGhvZCByZXR1cm5zIGEgcHJvbWlzZSBjb21wYXRpYmxlIHByb2plY3QsIGFuZFxuICogdGhlcmVmb3JlLCBwbGVhc2UgdXNlIFwidGhlblwiIHRvIGdvIGZ1dHVyZS5cbiAqIEBmdW5jdGlvbiBsb2FkSnNvblVyaVBcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEpzb25VcmlQKHVybCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwsIC8qICdsYW5nL29wdGlvbnMuanNvbicsICovXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgdXJsIGlzIHJlYWNoYWJsZS5cbiAqIEBmdW5jdGlvbiBwaW5nUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgdXJsIHRvIGJlIHRlc3RlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gIEEgc2V0IG9mIGFqYXggcGFyYW1ldGVycy5cbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGluZ1AodXJsLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgYWpheFBhcmFtcyA9IHRvb2xzLmV4dGVuZCh7IHVybDogdXJsIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiAkLmFqYXgoYWpheFBhcmFtcyk7XG59XG5cbi8qKlxuICogUmVhZHMgYSB0aGUgcmVzcG9uc2UgZnJvbSBhIGdpdmVuIHVybCBhbmRcbiAqIHBhcnNlcyBpdCBpbnRvIGEganF1ZXJ5IG9iamVjdC5cbiAqIEBmdW5jdGlvbiBsb2FkSHRtbFBcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEh0bWxQKHVybCkge1xuICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YVR5cGU6ICdodG1sIHRleHQnXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8qZ2xvYmFsIERPTVBhcnNlciAqL1xuICAgICAgICBjb25zdCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGRhdGEsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgcmV0dXJuICQoZG9jKTtcbiAgICB9KTtcbn1cbiJdfQ==