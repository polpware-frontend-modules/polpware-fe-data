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
const DataFlow = dependencies['dataflow'];
const backbone = dependencies['backbone'];
const _ = dependencies.underscore;
/**
 * The endpoint types for a backend service.
 */
export const endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 */
export const syncMethodEnum = {
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
const globalConfigurationMapping = {};
const mountedFeatureRemovers = [];
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
    let remover = mountSyncBeforeAdvice(function (method, model, options) {
        options.methodKey = method;
        options.endPointKey = model.endPointKey || (model.collection ? model.collection.endPointKey : null);
        if (options.endPointKey) {
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
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
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
            const policyDelegate = cfgOptions.securityDelegate;
            const extraParams = cfgOptions.extraParams;
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
        const options = jointpoint.args[2];
        if (options.endPointKey) {
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
            if (cfgOptions.syncDelegate) {
                const syncDelegate = cfgOptions.syncDelegate;
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
const defaultLivePeroid = 60 * 5;
export class GlobalProvider {
    constructor(ctorOptions) {
        this._cache = new SlidingExpirationCache(defaultLivePeroid);
        this._dataflow = new DataFlow();
        this._myEndPointKeys = [];
        this._host = ctorOptions.webhost || '';
        this._uniqueNamePrefix = this._host ? (this._host.replace('.', '-') + '-') : '';
        // Mount features
        mountFeatures();
    }
    get host() {
        return this._host;
    }
    get configurationMapping() {
        return globalConfigurationMapping;
    }
    /**
     * Defines an endpoint for a kind of service.
     */
    addEndPoint(name, tag, options) {
        const cfgMapping = this.configurationMapping;
        const dataflow = this._dataflow;
        const uniqueName = this._uniqueNamePrefix + name;
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
            for (const k in syncMethodEnum) {
                // skip loop if the property is from prototype
                if (syncMethodEnum.hasOwnProperty(k)) {
                    const value = syncMethodEnum[k];
                    dataflow[name + ':' + value] = 1;
                }
            }
        }
        else {
            dataflow[name + ':' + syncMethodEnum.read] = 1;
        }
    }
    /**
     * Retrieves the endpoint by the given name.
     */
    getEndPoint(name, ignoreCache) {
        const cache = this._cache;
        const uniqueName = this._uniqueNamePrefix + name;
        if (ignoreCache !== true) {
            const cachedValue = cache.get(uniqueName);
            if (cachedValue) {
                return cachedValue;
            }
        }
        const cfgMapping = this.configurationMapping;
        const cfg = cfgMapping[uniqueName];
        if (!cfg) {
            const error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }
        let value = null;
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
    }
    /**
     * Get the underlying configuration for an endpoint.
     */
    getConfiguration(endPointKey) {
        const uniqueName = this._uniqueNamePrefix + endPointKey;
        const cfgMapping = this.configurationMapping;
        return cfgMapping[uniqueName];
    }
    /**
     * Provides the callback when some operations happen.
     */
    addWhenCallback(name, callback) {
        const dataflow = this._dataflow;
        dataflow.when(name, callback);
    }
    /**
     * Defines the dependency.
     */
    addDependency(src, dst) {
        const dataflow = this._dataflow;
        dataflow.on(src, function () {
            dataflow[dst] = dataflow[dst] + 1;
        });
    }
    /**
     * Clean up all cached data provider
     */
    cleanupCache() {
        // Remove what we have in cache
        this._cache.reset();
    }
    cleanMountedFeatures() {
        mountedFeatureRemovers.forEach(function (remover) {
            remover.remove();
        });
        mountedFeatureRemovers.length = 0;
    }
    /**
     * Destroy the provider to release resources
     */
    destroy() {
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9iYWNrZW5kL3Byb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILHlCQUF5QjtBQUV6QixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUkzRSxPQUFPLEVBQ0gscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixxQkFBcUIsRUFDeEIsTUFBTSxhQUFhLENBQUM7QUFJckIsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRWxDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHO0lBQ3hCLEtBQUssRUFBRSxDQUFDO0lBQ1IsVUFBVSxFQUFFLENBQUM7SUFDYixlQUFlLEVBQUUsQ0FBQztDQUNyQixDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUc7SUFDMUI7O09BRUc7SUFDSCxJQUFJLEVBQUUsTUFBTTtJQUNaOztPQUVHO0lBQ0gsTUFBTSxFQUFFLFFBQVE7SUFDaEIsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQjs7T0FFRztJQUNILE1BQU0sRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFFRixNQUFNLDBCQUEwQixHQUE4QyxFQUFFLENBQUM7QUFDakYsTUFBTSxzQkFBc0IsR0FBVSxFQUFFLENBQUM7QUFFekMsYUFBYTtBQUNiLG9CQUFvQjtBQUNwQixTQUFTLGFBQWE7SUFF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O1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdEIsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyBhIGxheWVyIG9mIGJhY2tlbmQgc2VydmljZSBhYnN0cmFjdGlvbi5cbiAqIERlZmluZXMgdGhlIGJhY2tlbmQgc2VydmljZXMuIFRoaXMgY2xhc3MgaXMgYnVpbHQgb250byB0aGUgYmFja2JvbmUganMsIGJ1dCB3aXRoXG4gKiBlbmhhbmNlZCBhYmlsaXRpZXMgb2YgbWFuYWdpbmcgdGhlIGRlcGVuZGVuY3kgYW1vbmcgYWxsIHNlcnZpY2VzIG9mIHRoZSBiYWNrZW5kLFxuICogYW5kIGNhY2hpbmcgc29tZSB0eXBlIG9mIG9iamVjdHMgZm9yIGEgcGVyaW9kIG9mIHRpbWUuXG4gKi9cbi8qanNsaW50IHVucGFyYW06IHRydWUgKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyB1cmxFbmNvZGUgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgU2xpZGluZ0V4cGlyYXRpb25DYWNoZSB9IGZyb20gJy4uL2NhY2hlL3NsaWRpbmctZXhwaXJhdGlvbi1jYWNoZSc7XG5cbmltcG9ydCB7IElKb2lucG9pbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2pvaW50LXBvaW50LmludGVyZmFjZSc7XG5cbmltcG9ydCB7XG4gICAgbW91bnRTeW5jQmVmb3JlQWR2aWNlLFxuICAgIG1vdW50QWpheEJlZm9yZUFkdmljZSxcbiAgICBtb3VudFN5bmNBcm91bmRBZHZpY2Vcbn0gZnJvbSAnLi9ldmVudC1odWInO1xuXG5pbXBvcnQgeyBJQmFja2JvbmVPcHRpb25zLCBJQmFja2JvbmVDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgRGF0YUZsb3cgPSBkZXBlbmRlbmNpZXNbJ2RhdGFmbG93J107XG5jb25zdCBiYWNrYm9uZSA9IGRlcGVuZGVuY2llc1snYmFja2JvbmUnXTtcbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuLyoqXG4gKiBUaGUgZW5kcG9pbnQgdHlwZXMgZm9yIGEgYmFja2VuZCBzZXJ2aWNlLlxuICovXG5leHBvcnQgY29uc3QgZW5kUG9pbnRFbnVtID0ge1xuICAgIG1vZGVsOiAxLFxuICAgIGNvbGxlY3Rpb246IDIsXG4gICAgcGFnZWRDb2xsZWN0aW9uOiAzXG59O1xuXG4vKipcbiAqIFRoZSBzeW5jIHR5cGVzIGRlZmluZWQgaW4gdGhlIGJhY2tib25lIGpzLlxuICovXG5leHBvcnQgY29uc3Qgc3luY01ldGhvZEVudW0gPSB7XG4gICAgLyoqXG4gICAgICogRmV0Y2ggYSBtb2RlbCBvciBhIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgcmVhZDogJ3JlYWQnLFxuICAgIC8qKlxuICAgICAqIFNhdmUgYSBtb2RlbC5cbiAgICAgKi9cbiAgICBjcmVhdGU6ICdjcmVhdGUnLFxuICAgIHBhdGNoOiAncGF0Y2gnLFxuICAgIHVwZGF0ZTogJ3VwZGF0ZScsXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhIG1vZGVsXG4gICAgICovXG4gICAgZGVsZXRlOiAnZGVsZXRlJ1xufTtcblxuY29uc3QgZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmc6IHsgW2tleTogc3RyaW5nXTogSUJhY2tib25lQ29uZmlndXJhdGlvbiB9ID0ge307XG5jb25zdCBtb3VudGVkRmVhdHVyZVJlbW92ZXJzOiBhbnlbXSA9IFtdO1xuXG4vLyBJZGVtcG90ZW50XG4vLyBJbnN0YW5jZSBvbmNlIC4uLlxuZnVuY3Rpb24gbW91bnRGZWF0dXJlcygpIHtcblxuICAgIGlmIChtb3VudGVkRmVhdHVyZVJlbW92ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKmpzbGludCB1bnBhcmFtOiB0cnVlICovXG4gICAgLypcbiAgICAgIGV2ZW50SHViLm1vdW50U3luY0xpc3RlbmVyKGZ1bmN0aW9uIChtZXRob2QsIG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgLy8gSWdub3JlIG90aGVyIG1ldGhvZFxuICAgICAgaWYgKG1ldGhvZCAhPT0gJ3N5bmMnKSB7XG4gICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSAmJiBvcHRpb25zLm1ldGhvZEtleSkge1xuICAgICAgdmFyIGRhdGFmbG93ID0gc2VsZi5fZGF0YWZsb3csXG4gICAgICBrZXkgPSBvcHRpb25zLmVuZFBvaW50S2V5ICsgJzonICsgb3B0aW9ucy5tZXRob2RLZXk7XG4gICAgICBkYXRhZmxvd1trZXldID0gZGF0YWZsb3dba2V5XSArIDE7XG4gICAgICB9XG4gICAgICB9KTsgKi9cblxuICAgIGxldCByZW1vdmVyID0gbW91bnRTeW5jQmVmb3JlQWR2aWNlKGZ1bmN0aW9uKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2RLZXkgPSBtZXRob2Q7XG4gICAgICAgIG9wdGlvbnMuZW5kUG9pbnRLZXkgPSBtb2RlbC5lbmRQb2ludEtleSB8fCAobW9kZWwuY29sbGVjdGlvbiA/IG1vZGVsLmNvbGxlY3Rpb24uZW5kUG9pbnRLZXkgOiBudWxsKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kUG9pbnRLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNmZyA9IGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW29wdGlvbnMuZW5kUG9pbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY2ZnT3B0aW9ucyA9IGNmZy5vcHRpb25zO1xuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5kZWxldGVVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy51cmwgPSBjZmdPcHRpb25zLmRlbGV0ZVVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuZGVsZXRlQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMuZGVsZXRlQ29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICd1cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMudXBkYXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy51cGRhdGVVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnVwZGF0ZUNvbnRlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLnVwZGF0ZUNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAnY3JlYXRlJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmNyZWF0ZVVybCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IGNmZ09wdGlvbnMuY3JlYXRlVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5jcmVhdGVDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5jcmVhdGVDb250ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3BhdGNoJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnBhdGNoVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy5wYXRjaFVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMucGF0Y2hDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy5wYXRjaENvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xuICAgIHJlbW92ZXIgPSBtb3VudEFqYXhCZWZvcmVBZHZpY2UoZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSkge1xuICAgICAgICAgICAgY29uc3QgY2ZnID0gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmdbb3B0aW9ucy5lbmRQb2ludEtleV07XG4gICAgICAgICAgICBjb25zdCBjZmdPcHRpb25zID0gY2ZnLm9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCBwb2xpY3lEZWxlZ2F0ZSA9IGNmZ09wdGlvbnMuc2VjdXJpdHlEZWxlZ2F0ZTtcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhUGFyYW1zID0gY2ZnT3B0aW9ucy5leHRyYVBhcmFtcztcbiAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyAmJlxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04ucGFyc2Uob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQob3B0aW9ucy5kYXRhLCBleHRyYVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwb2xpY3lEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICBwb2xpY3lEZWxlZ2F0ZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMuY29udGVudFR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChleHRyYVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmRhdGEsIGV4dHJhUGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvbGljeURlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvbGljeURlbGVnYXRlKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xuXG4gICAgcmVtb3ZlciA9IG1vdW50U3luY0Fyb3VuZEFkdmljZShmdW5jdGlvbihqb2ludHBvaW50OiBJSm9pbnBvaW50KSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBqb2ludHBvaW50LmFyZ3NbMl07XG4gICAgICAgIGlmIChvcHRpb25zLmVuZFBvaW50S2V5KSB7XG4gICAgICAgICAgICBjb25zdCBjZmcgPSBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZ1tvcHRpb25zLmVuZFBvaW50S2V5XTtcbiAgICAgICAgICAgIGNvbnN0IGNmZ09wdGlvbnMgPSBjZmcub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnN5bmNEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN5bmNEZWxlZ2F0ZSA9IGNmZ09wdGlvbnMuc3luY0RlbGVnYXRlO1xuICAgICAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gc3luY0RlbGVnYXRlKG9wdGlvbnMuZW5kUG9pbnRLZXksIG9wdGlvbnMsIGNmZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqb2ludHBvaW50LnByb2NlZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9pbnRwb2ludC5wcm9jZWVkKCk7XG4gICAgfSk7XG4gICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5wdXNoKHJlbW92ZXIpO1xufVxuXG5jb25zdCBkZWZhdWx0TGl2ZVBlcm9pZCA9IDYwICogNTtcblxuZXhwb3J0IGludGVyZmFjZSBJR2xvYmFsUHJvdmlkZXJDdG9yT3B0aW9ucyB7XG4gICAgd2ViaG9zdD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEdsb2JhbFByb3ZpZGVyIHtcblxuICAgIHByaXZhdGUgX2hvc3Q6IHN0cmluZztcbiAgICBwcml2YXRlIF9kYXRhZmxvdzogYW55O1xuICAgIHByaXZhdGUgX2NhY2hlOiBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlPGFueT47XG4gICAgcHJpdmF0ZSBfbXlFbmRQb2ludEtleXM6IGFueVtdO1xuICAgIHByaXZhdGUgX3VuaXF1ZU5hbWVQcmVmaXg6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGN0b3JPcHRpb25zOiBJR2xvYmFsUHJvdmlkZXJDdG9yT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlKGRlZmF1bHRMaXZlUGVyb2lkKTtcbiAgICAgICAgdGhpcy5fZGF0YWZsb3cgPSBuZXcgRGF0YUZsb3coKTtcbiAgICAgICAgdGhpcy5fbXlFbmRQb2ludEtleXMgPSBbXTtcbiAgICAgICAgdGhpcy5faG9zdCA9IGN0b3JPcHRpb25zLndlYmhvc3QgfHwgJyc7XG4gICAgICAgIHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggPSB0aGlzLl9ob3N0ID8gKHRoaXMuX2hvc3QucmVwbGFjZSgnLicsICctJykgKyAnLScpIDogJyc7XG5cbiAgICAgICAgLy8gTW91bnQgZmVhdHVyZXNcbiAgICAgICAgbW91bnRGZWF0dXJlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaG9zdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faG9zdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNvbmZpZ3VyYXRpb25NYXBwaW5nKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBlbmRwb2ludCBmb3IgYSBraW5kIG9mIHNlcnZpY2UuXG4gICAgICovXG4gICAgYWRkRW5kUG9pbnQobmFtZTogc3RyaW5nLCB0YWc6IG51bWJlciwgb3B0aW9uczogSUJhY2tib25lT3B0aW9ucykge1xuICAgICAgICBjb25zdCBjZmdNYXBwaW5nID0gdGhpcy5jb25maWd1cmF0aW9uTWFwcGluZztcbiAgICAgICAgY29uc3QgZGF0YWZsb3cgPSB0aGlzLl9kYXRhZmxvdztcbiAgICAgICAgY29uc3QgdW5pcXVlTmFtZSA9IHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggKyBuYW1lO1xuXG4gICAgICAgIGlmIChjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZGVmaW5lZCBlbmRwb2ludDogJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNmZ01hcHBpbmdbdW5pcXVlTmFtZV0gPSB7XG4gICAgICAgICAgICBvcHRpb25zOiBfLmV4dGVuZChvcHRpb25zLCB7IGVuZFBvaW50S2V5OiB1bmlxdWVOYW1lIH0pLFxuICAgICAgICAgICAgdGFnOiB0YWdcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cy5wdXNoKHVuaXF1ZU5hbWUpO1xuXG4gICAgICAgIC8vIFNldCB1cCBkYXRhIGZsb3cgbm9kZXMgKGl0IGlzIGVub3VnaCB0byB1c2UgbG9jYWwgbmFtZXMpXG4gICAgICAgIGlmICh0YWcgPT09IGVuZFBvaW50RW51bS5tb2RlbCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIHN5bmNNZXRob2RFbnVtKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCBsb29wIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgIGlmIChzeW5jTWV0aG9kRW51bS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN5bmNNZXRob2RFbnVtW2tdO1xuICAgICAgICAgICAgICAgICAgICBkYXRhZmxvd1tuYW1lICsgJzonICsgdmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhZmxvd1tuYW1lICsgJzonICsgc3luY01ldGhvZEVudW0ucmVhZF0gPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBlbmRwb2ludCBieSB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBnZXRFbmRQb2ludChuYW1lOiBzdHJpbmcsIGlnbm9yZUNhY2hlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuX2NhY2hlO1xuICAgICAgICBjb25zdCB1bmlxdWVOYW1lID0gdGhpcy5fdW5pcXVlTmFtZVByZWZpeCArIG5hbWU7XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhY2hlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IGNhY2hlLmdldCh1bmlxdWVOYW1lKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNmZ01hcHBpbmcgPSB0aGlzLmNvbmZpZ3VyYXRpb25NYXBwaW5nO1xuXG4gICAgICAgIGNvbnN0IGNmZyA9IGNmZ01hcHBpbmdbdW5pcXVlTmFtZV07XG4gICAgICAgIGlmICghY2ZnKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignTm8gZ2l2ZW4gZW5kcG9pbnQgaXMgZGVmaW5lZCBmb3I6ICcgKyBuYW1lKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGNmZy50YWcgPT09IGVuZFBvaW50RW51bS5tb2RlbCkge1xuICAgICAgICAgICAgdmFsdWUgPSBiYWNrYm9uZS5Nb2RlbC5leHRlbmQoY2ZnLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2UgaWYgKGNmZy50YWcgPT09IGVuZFBvaW50RW51bS5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKGNmZy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmIChjZmcudGFnID09PSBlbmRQb2ludEVudW0ucGFnZWRDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhY2tib25lLlBhZ2VhYmxlQ29sbGVjdGlvbi5leHRlbmQoY2ZnLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYWNoZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2FjaGUuc2V0KHVuaXF1ZU5hbWUsIHZhbHVlLCBkZWZhdWx0TGl2ZVBlcm9pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdW5kZXJseWluZyBjb25maWd1cmF0aW9uIGZvciBhbiBlbmRwb2ludC5cbiAgICAgKi9cbiAgICBnZXRDb25maWd1cmF0aW9uKGVuZFBvaW50S2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdW5pcXVlTmFtZSA9IHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggKyBlbmRQb2ludEtleTtcbiAgICAgICAgY29uc3QgY2ZnTWFwcGluZyA9IHRoaXMuY29uZmlndXJhdGlvbk1hcHBpbmc7XG4gICAgICAgIHJldHVybiBjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIHRoZSBjYWxsYmFjayB3aGVuIHNvbWUgb3BlcmF0aW9ucyBoYXBwZW4uXG4gICAgICovXG4gICAgYWRkV2hlbkNhbGxiYWNrKG5hbWU6IHN0cmluZ1tdLCBjYWxsYmFjazogYW55KSB7XG4gICAgICAgIGNvbnN0IGRhdGFmbG93ID0gdGhpcy5fZGF0YWZsb3c7XG4gICAgICAgIGRhdGFmbG93LndoZW4obmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgdGhlIGRlcGVuZGVuY3kuXG4gICAgICovXG4gICAgYWRkRGVwZW5kZW5jeShzcmM6IHN0cmluZywgZHN0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZGF0YWZsb3cgPSB0aGlzLl9kYXRhZmxvdztcbiAgICAgICAgZGF0YWZsb3cub24oc3JjLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRhdGFmbG93W2RzdF0gPSBkYXRhZmxvd1tkc3RdICsgMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdXAgYWxsIGNhY2hlZCBkYXRhIHByb3ZpZGVyXG4gICAgICovXG4gICAgY2xlYW51cENhY2hlKCkge1xuICAgICAgICAvLyBSZW1vdmUgd2hhdCB3ZSBoYXZlIGluIGNhY2hlXG4gICAgICAgIHRoaXMuX2NhY2hlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgY2xlYW5Nb3VudGVkRmVhdHVyZXMoKSB7XG4gICAgICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMuZm9yRWFjaChmdW5jdGlvbihyZW1vdmVyKSB7XG4gICAgICAgICAgICByZW1vdmVyLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgbW91bnRlZEZlYXR1cmVSZW1vdmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIHByb3ZpZGVyIHRvIHJlbGVhc2UgcmVzb3VyY2VzXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX215RW5kUG9pbnRLZXlzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgZGVsZXRlIGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW2tdO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cy5sZW5ndGggPSAwO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlLmRlc3Ryb3koKTtcblxuICAgICAgICAvLyBObyBkZXN0cm95IG1ldGhvZHMgZm9yIHRoZSBmb2xsb3dpbmcgdHdvIGluc3RhbmNlcy5cbiAgICAgICAgdGhpcy5fY2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9kYXRhZmxvdyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2hvc3QgPSBudWxsO1xuICAgICAgICB0aGlzLl91bmlxdWVOYW1lUHJlZml4ID0gbnVsbDtcbiAgICB9XG59XG5cblxuXG4iXX0=