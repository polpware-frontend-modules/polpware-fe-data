/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time.
 */
/*jslint unparam: true */
import * as dependencies from '@polpware/fe-dependencies';
import { urlEncode } from '@polpware/fe-utilities';
import { SlidingExpirationCache } from '../cache/sliding-expiration-cache';
import { mountSyncBeforeAdvice, mountAjaxBeforeAdvice, mountSyncAroundAdvice } from './event-hub';
var DataFlow = dependencies['dataflow'];
var backbone = dependencies['backbone'];
var _ = dependencies.underscore;
/**
 * The endpoint types for a backend service.
 */
export var endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 */
export var syncMethodEnum = {
    /**
     * Fetch a model or a collection.
     */
    read: 'read',
    /**
     * Save a model.
     */
    create: 'create',
    patch: 'patch',
    update: 'update',
    /**
     * Destroy a model
     */
    delete: 'delete'
};
var globalConfigurationMapping = {};
var mountedFeatureRemovers = [];
// Idempotent
// Instance once ...
function mountFeatures() {
    if (mountedFeatureRemovers.length > 0) {
        return;
    }
    /*jslint unparam: true */
    /*
      eventHub.mountSyncListener(function (method, model, response, options) {
      // Ignore other method
      if (method !== 'sync') {
      return;
      }
      if (options.endPointKey && options.methodKey) {
      var dataflow = self._dataflow,
      key = options.endPointKey + ':' + options.methodKey;
      dataflow[key] = dataflow[key] + 1;
      }
      }); */
    var remover = mountSyncBeforeAdvice(function (method, model, options) {
        options.methodKey = method;
        options.endPointKey = model.endPointKey || (model.collection ? model.collection.endPointKey : null);
        if (options.endPointKey) {
            var cfg = globalConfigurationMapping[options.endPointKey];
            var cfgOptions = cfg.options;
            if (method === 'delete') {
                if (cfgOptions.deleteUrl) {
                    options.url = cfgOptions.deleteUrl;
                }
                if (cfgOptions.deleteContentType) {
                    options.contentType = cfgOptions.deleteContentType;
                }
            }
            else if (method === 'update') {
                if (cfgOptions.updateUrl) {
                    options.url = cfgOptions.updateUrl;
                }
                if (cfgOptions.updateContentType) {
                    options.contentType = cfgOptions.updateContentType;
                }
            }
            else if (method === 'create') {
                if (cfgOptions.createUrl) {
                    options.url = cfgOptions.createUrl;
                }
                if (cfgOptions.createContentType) {
                    options.contentType = cfgOptions.createContentType;
                }
            }
            else if (method === 'patch') {
                if (cfgOptions.patchUrl) {
                    options.url = cfgOptions.patchUrl;
                }
                if (cfgOptions.patchContentType) {
                    options.contentType = cfgOptions.patchContentType;
                }
            }
        }
    });
    mountedFeatureRemovers.push(remover);
    remover = mountAjaxBeforeAdvice(function (options) {
        if (options.endPointKey) {
            var cfg = globalConfigurationMapping[options.endPointKey];
            var cfgOptions = cfg.options;
            var policyDelegate = cfgOptions.securityDelegate;
            var extraParams = cfgOptions.extraParams;
            if (cfgOptions.contentType === 'application/x-www-form-urlencoded' &&
                options.contentType === 'application/json') {
                options.data = JSON.parse(options.data);
                if (extraParams) {
                    _.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                options.data = urlEncode(options.data);
                options.contentType = cfgOptions.contentType;
            }
            else {
                if (extraParams) {
                    _.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                if (options.contentType === 'application/x-www-form-urlencoded') {
                    options.data = urlEncode(options.data);
                }
            }
        }
    });
    mountedFeatureRemovers.push(remover);
    remover = mountSyncAroundAdvice(function (jointpoint) {
        var options = jointpoint.args[2];
        if (options.endPointKey) {
            var cfg = globalConfigurationMapping[options.endPointKey];
            var cfgOptions = cfg.options;
            if (cfgOptions.syncDelegate) {
                var syncDelegate = cfgOptions.syncDelegate;
                // Return a promise
                return syncDelegate(options.endPointKey, options, cfg, function () {
                    return jointpoint.proceed();
                });
            }
        }
        return jointpoint.proceed();
    });
    mountedFeatureRemovers.push(remover);
}
var defaultLivePeroid = 60 * 5;
var GlobalProvider = /** @class */ (function () {
    function GlobalProvider(ctorOptions) {
        this._cache = new SlidingExpirationCache(defaultLivePeroid);
        this._dataflow = new DataFlow();
        this._myEndPointKeys = [];
        this._host = ctorOptions.webhost || '';
        this._uniqueNamePrefix = this._host ? (this._host.replace('.', '-') + '-') : '';
        // Mount features
        mountFeatures();
    }
    Object.defineProperty(GlobalProvider.prototype, "host", {
        get: function () {
            return this._host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalProvider.prototype, "configurationMapping", {
        get: function () {
            return globalConfigurationMapping;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Defines an endpoint for a kind of service.
     */
    GlobalProvider.prototype.addEndPoint = function (name, tag, options) {
        var cfgMapping = this.configurationMapping;
        var dataflow = this._dataflow;
        var uniqueName = this._uniqueNamePrefix + name;
        if (cfgMapping[uniqueName]) {
            throw new Error('Redefined endpoint: ' + name);
        }
        cfgMapping[uniqueName] = {
            options: _.extend(options, { endPointKey: uniqueName }),
            tag: tag
        };
        this._myEndPointKeys.push(uniqueName);
        // Set up data flow nodes (it is enough to use local names)
        if (tag === endPointEnum.model) {
            for (var k in syncMethodEnum) {
                // skip loop if the property is from prototype
                if (syncMethodEnum.hasOwnProperty(k)) {
                    var value = syncMethodEnum[k];
                    dataflow[name + ':' + value] = 1;
                }
            }
        }
        else {
            dataflow[name + ':' + syncMethodEnum.read] = 1;
        }
    };
    /**
     * Retrieves the endpoint by the given name.
     */
    GlobalProvider.prototype.getEndPoint = function (name, ignoreCache) {
        var cache = this._cache;
        var uniqueName = this._uniqueNamePrefix + name;
        if (ignoreCache !== true) {
            var cachedValue = cache.get(uniqueName);
            if (cachedValue) {
                return cachedValue;
            }
        }
        var cfgMapping = this.configurationMapping;
        var cfg = cfgMapping[uniqueName];
        if (!cfg) {
            var error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }
        var value = null;
        if (cfg.tag === endPointEnum.model) {
            value = backbone.Model.extend(cfg.options);
        }
        else if (cfg.tag === endPointEnum.collection) {
            value = backbone.Collection.extend(cfg.options);
        }
        else if (cfg.tag === endPointEnum.pagedCollection) {
            value = backbone.PageableCollection.extend(cfg.options);
        }
        else {
            throw new Error('Not implemented');
        }
        if (ignoreCache !== true) {
            cache.set(uniqueName, value, defaultLivePeroid);
        }
        return value;
    };
    /**
     * Get the underlying configuration for an endpoint.
     */
    GlobalProvider.prototype.getConfiguration = function (endPointKey) {
        var uniqueName = this._uniqueNamePrefix + endPointKey;
        var cfgMapping = this.configurationMapping;
        return cfgMapping[uniqueName];
    };
    /**
     * Provides the callback when some operations happen.
     */
    GlobalProvider.prototype.addWhenCallback = function (name, callback) {
        var dataflow = this._dataflow;
        dataflow.when(name, callback);
    };
    /**
     * Defines the dependency.
     */
    GlobalProvider.prototype.addDependency = function (src, dst) {
        var dataflow = this._dataflow;
        dataflow.on(src, function () {
            dataflow[dst] = dataflow[dst] + 1;
        });
    };
    /**
     * Clean up all cached data provider
     */
    GlobalProvider.prototype.cleanupCache = function () {
        // Remove what we have in cache
        this._cache.reset();
    };
    GlobalProvider.prototype.cleanMountedFeatures = function () {
        mountedFeatureRemovers.forEach(function (remover) {
            remover.remove();
        });
        mountedFeatureRemovers.length = 0;
    };
    /**
     * Destroy the provider to release resources
     */
    GlobalProvider.prototype.destroy = function () {
        // Delete cache
        this._myEndPointKeys.forEach(function (k) {
            delete globalConfigurationMapping[k];
        });
        this._myEndPointKeys.length = 0;
        this._cache.destroy();
        // No destroy methods for the following two instances.
        this._cache = null;
        this._dataflow = null;
        this._host = null;
        this._uniqueNamePrefix = null;
    };
    return GlobalProvider;
}());
export { GlobalProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9iYWNrZW5kL3Byb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILHlCQUF5QjtBQUV6QixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUkzRSxPQUFPLEVBQ0gscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixxQkFBcUIsRUFDeEIsTUFBTSxhQUFhLENBQUM7QUFJckIsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFDLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRWxDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sWUFBWSxHQUFHO0lBQ3hCLEtBQUssRUFBRSxDQUFDO0lBQ1IsVUFBVSxFQUFFLENBQUM7SUFDYixlQUFlLEVBQUUsQ0FBQztDQUNyQixDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBTSxjQUFjLEdBQUc7SUFDMUI7O09BRUc7SUFDSCxJQUFJLEVBQUUsTUFBTTtJQUNaOztPQUVHO0lBQ0gsTUFBTSxFQUFFLFFBQVE7SUFDaEIsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQjs7T0FFRztJQUNILE1BQU0sRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFFRixJQUFNLDBCQUEwQixHQUE4QyxFQUFFLENBQUM7QUFDakYsSUFBTSxzQkFBc0IsR0FBVSxFQUFFLENBQUM7QUFFekMsYUFBYTtBQUNiLG9CQUFvQjtBQUNwQixTQUFTLGFBQWE7SUFF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QUFDLE9BQU8sQ0FBQyxVQUFTLENBQUM7WUFDbkMsT0FBTywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXRCLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUEvSkQsSUErSkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGEgbGF5ZXIgb2YgYmFja2VuZCBzZXJ2aWNlIGFic3RyYWN0aW9uLlxuICogRGVmaW5lcyB0aGUgYmFja2VuZCBzZXJ2aWNlcy4gVGhpcyBjbGFzcyBpcyBidWlsdCBvbnRvIHRoZSBiYWNrYm9uZSBqcywgYnV0IHdpdGhcbiAqIGVuaGFuY2VkIGFiaWxpdGllcyBvZiBtYW5hZ2luZyB0aGUgZGVwZW5kZW5jeSBhbW9uZyBhbGwgc2VydmljZXMgb2YgdGhlIGJhY2tlbmQsXG4gKiBhbmQgY2FjaGluZyBzb21lIHR5cGUgb2Ygb2JqZWN0cyBmb3IgYSBwZXJpb2Qgb2YgdGltZS5cbiAqL1xuLypqc2xpbnQgdW5wYXJhbTogdHJ1ZSAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IHVybEVuY29kZSB9IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5pbXBvcnQgeyBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY2FjaGUvc2xpZGluZy1leHBpcmF0aW9uLWNhY2hlJztcblxuaW1wb3J0IHsgSUpvaW5wb2ludCB9IGZyb20gJy4uL2ludGVyZmFjZXMvam9pbnQtcG9pbnQuaW50ZXJmYWNlJztcblxuaW1wb3J0IHtcbiAgICBtb3VudFN5bmNCZWZvcmVBZHZpY2UsXG4gICAgbW91bnRBamF4QmVmb3JlQWR2aWNlLFxuICAgIG1vdW50U3luY0Fyb3VuZEFkdmljZVxufSBmcm9tICcuL2V2ZW50LWh1Yic7XG5cbmltcG9ydCB7IElCYWNrYm9uZU9wdGlvbnMsIElCYWNrYm9uZUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCBEYXRhRmxvdyA9IGRlcGVuZGVuY2llc1snZGF0YWZsb3cnXTtcbmNvbnN0IGJhY2tib25lID0gZGVwZW5kZW5jaWVzWydiYWNrYm9uZSddO1xuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG4vKipcbiAqIFRoZSBlbmRwb2ludCB0eXBlcyBmb3IgYSBiYWNrZW5kIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjb25zdCBlbmRQb2ludEVudW0gPSB7XG4gICAgbW9kZWw6IDEsXG4gICAgY29sbGVjdGlvbjogMixcbiAgICBwYWdlZENvbGxlY3Rpb246IDNcbn07XG5cbi8qKlxuICogVGhlIHN5bmMgdHlwZXMgZGVmaW5lZCBpbiB0aGUgYmFja2JvbmUganMuXG4gKi9cbmV4cG9ydCBjb25zdCBzeW5jTWV0aG9kRW51bSA9IHtcbiAgICAvKipcbiAgICAgKiBGZXRjaCBhIG1vZGVsIG9yIGEgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICByZWFkOiAncmVhZCcsXG4gICAgLyoqXG4gICAgICogU2F2ZSBhIG1vZGVsLlxuICAgICAqL1xuICAgIGNyZWF0ZTogJ2NyZWF0ZScsXG4gICAgcGF0Y2g6ICdwYXRjaCcsXG4gICAgdXBkYXRlOiAndXBkYXRlJyxcbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGEgbW9kZWxcbiAgICAgKi9cbiAgICBkZWxldGU6ICdkZWxldGUnXG59O1xuXG5jb25zdCBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZzogeyBba2V5OiBzdHJpbmddOiBJQmFja2JvbmVDb25maWd1cmF0aW9uIH0gPSB7fTtcbmNvbnN0IG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnM6IGFueVtdID0gW107XG5cbi8vIElkZW1wb3RlbnRcbi8vIEluc3RhbmNlIG9uY2UgLi4uXG5mdW5jdGlvbiBtb3VudEZlYXR1cmVzKCkge1xuXG4gICAgaWYgKG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qanNsaW50IHVucGFyYW06IHRydWUgKi9cbiAgICAvKlxuICAgICAgZXZlbnRIdWIubW91bnRTeW5jTGlzdGVuZXIoZnVuY3Rpb24gKG1ldGhvZCwgbW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAvLyBJZ25vcmUgb3RoZXIgbWV0aG9kXG4gICAgICBpZiAobWV0aG9kICE9PSAnc3luYycpIHtcbiAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmVuZFBvaW50S2V5ICYmIG9wdGlvbnMubWV0aG9kS2V5KSB7XG4gICAgICB2YXIgZGF0YWZsb3cgPSBzZWxmLl9kYXRhZmxvdyxcbiAgICAgIGtleSA9IG9wdGlvbnMuZW5kUG9pbnRLZXkgKyAnOicgKyBvcHRpb25zLm1ldGhvZEtleTtcbiAgICAgIGRhdGFmbG93W2tleV0gPSBkYXRhZmxvd1trZXldICsgMTtcbiAgICAgIH1cbiAgICAgIH0pOyAqL1xuXG4gICAgbGV0IHJlbW92ZXIgPSBtb3VudFN5bmNCZWZvcmVBZHZpY2UoZnVuY3Rpb24obWV0aG9kLCBtb2RlbCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLm1ldGhvZEtleSA9IG1ldGhvZDtcbiAgICAgICAgb3B0aW9ucy5lbmRQb2ludEtleSA9IG1vZGVsLmVuZFBvaW50S2V5IHx8IChtb2RlbC5jb2xsZWN0aW9uID8gbW9kZWwuY29sbGVjdGlvbi5lbmRQb2ludEtleSA6IG51bGwpO1xuICAgICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSkge1xuICAgICAgICAgICAgY29uc3QgY2ZnID0gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmdbb3B0aW9ucy5lbmRQb2ludEtleV07XG4gICAgICAgICAgICBjb25zdCBjZmdPcHRpb25zID0gY2ZnLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSAnZGVsZXRlJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmRlbGV0ZVVybCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IGNmZ09wdGlvbnMuZGVsZXRlVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5kZWxldGVDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5kZWxldGVDb250ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy51cGRhdGVVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy51cmwgPSBjZmdPcHRpb25zLnVwZGF0ZVVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMudXBkYXRlQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMudXBkYXRlQ29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdjcmVhdGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuY3JlYXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy5jcmVhdGVVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmNyZWF0ZUNvbnRlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLmNyZWF0ZUNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAncGF0Y2gnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMucGF0Y2hVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy51cmwgPSBjZmdPcHRpb25zLnBhdGNoVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5wYXRjaENvbnRlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLnBhdGNoQ29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VudGVkRmVhdHVyZVJlbW92ZXJzLnB1c2gocmVtb3Zlcik7XG4gICAgcmVtb3ZlciA9IG1vdW50QWpheEJlZm9yZUFkdmljZShmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmVuZFBvaW50S2V5KSB7XG4gICAgICAgICAgICBjb25zdCBjZmcgPSBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZ1tvcHRpb25zLmVuZFBvaW50S2V5XTtcbiAgICAgICAgICAgIGNvbnN0IGNmZ09wdGlvbnMgPSBjZmcub3B0aW9ucztcbiAgICAgICAgICAgIGNvbnN0IHBvbGljeURlbGVnYXRlID0gY2ZnT3B0aW9ucy5zZWN1cml0eURlbGVnYXRlO1xuICAgICAgICAgICAgY29uc3QgZXh0cmFQYXJhbXMgPSBjZmdPcHRpb25zLmV4dHJhUGFyYW1zO1xuICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnICYmXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5wYXJzZShvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChleHRyYVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmRhdGEsIGV4dHJhUGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvbGljeURlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvbGljeURlbGVnYXRlKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEgPSB1cmxFbmNvZGUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5jb250ZW50VHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZGF0YSwgZXh0cmFQYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocG9saWN5RGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9saWN5RGVsZWdhdGUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEgPSB1cmxFbmNvZGUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBtb3VudGVkRmVhdHVyZVJlbW92ZXJzLnB1c2gocmVtb3Zlcik7XG5cbiAgICByZW1vdmVyID0gbW91bnRTeW5jQXJvdW5kQWR2aWNlKGZ1bmN0aW9uKGpvaW50cG9pbnQ6IElKb2lucG9pbnQpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGpvaW50cG9pbnQuYXJnc1syXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kUG9pbnRLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNmZyA9IGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW29wdGlvbnMuZW5kUG9pbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY2ZnT3B0aW9ucyA9IGNmZy5vcHRpb25zO1xuICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuc3luY0RlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3luY0RlbGVnYXRlID0gY2ZnT3B0aW9ucy5zeW5jRGVsZWdhdGU7XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICAgICAgICAgIHJldHVybiBzeW5jRGVsZWdhdGUob3B0aW9ucy5lbmRQb2ludEtleSwgb3B0aW9ucywgY2ZnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpvaW50cG9pbnQucHJvY2VlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2ludHBvaW50LnByb2NlZWQoKTtcbiAgICB9KTtcbiAgICBtb3VudGVkRmVhdHVyZVJlbW92ZXJzLnB1c2gocmVtb3Zlcik7XG59XG5cbmNvbnN0IGRlZmF1bHRMaXZlUGVyb2lkID0gNjAgKiA1O1xuXG5leHBvcnQgaW50ZXJmYWNlIElHbG9iYWxQcm92aWRlckN0b3JPcHRpb25zIHtcbiAgICB3ZWJob3N0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgR2xvYmFsUHJvdmlkZXIge1xuXG4gICAgcHJpdmF0ZSBfaG9zdDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2RhdGFmbG93OiBhbnk7XG4gICAgcHJpdmF0ZSBfY2FjaGU6IFNsaWRpbmdFeHBpcmF0aW9uQ2FjaGU8YW55PjtcbiAgICBwcml2YXRlIF9teUVuZFBvaW50S2V5czogYW55W107XG4gICAgcHJpdmF0ZSBfdW5pcXVlTmFtZVByZWZpeDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoY3Rvck9wdGlvbnM6IElHbG9iYWxQcm92aWRlckN0b3JPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlID0gbmV3IFNsaWRpbmdFeHBpcmF0aW9uQ2FjaGUoZGVmYXVsdExpdmVQZXJvaWQpO1xuICAgICAgICB0aGlzLl9kYXRhZmxvdyA9IG5ldyBEYXRhRmxvdygpO1xuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cyA9IFtdO1xuICAgICAgICB0aGlzLl9ob3N0ID0gY3Rvck9wdGlvbnMud2ViaG9zdCB8fCAnJztcbiAgICAgICAgdGhpcy5fdW5pcXVlTmFtZVByZWZpeCA9IHRoaXMuX2hvc3QgPyAodGhpcy5faG9zdC5yZXBsYWNlKCcuJywgJy0nKSArICctJykgOiAnJztcblxuICAgICAgICAvLyBNb3VudCBmZWF0dXJlc1xuICAgICAgICBtb3VudEZlYXR1cmVzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBob3N0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ob3N0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY29uZmlndXJhdGlvbk1hcHBpbmcoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGVuZHBvaW50IGZvciBhIGtpbmQgb2Ygc2VydmljZS5cbiAgICAgKi9cbiAgICBhZGRFbmRQb2ludChuYW1lOiBzdHJpbmcsIHRhZzogbnVtYmVyLCBvcHRpb25zOiBJQmFja2JvbmVPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGNmZ01hcHBpbmcgPSB0aGlzLmNvbmZpZ3VyYXRpb25NYXBwaW5nO1xuICAgICAgICBjb25zdCBkYXRhZmxvdyA9IHRoaXMuX2RhdGFmbG93O1xuICAgICAgICBjb25zdCB1bmlxdWVOYW1lID0gdGhpcy5fdW5pcXVlTmFtZVByZWZpeCArIG5hbWU7XG5cbiAgICAgICAgaWYgKGNmZ01hcHBpbmdbdW5pcXVlTmFtZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkZWZpbmVkIGVuZHBvaW50OiAnICsgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2ZnTWFwcGluZ1t1bmlxdWVOYW1lXSA9IHtcbiAgICAgICAgICAgIG9wdGlvbnM6IF8uZXh0ZW5kKG9wdGlvbnMsIHsgZW5kUG9pbnRLZXk6IHVuaXF1ZU5hbWUgfSksXG4gICAgICAgICAgICB0YWc6IHRhZ1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX215RW5kUG9pbnRLZXlzLnB1c2godW5pcXVlTmFtZSk7XG5cbiAgICAgICAgLy8gU2V0IHVwIGRhdGEgZmxvdyBub2RlcyAoaXQgaXMgZW5vdWdoIHRvIHVzZSBsb2NhbCBuYW1lcylcbiAgICAgICAgaWYgKHRhZyA9PT0gZW5kUG9pbnRFbnVtLm1vZGVsKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gc3luY01ldGhvZEVudW0pIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIGxvb3AgaWYgdGhlIHByb3BlcnR5IGlzIGZyb20gcHJvdG90eXBlXG4gICAgICAgICAgICAgICAgaWYgKHN5bmNNZXRob2RFbnVtLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc3luY01ldGhvZEVudW1ba107XG4gICAgICAgICAgICAgICAgICAgIGRhdGFmbG93W25hbWUgKyAnOicgKyB2YWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGFmbG93W25hbWUgKyAnOicgKyBzeW5jTWV0aG9kRW51bS5yZWFkXSA9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGVuZHBvaW50IGJ5IHRoZSBnaXZlbiBuYW1lLlxuICAgICAqL1xuICAgIGdldEVuZFBvaW50KG5hbWU6IHN0cmluZywgaWdub3JlQ2FjaGU/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5fY2FjaGU7XG4gICAgICAgIGNvbnN0IHVuaXF1ZU5hbWUgPSB0aGlzLl91bmlxdWVOYW1lUHJlZml4ICsgbmFtZTtcblxuICAgICAgICBpZiAoaWdub3JlQ2FjaGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZFZhbHVlID0gY2FjaGUuZ2V0KHVuaXF1ZU5hbWUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2ZnTWFwcGluZyA9IHRoaXMuY29uZmlndXJhdGlvbk1hcHBpbmc7XG5cbiAgICAgICAgY29uc3QgY2ZnID0gY2ZnTWFwcGluZ1t1bmlxdWVOYW1lXTtcbiAgICAgICAgaWYgKCFjZmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdObyBnaXZlbiBlbmRwb2ludCBpcyBkZWZpbmVkIGZvcjogJyArIG5hbWUpO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoY2ZnLnRhZyA9PT0gZW5kUG9pbnRFbnVtLm1vZGVsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhY2tib25lLk1vZGVsLmV4dGVuZChjZmcub3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2ZnLnRhZyA9PT0gZW5kUG9pbnRFbnVtLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gYmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoY2ZnLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2UgaWYgKGNmZy50YWcgPT09IGVuZFBvaW50RW51bS5wYWdlZENvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gYmFja2JvbmUuUGFnZWFibGVDb2xsZWN0aW9uLmV4dGVuZChjZmcub3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhY2hlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBjYWNoZS5zZXQodW5pcXVlTmFtZSwgdmFsdWUsIGRlZmF1bHRMaXZlUGVyb2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB1bmRlcmx5aW5nIGNvbmZpZ3VyYXRpb24gZm9yIGFuIGVuZHBvaW50LlxuICAgICAqL1xuICAgIGdldENvbmZpZ3VyYXRpb24oZW5kUG9pbnRLZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1bmlxdWVOYW1lID0gdGhpcy5fdW5pcXVlTmFtZVByZWZpeCArIGVuZFBvaW50S2V5O1xuICAgICAgICBjb25zdCBjZmdNYXBwaW5nID0gdGhpcy5jb25maWd1cmF0aW9uTWFwcGluZztcbiAgICAgICAgcmV0dXJuIGNmZ01hcHBpbmdbdW5pcXVlTmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZXMgdGhlIGNhbGxiYWNrIHdoZW4gc29tZSBvcGVyYXRpb25zIGhhcHBlbi5cbiAgICAgKi9cbiAgICBhZGRXaGVuQ2FsbGJhY2sobmFtZTogc3RyaW5nW10sIGNhbGxiYWNrOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGF0YWZsb3cgPSB0aGlzLl9kYXRhZmxvdztcbiAgICAgICAgZGF0YWZsb3cud2hlbihuYW1lLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgZGVwZW5kZW5jeS5cbiAgICAgKi9cbiAgICBhZGREZXBlbmRlbmN5KHNyYzogc3RyaW5nLCBkc3Q6IHN0cmluZykge1xuICAgICAgICBjb25zdCBkYXRhZmxvdyA9IHRoaXMuX2RhdGFmbG93O1xuICAgICAgICBkYXRhZmxvdy5vbihzcmMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGF0YWZsb3dbZHN0XSA9IGRhdGFmbG93W2RzdF0gKyAxO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiB1cCBhbGwgY2FjaGVkIGRhdGEgcHJvdmlkZXJcbiAgICAgKi9cbiAgICBjbGVhbnVwQ2FjaGUoKSB7XG4gICAgICAgIC8vIFJlbW92ZSB3aGF0IHdlIGhhdmUgaW4gY2FjaGVcbiAgICAgICAgdGhpcy5fY2FjaGUucmVzZXQoKTtcbiAgICB9XG5cbiAgICBjbGVhbk1vdW50ZWRGZWF0dXJlcygpIHtcbiAgICAgICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5mb3JFYWNoKGZ1bmN0aW9uKHJlbW92ZXIpIHtcbiAgICAgICAgICAgIHJlbW92ZXIucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBtb3VudGVkRmVhdHVyZVJlbW92ZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgcHJvdmlkZXIgdG8gcmVsZWFzZSByZXNvdXJjZXNcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICAvLyBEZWxldGUgY2FjaGVcbiAgICAgICAgdGhpcy5fbXlFbmRQb2ludEtleXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICBkZWxldGUgZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmdba107XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX215RW5kUG9pbnRLZXlzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdGhpcy5fY2FjaGUuZGVzdHJveSgpO1xuXG4gICAgICAgIC8vIE5vIGRlc3Ryb3kgbWV0aG9kcyBmb3IgdGhlIGZvbGxvd2luZyB0d28gaW5zdGFuY2VzLlxuICAgICAgICB0aGlzLl9jYWNoZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2RhdGFmbG93ID0gbnVsbDtcbiAgICAgICAgdGhpcy5faG9zdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggPSBudWxsO1xuICAgIH1cbn1cblxuXG5cbiJdfQ==