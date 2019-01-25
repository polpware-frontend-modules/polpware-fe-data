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
import * as tools from 'polpware-tinymce-tailor/src/util/Tools';
/** @type {?} */
var $ = dependencies.jquery;
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
    var deferred = $.ajax({
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
    var ajaxParams = tools.extend({ url: url }, options);
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
        var doc = new DOMParser().parseFromString(data, 'text/html');
        return $(doc);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL25ldC9jdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxLQUFLLEtBQUssTUFBTSx3Q0FBd0MsQ0FBQzs7SUFFMUQsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNOzs7Ozs7Ozs7Ozs7O0FBZTdCLE1BQU0sVUFBVSxZQUFZLENBQUMsR0FBRzs7UUFDdEIsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEIsR0FBRyxFQUFFLEdBQUc7O1FBQ1IsS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUUsTUFBTTtLQUNuQixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQzs7Ozs7OztBQVNELE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU87SUFDOUIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O1FBQ2xCLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQztJQUN0RCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQzs7Ozs7OztBQVNELE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBRztJQUN6QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJOzs7WUFFWCxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztRQUM5RCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGEgYnVuY2ggb2YgdXRpbHRpZXMgb24gbmV0d29yayBjb21tdW5pY2F0aW9uLlxuICogQG5hbWUgQ3VybC5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS91dGlsL0N1cmxcbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJ3BvbHB3YXJlLXRpbnltY2UtdGFpbG9yL3NyYy91dGlsL1Rvb2xzJztcblxuY29uc3QgJCA9IGRlcGVuZGVuY2llcy5qcXVlcnk7XG5cbi8qKlxuICogTG9hZCBhIGxvY2FsIGpzb24gZmlsZSBmcm9tIHRoZSBnaXZlbiB1cmwuXG4gKiBUaGlzIG1ldGhvZCBlbmNhcHN1bGF0ZXMgdGhlIGJlaGF2aW9yIG9mIGxvYWRpbmcgYSBsb2NhbCBqc29uXG4gKiBmaWxlLCBpbiBvcmRlciB0aGF0IGNoYW5naW5nIGl0cyBiZWhhdmlvciBpbiB0aGUgZnV0dXJlXG4gKiB3aWxsIG5vdCBpbXBhY3Qgb3RoZXIgbW9kdWxlcy5cbiAqIFdlIGN1cnJlbnRseSBsZWF2ZXJhZ2UgdGhlIGNhY2hlIGNhcGFiaWxpdHkgb2YgYSBicm93c2VyLlxuICogSW4gdGhlIGZ1dHVyZSwgd2UgbWF5IHVzZSBtZW1vcnkgY2FjaGUuXG4gKiBBbHNvIHRoaXMgbWV0aG9kIHJldHVybnMgYSBwcm9taXNlIGNvbXBhdGlibGUgcHJvamVjdCwgYW5kXG4gKiB0aGVyZWZvcmUsIHBsZWFzZSB1c2UgXCJ0aGVuXCIgdG8gZ28gZnV0dXJlLlxuICogQGZ1bmN0aW9uIGxvYWRKc29uVXJpUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSnNvblVyaVAodXJsKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCwgLyogJ2xhbmcvb3B0aW9ucy5qc29uJywgKi9cbiAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgYSB1cmwgaXMgcmVhY2hhYmxlLlxuICogQGZ1bmN0aW9uIHBpbmdQXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSB1cmwgdG8gYmUgdGVzdGVkLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAgQSBzZXQgb2YgYWpheCBwYXJhbWV0ZXJzLlxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaW5nUCh1cmwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBhamF4UGFyYW1zID0gdG9vbHMuZXh0ZW5kKHsgdXJsOiB1cmwgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICQuYWpheChhamF4UGFyYW1zKTtcbn1cblxuLyoqXG4gKiBSZWFkcyBhIHRoZSByZXNwb25zZSBmcm9tIGEgZ2l2ZW4gdXJsIGFuZFxuICogcGFyc2VzIGl0IGludG8gYSBqcXVlcnkgb2JqZWN0LlxuICogQGZ1bmN0aW9uIGxvYWRIdG1sUFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSHRtbFAodXJsKSB7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhVHlwZTogJ2h0bWwgdGV4dCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLypnbG9iYWwgRE9NUGFyc2VyICovXG4gICAgICAgIGNvbnN0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoZGF0YSwgJ3RleHQvaHRtbCcpO1xuICAgICAgICByZXR1cm4gJChkb2MpO1xuICAgIH0pO1xufVxuIl19