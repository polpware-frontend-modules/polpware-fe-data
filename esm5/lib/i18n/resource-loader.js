/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a Resources class.
 * With this class, you may configure a bunch of resources
 * accessible from global URIs, such as URLs.
 * Once the requested resources are loaded, they may be
 * cached in the memory.
 * Note that the resources are expected to be organized in
 * a common namespace hierarchy.
 * E.g.,
 * x.y.z corresponds to a json resource like:
 *    {
 *       y: {
 *             z: 112
 *          }
 *    }
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as externalInterface from '@polpware/fe-dependencies';
import { lift } from '@polpware/fe-utilities';
import { loadJsonUriP } from '../net/curl';
/** @type {?} */
var _ = externalInterface.underscore;
/** @type {?} */
var isString = _.isString;
/**
 * Retrieves a value from a variable by a given namespace nested structure.
 * @template T
 * @param {?} repo
 * @param {?} identifiers
 * @param {?=} startLevel
 * @return {?}
 */
function getByNamespace(repo, identifiers, startLevel) {
    if (startLevel === void 0) { startLevel = 1; }
    /** @type {?} */
    var restIdentifiers = identifiers.slice(startLevel);
    /** @type {?} */
    var restKey = restIdentifiers.join('.');
    if (repo[restKey]) {
        return repo[restKey];
    }
    /** @type {?} */
    var initRepo = repo;
    for (var index = startLevel; index < identifiers.length; index++) {
        if (!initRepo) {
            break;
        }
        /** @type {?} */
        var key = identifiers[index];
        initRepo = initRepo[key];
    }
    return initRepo;
}
/**
 * @record
 */
