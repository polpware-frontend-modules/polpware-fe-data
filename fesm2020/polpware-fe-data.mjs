import * as dependencies from '@polpware/fe-dependencies';
import * as polpwareUtil from '@polpware/fe-utilities';
import { pushArray, urlEncode, lift, safeParseInt, isArray, liftWithGuard, defaultValue, ok, tyArray } from '@polpware/fe-utilities';
import { __decorate } from 'tslib';
import * as ngrxStore from '@ngrx/store';
import * as i0 from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */
const backbone$3 = dependencies.backbone;
const _$8 = dependencies.underscore;
const cjs = dependencies.constraintjs;
class RelationalTable {
    constructor(options, dummyRecords) {
        this.dummyRecords = dummyRecords;
        this._name = options.name;
        this._cascade = false;
        this._foreignRelation = {};
        this._reverseForeignRelation = {};
        if (options.dataProviderCtor) {
            this._dataProvider = new options.dataProviderCtor();
        }
        else {
            const ctor = backbone$3.Collection.extend(options.dataProviderCtorOption || {});
            this._dataProvider = new ctor();
        }
        this._addConstraint = cjs.constraint([]);
        this._deleteConstraint = cjs.constraint([]);
        // Todo: Figure out parameters
        this._onDeletedHandler = (...args) => {
            this.onDeleted();
        };
        // Set up constraint
        this._deleteConstraint.onChange(this._onDeletedHandler);
    }
    get name() {
        return this._name;
    }
    get cascade() {
        return this._cascade;
    }
    dataProvider() {
        return this._dataProvider;
    }
    // TODO: Figure out ...
    onDeleted() {
    }
    /**
     * Check if the given items are still in use.
     */
    hasAnyReference(item) {
        // Check if this item is in this table or not
        const itemInTable = this._dataProvider.get(item.id);
        if (!itemInTable) {
            return false;
        }
        const revRelations = this._reverseForeignRelation;
        let hasFound = false;
        for (const revK in revRelations) {
            if (revRelations.hasOwnProperty(revK)) {
                const revTables = revRelations[revK];
                hasFound = _$8.some(revTables, (fromTable) => {
                    const fromTableDataProvider = fromTable.dataProvider();
                    const filter = {};
                    filter[revK] = item.id;
                    const anyUse = fromTableDataProvider.findWhere(filter);
                    return !!anyUse;
                });
                if (hasFound) {
                    break;
                }
            }
        }
        return hasFound;
    }
    /**
     * Removing any items in other tables which depend on the deleted item.
     */
    removeReverseForeign(removedItems) {
        const revRelation = this._reverseForeignRelation;
        for (const revK in revRelation) {
            if (revRelation.hasOwnProperty(revK)) {
                const revTables = revRelation[revK];
                revTables.forEach((reverseTable) => {
                    const dataProvider = reverseTable.dataProvider();
                    const toBeRemoved = [];
                    removedItems.forEach((item) => {
                        const filter = {};
                        filter[revK] = item.id;
                        const anyItems = dataProvider.where(filter);
                        pushArray(toBeRemoved, anyItems);
                    });
                    toBeRemoved.forEach((item) => {
                        item.destroyFromTable();
                    });
                });
            }
        }
    }
    /**
     * Gets the model in the table by id.
     */
    get(id) {
        return this._dataProvider.get(id);
    }
    destroyFromTable(thatItem) {
        const removedItem = this._dataProvider.remove(thatItem);
        if (!removedItem) {
            return;
        }
        // Notify of its collection
        removedItem.set('invalidated', true);
        removedItem.trigger('destroy', removedItem);
        this.removeReverseForeign([removedItem]);
    }
    getForeignModel(thatItem, foreignKey) {
        const value = thatItem.attributes[foreignKey];
        // If we do not have this foreignKey, then return a dummy one
        if (!value) {
            return this.dummyRecords.getDummyRecord(foreignKey);
        }
        const table = this._foreignRelation[foreignKey];
        return table.dataProvider().get(value);
    }
    /**
     * Adds an item in the Table and recursively add foreign items.
     */
    add(model) {
        const selfContext = this;
        const dataProvider = this._dataProvider;
        const foreignRelation = this._foreignRelation;
        // Check if the item to be added is already in this table.
        const modelId = dataProvider.modelId(model);
        let addedItem = dataProvider.get(modelId);
        if (addedItem) {
            const newAttr = _$8.extend({}, addedItem.attributes, model);
            addedItem.set(newAttr);
            return addedItem;
        }
        // Otherwise a new item
        addedItem = dataProvider.add(model);
        // Add convenient methods
        addedItem.destroyFromTable = function () {
            const thatItem = this;
            selfContext.destroyFromTable(thatItem);
        };
        addedItem.getForeignModel = function (foreignKey) {
            const thatItem = this;
            return selfContext.getForeignModel(thatItem, foreignKey);
        };
        addedItem.hasAnyReference = function () {
            const thatItem = this;
            return selfContext.hasAnyReference(thatItem);
        };
        return addedItem;
    }
    /**
     * Add many items into a table.
     */
    addMany(models) {
        return models.map(model => {
            return this.add(model);
        });
    }
    /**
     * Adds a foreign relation.
     */
    addForeignRelation(foreignKey, foreignTable) {
        if (this._foreignRelation[foreignKey]) {
            throw new Error('Foreign key exists: ' + foreignKey);
        }
        this._foreignRelation[foreignKey] = foreignTable;
    }
    /**
     * Add a reverse foreign relation.
     */
    addReverseForeignRelation(reverseForeignKey, table) {
        const reverseTables = this._reverseForeignRelation[reverseForeignKey];
        if (reverseTables) {
            const index = reverseTables.findIndex((elem) => {
                return elem === table;
            });
            if (index !== -1) {
                throw new Error('Reverse foreign table exists: ' + reverseForeignKey);
            }
            reverseTables.push(table);
        }
        else {
            this._reverseForeignRelation[reverseForeignKey] = [table];
        }
    }
    /**
     * Check if a given foreign relation is present.
     */
    hasForeignRelation(foreignKey) {
        return !!this._foreignRelation[foreignKey];
    }
    /**
     * Checks if a given reverse foreign relation is present.
     */
    hasReverseForeignRelation(reverseForeignKey) {
        return !!this._reverseForeignRelation[reverseForeignKey];
    }
    /**
     * Destroys table
     */
    destroy() {
        // Remove constraint
        this._deleteConstraint.offChange(this._onDeletedHandler);
        this._dataProvider.reset();
    }
}

