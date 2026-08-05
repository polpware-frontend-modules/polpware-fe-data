import * as ngrxStore from '@ngrx/store';
import { Action, ActionReducerMap, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as i0 from '@angular/core';
import { ITypeDef } from '@polpware/fe-utilities';

interface IModelLike {
    id: any;
    attributes: any;
    destroyFromTable(): void;
    getForeignModel(foreignKey: string): IModelLike;
    hasAnyReference(): boolean;
}
interface IFullModelLike extends IModelLike {
    set(...args: any[]): any;
    trigger(evt: string, data: any): any;
}
interface IBackboneCollectionLike {
    state: IBackboneQueryParams;
    hasNextPage(): boolean;
    getFirstPage(): PromiseLike<any>;
    getNextPage(): PromiseLike<any>;
    forEach(f: (elem: any) => any): any;
}
interface IFullBackboneCollectionLike extends IBackboneCollectionLike {
    models: [IFullModelLike];
    get(id: any): IFullModelLike;
    findWhere(filter: {
        [key: string]: any;
    }): IFullModelLike;
    where(filter: {
        [key: string]: any;
    }): [IFullModelLike];
    add(m: any): IFullModelLike;
    remove(m: IModelLike): IFullModelLike;
    modelId(m: object): any;
    reset(): void;
    on(evt: string, callback: any): any;
    off(evt: string, callback: any): any;
    once(evt: string, callback: any): any;
}
interface IBackboneQueryParams {
    currentPage?: any;
    pageSize?: any;
    totalPages?: any;
    totalRecords?: any;
    sortKey?: any;
    order?: any;
    directions?: any;
}

declare class DummyRecords {
    private _data;
    constructor();
    getDummyRecord(key: string): IModelLike;
}

/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */

interface IRelationalTableOptions {
    name: string;
    cascade?: boolean;
    dataProviderCtor?: any;
    dataProviderCtorOption?: any;
}
interface IRelationalTable {
    name: string;
    cascade: boolean;
    dataProvider(): IFullBackboneCollectionLike;
    get(id: any): IFullModelLike;
    add(model: object): IFullModelLike;
    addMany(models: any[]): IFullModelLike[];
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void;
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void;
    hasForeignRelation(foreignKey: string): boolean;
    hasReverseForeignRelation(reverseForeignKey: string): boolean;
    destroy(): void;
}
declare class RelationalTable implements IRelationalTable {
    dummyRecords: DummyRecords;
    private _name;
    private _cascade;
    private _addConstraint;
    private _deleteConstraint;
    private _foreignRelation;
    private _reverseForeignRelation;
    private _dataProvider;
    private _onDeletedHandler;
    constructor(options: IRelationalTableOptions, dummyRecords: DummyRecords);
    get name(): string;
    get cascade(): boolean;
    dataProvider(): IFullBackboneCollectionLike;
    onDeleted(): void;
    /**
     * Check if the given items are still in use.
     */
    private hasAnyReference;
    /**
     * Removing any items in other tables which depend on the deleted item.
     */
    private removeReverseForeign;
    /**
     * Gets the model in the table by id.
     */
    get(id: any): IFullModelLike;
    private destroyFromTable;
    private getForeignModel;
    /**
     * Adds an item in the Table and recursively add foreign items.
     */
    add(model: object): IFullModelLike;
    /**
     * Add many items into a table.
     */
    addMany(models: any[]): IFullModelLike[];
    /**
     * Adds a foreign relation.
     */
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void;
    /**
     * Add a reverse foreign relation.
     */
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void;
    /**
     * Check if a given foreign relation is present.
     */
    hasForeignRelation(foreignKey: string): boolean;
    /**
     * Checks if a given reverse foreign relation is present.
     */
    hasReverseForeignRelation(reverseForeignKey: string): boolean;
    /**
     * Destroys table
     */
    destroy(): void;
}

/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */

interface IRelationalDatabase {
    getReference(): IRelationalDatabase;
    addTable(options: IRelationalTableOptions): IRelationalTable;
    getTable(name: string): IRelationalTable;
    addForeignkey(name: string, foreignKey: string, foreignName: string): void;
    destroy(): void;
}
declare class RelationDatabase implements IRelationalDatabase {
    private _tableCollection;
    private _referenceCounter;
    private _dummyRecords;
    /**
     * Represents a relational database.
     */
    constructor();
    /**
     * Gets a reference of the file system database
     */
    getReference(): IRelationalDatabase;
    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    addTable(options: IRelationalTableOptions): IRelationalTable;
    /**
     * Retrieves a table by name.
     */
    getTable(name: string): IRelationalTable;
    /**
     * Defines a foreign relation between two tables.
     */
    addForeignkey(name: string, foreignKey: string, foreignName: string): void;
    /**
     * Destroys database
     */
    destroy(): void;
}

interface IRelationDatabaseSchema {
    leafTables: {
        [key: string]: {
            relations?: {
                [key: string]: string;
            };
        };
    };
    assocations: {
        [key: string]: {
            relations: {
                [key: string]: string;
            };
        };
    };
}

/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
interface IXHRCtorOption {
    url: string;
    async?: boolean;
    type?: 'POST' | 'GET';
    content_type: 'application/x-www-form-urlencoded' | 'application/json' | '';
    response_type: 'json' | 'blob' | 'document' | 'text' | 'arraybuffer' | '';
    requestheaders: any[];
    scope?: any;
    success_scope?: any;
    error_scope?: any;
    data?: any;
}
declare function sendPromise(options: IXHRCtorOption): PromiseLike<any>;

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
declare function loadJsonUriP(url: any): any;
/**
 * Tests if a url is reachable.
 * @function pingP
 * @param {String} url The url to be tested.
 * @param {Object} [options]  A set of ajax parameters.
 * @returns {Promise}
 */
declare function pingP(url: any, options: any): any;
/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @function loadHtmlP
 * @param {String} url
 * @returns {Promise}
 */
declare function loadHtmlP(url: any): any;

interface IEventArgs<T> {
    data: T;
    type: string;
    preventDefault: () => void;
    stopPropagation: () => void;
    stopImmediatePropagation: () => void;
    isDefaultPrevented: () => boolean;
    isPropagationStopped: () => boolean;
    isImmediatePropagationStopped: () => boolean;
}

interface IObservable {
    fire<U>(name: string, data: U, bubble?: boolean): IEventArgs<U>;
    on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any;
    off(name: string, callback: (...args: any[]) => any): any;
    once(name: string, callback: (...args: any[]) => any): any;
    hasEventListeners(name: string): boolean;
}

interface INgZoneLike {
    runOutsideAngular<T>(fn: (...args: any[]) => T): T;
}

interface ISlidingExpireCache<T> {
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>): any;
    get(key: string, seconds?: number): T | null;
    invalidate(key: string): void;
    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
}

