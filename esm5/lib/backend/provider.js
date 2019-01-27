/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
var DataFlow = dependencies['dataflow'];
/** @type {?} */
var backbone = dependencies['backbone'];
/** @type {?} */
var _ = dependencies.underscore;
/**
 * The endpoint types for a backend service.
 * @type {?}
 */
export var endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 * @type {?}
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
/** @type {?} */
var globalConfigurationMapping = {};
/** @type {?} */
var mountedFeatureRemovers = [];
// Idempotent
// Instance once ...
/**
 * @return {?}
 */
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
    /** @type {?} */
    var remover = mountSyncBeforeAdvice(function (method, model, options) {
        options.methodKey = method;
        options.endPointKey = model.endPointKey || (model.collection ? model.collection.endPointKey : null);
        if (options.endPointKey) {
            /** @type {?} */
            var cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
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
            /** @type {?} */
            var cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
            var cfgOptions = cfg.options;
            /** @type {?} */
            var policyDelegate = cfgOptions.securityDelegate;
            /** @type {?} */
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
        /** @type {?} */
        var options = jointpoint.args[2];
        if (options.endPointKey) {
            /** @type {?} */
            var cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
            var cfgOptions = cfg.options;
            if (cfgOptions.syncDelegate) {
                /** @type {?} */
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
/** @type {?} */
var defaultLivePeroid = 60 * 5;
/**
 * @record
 */
export function IGlobalProviderCtorOptions() { }
if (false) {
    /** @type {?|undefined} */
    IGlobalProviderCtorOptions.prototype.webhost;
}
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
        get: /**
         * @return {?}
         */
        function () {
            return this._host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalProvider.prototype, "configurationMapping", {
        get: /**
         * @return {?}
         */
        function () {
            return globalConfigurationMapping;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Defines an endpoint for a kind of service.
     */
    /**
     * Defines an endpoint for a kind of service.
     * @param {?} name
     * @param {?} tag
     * @param {?} options
     * @return {?}
     */
    GlobalProvider.prototype.addEndPoint = /**
     * Defines an endpoint for a kind of service.
     * @param {?} name
     * @param {?} tag
     * @param {?} options
     * @return {?}
     */
    function (name, tag, options) {
        /** @type {?} */
        var cfgMapping = this.configurationMapping;
        /** @type {?} */
        var dataflow = this._dataflow;
        /** @type {?} */
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
                    /** @type {?} */
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
    /**
     * Retrieves the endpoint by the given name.
     * @param {?} name
     * @param {?=} ignoreCache
     * @return {?}
     */
    GlobalProvider.prototype.getEndPoint = /**
     * Retrieves the endpoint by the given name.
     * @param {?} name
     * @param {?=} ignoreCache
     * @return {?}
     */
    function (name, ignoreCache) {
        /** @type {?} */
        var cache = this._cache;
        /** @type {?} */
        var uniqueName = this._uniqueNamePrefix + name;
        if (ignoreCache !== true) {
            /** @type {?} */
            var cachedValue = cache.get(uniqueName);
            if (cachedValue) {
                return cachedValue;
            }
        }
        /** @type {?} */
        var cfgMapping = this.configurationMapping;
        /** @type {?} */
        var cfg = cfgMapping[uniqueName];
        if (!cfg) {
            /** @type {?} */
            var error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }
        /** @type {?} */
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
    /**
     * Get the underlying configuration for an endpoint.
     * @param {?} endPointKey
     * @return {?}
     */
    GlobalProvider.prototype.getConfiguration = /**
     * Get the underlying configuration for an endpoint.
     * @param {?} endPointKey
     * @return {?}
     */
    function (endPointKey) {
        /** @type {?} */
        var uniqueName = this._uniqueNamePrefix + endPointKey;
        /** @type {?} */
        var cfgMapping = this.configurationMapping;
        return cfgMapping[uniqueName];
    };
    /**
     * Provides the callback when some operations happen.
     */
    /**
     * Provides the callback when some operations happen.
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    GlobalProvider.prototype.addWhenCallback = /**
     * Provides the callback when some operations happen.
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    function (name, callback) {
        /** @type {?} */
        var dataflow = this._dataflow;
        dataflow.when(name, callback);
    };
    /**
     * Defines the dependency.
     */
    /**
     * Defines the dependency.
     * @param {?} src
     * @param {?} dst
     * @return {?}
     */
    GlobalProvider.prototype.addDependency = /**
     * Defines the dependency.
     * @param {?} src
     * @param {?} dst
     * @return {?}
     */
    function (src, dst) {
        /** @type {?} */
        var dataflow = this._dataflow;
        dataflow.on(src, function () {
            dataflow[dst] = dataflow[dst] + 1;
        });
    };
    /**
     * Clean up all cached data provider
     */
    /**
     * Clean up all cached data provider
     * @return {?}
     */
    GlobalProvider.prototype.cleanupCache = /**
     * Clean up all cached data provider
     * @return {?}
     */
    function () {
        // Remove what we have in cache
        this._cache.reset();
    };
    /**
     * @return {?}
     */
    GlobalProvider.prototype.cleanMountedFeatures = /**
     * @return {?}
     */
    function () {
        mountedFeatureRemovers.forEach(function (remover) {
            remover.remove();
        });
        mountedFeatureRemovers.length = 0;
    };
    /**
     * Destroy the provider to release resources
     */
    /**
     * Destroy the provider to release resources
     * @return {?}
     */
    GlobalProvider.prototype.destroy = /**
     * Destroy the provider to release resources
     * @return {?}
     */
    function () {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    GlobalProvider.prototype._host;
    /**
     * @type {?}
     * @private
     */
    GlobalProvider.prototype._dataflow;
    /**
     * @type {?}
     * @private
     */
    GlobalProvider.prototype._cache;
    /**
     * @type {?}
     * @private
     */
    GlobalProvider.prototype._myEndPointKeys;
    /**
     * @type {?}
     * @private
     */
    GlobalProvider.prototype._uniqueNamePrefix;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9iYWNrZW5kL3Byb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVNBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRW5ELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBSTNFLE9BQU8sRUFDSCxxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUN4QixNQUFNLGFBQWEsQ0FBQzs7SUFJZixRQUFRLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQzs7SUFDbkMsUUFBUSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7O0lBQ25DLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVTs7Ozs7QUFLakMsTUFBTSxLQUFPLFlBQVksR0FBRztJQUN4QixLQUFLLEVBQUUsQ0FBQztJQUNSLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZUFBZSxFQUFFLENBQUM7Q0FDckI7Ozs7O0FBS0QsTUFBTSxLQUFPLGNBQWMsR0FBRzs7OztJQUkxQixJQUFJLEVBQUUsTUFBTTs7OztJQUlaLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLFFBQVE7Ozs7SUFJaEIsTUFBTSxFQUFFLFFBQVE7Q0FDbkI7O0lBRUssMEJBQTBCLEdBQThDLEVBQUU7O0lBQzFFLHNCQUFzQixHQUFVLEVBQUU7Ozs7OztBQUl4QyxTQUFTLGFBQWE7SUFFbEIsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU87S0FDVjs7Ozs7Ozs7Ozs7Ozs7O1FBZUcsT0FBTyxHQUFHLHFCQUFxQixDQUFDLFVBQVMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPO1FBQy9ELE9BQU8s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LENBQUM7UUFDbEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBL0pELElBK0pDOzs7Ozs7O0lBN0pHLCtCQUFzQjs7Ozs7SUFDdEIsbUNBQXVCOzs7OztJQUN2QixnQ0FBNEM7Ozs7O0lBQzVDLHlDQUErQjs7Ozs7SUFDL0IsMkNBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyBhIGxheWVyIG9mIGJhY2tlbmQgc2VydmljZSBhYnN0cmFjdGlvbi5cbiAqIERlZmluZXMgdGhlIGJhY2tlbmQgc2VydmljZXMuIFRoaXMgY2xhc3MgaXMgYnVpbHQgb250byB0aGUgYmFja2JvbmUganMsIGJ1dCB3aXRoXG4gKiBlbmhhbmNlZCBhYmlsaXRpZXMgb2YgbWFuYWdpbmcgdGhlIGRlcGVuZGVuY3kgYW1vbmcgYWxsIHNlcnZpY2VzIG9mIHRoZSBiYWNrZW5kLFxuICogYW5kIGNhY2hpbmcgc29tZSB0eXBlIG9mIG9iamVjdHMgZm9yIGEgcGVyaW9kIG9mIHRpbWUuXG4gKi9cbi8qanNsaW50IHVucGFyYW06IHRydWUgKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyB1cmxFbmNvZGUgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgU2xpZGluZ0V4cGlyYXRpb25DYWNoZSB9IGZyb20gJy4uL2NhY2hlL3NsaWRpbmctZXhwaXJhdGlvbi1jYWNoZSc7XG5cbmltcG9ydCB7IElKb2lucG9pbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2pvaW50LXBvaW50LmludGVyZmFjZSc7XG5cbmltcG9ydCB7XG4gICAgbW91bnRTeW5jQmVmb3JlQWR2aWNlLFxuICAgIG1vdW50QWpheEJlZm9yZUFkdmljZSxcbiAgICBtb3VudFN5bmNBcm91bmRBZHZpY2Vcbn0gZnJvbSAnLi9ldmVudC1odWInO1xuXG5pbXBvcnQgeyBJQmFja2JvbmVPcHRpb25zLCBJQmFja2JvbmVDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgRGF0YUZsb3cgPSBkZXBlbmRlbmNpZXNbJ2RhdGFmbG93J107XG5jb25zdCBiYWNrYm9uZSA9IGRlcGVuZGVuY2llc1snYmFja2JvbmUnXTtcbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuLyoqXG4gKiBUaGUgZW5kcG9pbnQgdHlwZXMgZm9yIGEgYmFja2VuZCBzZXJ2aWNlLlxuICovXG5leHBvcnQgY29uc3QgZW5kUG9pbnRFbnVtID0ge1xuICAgIG1vZGVsOiAxLFxuICAgIGNvbGxlY3Rpb246IDIsXG4gICAgcGFnZWRDb2xsZWN0aW9uOiAzXG59O1xuXG4vKipcbiAqIFRoZSBzeW5jIHR5cGVzIGRlZmluZWQgaW4gdGhlIGJhY2tib25lIGpzLlxuICovXG5leHBvcnQgY29uc3Qgc3luY01ldGhvZEVudW0gPSB7XG4gICAgLyoqXG4gICAgICogRmV0Y2ggYSBtb2RlbCBvciBhIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgcmVhZDogJ3JlYWQnLFxuICAgIC8qKlxuICAgICAqIFNhdmUgYSBtb2RlbC5cbiAgICAgKi9cbiAgICBjcmVhdGU6ICdjcmVhdGUnLFxuICAgIHBhdGNoOiAncGF0Y2gnLFxuICAgIHVwZGF0ZTogJ3VwZGF0ZScsXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhIG1vZGVsXG4gICAgICovXG4gICAgZGVsZXRlOiAnZGVsZXRlJ1xufTtcblxuY29uc3QgZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmc6IHsgW2tleTogc3RyaW5nXTogSUJhY2tib25lQ29uZmlndXJhdGlvbiB9ID0ge307XG5jb25zdCBtb3VudGVkRmVhdHVyZVJlbW92ZXJzOiBhbnlbXSA9IFtdO1xuXG4vLyBJZGVtcG90ZW50XG4vLyBJbnN0YW5jZSBvbmNlIC4uLlxuZnVuY3Rpb24gbW91bnRGZWF0dXJlcygpIHtcblxuICAgIGlmIChtb3VudGVkRmVhdHVyZVJlbW92ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKmpzbGludCB1bnBhcmFtOiB0cnVlICovXG4gICAgLypcbiAgICAgIGV2ZW50SHViLm1vdW50U3luY0xpc3RlbmVyKGZ1bmN0aW9uIChtZXRob2QsIG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgLy8gSWdub3JlIG90aGVyIG1ldGhvZFxuICAgICAgaWYgKG1ldGhvZCAhPT0gJ3N5bmMnKSB7XG4gICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSAmJiBvcHRpb25zLm1ldGhvZEtleSkge1xuICAgICAgdmFyIGRhdGFmbG93ID0gc2VsZi5fZGF0YWZsb3csXG4gICAgICBrZXkgPSBvcHRpb25zLmVuZFBvaW50S2V5ICsgJzonICsgb3B0aW9ucy5tZXRob2RLZXk7XG4gICAgICBkYXRhZmxvd1trZXldID0gZGF0YWZsb3dba2V5XSArIDE7XG4gICAgICB9XG4gICAgICB9KTsgKi9cblxuICAgIGxldCByZW1vdmVyID0gbW91bnRTeW5jQmVmb3JlQWR2aWNlKGZ1bmN0aW9uKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2RLZXkgPSBtZXRob2Q7XG4gICAgICAgIG9wdGlvbnMuZW5kUG9pbnRLZXkgPSBtb2RlbC5lbmRQb2ludEtleSB8fCAobW9kZWwuY29sbGVjdGlvbiA/IG1vZGVsLmNvbGxlY3Rpb24uZW5kUG9pbnRLZXkgOiBudWxsKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kUG9pbnRLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNmZyA9IGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW29wdGlvbnMuZW5kUG9pbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY2ZnT3B0aW9ucyA9IGNmZy5vcHRpb25zO1xuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5kZWxldGVVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy51cmwgPSBjZmdPcHRpb25zLmRlbGV0ZVVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuZGVsZXRlQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMuZGVsZXRlQ29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICd1cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMudXBkYXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy51cGRhdGVVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnVwZGF0ZUNvbnRlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLnVwZGF0ZUNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAnY3JlYXRlJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmNyZWF0ZVVybCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IGNmZ09wdGlvbnMuY3JlYXRlVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5jcmVhdGVDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5jcmVhdGVDb250ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3BhdGNoJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnBhdGNoVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy5wYXRjaFVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMucGF0Y2hDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5wYXRjaENvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xuICAgIHJlbW92ZXIgPSBtb3VudEFqYXhCZWZvcmVBZHZpY2UoZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSkge1xuICAgICAgICAgICAgY29uc3QgY2ZnID0gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmdbb3B0aW9ucy5lbmRQb2ludEtleV07XG4gICAgICAgICAgICBjb25zdCBjZmdPcHRpb25zID0gY2ZnLm9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCBwb2xpY3lEZWxlZ2F0ZSA9IGNmZ09wdGlvbnMuc2VjdXJpdHlEZWxlZ2F0ZTtcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhUGFyYW1zID0gY2ZnT3B0aW9ucy5leHRyYVBhcmFtcztcbiAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyAmJlxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04ucGFyc2Uob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQob3B0aW9ucy5kYXRhLCBleHRyYVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwb2xpY3lEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICBwb2xpY3lEZWxlZ2F0ZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMuY29udGVudFR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChleHRyYVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmRhdGEsIGV4dHJhUGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvbGljeURlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvbGljeURlbGVnYXRlKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xuXG4gICAgcmVtb3ZlciA9IG1vdW50U3luY0Fyb3VuZEFkdmljZShmdW5jdGlvbihqb2ludHBvaW50OiBJSm9pbnBvaW50KSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBqb2ludHBvaW50LmFyZ3NbMl07XG4gICAgICAgIGlmIChvcHRpb25zLmVuZFBvaW50S2V5KSB7XG4gICAgICAgICAgICBjb25zdCBjZmcgPSBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZ1tvcHRpb25zLmVuZFBvaW50S2V5XTtcbiAgICAgICAgICAgIGNvbnN0IGNmZ09wdGlvbnMgPSBjZmcub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnN5bmNEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN5bmNEZWxlZ2F0ZSA9IGNmZ09wdGlvbnMuc3luY0RlbGVnYXRlO1xuICAgICAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gc3luY0RlbGVnYXRlKG9wdGlvbnMuZW5kUG9pbnRLZXksIG9wdGlvbnMsIGNmZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqb2ludHBvaW50LnByb2NlZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9pbnRwb2ludC5wcm9jZWVkKCk7XG4gICAgfSk7XG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xufVxuXG5jb25zdCBkZWZhdWx0TGl2ZVBlcm9pZCA9IDYwICogNTtcblxuZXhwb3J0IGludGVyZmFjZSBJR2xvYmFsUHJvdmlkZXJDdG9yT3B0aW9ucyB7XG4gICAgd2ViaG9zdD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEdsb2JhbFByb3ZpZGVyIHtcblxuICAgIHByaXZhdGUgX2hvc3Q6IHN0cmluZztcbiAgICBwcml2YXRlIF9kYXRhZmxvdzogYW55O1xuICAgIHByaXZhdGUgX2NhY2hlOiBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlPGFueT47XG4gICAgcHJpdmF0ZSBfbXlFbmRQb2ludEtleXM6IGFueVtdO1xuICAgIHByaXZhdGUgX3VuaXF1ZU5hbWVQcmVmaXg6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGN0b3JPcHRpb25zOiBJR2xvYmFsUHJvdmlkZXJDdG9yT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlKGRlZmF1bHRMaXZlUGVyb2lkKTtcbiAgICAgICAgdGhpcy5fZGF0YWZsb3cgPSBuZXcgRGF0YUZsb3coKTtcbiAgICAgICAgdGhpcy5fbXlFbmRQb2ludEtleXMgPSBbXTtcbiAgICAgICAgdGhpcy5faG9zdCA9IGN0b3JPcHRpb25zLndlYmhvc3QgfHwgJyc7XG4gICAgICAgIHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggPSB0aGlzLl9ob3N0ID8gKHRoaXMuX2hvc3QucmVwbGFjZSgnLicsICctJykgKyAnLScpIDogJyc7XG5cbiAgICAgICAgLy8gTW91bnQgZmVhdHVyZXNcbiAgICAgICAgbW91bnRGZWF0dXJlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaG9zdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faG9zdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNvbmZpZ3VyYXRpb25NYXBwaW5nKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBlbmRwb2ludCBmb3IgYSBraW5kIG9mIHNlcnZpY2UuXG4gICAgICovXG4gICAgYWRkRW5kUG9pbnQobmFtZTogc3RyaW5nLCB0YWc6IG51bWJlciwgb3B0aW9uczogSUJhY2tib25lT3B0aW9ucykge1xuICAgICAgICBjb25zdCBjZmdNYXBwaW5nID0gdGhpcy5jb25maWd1cmF0aW9uTWFwcGluZztcbiAgICAgICAgY29uc3QgZGF0YWZsb3cgPSB0aGlzLl9kYXRhZmxvdztcbiAgICAgICAgY29uc3QgdW5pcXVlTmFtZSA9IHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggKyBuYW1lO1xuXG4gICAgICAgIGlmIChjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZGVmaW5lZCBlbmRwb2ludDogJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNmZ01hcHBpbmdbdW5pcXVlTmFtZV0gPSB7XG4gICAgICAgICAgICBvcHRpb25zOiBfLmV4dGVuZChvcHRpb25zLCB7IGVuZFBvaW50S2V5OiB1bmlxdWVOYW1lIH0pLFxuICAgICAgICAgICAgdGFnOiB0YWdcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cy5wdXNoKHVuaXF1ZU5hbWUpO1xuXG4gICAgICAgIC8vIFNldCB1cCBkYXRhIGZsb3cgbm9kZXMgKGl0IGlzIGVub3VnaCB0byB1c2UgbG9jYWwgbmFtZXMpXG4gICAgICAgIGlmICh0YWcgPT09IGVuZFBvaW50RW51bS5tb2RlbCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIHN5bmNNZXRob2RFbnVtKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCBsb29wIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgIGlmIChzeW5jTWV0aG9kRW51bS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN5bmNNZXRob2RFbnVtW2tdO1xuICAgICAgICAgICAgICAgICAgICBkYXRhZmxvd1tuYW1lICsgJzonICsgdmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhZmxvd1tuYW1lICsgJzonICsgc3luY01ldGhvZEVudW0ucmVhZF0gPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBlbmRwb2ludCBieSB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBnZXRFbmRQb2ludChuYW1lOiBzdHJpbmcsIGlnbm9yZUNhY2hlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuX2NhY2hlO1xuICAgICAgICBjb25zdCB1bmlxdWVOYW1lID0gdGhpcy5fdW5pcXVlTmFtZVByZWZpeCArIG5hbWU7XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhY2hlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IGNhY2hlLmdldCh1bmlxdWVOYW1lKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNmZ01hcHBpbmcgPSB0aGlzLmNvbmZpZ3VyYXRpb25NYXBwaW5nO1xuXG4gICAgICAgIGNvbnN0IGNmZyA9IGNmZ01hcHBpbmdbdW5pcXVlTmFtZV07XG4gICAgICAgIGlmICghY2ZnKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignTm8gZ2l2ZW4gZW5kcG9pbnQgaXMgZGVmaW5lZCBmb3I6ICcgKyBuYW1lKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGNmZy50YWcgPT09IGVuZFBvaW50RW51bS5tb2RlbCkge1xuICAgICAgICAgICAgdmFsdWUgPSBiYWNrYm9uZS5Nb2RlbC5leHRlbmQoY2ZnLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2UgaWYgKGNmZy50YWcgPT09IGVuZFBvaW50RW51bS5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKGNmZy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmIChjZmcudGFnID09PSBlbmRQb2ludEVudW0ucGFnZWRDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhY2tib25lLlBhZ2VhYmxlQ29sbGVjdGlvbi5leHRlbmQoY2ZnLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYWNoZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2FjaGUuc2V0KHVuaXF1ZU5hbWUsIHZhbHVlLCBkZWZhdWx0TGl2ZVBlcm9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdW5kZXJseWluZyBjb25maWd1cmF0aW9uIGZvciBhbiBlbmRwb2ludC5cbiAgICAgKi9cbiAgICBnZXRDb25maWd1cmF0aW9uKGVuZFBvaW50S2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdW5pcXVlTmFtZSA9IHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggKyBlbmRQb2ludEtleTtcbiAgICAgICAgY29uc3QgY2ZnTWFwcGluZyA9IHRoaXMuY29uZmlndXJhdGlvbk1hcHBpbmc7XG4gICAgICAgIHJldHVybiBjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIHRoZSBjYWxsYmFjayB3aGVuIHNvbWUgb3BlcmF0aW9ucyBoYXBwZW4uXG4gICAgICovXG4gICAgYWRkV2hlbkNhbGxiYWNrKG5hbWU6IHN0cmluZ1tdLCBjYWxsYmFjazogYW55KSB7XG4gICAgICAgIGNvbnN0IGRhdGFmbG93ID0gdGhpcy5fZGF0YWZsb3c7XG4gICAgICAgIGRhdGFmbG93LndoZW4obmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgdGhlIGRlcGVuZGVuY3kuXG4gICAgICovXG4gICAgYWRkRGVwZW5kZW5jeShzcmM6IHN0cmluZywgZHN0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZGF0YWZsb3cgPSB0aGlzLl9kYXRhZmxvdztcbiAgICAgICAgZGF0YWZsb3cub24oc3JjLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRhdGFmbG93W2RzdF0gPSBkYXRhZmxvd1tkc3RdICsgMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdXAgYWxsIGNhY2hlZCBkYXRhIHByb3ZpZGVyXG4gICAgICovXG4gICAgY2xlYW51cENhY2hlKCkge1xuICAgICAgICAvLyBSZW1vdmUgd2hhdCB3ZSBoYXZlIGluIGNhY2hlXG4gICAgICAgIHRoaXMuX2NhY2hlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgY2xlYW5Nb3VudGVkRmVhdHVyZXMoKSB7XG4gICAgICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMuZm9yRWFjaChmdW5jdGlvbihyZW1vdmVyKSB7XG4gICAgICAgICAgICByZW1vdmVyLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIHByb3ZpZGVyIHRvIHJlbGVhc2UgcmVzb3VyY2VzXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX215RW5kUG9pbnRLZXlzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgZGVsZXRlIGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW2tdO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cy5sZW5ndGggPSAwO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlLmRlc3Ryb3koKTtcblxuICAgICAgICAvLyBObyBkZXN0cm95IG1ldGhvZHMgZm9yIHRoZSBmb2xsb3dpbmcgdHdvIGluc3RhbmNlcy5cbiAgICAgICAgdGhpcy5fY2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9kYXRhZmxvdyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2hvc3QgPSBudWxsO1xuICAgICAgICB0aGlzLl91bmlxdWVOYW1lUHJlZml4ID0gbnVsbDtcbiAgICB9XG59XG5cblxuXG4iXX0=