/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
const backbone$2 = dependencies.backbone;
class DummyRecords {
    constructor() {
        this._data = {};
    }
    getDummyRecord(key) {
        if (!this._data[key]) {
            this._data[key] = new backbone$2.Model({});
        }
        return this._data[key];
    }
}

/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */
class RelationDatabase {
    /**
     * Represents a relational database.
     */
    constructor() {
        this._referenceCounter = 1;
        this._tableCollection = {};
        this._dummyRecords = new DummyRecords();
    }
    /**
     * Gets a reference of the file system database
     */
    getReference() {
        this._referenceCounter++;
        return this;
    }
    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    addTable(options) {
        return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
    }
    /**
     * Retrieves a table by name.
     */
    getTable(name) {
        return this._tableCollection[name];
    }
    /**
     * Defines a foreign relation between two tables.
     */
    addForeignkey(name, foreignKey, foreignName) {
        // Constraints
        const table = this._tableCollection[name];
        if (!table) {
            throw new Error('Undefined table: ' + name);
        }
        const foreignTable = this._tableCollection[foreignName];
        if (!foreignTable) {
            throw new Error('Undefined foreign table: ' + foreignName);
        }
        table.addForeignRelation(foreignKey, foreignTable);
        foreignTable.addReverseForeignRelation(foreignKey, table);
    }
    /**
     * Destroys database
     */
    destroy() {
        this._referenceCounter--;
        if (this._referenceCounter === 0) {
            for (const k in this._tableCollection) {
                if (this._tableCollection.hasOwnProperty(k)) {
                    const table = this._tableCollection[k];
                    table.destroy();
                }
            }
            this._tableCollection = {};
        }
    }
}

/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
const XHR = dependencies.XHR;
const _$7 = dependencies.underscore;
const defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};
function sendPromise(options) {
    const settings = _$7.extend({}, defaultOptions, options);
    const promise = new Promise((resolve, reject) => {
        const xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: (output, xhr, input) => {
                resolve({
                    response: output,
                    xhr: xhr,
                    settings: input
                });
            },
            error: (output, xhr, input) => {
                reject({
                    error: output,
                    xhr: xhr,
                    settings: input
                });
            },
            success_scope: settings.success_scope,
            error_scope: settings.error_scope,
            scope: settings.scope,
            requestheaders: settings.requestheaders
        };
        // Process sent-out data
        if (settings.content_type === 'application/x-www-form-urlencoded') {
            xhrSettings.data = urlEncode(xhrSettings.data);
        }
        else if (settings.content_type === 'application/json') {
            xhrSettings.data = JSON.stringify(xhrSettings.data);
        }
        XHR.send(xhrSettings);
    });
    return promise;
}