declare class SlidingExpirationCache<T> implements ISlidingExpireCache<T> {
    private _defaultSeconds;
    private _cache;
    private _timeInterval;
    constructor(_defaultSeconds: number, scheduleInterval?: number, ngZone?: INgZoneLike);
    private onExpireEventName;
    private afterRemoveEventName;
    private resetExpireKey;
    get asObservable(): IObservable;
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>): any;
    get(key: string, seconds?: number): T | null;
    invalidate(key: string): void;
    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;
    get count(): number;
    reset(): void;
    private resetInternal;
    destroy(): void;
}

interface ICacheBackend<T> {
    set(key: string, value: T | number): any;
    get(key: string): T | number | null;
    remove(key: string): any;
    length(key: string): number;
    key(index: number): string;
    enabled(): boolean;
}

declare class MemoryBackend<T> implements ICacheBackend<T> {
    private _store;
    constructor();
    /**
     * Sets a key-value pair
     */
    set(key: string, value: T | number): T | number;
    /**
     * Gets the value for a given key.
     */
    get(key: string): T | number | null;
    /**
     * Removes the given key and its corresponding value.
     */
    remove(key: string): void;
    /**
     * Returns the number of stored items.
     */
    length(key: string): number;
    /**
     * Retuns the ith key in the store table.
     */
    key(index: number): string;
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    enabled(): boolean;
}

