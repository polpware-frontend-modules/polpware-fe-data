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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvYmFja2VuZC9wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCx5QkFBeUI7QUFFekIsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFJM0UsT0FBTyxFQUNILHFCQUFxQixFQUNyQixxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3hCLE1BQU0sYUFBYSxDQUFDO0FBSXJCLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUVsQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRztJQUN4QixLQUFLLEVBQUUsQ0FBQztJQUNSLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZUFBZSxFQUFFLENBQUM7Q0FDckIsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHO0lBQzFCOztPQUVHO0lBQ0gsSUFBSSxFQUFFLE1BQU07SUFDWjs7T0FFRztJQUNILE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLFFBQVE7SUFDaEI7O09BRUc7SUFDSCxNQUFNLEVBQUUsUUFBUTtDQUNuQixDQUFDO0FBRUYsTUFBTSwwQkFBMEIsR0FBOEMsRUFBRSxDQUFDO0FBQ2pGLE1BQU0sc0JBQXNCLEdBQVUsRUFBRSxDQUFDO0FBRXpDLGFBQWE7QUFDYixv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QkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXRCLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgYSBsYXllciBvZiBiYWNrZW5kIHNlcnZpY2UgYWJzdHJhY3Rpb24uXG4gKiBEZWZpbmVzIHRoZSBiYWNrZW5kIHNlcnZpY2VzLiBUaGlzIGNsYXNzIGlzIGJ1aWx0IG9udG8gdGhlIGJhY2tib25lIGpzLCBidXQgd2l0aFxuICogZW5oYW5jZWQgYWJpbGl0aWVzIG9mIG1hbmFnaW5nIHRoZSBkZXBlbmRlbmN5IGFtb25nIGFsbCBzZXJ2aWNlcyBvZiB0aGUgYmFja2VuZCxcbiAqIGFuZCBjYWNoaW5nIHNvbWUgdHlwZSBvZiBvYmplY3RzIGZvciBhIHBlcmlvZCBvZiB0aW1lLlxuICovXG4vKmpzbGludCB1bnBhcmFtOiB0cnVlICovXG5cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IHsgdXJsRW5jb2RlIH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmltcG9ydCB7IFNsaWRpbmdFeHBpcmF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jYWNoZS9zbGlkaW5nLWV4cGlyYXRpb24tY2FjaGUnO1xuXG5pbXBvcnQgeyBJSm9pbnBvaW50IH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9qb2ludC1wb2ludC5pbnRlcmZhY2UnO1xuXG5pbXBvcnQge1xuICAgIG1vdW50U3luY0JlZm9yZUFkdmljZSxcbiAgICBtb3VudEFqYXhCZWZvcmVBZHZpY2UsXG4gICAgbW91bnRTeW5jQXJvdW5kQWR2aWNlXG59IGZyb20gJy4vZXZlbnQtaHViJztcblxuaW1wb3J0IHsgSUJhY2tib25lT3B0aW9ucywgSUJhY2tib25lQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IERhdGFGbG93ID0gZGVwZW5kZW5jaWVzWydkYXRhZmxvdyddO1xuY29uc3QgYmFja2JvbmUgPSBkZXBlbmRlbmNpZXNbJ2JhY2tib25lJ107XG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5cbi8qKlxuICogVGhlIGVuZHBvaW50IHR5cGVzIGZvciBhIGJhY2tlbmQgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVuZFBvaW50RW51bSA9IHtcbiAgICBtb2RlbDogMSxcbiAgICBjb2xsZWN0aW9uOiAyLFxuICAgIHBhZ2VkQ29sbGVjdGlvbjogM1xufTtcblxuLyoqXG4gKiBUaGUgc3luYyB0eXBlcyBkZWZpbmVkIGluIHRoZSBiYWNrYm9uZSBqcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHN5bmNNZXRob2RFbnVtID0ge1xuICAgIC8qKlxuICAgICAqIEZldGNoIGEgbW9kZWwgb3IgYSBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIHJlYWQ6ICdyZWFkJyxcbiAgICAvKipcbiAgICAgKiBTYXZlIGEgbW9kZWwuXG4gICAgICovXG4gICAgY3JlYXRlOiAnY3JlYXRlJyxcbiAgICBwYXRjaDogJ3BhdGNoJyxcbiAgICB1cGRhdGU6ICd1cGRhdGUnLFxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgYSBtb2RlbFxuICAgICAqL1xuICAgIGRlbGV0ZTogJ2RlbGV0ZSdcbn07XG5cbmNvbnN0IGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nOiB7IFtrZXk6IHN0cmluZ106IElCYWNrYm9uZUNvbmZpZ3VyYXRpb24gfSA9IHt9O1xuY29uc3QgbW91bnRlZEZlYXR1cmVSZW1vdmVyczogYW55W10gPSBbXTtcblxuLy8gSWRlbXBvdGVudFxuLy8gSW5zdGFuY2Ugb25jZSAuLi5cbmZ1bmN0aW9uIG1vdW50RmVhdHVyZXMoKSB7XG5cbiAgICBpZiAobW91bnRlZEZlYXR1cmVSZW1vdmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLypqc2xpbnQgdW5wYXJhbTogdHJ1ZSAqL1xuICAgIC8qXG4gICAgICBldmVudEh1Yi5tb3VudFN5bmNMaXN0ZW5lcihmdW5jdGlvbiAobWV0aG9kLCBtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgIC8vIElnbm9yZSBvdGhlciBtZXRob2RcbiAgICAgIGlmIChtZXRob2QgIT09ICdzeW5jJykge1xuICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZW5kUG9pbnRLZXkgJiYgb3B0aW9ucy5tZXRob2RLZXkpIHtcbiAgICAgIHZhciBkYXRhZmxvdyA9IHNlbGYuX2RhdGFmbG93LFxuICAgICAga2V5ID0gb3B0aW9ucy5lbmRQb2ludEtleSArICc6JyArIG9wdGlvbnMubWV0aG9kS2V5O1xuICAgICAgZGF0YWZsb3dba2V5XSA9IGRhdGFmbG93W2tleV0gKyAxO1xuICAgICAgfVxuICAgICAgfSk7ICovXG5cbiAgICBsZXQgcmVtb3ZlciA9IG1vdW50U3luY0JlZm9yZUFkdmljZShmdW5jdGlvbihtZXRob2QsIG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMubWV0aG9kS2V5ID0gbWV0aG9kO1xuICAgICAgICBvcHRpb25zLmVuZFBvaW50S2V5ID0gbW9kZWwuZW5kUG9pbnRLZXkgfHwgKG1vZGVsLmNvbGxlY3Rpb24gPyBtb2RlbC5jb2xsZWN0aW9uLmVuZFBvaW50S2V5IDogbnVsbCk7XG4gICAgICAgIGlmIChvcHRpb25zLmVuZFBvaW50S2V5KSB7XG4gICAgICAgICAgICBjb25zdCBjZmcgPSBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZ1tvcHRpb25zLmVuZFBvaW50S2V5XTtcbiAgICAgICAgICAgIGNvbnN0IGNmZ09wdGlvbnMgPSBjZmcub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdkZWxldGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuZGVsZXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gY2ZnT3B0aW9ucy5kZWxldGVVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLmRlbGV0ZUNvbnRlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLmRlbGV0ZUNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAndXBkYXRlJykge1xuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnVwZGF0ZVVybCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IGNmZ09wdGlvbnMudXBkYXRlVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy51cGRhdGVDb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gY2ZnT3B0aW9ucy51cGRhdGVDb250ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5jcmVhdGVVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy51cmwgPSBjZmdPcHRpb25zLmNyZWF0ZVVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNmZ09wdGlvbnMuY3JlYXRlQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMuY3JlYXRlQ29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdwYXRjaCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5wYXRjaFVybCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IGNmZ09wdGlvbnMucGF0Y2hVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZmdPcHRpb25zLnBhdGNoQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb250ZW50VHlwZSA9IGNmZ09wdGlvbnMucGF0Y2hDb250ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMucHVzaChyZW1vdmVyKTtcbiAgICByZW1vdmVyID0gbW91bnRBamF4QmVmb3JlQWR2aWNlKGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kUG9pbnRLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNmZyA9IGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nW29wdGlvbnMuZW5kUG9pbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY2ZnT3B0aW9ucyA9IGNmZy5vcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgcG9saWN5RGVsZWdhdGUgPSBjZmdPcHRpb25zLnNlY3VyaXR5RGVsZWdhdGU7XG4gICAgICAgICAgICBjb25zdCBleHRyYVBhcmFtcyA9IGNmZ09wdGlvbnMuZXh0cmFQYXJhbXM7XG4gICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgJiZcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnBhcnNlKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZGF0YSwgZXh0cmFQYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocG9saWN5RGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9saWN5RGVsZWdhdGUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YSA9IHVybEVuY29kZShvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBjZmdPcHRpb25zLmNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQob3B0aW9ucy5kYXRhLCBleHRyYVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwb2xpY3lEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICBwb2xpY3lEZWxlZ2F0ZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZGF0YSA9IHVybEVuY29kZShvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMucHVzaChyZW1vdmVyKTtcblxuICAgIHJlbW92ZXIgPSBtb3VudFN5bmNBcm91bmRBZHZpY2UoZnVuY3Rpb24oam9pbnRwb2ludDogSUpvaW5wb2ludCkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gam9pbnRwb2ludC5hcmdzWzJdO1xuICAgICAgICBpZiAob3B0aW9ucy5lbmRQb2ludEtleSkge1xuICAgICAgICAgICAgY29uc3QgY2ZnID0gZ2xvYmFsQ29uZmlndXJhdGlvbk1hcHBpbmdbb3B0aW9ucy5lbmRQb2ludEtleV07XG4gICAgICAgICAgICBjb25zdCBjZmdPcHRpb25zID0gY2ZnLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoY2ZnT3B0aW9ucy5zeW5jRGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW5jRGVsZWdhdGUgPSBjZmdPcHRpb25zLnN5bmNEZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN5bmNEZWxlZ2F0ZShvcHRpb25zLmVuZFBvaW50S2V5LCBvcHRpb25zLCBjZmcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gam9pbnRwb2ludC5wcm9jZWVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvaW50cG9pbnQucHJvY2VlZCgpO1xuICAgIH0pO1xuICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMucHVzaChyZW1vdmVyKTtcbn1cblxuY29uc3QgZGVmYXVsdExpdmVQZXJvaWQgPSA2MCAqIDU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdsb2JhbFByb3ZpZGVyQ3Rvck9wdGlvbnMge1xuICAgIHdlYmhvc3Q/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxQcm92aWRlciB7XG5cbiAgICBwcml2YXRlIF9ob3N0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZGF0YWZsb3c6IGFueTtcbiAgICBwcml2YXRlIF9jYWNoZTogU2xpZGluZ0V4cGlyYXRpb25DYWNoZTxhbnk+O1xuICAgIHByaXZhdGUgX215RW5kUG9pbnRLZXlzOiBhbnlbXTtcbiAgICBwcml2YXRlIF91bmlxdWVOYW1lUHJlZml4OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihjdG9yT3B0aW9uczogSUdsb2JhbFByb3ZpZGVyQ3Rvck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBuZXcgU2xpZGluZ0V4cGlyYXRpb25DYWNoZShkZWZhdWx0TGl2ZVBlcm9pZCk7XG4gICAgICAgIHRoaXMuX2RhdGFmbG93ID0gbmV3IERhdGFGbG93KCk7XG4gICAgICAgIHRoaXMuX215RW5kUG9pbnRLZXlzID0gW107XG4gICAgICAgIHRoaXMuX2hvc3QgPSBjdG9yT3B0aW9ucy53ZWJob3N0IHx8ICcnO1xuICAgICAgICB0aGlzLl91bmlxdWVOYW1lUHJlZml4ID0gdGhpcy5faG9zdCA/ICh0aGlzLl9ob3N0LnJlcGxhY2UoJy4nLCAnLScpICsgJy0nKSA6ICcnO1xuXG4gICAgICAgIC8vIE1vdW50IGZlYXR1cmVzXG4gICAgICAgIG1vdW50RmVhdHVyZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGhvc3QoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvc3Q7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjb25maWd1cmF0aW9uTWFwcGluZygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbENvbmZpZ3VyYXRpb25NYXBwaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZW5kcG9pbnQgZm9yIGEga2luZCBvZiBzZXJ2aWNlLlxuICAgICAqL1xuICAgIGFkZEVuZFBvaW50KG5hbWU6IHN0cmluZywgdGFnOiBudW1iZXIsIG9wdGlvbnM6IElCYWNrYm9uZU9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgY2ZnTWFwcGluZyA9IHRoaXMuY29uZmlndXJhdGlvbk1hcHBpbmc7XG4gICAgICAgIGNvbnN0IGRhdGFmbG93ID0gdGhpcy5fZGF0YWZsb3c7XG4gICAgICAgIGNvbnN0IHVuaXF1ZU5hbWUgPSB0aGlzLl91bmlxdWVOYW1lUHJlZml4ICsgbmFtZTtcblxuICAgICAgICBpZiAoY2ZnTWFwcGluZ1t1bmlxdWVOYW1lXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWRlZmluZWQgZW5kcG9pbnQ6ICcgKyBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdID0ge1xuICAgICAgICAgICAgb3B0aW9uczogXy5leHRlbmQob3B0aW9ucywgeyBlbmRQb2ludEtleTogdW5pcXVlTmFtZSB9KSxcbiAgICAgICAgICAgIHRhZzogdGFnXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fbXlFbmRQb2ludEtleXMucHVzaCh1bmlxdWVOYW1lKTtcblxuICAgICAgICAvLyBTZXQgdXAgZGF0YSBmbG93IG5vZGVzIChpdCBpcyBlbm91Z2ggdG8gdXNlIGxvY2FsIG5hbWVzKVxuICAgICAgICBpZiAodGFnID09PSBlbmRQb2ludEVudW0ubW9kZWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBpbiBzeW5jTWV0aG9kRW51bSkge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgbG9vcCBpZiB0aGUgcHJvcGVydHkgaXMgZnJvbSBwcm90b3R5cGVcbiAgICAgICAgICAgICAgICBpZiAoc3luY01ldGhvZEVudW0uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzeW5jTWV0aG9kRW51bVtrXTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YWZsb3dbbmFtZSArICc6JyArIHZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YWZsb3dbbmFtZSArICc6JyArIHN5bmNNZXRob2RFbnVtLnJlYWRdID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZW5kcG9pbnQgYnkgdGhlIGdpdmVuIG5hbWUuXG4gICAgICovXG4gICAgZ2V0RW5kUG9pbnQobmFtZTogc3RyaW5nLCBpZ25vcmVDYWNoZT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgY29uc3QgdW5pcXVlTmFtZSA9IHRoaXMuX3VuaXF1ZU5hbWVQcmVmaXggKyBuYW1lO1xuXG4gICAgICAgIGlmIChpZ25vcmVDYWNoZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVkVmFsdWUgPSBjYWNoZS5nZXQodW5pcXVlTmFtZSk7XG4gICAgICAgICAgICBpZiAoY2FjaGVkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjZmdNYXBwaW5nID0gdGhpcy5jb25maWd1cmF0aW9uTWFwcGluZztcblxuICAgICAgICBjb25zdCBjZmcgPSBjZmdNYXBwaW5nW3VuaXF1ZU5hbWVdO1xuICAgICAgICBpZiAoIWNmZykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ05vIGdpdmVuIGVuZHBvaW50IGlzIGRlZmluZWQgZm9yOiAnICsgbmFtZSk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChjZmcudGFnID09PSBlbmRQb2ludEVudW0ubW9kZWwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYmFja2JvbmUuTW9kZWwuZXh0ZW5kKGNmZy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmIChjZmcudGFnID09PSBlbmRQb2ludEVudW0uY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBiYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZChjZmcub3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2ZnLnRhZyA9PT0gZW5kUG9pbnRFbnVtLnBhZ2VkQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBiYWNrYm9uZS5QYWdlYWJsZUNvbGxlY3Rpb24uZXh0ZW5kKGNmZy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWdub3JlQ2FjaGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNhY2hlLnNldCh1bmlxdWVOYW1lLCB2YWx1ZSwgZGVmYXVsdExpdmVQZXJvaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHVuZGVybHlpbmcgY29uZmlndXJhdGlvbiBmb3IgYW4gZW5kcG9pbnQuXG4gICAgICovXG4gICAgZ2V0Q29uZmlndXJhdGlvbihlbmRQb2ludEtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHVuaXF1ZU5hbWUgPSB0aGlzLl91bmlxdWVOYW1lUHJlZml4ICsgZW5kUG9pbnRLZXk7XG4gICAgICAgIGNvbnN0IGNmZ01hcHBpbmcgPSB0aGlzLmNvbmZpZ3VyYXRpb25NYXBwaW5nO1xuICAgICAgICByZXR1cm4gY2ZnTWFwcGluZ1t1bmlxdWVOYW1lXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlcyB0aGUgY2FsbGJhY2sgd2hlbiBzb21lIG9wZXJhdGlvbnMgaGFwcGVuLlxuICAgICAqL1xuICAgIGFkZFdoZW5DYWxsYmFjayhuYW1lOiBzdHJpbmdbXSwgY2FsbGJhY2s6IGFueSkge1xuICAgICAgICBjb25zdCBkYXRhZmxvdyA9IHRoaXMuX2RhdGFmbG93O1xuICAgICAgICBkYXRhZmxvdy53aGVuKG5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHRoZSBkZXBlbmRlbmN5LlxuICAgICAqL1xuICAgIGFkZERlcGVuZGVuY3koc3JjOiBzdHJpbmcsIGRzdDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGRhdGFmbG93ID0gdGhpcy5fZGF0YWZsb3c7XG4gICAgICAgIGRhdGFmbG93Lm9uKHNyYywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkYXRhZmxvd1tkc3RdID0gZGF0YWZsb3dbZHN0XSArIDE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIHVwIGFsbCBjYWNoZWQgZGF0YSBwcm92aWRlclxuICAgICAqL1xuICAgIGNsZWFudXBDYWNoZSgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHdoYXQgd2UgaGF2ZSBpbiBjYWNoZVxuICAgICAgICB0aGlzLl9jYWNoZS5yZXNldCgpO1xuICAgIH1cblxuICAgIGNsZWFuTW91bnRlZEZlYXR1cmVzKCkge1xuICAgICAgICBtb3VudGVkRmVhdHVyZVJlbW92ZXJzLmZvckVhY2goZnVuY3Rpb24ocmVtb3Zlcikge1xuICAgICAgICAgICAgcmVtb3Zlci5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1vdW50ZWRGZWF0dXJlUmVtb3ZlcnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBwcm92aWRlciB0byByZWxlYXNlIHJlc291cmNlc1xuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIERlbGV0ZSBjYWNoZVxuICAgICAgICB0aGlzLl9teUVuZFBvaW50S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIGRlbGV0ZSBnbG9iYWxDb25maWd1cmF0aW9uTWFwcGluZ1trXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbXlFbmRQb2ludEtleXMubGVuZ3RoID0gMDtcblxuICAgICAgICB0aGlzLl9jYWNoZS5kZXN0cm95KCk7XG5cbiAgICAgICAgLy8gTm8gZGVzdHJveSBtZXRob2RzIGZvciB0aGUgZm9sbG93aW5nIHR3byBpbnN0YW5jZXMuXG4gICAgICAgIHRoaXMuX2NhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGF0YWZsb3cgPSBudWxsO1xuICAgICAgICB0aGlzLl9ob3N0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdW5pcXVlTmFtZVByZWZpeCA9IG51bGw7XG4gICAgfVxufVxuXG5cblxuIl19