/**
 * @fileOverview
 * Provides a bunch of utilties on network communication.
 * @name Curl.js
 * @module hypercom/util/Curl
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
const tools = dependencies.Tools;
const $$2 = dependencies.jquery;
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
function loadJsonUriP(url) {
    const deferred = $$2.ajax({
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
function pingP(url, options) {
    options = options || {};
    const ajaxParams = tools.extend({ url: url }, options);
    return $$2.ajax(ajaxParams);
}
/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @function loadHtmlP
 * @param {String} url
 * @returns {Promise}
 */
function loadHtmlP(url) {
    return $$2.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data) {
        /*global DOMParser */
        const doc = new DOMParser().parseFromString(data, 'text/html');
        return $$2(doc);
    });
}

class MemoryBackend {
    constructor() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     */
    set(key, value) {
        this._store[key] = value;
        return value;
    }
    /**
     * Gets the value for a given key.
     */
    get(key) {
        return this._store[key] || null;
    }
    /**
     * Removes the given key and its corresponding value.
     */
    remove(key) {
        delete this._store[key];
    }
    /**
     * Returns the number of stored items.
     */
    length(key) {
        return Object.keys(this._store).length;
    }
    /**
     * Retuns the ith key in the store table.
     */
    key(index) {
        const keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    }
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    enabled() {
        return true;
    }
}

//
const EventDispatcher = dependencies.EventDispatcher;
const getEventDispatcher = function (obj) {
    if (!obj._eventDispatcher) {
        obj._eventDispatcher = new EventDispatcher({
            scope: obj,
            toggleEvent: function (name, state) {
                if (EventDispatcher.isNative(name) && obj.toggleNativeEvent) {
                    obj.toggleNativeEvent(name, state);
                }
            }
        });
    }
    return obj._eventDispatcher;
};
function observableDecorator(constructor) {
    return class extends constructor {
        fire(name, evt, bubble) {
            const self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self['removed'] && name !== 'remove') {
                return null;
            }
            const newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self['parent']) {
                let parent = self['parent']();
                while (parent && !newEvt.isPropagationStopped()) {
                    parent.fire(name, newEvt, false);
                    parent = parent.parent();
                }
            }
            return newEvt;
        }
        on(name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        }
        off(name, callback) {
            return getEventDispatcher(this).off(name, callback);
        }
        once(name, callback) {
            return getEventDispatcher(this).once(name, callback);
        }
        hasEventListeners(name) {
            return getEventDispatcher(this).has(name);
        }
    };
}

//
const locache = dependencies.locache;
const meld$1 = dependencies.meld;
const originalRemove = Object.getPrototypeOf(locache.locache).remove;
const currentTime = function () {
    return new Date().getTime();
};
let SlidingExpirationCache = class SlidingExpirationCache {
    constructor(_defaultSeconds, scheduleInterval, ngZone) {
        this._defaultSeconds = _defaultSeconds;
        const backend = new MemoryBackend();
        this._cache = locache.locache.createCache({ storage: backend });
        this._cache.remove = meld$1.around(originalRemove, (input) => {
            const key = input.args[0];
            const onExpireEvtName = this.onExpireEventName(key);
            const event = this.asObservable.fire(onExpireEvtName, {});
            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                this.resetExpireKey(key, this._defaultSeconds);
                return false;
            }
            // Otherwise, continue the original logic
            // Remove all listener
            this.asObservable.off(onExpireEvtName, null);
            input.proceed();
            // fire event
            const afterRemoveEvtName = this.afterRemoveEventName(key);
            this.asObservable.fire(afterRemoveEvtName, {});
            return true;
        });
        // interval
        if (scheduleInterval) {
            if (ngZone) {
                ngZone.runOutsideAngular(() => {
                    this._timeInterval = setInterval(() => {
                        this._cache.cleanup();
                    }, scheduleInterval * 1000);
                });
            }
            else {
                this._timeInterval = setInterval(() => {
                    this._cache.cleanup();
                }, scheduleInterval * 1000);
            }
        }
        else {
            this._timeInterval = null;
        }
    }
    onExpireEventName(key) {
        return 'onExpire:' + key;
    }
    afterRemoveEventName(key) {
        return 'afterRemove:' + key;
    }
    resetExpireKey(key, seconds) {
        const expirekey = this._cache.expirekey(key);
        const ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    }
    get asObservable() {
        const self = this;
        const observable = self;
        return observable;
    }
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    set(key, value, seconds, afterRemoveCallback) {
        const expirekey = this._cache.expirekey(key);
        const valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            const ms = seconds * 1000;
            this._cache.storage.set(expirekey, currentTime() + ms);
        }
        else {
            // Remove the expire key, if no timeout is set
            this._cache.storage.remove(expirekey);
        }
        if (afterRemoveCallback) {
            this.asObservable.once(this.afterRemoveEventName(key), afterRemoveCallback);
        }
        return this._cache.storage.set(valueKey, value);
    }
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    get(key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        const valueKey = this._cache.key(key);
        const value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    }
    invalidate(key) {
        let keys = this._cache.keys() || [];
        keys = keys.filter(a => a.indexOf(key) !== -1);
        this.resetInternal(keys);
    }
    rmOnExpireHandler(key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    }
    addOnExpireHandler(key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    }
    get count() {
        return this._cache.length();
    }
    reset() {
        const keys = this._cache.keys() || [];
        this.resetInternal(keys);
    }
    resetInternal(keys) {
        keys.forEach((k) => {
            this.asObservable.off(this.onExpireEventName(k), null);
            originalRemove.call(this._cache, k);
            this.asObservable.fire(this.afterRemoveEventName(k), {});
        });
    }
    // must destory, or leaking ...
    destroy() {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
};
SlidingExpirationCache = __decorate([
    observableDecorator
], SlidingExpirationCache);