interface IPolicyCtorOptions {
    url: string;
}
interface IOAuthTokenPolicyCtorOptions extends IPolicyCtorOptions {
    clientId: string;
    clientSecret: string;
    scope: string;
}
interface IAntiForgeryKeyCtorOptions extends IPolicyCtorOptions {
    antiForgeryKey: string;
    elementTag: string;
}
interface IOAuthParams {
    client_id: string;
    client_secret: string;
    scope: string;
    grant_type: any;
}
interface IOAuthToken {
    expiresIn: number;
    createdOn: number;
    token: string;
    refreshToken: string;
}
interface IOpenIDToken extends IOAuthToken {
    openId: string;
}
interface IPolicy {
    getTokenInternal(): PromiseLike<string>;
    applyTo(options: any): void;
    isExpired(): boolean;
    readFrom(settings: {}): any;
    persistent(): any;
    applyToV2(options: any): void;
    applyToV3(options: any): void;
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP(): PromiseLike<string>;
    reset(): any;
}
declare const DummyOAuthTokenCtorParams: IOAuthTokenPolicyCtorOptions;

/**
 * @fileOverview
 * A base class for defining security plicies.
 */

declare abstract class PolicyBase implements IPolicy {
    protected url: string;
    protected token: string;
    constructor(settings: IPolicyCtorOptions);
    abstract getTokenInternal(): PromiseLike<string>;
    abstract applyTo(options: any): void;
    abstract isExpired(): boolean;
    abstract readFrom(settings: {}): any;
    abstract persistent(): any;
    abstract applyToV2(options: any): void;
    abstract applyToV3(options: any): void;
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP(): PromiseLike<string>;
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    reset(): void;
}

/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */

declare function adaptToOAuthToken(data: any): IOAuthToken;
declare class OAuthTokenPolicy extends PolicyBase {
    protected clientId: string;
    protected clientSecret: string;
    protected scope: string;
    protected expiresIn: number;
    protected createdOn: number;
    protected refreshToken: string;
    grantType: 'authorization_code' | 'refresh_token' | 'password' | 'client_credentials';
    response: any;
    constructor(settings: IOAuthTokenPolicyCtorOptions);
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    readFrom(settings: IOAuthToken): void;
    /**
     * Returns the data that are persistentable.
     */
    persistent(): IOAuthToken;
    getParams(): any;
    getTokenInternal(): PromiseLike<string>;
    /**
     * Returns if the token is expired or not.
     */
    isExpired(): boolean;
    /**
     * Applys the token to the given options.
     */
    applyTo(options: any): void;
    /**
     * Apply security policy to the given options.
     */
    applyToV2(options: any): void;
    /**
     * App security policy the given options, used for our customized XHR.
     */
    applyToV3(options: any): void;
    /**
     * Resets the token and its assoicated information.
     */
    reset(): void;
}

/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */

declare function adaptToOpenIDToken(data: any): IOpenIDToken;
declare class OpenIDPolicy extends OAuthTokenPolicy {
    private _openId;
    constructor();
    /**
     * Returns the necessary information for peristence.
     */
    persistent(): IOpenIDToken;
    /**
     * Reads credential from the given settings.
     */
    readFrom(settings: IOpenIDToken): this;
}

declare class NullPolicy implements IPolicy {
    getTokenInternal(): PromiseLike<string>;
    applyTo(options: any): void;
    isExpired(): boolean;
    readFrom(settings: {}): void;
    persistent(): any;
    applyToV2(options: any): void;
    applyToV3(options: any): void;
    getTokenP(): PromiseLike<string>;
    reset(): void;
}

interface IUserProfile {
    username?: string;
    email?: string;
    role?: string;
    displayName?: string;
}
declare class UserCredential<T extends IPolicy> {
    authPolicy: T;
    private _security;
    private _user;
    /**
     * @constructor Credential
     */
    constructor(authPolicy: T);
    get asObservable(): IObservable;
    security(value?: T): T;
    readFrom<U extends IUserProfile>(data: U): void;
    setUser<U extends IUserProfile>(data: U): void;
    extendUser<U extends IUserProfile>(data: U): void;
    getUser<U extends IUserProfile>(): U;
    subscribe<U extends IUserProfile>(handler: (evt: IEventArgs<U>) => IEventArgs<U>, likeBehaviorSubject?: boolean): void;
    unSubscribe(handler: (evt: any) => any): void;
    isUserKnown(): boolean;
    isAuthenticated(): boolean;
}

