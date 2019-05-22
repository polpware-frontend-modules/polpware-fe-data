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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL25ldC9jdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFDSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFFakMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUU5Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLEdBQUc7SUFDNUIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNwQixHQUFHLEVBQUUsR0FBRztRQUNSLEtBQUssRUFBRSxJQUFJO1FBQ1gsUUFBUSxFQUFFLE1BQU07S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU87SUFDOUIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDeEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBRztJQUN6QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO1FBQ2pCLHFCQUFxQjtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyBhIGJ1bmNoIG9mIHV0aWx0aWVzIG9uIG5ldHdvcmsgY29tbXVuaWNhdGlvbi5cbiAqIEBuYW1lIEN1cmwuanNcbiAqIEBtb2R1bGUgaHlwZXJjb20vdXRpbC9DdXJsXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmNvbnN0IHRvb2xzID0gZGVwZW5kZW5jaWVzLlRvb2xzO1xuXG5jb25zdCAkID0gZGVwZW5kZW5jaWVzLmpxdWVyeTtcblxuLyoqXG4gKiBMb2FkIGEgbG9jYWwganNvbiBmaWxlIGZyb20gdGhlIGdpdmVuIHVybC5cbiAqIFRoaXMgbWV0aG9kIGVuY2Fwc3VsYXRlcyB0aGUgYmVoYXZpb3Igb2YgbG9hZGluZyBhIGxvY2FsIGpzb25cbiAqIGZpbGUsIGluIG9yZGVyIHRoYXQgY2hhbmdpbmcgaXRzIGJlaGF2aW9yIGluIHRoZSBmdXR1cmVcbiAqIHdpbGwgbm90IGltcGFjdCBvdGhlciBtb2R1bGVzLlxuICogV2UgY3VycmVudGx5IGxlYXZlcmFnZSB0aGUgY2FjaGUgY2FwYWJpbGl0eSBvZiBhIGJyb3dzZXIuXG4gKiBJbiB0aGUgZnV0dXJlLCB3ZSBtYXkgdXNlIG1lbW9yeSBjYWNoZS5cbiAqIEFsc28gdGhpcyBtZXRob2QgcmV0dXJucyBhIHByb21pc2UgY29tcGF0aWJsZSBwcm9qZWN0LCBhbmRcbiAqIHRoZXJlZm9yZSwgcGxlYXNlIHVzZSBcInRoZW5cIiB0byBnbyBmdXR1cmUuXG4gKiBAZnVuY3Rpb24gbG9hZEpzb25VcmlQXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRKc29uVXJpUCh1cmwpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9ICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLCAvKiAnbGFuZy9vcHRpb25zLmpzb24nLCAqL1xuICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pO1xuICAgIHJldHVybiBkZWZlcnJlZDtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIHVybCBpcyByZWFjaGFibGUuXG4gKiBAZnVuY3Rpb24gcGluZ1BcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIHVybCB0byBiZSB0ZXN0ZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdICBBIHNldCBvZiBhamF4IHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpbmdQKHVybCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGFqYXhQYXJhbXMgPSB0b29scy5leHRlbmQoeyB1cmw6IHVybCB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gJC5hamF4KGFqYXhQYXJhbXMpO1xufVxuXG4vKipcbiAqIFJlYWRzIGEgdGhlIHJlc3BvbnNlIGZyb20gYSBnaXZlbiB1cmwgYW5kXG4gKiBwYXJzZXMgaXQgaW50byBhIGpxdWVyeSBvYmplY3QuXG4gKiBAZnVuY3Rpb24gbG9hZEh0bWxQXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIdG1sUCh1cmwpIHtcbiAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGRhdGFUeXBlOiAnaHRtbCB0ZXh0J1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvKmdsb2JhbCBET01QYXJzZXIgKi9cbiAgICAgICAgY29uc3QgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhkYXRhLCAndGV4dC9odG1sJyk7XG4gICAgICAgIHJldHVybiAkKGRvYyk7XG4gICAgfSk7XG59XG4iXX0=