//

const DummyOAuthTokenCtorParams = {
    url: 'dummy',
    clientId: 'dummy',
    clientSecret: 'dummy',
    scope: 'all'
};

/**
 * @fileOverview
 * A base class for defining security plicies.
 */
const _$6 = dependencies.underscore;
class PolicyBase {
    constructor(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP() {
        if (!_$6.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }
        return this.getTokenInternal()
            .then((token) => {
            return this.token = token;
        });
    }
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    reset() {
        this.token = '';
    }
}

/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */
const _$5 = dependencies.underscore;
const $$1 = dependencies.jquery;
function adaptToOAuthToken(data) {
    data = data || {};
    data.expiresIn = data.expiresIn || 0;
    data.createdOn = data.createdOn || 0;
    data.token = data.token || '';
    data.refreshToken = data.refreshToken || '';
    return data;
}
class OAuthTokenPolicy extends PolicyBase {
    constructor(settings) {
        super(settings);
        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope;
        this.expiresIn = null;
        this.createdOn = null;
        this.refreshToken = '';
        this.response = null;
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    readFrom(settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    }
    /**
     * Returns the data that are persistentable.
     */
    persistent() {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    }
    getParams() {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    }
    // TODO: Support progress loading
    getTokenInternal() {
        const params = this.getParams();
        return $$1.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then((resp) => {
            // Put down the response
            this.response = resp;
            this.createdOn = new Date().getTime();
            this.expiresIn = resp.expires_in;
            this.refreshToken = resp.refreshToken || '';
            resp.scope && (this.scope = resp.scope);
            return (resp.access_token);
        });
    }
    /**
     * Returns if the token is expired or not.
     */
    isExpired() {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        const expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        const now = new Date();
        const diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    }
    /**
     * Applys the token to the given options.
     */
    applyTo(options) {
        options.beforeSend = (xhr) => {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(this.token)));
        };
    }
    /**
     * Apply security policy to the given options.
     */
    applyToV2(options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    }
    /**
     * App security policy the given options, used for our customized XHR.
     */
    applyToV3(options) {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    }
    /**
     * Resets the token and its assoicated information.
     */
    reset() {
        super.reset();
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    }
}

/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */
function adaptToOpenIDToken(data) {
    data = data || {};
    const r = adaptToOAuthToken(data);
    return { ...r, openId: data.openId || '' };
}
class OpenIDPolicy extends OAuthTokenPolicy {
    constructor() {
        super(DummyOAuthTokenCtorParams);
        this._openId = '';
    }
    /**
     * Returns the necessary information for peristence.
     */
    persistent() {
        const r = super.persistent();
        return { ...r, openId: this._openId };
    }
    /**
     * Reads credential from the given settings.
     */
    readFrom(settings) {
        super.readFrom(settings);
        this._openId = settings.openId;
        return this;
    }
}

class NullPolicy {
    getTokenInternal() {
        throw new Error('NotImplemented');
    }
    applyTo(options) { }
    isExpired() {
        return false;
    }
    readFrom(settings) { }
    persistent() { }
    applyToV2(options) { }
    applyToV3(options) { }
    getTokenP() {
        throw new Error('NotImplemented');
    }
    reset() { }
}