declare class AntiForgeryKeyPolicy extends PolicyBase {
    private _antiForgeryKey;
    private _elementTag;
    private _expired;
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    constructor(settings: IAntiForgeryKeyCtorOptions);
    isExpired(): boolean;
    inputField(): string;
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    readFrom(settings: any): void;
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    persistent(): {
        token: string;
    };
    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * @function getTokenP
     * @param {String}[url] The URL where the response from it may contain
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @returns {Promise}
     * @throws {}
     */
    getTokenInternal(): PromiseLike<string>;
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    applyTo(options: any): void;
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    applyToV2(options: any): void;
    applyToV3(options: any): void;
    /**
     * Resets the token and expired flag
     * @function reset
     */
    reset(): void;
}

declare class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    private _payload;
    constructor(settings: IOAuthTokenPolicyCtorOptions, payload: object);
    get payload(): object;
    getParams(): any;
}

declare function observableDecorator<T extends {
    new (...args: any[]): any;
}>(constructor: T): {
    new (...args: any[]): {
        [x: string]: any;
        fire<U>(name: string, evt: IEventArgs<U>, bubble?: boolean): IEventArgs<U>;
        on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any;
        off(name: string, callback: (...args: any[]) => any): any;
        once(name: string, callback: (...args: any[]) => any): any;
        hasEventListeners(name: string): boolean;
    };
} & T;

type CollectionActionTypes = 'ADD' | 'REMOVE' | 'MODIFY';
interface ICollectionItem {
    id: string | number;
}
interface CollectionActionWithPayload<T extends ICollectionItem> extends Action {
    payload: Array<T>;
}
interface ICollectionState<T extends ICollectionItem> {
    items: Array<T>;
}

interface GenericState<T extends ICollectionItem> {
    collection: ICollectionState<T>;
}
declare function buildInitialState<T extends ICollectionItem>(): GenericState<T>;
declare function buildReducerMap<T extends ICollectionItem>(): ActionReducerMap<GenericState<T>>;

declare function factory<T extends ICollectionItem>(): ngrxStore.Store<GenericState<T>>;

interface ICollectionStore<T extends ICollectionItem> {
    getState(): Observable<ICollectionState<T>>;
    add(payload: Array<T>): void;
    remove(payload: Array<T>): void;
    modify(payload: Array<T>): void;
}

declare abstract class CollectionAbstractStore<T extends ICollectionItem> implements ICollectionStore<T> {
    abstract getState(): Observable<ICollectionState<T>>;
    abstract getStore(): Store<GenericState<T>>;
    add(payload: Array<T>): void;
    remove(payload: Array<T>): void;
    modify(payload: Array<T>): void;
}

declare class CollectionStore<T extends ICollectionItem> extends CollectionAbstractStore<T> {
    private _store;
    constructor();
    getStore(): Store<GenericState<T>>;
    getState(): Observable<ICollectionState<T>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollectionStore<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CollectionStore<any>>;
}

declare function reducer<T extends ICollectionItem>(state: ICollectionState<T>, action: CollectionActionWithPayload<T>): ICollectionState<T>;

/**
 * @fileOverview
 * An endpoint which aggregates a few other endpoints, to form a new endpoint.
 * Note that the caller is responsible for resetting underlying data providers
 * and even caching them.
 * Moreover, this class does not assume any knowledge about providerGenerator.
 * providerGenerator may generate the same thing again as again.
 * Also note that it is the provider generator's responsibilty for
 * preversing the state of each data provider.
 */

interface IProviderGenerator {
    hasMore(): boolean;
    getNext(): PromiseLike<Array<IBackboneCollectionLike>>;
    reset(): void;
}
declare class AggregateCollection {
    private _providerGenerator;
    private _workingProviders;
    constructor(_providerGenerator: IProviderGenerator);
    hasNextPage(): boolean;
    getFirstPage(): PromiseLike<any>;
    getNextPage(): PromiseLike<any>;
    reset(): void;
    forEach(func: (elem: any) => any): void;
    get(id: any): void;
}

