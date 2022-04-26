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
        url: url,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BvbHB3YXJlL2ZlLWRhdGEvc3JjL2xpYi9uZXQvY3VybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBRWpDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7QUFFOUI7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxHQUFHO0lBQzVCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEIsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUUsSUFBSTtRQUNYLFFBQVEsRUFBRSxNQUFNO0tBQ25CLENBQUMsQ0FBQztJQUNILE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPO0lBQzlCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLEdBQUc7SUFDekIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUFRLEVBQUUsV0FBVztLQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtRQUNqQixxQkFBcUI7UUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgYSBidW5jaCBvZiB1dGlsdGllcyBvbiBuZXR3b3JrIGNvbW11bmljYXRpb24uXG4gKiBAbmFtZSBDdXJsLmpzXG4gKiBAbW9kdWxlIGh5cGVyY29tL3V0aWwvQ3VybFxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5jb25zdCB0b29scyA9IGRlcGVuZGVuY2llcy5Ub29scztcblxuY29uc3QgJCA9IGRlcGVuZGVuY2llcy5qcXVlcnk7XG5cbi8qKlxuICogTG9hZCBhIGxvY2FsIGpzb24gZmlsZSBmcm9tIHRoZSBnaXZlbiB1cmwuXG4gKiBUaGlzIG1ldGhvZCBlbmNhcHN1bGF0ZXMgdGhlIGJlaGF2aW9yIG9mIGxvYWRpbmcgYSBsb2NhbCBqc29uXG4gKiBmaWxlLCBpbiBvcmRlciB0aGF0IGNoYW5naW5nIGl0cyBiZWhhdmlvciBpbiB0aGUgZnV0dXJlXG4gKiB3aWxsIG5vdCBpbXBhY3Qgb3RoZXIgbW9kdWxlcy5cbiAqIFdlIGN1cnJlbnRseSBsZWF2ZXJhZ2UgdGhlIGNhY2hlIGNhcGFiaWxpdHkgb2YgYSBicm93c2VyLlxuICogSW4gdGhlIGZ1dHVyZSwgd2UgbWF5IHVzZSBtZW1vcnkgY2FjaGUuXG4gKiBBbHNvIHRoaXMgbWV0aG9kIHJldHVybnMgYSBwcm9taXNlIGNvbXBhdGlibGUgcHJvamVjdCwgYW5kXG4gKiB0aGVyZWZvcmUsIHBsZWFzZSB1c2UgXCJ0aGVuXCIgdG8gZ28gZnV0dXJlLlxuICogQGZ1bmN0aW9uIGxvYWRKc29uVXJpUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSnNvblVyaVAodXJsKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCwgLyogJ2xhbmcvb3B0aW9ucy5qc29uJywgKi9cbiAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgYSB1cmwgaXMgcmVhY2hhYmxlLlxuICogQGZ1bmN0aW9uIHBpbmdQXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSB1cmwgdG8gYmUgdGVzdGVkLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAgQSBzZXQgb2YgYWpheCBwYXJhbWV0ZXJzLlxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaW5nUCh1cmwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBhamF4UGFyYW1zID0gdG9vbHMuZXh0ZW5kKHsgdXJsOiB1cmwgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICQuYWpheChhamF4UGFyYW1zKTtcbn1cblxuLyoqXG4gKiBSZWFkcyBhIHRoZSByZXNwb25zZSBmcm9tIGEgZ2l2ZW4gdXJsIGFuZFxuICogcGFyc2VzIGl0IGludG8gYSBqcXVlcnkgb2JqZWN0LlxuICogQGZ1bmN0aW9uIGxvYWRIdG1sUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSHRtbFAodXJsKSB7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhVHlwZTogJ2h0bWwgdGV4dCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLypnbG9iYWwgRE9NUGFyc2VyICovXG4gICAgICAgIGNvbnN0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoZGF0YSwgJ3RleHQvaHRtbCcpO1xuICAgICAgICByZXR1cm4gJChkb2MpO1xuICAgIH0pO1xufVxuIl19