const _$4 = dependencies.underscore;
function isEquiva(a, b) {
    // Strict equals
    if (a === b) {
        return true;
    }
    // Compare null
    if (a === null || b === null) {
        return a === b;
    }
    // Compare number, boolean, string, undefined
    if (typeof a !== 'object' || typeof b !== 'object') {
        return a === b;
    }
    // Compare arrays
    if (isArray(b) && isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        let k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    const checked = {};
    const objectB = b;
    for (const k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
            checked[k] = true;
        }
    }
    const objectA = a;
    for (const k in objectA) {
        if (objectA.hasOwnProperty(k)) {
            if (!checked[k] && !isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    return true;
}
// immutable
let UserCredential = class UserCredential {
    /**
     * @constructor Credential
     */
    constructor(authPolicy) {
        this.authPolicy = authPolicy;
        this._user = {};
        this._security = authPolicy;
    }
    get asObservable() {
        const self = this;
        return self;
    }
    security(value) {
        if (value) {
            this._security = value;
        }
        return this._security;
    }
    // Does not trigger any event
    readFrom(data) {
        this._user = _$4.extend(this._user, data);
    }
    setUser(data) {
        if (isEquiva(this._user, data)) {
            return;
        }
        this._user = data;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    }
    extendUser(data) {
        const newData = _$4.extend({}, this._user, data);
        this.setUser(newData);
    }
    getUser() {
        return _$4.extend({}, this._user);
    }
    subscribe(handler, likeBehaviorSubject = false) {
        this.asObservable.on('change:user', handler);
        if (likeBehaviorSubject) {
            const newEvt = { data: this._user };
            handler(newEvt);
        }
    }
    unSubscribe(handler) {
        this.asObservable.off('change:user', handler);
    }
    isUserKnown() {
        return !!(this._user && this._user.username);
    }
    isAuthenticated() {
        return this.authPolicy && !this.authPolicy.isExpired();
    }
};
UserCredential = __decorate([
    observableDecorator
], UserCredential);

/**
 * @fileOverview
 * Provides the anti-forgery security policy.
 * @name AntiForgeryKeyPolicy.js
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
const $ = dependencies.jquery;
const defaultAntiForgeryKey = '__RequestVerificationToken';
const defaultElementTag = '';
/*
 <input name="__RequestVerificationToken" type="hidden"
 value="J8kl6w7KaBAteKOPeHW1IlG9RS7abCkbvQf2GwBlMVZZOX9FF-Bhc5mYmqXw4qe0MLraucQtKC-TAVh1rJEZ0SDfeLfqp-L5JrthIM9V0gp76-jnVz9J-rdYFhVeTT4Y0">
 */
function getTokenInternal(url, elementTag, inputField) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data) {
        /*global DOMParser */
        let doc, token, elm;
        token = '';
        doc = new DOMParser().parseFromString(data, 'text/html');
        if (elementTag) {
            elm = $(doc).find(elementTag);
            if (elm.length > 0) {
                elm = $(doc).find(inputField);
                if (elm.length > 0) {
                    elm = elm.eq(0);
                    token = elm.attr('value');
                }
            }
        }
        else {
            elm = $(doc).find(inputField);
            if (elm.length > 0) {
                elm = elm.eq(0);
                token = elm.attr('value');
            }
        }
        return token;
    });
}
class AntiForgeryKeyPolicy extends PolicyBase {
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    constructor(settings) {
        super(settings);
        this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        this._elementTag = settings.elementTag || defaultElementTag;
        this._expired = true;
    }
    isExpired() {
        return this._expired;
    }
    inputField() {
        return 'input[name="' + this._antiForgeryKey + '"]';
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    readFrom(settings) {
        this.token = settings.token;
    }
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    persistent() {
        return {
            token: this.token
        };
    }
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
    getTokenInternal() {
        const ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        const p = liftWithGuard(ret, function (token) {
            const isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    }
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    applyTo(options) {
        const data = options.data;
        data[this._antiForgeryKey] = this.token;
    }
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    applyToV2(options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    }
    // TODO:
    applyToV3(options) {
    }
    /**
     * Resets the token and expired flag
     * @function reset
     */
    reset() {
        super.reset();
        this._expired = true;
    }
}

class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    constructor(settings, payload) {
        super(settings);
        this._payload = { ...payload };
    }
    get payload() {
        return this._payload;
    }
    // override
    getParams() {
        const p = super.getParams();
        return { ...p, ...this._payload };
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const payload = action.payload.filter(x => {
                // Look for it in the current list
                const index = state.items.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return {
                ...state,
                items: [
                    ...state.items,
                    ...payload
                ]
            };
        }
        case 'REMOVE': {
            const newItems = state.items.filter(x => {
                const index = action.payload.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return {
                ...state,
                items: newItems
            };
        }
        case 'MODIFY': {
            // Nothing to do
            return state;
        }
        default:
            return state;
    }
}

function buildInitialState() {
    return {
        collection: {
            items: []
        }
    };
}
function buildReducerMap() {
    return {
        collection: reducer
    };
}

// Store
/*
    ReducerManager,
    StateObservable,
    ActionsSubject
*/
// StateObservable
/*
   ActionsSubject
   ReducerManager
   ScannnedActionsSubject => leaf
   InitialState
*/
// ActionsSubject (leaf)
// ReducerManager
/*
   ReducerManagerDispatcher
   INITIAL_STATE  => pass in parameters
   INITIAL_REDUCERS => ActionReducerMap (pass in parameters)
   REDUCER_FACTORY => combineReducers
   ActionReducerFactory<any, any>
*/
// ReducerManagerDispatcher
/*
   ActionSsubject  (leaf)
*/
// ActionReducerFactory<any, any> (Use combinReducer function from utils)
/*
   ActionReducerMap
   initialState

   ActionReducer
*/
// createReducerfactory
/*
   ActionReducerFactory
   MataReducerFactory

*/
function factory() {
    const actionSubject = new ngrxStore.ActionsSubject();
    const scannerActionSubject = new ngrxStore.ScannedActionsSubject();
    const reducerManagerDispatch = actionSubject;
    const actionReducerFactory = ngrxStore.combineReducers;
    const reducerManager = new ngrxStore.ReducerManager(actionSubject, buildInitialState(), buildReducerMap(), actionReducerFactory);
    const stateObservable = new ngrxStore.State(actionSubject, reducerManager, scannerActionSubject, buildInitialState());
    const store = new ngrxStore.Store(stateObservable, actionSubject, reducerManager);
    return store;
}

class CollectionAbstractStore {
    add(payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    }
    remove(payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    }
    modify(payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    }
}

class CollectionStore extends CollectionAbstractStore {
    constructor() {
        super();
        this._store = factory();
    }
    getStore() {
        return this._store;
    }
    getState() {
        return this._store.select('collection');
    }
}
CollectionStore.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: CollectionStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CollectionStore.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: CollectionStore });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: CollectionStore, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

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
const when = dependencies.when;
const _$3 = dependencies.underscore;
function hasNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return true;
    }
    return collection.hasNextPage();
}
function getNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return collection.getFirstPage();
    }
    return collection.getNextPage();
}
class AggregateCollection {
    constructor(_providerGenerator) {
        this._providerGenerator = _providerGenerator;
        this._workingProviders = [];
    }
    hasNextPage() {
        // Case 1: The first time we request, we always have something.
        if (this._workingProviders.length === 0) {
            return true;
        }
        if (this._providerGenerator.hasMore()) {
            return true;
        }
        return _$3.some(this._workingProviders, function (elem) {
            return elem.hasNextPage();
        });
    }
    getFirstPage() {
        // Generate providers
        return this._providerGenerator.getNext()
            .then((providers) => {
            providers = _$3.filter(providers, function (p) {
                return hasNextPage(p);
            });
            return providers;
        })
            .then((providers) => {
            this._workingProviders.length = 0;
            const promises = _$3.map(providers, function (p) {
                return getNextPage(p)
                    .then((resp) => {
                    this._workingProviders.push(p);
                    return resp;
                });
            });
            return when.settle(promises);
        });
    }
    getNextPage() {
        return this.getFirstPage();
    }
    reset() {
        this._providerGenerator.reset();
        this._workingProviders = [];
    }
    forEach(func) {
        this._workingProviders.forEach((p) => {
            p.forEach(func);
        });
    }
    get(id) {
        // TODO:
    }
}