function IConfigurationEntry() { }
if (false) {
    /** @type {?} */
    IConfigurationEntry.prototype.uri;
    /** @type {?} */
    IConfigurationEntry.prototype.liveSeconds;
}
var ResourceLoader = /** @class */ (function () {
    /**
     * Constructor
     * @function init
     */
    function ResourceLoader(_cache) {
        if (_cache === void 0) { _cache = null; }
        this._cache = _cache;
        this._configuration = {};
    }
    /**
     * Configure a resource
     * @function register
     * @param {String} key The resource key.
     * @param {String} uri The resource URI.
     * @param {Number} liveSeconds The cache period.
     * @throws {Error}
     */
    /**
     * Configure a resource
     * @throws {Error}
     * @param {?} key
     * @param {?} uri
     * @param {?=} liveSeconds
     * @return {?}
     */
    ResourceLoader.prototype.register = /**
     * Configure a resource
     * @throws {Error}
     * @param {?} key
     * @param {?} uri
     * @param {?=} liveSeconds
     * @return {?}
     */
    function (key, uri, liveSeconds) {
        if (liveSeconds === void 0) { liveSeconds = 60; }
        /** @type {?} */
        var configuration = this._configuration;
        if (configuration[key]) {
            throw new Error('Registering an existing resource key: ' + key);
        }
        configuration[key] = {
            uri: uri,
            liveSeconds: liveSeconds
        };
    };
    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    /**
     * Removes a registered item
     * @param {?} key
     * @return {?}
     */
    ResourceLoader.prototype.undoRegister = /**
     * Removes a registered item
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var configuration = this._configuration;
        if (configuration[key]) {
            delete configuration[key];
        }
    };
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    /**
     * Returns a promise for the resource key.
     * @throws {Error}
     * @template T
     * @param {?} fullyQualifiedNamespace
     * @param {?} convertor
     * @return {?}
     */
    ResourceLoader.prototype.getPromise = /**
     * Returns a promise for the resource key.
     * @throws {Error}
     * @template T
     * @param {?} fullyQualifiedNamespace
     * @param {?} convertor
     * @return {?}
     */
    function (fullyQualifiedNamespace, convertor) {
        /** @type {?} */
        var identifiers = fullyQualifiedNamespace.split('.');
        /** @type {?} */
        var topIdentifier = identifiers[0];
        /** @type {?} */
        var cache = this._cache;
        if (cache) {
            // Figure out the master key
            /** @type {?} */
            var repo = cache.get(topIdentifier, 60);
            if (repo) {
                /** @type {?} */
                var value = getByNamespace(repo, identifiers);
                if (value) {
                    // Return a promise
                    return lift(value, null);
                }
            }
        }
        /** @type {?} */
        var entry = this._configuration[topIdentifier];
        if (!entry) {
            throw new Error('Get unregistered resource: ' + topIdentifier);
        }
        // Otherwise, load it
        return loadJsonUriP(entry.uri).then(function (content) {
            content = convertor(content);
            // Cache the new value
            if (cache) {
                cache.set(topIdentifier, content, entry.liveSeconds);
            }
            return getByNamespace(content, identifiers);
        });
    };
    return ResourceLoader;
}());
export { ResourceLoader };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ResourceLoader.prototype._configuration;
    /**
     * @type {?}
     * @private
     */
    ResourceLoader.prototype._cache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtbG9hZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvaTE4bi9yZXNvdXJjZS1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBVyxJQUFJLEVBQVcsTUFBTSx3QkFBd0IsQ0FBQztBQUloRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDOztJQUdyQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsVUFBVTs7SUFDaEMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFROzs7Ozs7Ozs7QUFXM0IsU0FBUyxjQUFjLENBQUksSUFBMEIsRUFDakQsV0FBMEIsRUFDMUIsVUFBc0I7SUFBdEIsMkJBQUEsRUFBQSxjQUFzQjs7UUFFaEIsZUFBZSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDOztRQUMvQyxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDekMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4Qjs7UUFFRyxRQUFRLEdBQVEsSUFBSTtJQUN4QixLQUFLLElBQUksS0FBSyxHQUFHLFVBQVUsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM5RCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsTUFBTTtTQUNUOztZQUNLLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQzlCLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUI7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDOzs7O0FBRUQsa0NBR0M7OztJQUZHLGtDQUFZOztJQUNaLDBDQUFvQjs7QUFNeEI7SUFJSTs7O09BR0c7SUFDSCx3QkFBb0IsTUFBdUM7UUFBdkMsdUJBQUEsRUFBQSxhQUF1QztRQUF2QyxXQUFNLEdBQU4sTUFBTSxDQUFpQztRQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRzs7Ozs7Ozs7O0lBQ0gsaUNBQVE7Ozs7Ozs7O0lBQVIsVUFBUyxHQUFXLEVBQUUsR0FBVyxFQUFFLFdBQXdCO1FBQXhCLDRCQUFBLEVBQUEsZ0JBQXdCOztZQUNqRCxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWM7UUFDekMsSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNuRTtRQUNELGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRztZQUNqQixHQUFHLEVBQUUsR0FBRztZQUNSLFdBQVcsRUFBRSxXQUFXO1NBQzNCLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7O0lBQ0gscUNBQVk7Ozs7O0lBQVosVUFBYSxHQUFXOztZQUNkLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYztRQUN6QyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFDRDs7Ozs7O09BTUc7Ozs7Ozs7OztJQUNILG1DQUFVOzs7Ozs7OztJQUFWLFVBQWMsdUJBQStCLEVBQ3pDLFNBQXVCOztZQUNqQixXQUFXLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7WUFDaEQsYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7O1lBQzlCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTTtRQUN6QixJQUFJLEtBQUssRUFBRTs7O2dCQUVELElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxJQUFJLEVBQUU7O29CQUNBLEtBQUssR0FBRyxjQUFjLENBQUksSUFBSSxFQUFFLFdBQVcsQ0FBQztnQkFDbEQsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsbUJBQW1CO29CQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzVCO2FBQ0o7U0FDSjs7WUFFSyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsYUFBYSxDQUFDLENBQUM7U0FDbEU7UUFFRCxxQkFBcUI7UUFDckIsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87WUFDeEMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixzQkFBc0I7WUFDdEIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN4RDtZQUNELE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUFqRkQsSUFpRkM7Ozs7Ozs7SUEvRUcsd0NBQStEOzs7OztJQU1uRCxnQ0FBK0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgYSBSZXNvdXJjZXMgY2xhc3MuXG4gKiBXaXRoIHRoaXMgY2xhc3MsIHlvdSBtYXkgY29uZmlndXJlIGEgYnVuY2ggb2YgcmVzb3VyY2VzXG4gKiBhY2Nlc3NpYmxlIGZyb20gZ2xvYmFsIFVSSXMsIHN1Y2ggYXMgVVJMcy5cbiAqIE9uY2UgdGhlIHJlcXVlc3RlZCByZXNvdXJjZXMgYXJlIGxvYWRlZCwgdGhleSBtYXkgYmVcbiAqIGNhY2hlZCBpbiB0aGUgbWVtb3J5LlxuICogTm90ZSB0aGF0IHRoZSByZXNvdXJjZXMgYXJlIGV4cGVjdGVkIHRvIGJlIG9yZ2FuaXplZCBpblxuICogYSBjb21tb24gbmFtZXNwYWNlIGhpZXJhcmNoeS5cbiAqIEUuZy4sXG4gKiB4LnkueiBjb3JyZXNwb25kcyB0byBhIGpzb24gcmVzb3VyY2UgbGlrZTpcbiAqICAgIHtcbiAqICAgICAgIHk6IHtcbiAqICAgICAgICAgICAgIHo6IDExMlxuICogICAgICAgICAgfVxuICogICAgfVxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuXG5cbmltcG9ydCAqIGFzIGV4dGVybmFsSW50ZXJmYWNlIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgcmVwbGFjZSwgbGlmdCwgY29udmVydCB9IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5pbXBvcnQgeyBJU2xpZGluZ0V4cGlyZUNhY2hlIH0gZnJvbSAnLi4vY2FjaGUvc2xpZGluZy1leHBpcmUtY2FjaGUuaW50ZXJmYWNlJztcblxuaW1wb3J0IHsgbG9hZEpzb25VcmlQIH0gZnJvbSAnLi4vbmV0L2N1cmwnO1xuXG5cbmNvbnN0IF8gPSBleHRlcm5hbEludGVyZmFjZS51bmRlcnNjb3JlO1xuY29uc3QgaXNTdHJpbmcgPSBfLmlzU3RyaW5nO1xuXG5cbi8qKlxuICogUmV0cmlldmVzIGEgdmFsdWUgZnJvbSBhIHZhcmlhYmxlIGJ5IGEgZ2l2ZW4gbmFtZXNwYWNlIG5lc3RlZCBzdHJ1Y3R1cmUuXG4gKiBAZnVuY3Rpb24gZ2V0QnlOYW1lc3BhY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXBvXG4gKiBAcGFyYW0geyp9IGZ1bGx5UXVhbGlmaWVkTmFtZXNwYWNlIEEgc3RyaW5nIG9yIGFuIGFycnkgb2Ygc3RyaW5nIGRlZmluaW5nIHRoZSBuYW1lc3BhY2UuXG4gKiBAcGFyYW0ge051bWJlcn1bXSBzdGFydExldmVsXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gZ2V0QnlOYW1lc3BhY2U8VD4ocmVwbzogeyBba2V5OiBzdHJpbmddOiBUIH0sXG4gICAgaWRlbnRpZmllcnM6IEFycmF5PHN0cmluZz4sXG4gICAgc3RhcnRMZXZlbDogbnVtYmVyID0gMSk6IFQge1xuXG4gICAgY29uc3QgcmVzdElkZW50aWZpZXJzID0gaWRlbnRpZmllcnMuc2xpY2Uoc3RhcnRMZXZlbCk7XG4gICAgY29uc3QgcmVzdEtleSA9IHJlc3RJZGVudGlmaWVycy5qb2luKCcuJyk7XG4gICAgaWYgKHJlcG9bcmVzdEtleV0pIHtcbiAgICAgICAgcmV0dXJuIHJlcG9bcmVzdEtleV07XG4gICAgfVxuXG4gICAgbGV0IGluaXRSZXBvOiBhbnkgPSByZXBvO1xuICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRMZXZlbDsgaW5kZXggPCBpZGVudGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgaWYgKCFpbml0UmVwbykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2V5ID0gaWRlbnRpZmllcnNbaW5kZXhdO1xuICAgICAgICBpbml0UmVwbyA9IGluaXRSZXBvW2tleV07XG4gICAgfVxuICAgIHJldHVybiBpbml0UmVwbztcbn1cblxuaW50ZXJmYWNlIElDb25maWd1cmF0aW9uRW50cnkge1xuICAgIHVyaTogc3RyaW5nO1xuICAgIGxpdmVTZWNvbmRzOiBudW1iZXI7XG59XG5cbi8qKlxuICogQGNsYXNzIFJlc291cmNlc1xuICovXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VMb2FkZXIge1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogeyBba2V5OiBzdHJpbmddOiBJQ29uZmlndXJhdGlvbkVudHJ5IH07XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIEBmdW5jdGlvbiBpbml0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2FjaGU6IElTbGlkaW5nRXhwaXJlQ2FjaGU8YW55PiA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyZSBhIHJlc291cmNlXG4gICAgICogQGZ1bmN0aW9uIHJlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgcmVzb3VyY2Uga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmkgVGhlIHJlc291cmNlIFVSSS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGl2ZVNlY29uZHMgVGhlIGNhY2hlIHBlcmlvZC5cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICByZWdpc3RlcihrZXk6IHN0cmluZywgdXJpOiBzdHJpbmcsIGxpdmVTZWNvbmRzOiBudW1iZXIgPSA2MCkge1xuICAgICAgICBjb25zdCBjb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlndXJhdGlvbjtcbiAgICAgICAgaWYgKGNvbmZpZ3VyYXRpb25ba2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWdpc3RlcmluZyBhbiBleGlzdGluZyByZXNvdXJjZSBrZXk6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZ3VyYXRpb25ba2V5XSA9IHtcbiAgICAgICAgICAgIHVyaTogdXJpLFxuICAgICAgICAgICAgbGl2ZVNlY29uZHM6IGxpdmVTZWNvbmRzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHJlZ2lzdGVyZWQgaXRlbVxuICAgICAqIEBmdW5jdGlvbiB1bmRvUmVnaXN0ZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSByZXNvdXJjZSBrZXkgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICB1bmRvUmVnaXN0ZXIoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbiA9IHRoaXMuX2NvbmZpZ3VyYXRpb247XG4gICAgICAgIGlmIChjb25maWd1cmF0aW9uW2tleV0pIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWd1cmF0aW9uW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXNvdXJjZSBrZXkuXG4gICAgICogQGZ1bmN0aW9uIGdldFByb21pc2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVsbHlRdWFsaWZpZWROYW1lc3BhY2UgVGhlIHJlc291cmNlIGtleS5cbiAgICAgKiBAcmV0dXJucyB7Kn0gVGhlIHJlc291cmNlIHZhbHVlLlxuICAgICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgICAqL1xuICAgIGdldFByb21pc2U8VD4oZnVsbHlRdWFsaWZpZWROYW1lc3BhY2U6IHN0cmluZyxcbiAgICAgICAgY29udmVydG9yOiAoYW55KSA9PiBhbnkpOiBQcm9taXNlTGlrZTxUPiB7XG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXJzID0gZnVsbHlRdWFsaWZpZWROYW1lc3BhY2Uuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgdG9wSWRlbnRpZmllciA9IGlkZW50aWZpZXJzWzBdO1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuX2NhY2hlO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgdGhlIG1hc3RlciBrZXlcbiAgICAgICAgICAgIGNvbnN0IHJlcG8gPSBjYWNoZS5nZXQodG9wSWRlbnRpZmllciwgNjApO1xuICAgICAgICAgICAgaWYgKHJlcG8pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldEJ5TmFtZXNwYWNlPFQ+KHJlcG8sIGlkZW50aWZpZXJzKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlmdCh2YWx1ZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9jb25maWd1cmF0aW9uW3RvcElkZW50aWZpZXJdO1xuICAgICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dldCB1bnJlZ2lzdGVyZWQgcmVzb3VyY2U6ICcgKyB0b3BJZGVudGlmaWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgbG9hZCBpdFxuICAgICAgICByZXR1cm4gbG9hZEpzb25VcmlQKGVudHJ5LnVyaSkudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgY29udGVudCA9IGNvbnZlcnRvcihjb250ZW50KTtcbiAgICAgICAgICAgIC8vIENhY2hlIHRoZSBuZXcgdmFsdWVcbiAgICAgICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgICAgIGNhY2hlLnNldCh0b3BJZGVudGlmaWVyLCBjb250ZW50LCBlbnRyeS5saXZlU2Vjb25kcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2V0QnlOYW1lc3BhY2UoY29udGVudCwgaWRlbnRpZmllcnMpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=