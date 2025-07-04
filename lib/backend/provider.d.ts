/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time.
 */
import { IBackboneOptions } from './interfaces';
/**
 * The endpoint types for a backend service.
 */
export declare const endPointEnum: {
    model: number;
    collection: number;
    pagedCollection: number;
};
/**
 * The sync types defined in the backbone js.
 */
export declare const syncMethodEnum: {
    /**
     * Fetch a model or a collection.
     */
    read: string;
    /**
     * Save a model.
     */
    create: string;
    patch: string;
    update: string;
    /**
     * Destroy a model
     */
    delete: string;
};
export interface IGlobalProviderCtorOptions {
    webhost?: string;
}
export declare class GlobalProvider {
    private _host;
    private _dataflow;
    private _cache;
    private _myEndPointKeys;
    private _uniqueNamePrefix;
    constructor(ctorOptions: IGlobalProviderCtorOptions);
    get host(): string;
    get configurationMapping(): {
        [key: string]: any;
    };
    /**
     * Defines an endpoint for a kind of service.
     */
    addEndPoint(name: string, tag: number, options: IBackboneOptions): void;
    /**
     * Retrieves the endpoint by the given name.
     */
    getEndPoint(name: string, ignoreCache?: boolean): any;
    /**
     * Get the underlying configuration for an endpoint.
     */
    getConfiguration(endPointKey: string): any;
    /**
     * Provides the callback when some operations happen.
     */
    addWhenCallback(name: string[], callback: any): void;
    /**
     * Defines the dependency.
     */
    addDependency(src: string, dst: string): void;
    /**
     * Clean up all cached data provider
     */
    cleanupCache(): void;
    cleanMountedFeatures(): void;
    /**
     * Destroy the provider to release resources
     */
    destroy(): void;
}