/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */
/**
 * The callback for the sync event.
 * @callback EventHubcallback
 * @param {Object} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} response The response assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */
/**
 * Sets up a callback for listening to the sync events from Backbone.
 * @function mountSyncListener
 * @param {EventHubcallback} callback
 * @throws {Error}
 */
declare function mountSyncListener(callback: any): any[];
/**
 * The callback for the sync event.
 * @callback EventHubsyncSignature
 * @param {String} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */
/**
 * Sets up a pre-sync callback.
 * @function mountSyncBeforeAdvice
 * @param {EventHubsyncSignature} callback
 */
declare function mountSyncBeforeAdvice(callback: any): any;
/**
 * The signature for the around advice.
 * @callback EventHubaroundAdviceSignature
 * @param {String} jointpoint the jointpoint for this advice.
 */
/**
 * Sets up an around advice.
 * @function mountSyncAroundAdvice
 * @param {EventHubaroundAdviceSignature} callback
 */
declare function mountSyncAroundAdvice(callback: any): any;
/**
 * Sets up a pre-ajax callback.
 * @function mountAjaxBeforeAdvice
 * @param {Function} callback
 */
declare function mountAjaxBeforeAdvice(callback: any): any;

interface IBackboneOptions {
    securityDelegate: (options: any) => void;
    url: string;
    modelId?: (attributes: any) => any;
    model?: any;
    syncDelegate?: any;
    parse?: any;
    parseState?: (resp: any, queryParams: any, state: any, options: any) => any;
    parseRecords?: (resp: any, options: any) => any;
    queryParams?: IBackboneQueryParams;
    deleteUrl?: string;
    deleteContentType?: string;
    updateUrl?: string;
    updateContentType?: string;
    createUrl?: string;
    createContentType?: string;
    patchUrl?: string;
    patchContentType?: string;
    extraParams?: any;
    contentType?: string;
}
interface IBackboneWorkingOptions extends IBackboneOptions {
    endPointKey: string;
}
interface IBackboneConfiguration {
    tag: number;
    options: IBackboneWorkingOptions;
}
interface IEndpointSpec {
    [key: string]: {
        url: string;
        options?: IBackboneOptions;
    };
}
interface IParserTableSpec {
    [key: string]: {
        parser: string;
    };
}

/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time.
 */

/**
 * The endpoint types for a backend service.
 */
declare const endPointEnum: {
    model: number;
    collection: number;
    pagedCollection: number;
};
/**
 * The sync types defined in the backbone js.
 */