/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */
const backbone$1 = dependencies.backbone;
const meld = dependencies.meld;
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
function mountSyncListener(callback) {
    // Collection
    const remover1 = meld.before(backbone$1.Collection.prototype, 'trigger', callback);
    const remover2 = meld.before(backbone$1.Model.prototype, 'trigger', callback);
    return [remover1, remover2];
}
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
function mountSyncBeforeAdvice(callback) {
    return meld.before(backbone$1, 'sync', callback);
}
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
function mountSyncAroundAdvice(callback) {
    return meld.around(backbone$1, 'sync', callback);
}
/**
 * Sets up a pre-ajax callback.
 * @function mountAjaxBeforeAdvice
 * @param {Function} callback
 */
function mountAjaxBeforeAdvice(callback) {
    return meld.before(backbone$1, 'ajax', callback);
}

/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time.
 */
const DataFlow = dependencies['dataflow'];
const backbone = dependencies['backbone'];
const _$2 = dependencies.underscore;
/**
 * The endpoint types for a backend service.
 */
const endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 */
const syncMethodEnum = {
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
                    _$2.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                options.data = urlEncode(options.data);
                options.contentType = cfgOptions.contentType;
            }
            else {
                if (extraParams) {
                    _$2.extend(options.data, extraParams);
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
class GlobalProvider {
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
            options: _$2.extend(options, { endPointKey: uniqueName }),
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

/**
 * @fileOverview
 * Provides type-safety operations of manipulating LocalStorage data.
 * @name LocalStorageUtil.js
 * @module hypercom/storage/LocalStorageUtil
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
// as polyfill for localstorage
// Do NOT use the LocalStorage as there is global variable which cannot be resolved
// and which is defined only in TINYMCE.
// import * as localStorage from 'polpware-tinymce-tailor/src/util/LocalStorage.js';
const globalLocalStorage = window.localStorage;
const _$1 = dependencies.underscore, find = _$1.find, findIndex = _$1.findIndex, union = _$1.union;
/**
 * Reads the value of an entity by its key.
 * @function getEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 * @returns {*} The entity value.
 */
function getEntity(key, ty) {
    let data = defaultValue(ty);
    try {
        let tmp = globalLocalStorage.getItem(key);
        if (tmp && tmp !== 'undefined') {
            tmp = JSON.parse(tmp);
            if (ok(tmp, ty)) {
                data = tmp;
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return data;
}
/**
 * Updates the value of an entity by its key.
 * @function updateEntity
 * @param {String} key The entity key.
 * @param {*} data The new value to be replaced with.
 * @param {*} ty The type of the entity value.
 */
function updateEntity(key, data, ty = null) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(data));
    }
    catch (ex) {
        console.log(ex);
    }
}
/**
 * Cleans the value of an entity by its key.
 * @function cleanEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 */
function cleanEntity(key, ty) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(defaultValue(ty)));
    }
    catch (ex) {
        console.log(ex);
    }
}
/**
 * Inserts the given data into the value of an entity of type array.
 * Note that the inserted data should be disjoint with the current data
 * stored in this entity. Otherwise, the behavior may be undefined.
 * @function insertEntities
 * @param {String} key The entity key.
 * @param {Array} data The value to be inserted.
 * @param {Number} upperBound The max number of elements allows for this entity value.
 */