declare const syncMethodEnum: {
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
interface IGlobalProviderCtorOptions {
    webhost?: string;
}
declare class GlobalProvider {
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

interface IEntity {
    Id: any;
}
/**
 * Reads the value of an entity by its key.
 * @function getEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 * @returns {*} The entity value.
 */
declare function getEntity(key: string, ty: ITypeDef): any;
/**
 * Updates the value of an entity by its key.
 * @function updateEntity
 * @param {String} key The entity key.
 * @param {*} data The new value to be replaced with.
 * @param {*} ty The type of the entity value.
 */
declare function updateEntity(key: string, data: any, ty?: ITypeDef): void;
/**
 * Cleans the value of an entity by its key.
 * @function cleanEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 */
declare function cleanEntity(key: string, ty: ITypeDef): void;
/**
 * Inserts the given data into the value of an entity of type array.
 * Note that the inserted data should be disjoint with the current data
 * stored in this entity. Otherwise, the behavior may be undefined.
 * @function insertEntities
 * @param {String} key The entity key.
 * @param {Array} data The value to be inserted.
 * @param {Number} upperBound The max number of elements allows for this entity value.
 */
declare function insertEntities(key: string, data: Array<IEntity>, upperBound: number): void;
/**
 * Finds one element of an entity of type array.
 * @function findEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value. An Id field is assumed for each element.
 * @returns {*} The value of the found element.
 */
declare function findEntityById(key: string, id: any): IEntity;
/**
 * Removes an element of an entity of type array.
 * @function removeEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value for the element to be removed.
 */
declare function removeEntityById(key: string, id: any): void;
/**
 * Inserts or udpates an element of an entity of type array.
 * @function insertOrUpdateEntity
 * @param {String} key The entity key.
 * @param {Array} entity The new value of the entity.
 */
declare function insertOrUpdateEntity(key: string, entity: IEntity): void;
/**
 * Removes a group of entities by a given prefix.
 * @function cleanEntityGroup
 * @param {String} prefix The prefix of the keys of the entities to be removed. We organize entities somewhat hirarchly.
 * @returns {Boolean}
 */
declare function cleanEntityGroup(prefix: string): Array<string>;

/**
 * @fileOverview
 * Encapsulates the local storage service into one
 * providing prmoise-aware services.
 * @name LocalStorageTable.js
 * @module hypercom/storage/LocalStorageTable
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
/**
 * @class LocalStorageTable
 */
declare class LocalStorageTable {
    /**
     * Gets the value for the given key.
     * @function getP
     * @param {String} key The key to be searched for.
     * @returns {Promise}
     * @throws {Error}
     */
    getP(key: string): PromiseLike<object>;
    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    removeP(key: string): PromiseLike<boolean>;
    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    updateP(key: string, value: object): PromiseLike<boolean>;
}

/**
 * @fileOverview
 * Provides i18n service. This module is designed as
 * a delegate of the tinymce I18n service.
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
declare class I18n {
    static getDictByCode(code: string): any;
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    static add(code: string, items: any): void;
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    static translate(text: string, defaultText: string): any;
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    static recycleOthers(code: string): void;
}

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

/**
 * @class Resources
 */
declare class ResourceLoader {
    private _cache;
    private _configuration;
    /**
     * Constructor
     * @function init
     */
    constructor(_cache?: ISlidingExpireCache<any>);
    /**
     * Configure a resource
     * @function register
     * @param {String} key The resource key.
     * @param {String} uri The resource URI.
     * @param {Number} liveSeconds The cache period.
     * @throws {Error}
     */
    register(key: string, uri: string, liveSeconds?: number): void;
    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    undoRegister(key: string): void;
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    getPromise<T>(fullyQualifiedNamespace: string, convertor: (any: any) => any): PromiseLike<T>;
}

interface IJoinpoint {
    target: any;
    args: any[];
    method: string;
    proceed: (...args: any[]) => any;
    proceedApply: (...args: any[]) => any;
    proceedCount: (...args: any[]) => any;
}

export { AggregateCollection, AntiForgeryKeyPolicy, CollectionAbstractStore, CollectionStore, DummyOAuthTokenCtorParams, DummyRecords, GlobalProvider, I18n, LocalStorageTable, MemoryBackend, NullPolicy, OAuthTokenExtPolicy, OAuthTokenPolicy, OpenIDPolicy, PolicyBase, RelationDatabase, RelationalTable, ResourceLoader, SlidingExpirationCache, UserCredential, adaptToOAuthToken, adaptToOpenIDToken, buildInitialState, buildReducerMap, cleanEntity, cleanEntityGroup, endPointEnum, factory, findEntityById, getEntity, insertEntities, insertOrUpdateEntity, loadHtmlP, loadJsonUriP, mountAjaxBeforeAdvice, mountSyncAroundAdvice, mountSyncBeforeAdvice, mountSyncListener, observableDecorator, pingP, reducer, removeEntityById, sendPromise, syncMethodEnum, updateEntity };
export type { CollectionActionTypes, CollectionActionWithPayload, GenericState, IAntiForgeryKeyCtorOptions, IBackboneCollectionLike, IBackboneConfiguration, IBackboneOptions, IBackboneQueryParams, IBackboneWorkingOptions, ICacheBackend, ICollectionItem, ICollectionState, ICollectionStore, IEndpointSpec, IEntity, IEventArgs, IFullBackboneCollectionLike, IFullModelLike, IGlobalProviderCtorOptions, IJoinpoint, IModelLike, INgZoneLike, IOAuthParams, IOAuthToken, IOAuthTokenPolicyCtorOptions, IObservable, IOpenIDToken, IParserTableSpec, IPolicy, IPolicyCtorOptions, IProviderGenerator, IRelationDatabaseSchema, IRelationalDatabase, IRelationalTable, IRelationalTableOptions, ISlidingExpireCache, IUserProfile, IXHRCtorOption };