function insertEntities(key, data, upperBound) {
    let newData = [];
    const currentData = getEntity(key, tyArray);
    if (upperBound > 0 && currentData.length > upperBound) {
        newData = data;
    }
    else {
        newData = union(currentData, data);
    }
    updateEntity(key, newData, tyArray);
}
/**
 * Finds one element of an entity of type array.
 * @function findEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value. An Id field is assumed for each element.
 * @returns {*} The value of the found element.
 */
function findEntityById(key, id) {
    const data = getEntity(key, tyArray);
    return find(data, { Id: id });
}
/**
 * Removes an element of an entity of type array.
 * @function removeEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value for the element to be removed.
 */
function removeEntityById(key, id) {
    const data = getEntity(key, tyArray);
    const index = findIndex(data, { Id: id });
    if (index === -1) {
        return;
    }
    data.splice(index, 1);
    updateEntity(key, data, tyArray);
}
/**
 * Inserts or udpates an element of an entity of type array.
 * @function insertOrUpdateEntity
 * @param {String} key The entity key.
 * @param {Array} entity The new value of the entity.
 */
function insertOrUpdateEntity(key, entity) {
    const data = getEntity(key, tyArray);
    const index = findIndex(data, { Id: entity.Id });
    if (index !== -1) {
        data[index] = entity;
    }
    else {
        data.push(entity);
    }
    updateEntity(key, data, tyArray);
}
/**
 * Removes a group of entities by a given prefix.
 * @function cleanEntityGroup
 * @param {String} prefix The prefix of the keys of the entities to be removed. We organize entities somewhat hirarchly.
 * @returns {Boolean}
 */
function cleanEntityGroup(prefix) {
    const keys = [];
    for (const p in globalLocalStorage) {
        if (globalLocalStorage.hasOwnProperty(p) &&
            p.indexOf(prefix) === 0) {
            keys.push(p);
        }
    }
    if (keys.length === 0) {
        return keys;
    }
    keys.forEach(function (k) {
        globalLocalStorage.removeItem(k);
    });
    return keys;
}

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
class LocalStorageTable {
    /**
     * Gets the value for the given key.
     * @function getP
     * @param {String} key The key to be searched for.
     * @returns {Promise}
     * @throws {Error}
     */
    getP(key) {
        const data = getEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(data, null);
    }
    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    removeP(key) {
        cleanEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    updateP(key, value) {
        updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
}

/**
 * @fileOverview
 * Provides i18n service. This module is designed as
 * a delegate of the tinymce I18n service.
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
const _i18n = dependencies.I18n;
class I18n {
    static getDictByCode(code) {
        return _i18n.data[code];
    }
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    static add(code, items) {
        _i18n.add(code, items);
    }
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    static translate(text, defaultText) {
        const value = _i18n.translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    }
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    static recycleOthers(code) {
        const data = _i18n.data;
        const recycleList = [];
        for (const key in data) {
            // skip loop if the property is from prototype
            if (data.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (let i = 0; i < recycleList.length; i++) {
            const k = recycleList[i];
            delete data[k];
        }
    }
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
const _ = dependencies.underscore;
const isString = _.isString;
/**
 * Retrieves a value from a variable by a given namespace nested structure.
 * @function getByNamespace
 * @param {Object} repo
 * @param {*} fullyQualifiedNamespace A string or an arry of string defining the namespace.
 * @param {Number}[] startLevel
 * @returns {*}
 */
function getByNamespace(repo, identifiers, startLevel = 1) {
    const restIdentifiers = identifiers.slice(startLevel);
    const restKey = restIdentifiers.join('.');
    if (repo[restKey]) {
        return repo[restKey];
    }
    let initRepo = repo;
    for (let index = startLevel; index < identifiers.length; index++) {
        if (!initRepo) {
            break;
        }
        const key = identifiers[index];
        initRepo = initRepo[key];
    }
    return initRepo;
}
/**
 * @class Resources
 */
class ResourceLoader {
    /**
     * Constructor
     * @function init
     */
    constructor(_cache = null) {
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
    register(key, uri, liveSeconds = 60) {
        const configuration = this._configuration;
        if (configuration[key]) {
            throw new Error('Registering an existing resource key: ' + key);
        }
        configuration[key] = {
            uri: uri,
            liveSeconds: liveSeconds
        };
    }
    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    undoRegister(key) {
        const configuration = this._configuration;
        if (configuration[key]) {
            delete configuration[key];
        }
    }
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    getPromise(fullyQualifiedNamespace, convertor) {
        const identifiers = fullyQualifiedNamespace.split('.');
        const topIdentifier = identifiers[0];
        const cache = this._cache;
        if (cache) {
            // Figure out the master key
            const repo = cache.get(topIdentifier, 60);
            if (repo) {
                const value = getByNamespace(repo, identifiers);
                if (value) {
                    // Return a promise
                    return lift(value, null);
                }
            }
        }
        const entry = this._configuration[topIdentifier];
        if (!entry) {
            throw new Error('Get unregistered resource: ' + topIdentifier);
        }
        // Otherwise, load it
        return loadJsonUriP(entry.uri).then((content) => {
            content = convertor(content);
            // Cache the new value
            if (cache) {
                cache.set(topIdentifier, content, entry.liveSeconds);
            }
            return getByNamespace(content, identifiers);
        });
    }
}

//

//

//

/**
 * Generated bundle index. Do not edit.
 */

export { AggregateCollection, AntiForgeryKeyPolicy, CollectionAbstractStore, CollectionStore, DummyOAuthTokenCtorParams, DummyRecords, GlobalProvider, I18n, LocalStorageTable, MemoryBackend, NullPolicy, OAuthTokenExtPolicy, OAuthTokenPolicy, OpenIDPolicy, PolicyBase, RelationDatabase, RelationalTable, ResourceLoader, SlidingExpirationCache, UserCredential, adaptToOAuthToken, adaptToOpenIDToken, buildInitialState, buildReducerMap, cleanEntity, cleanEntityGroup, endPointEnum, factory, findEntityById, getEntity, insertEntities, insertOrUpdateEntity, loadHtmlP, loadJsonUriP, mountAjaxBeforeAdvice, mountSyncAroundAdvice, mountSyncBeforeAdvice, mountSyncListener, observableDecorator, pingP, reducer, removeEntityById, sendPromise, syncMethodEnum, updateEntity };
//# sourceMappingURL=polpware-fe-data.mjs.map
