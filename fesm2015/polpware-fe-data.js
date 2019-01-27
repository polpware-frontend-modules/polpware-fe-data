import { send } from 'polpware-tinymce-tailor/src/util/XHR';
import { extend } from 'polpware-tinymce-tailor/src/util/Tools';
import * as EventDispatcher from 'polpware-tinymce-tailor/src/util/EventDispatcher';
import { isNative } from 'polpware-tinymce-tailor/src/util/EventDispatcher';
import { __decorate, __metadata } from 'tslib';
import { ActionsSubject, ScannedActionsSubject, combineReducers, ReducerManager, State, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { data, add, translate } from 'polpware-tinymce-tailor/src/util/I18n';
import { backbone, jquery, underscore, meld, when, constraintjs, locache, dataflow } from '@polpware/fe-dependencies';
import { pushArray, urlEncode, lift, safeParseInt, isArray, liftWithGuard, defaultValue, tyArray, ok, tyObject } from '@polpware/fe-utilities';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const backbone$1 = backbone;
/** @type {?} */
const _ = underscore;
/** @type {?} */
const cjs = constraintjs;
class RelationalTable {
    /**
     * @param {?} options
     * @param {?} dummyRecords
     */
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
            /** @type {?} */
            const ctor = backbone$1.Collection.extend(options.dataProviderCtorOption || {});
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
    /**
     * @return {?}
     */
    get name() {
        return this._name;
    }
    /**
     * @return {?}
     */
    get cascade() {
        return this._cascade;
    }
    /**
     * @return {?}
     */
    dataProvider() {
        return this._dataProvider;
    }
    // TODO: Figure out ...
    /**
     * @return {?}
     */
    onDeleted() {
    }
    /**
     * Check if the given items are still in use.
     * @private
     * @param {?} item
     * @return {?}
     */
    hasAnyReference(item) {
        // Check if this item is in this table or not
        /** @type {?} */
        const itemInTable = this._dataProvider.get(item.id);
        if (!itemInTable) {
            return false;
        }
        /** @type {?} */
        const revRelations = this._reverseForeignRelation;
        /** @type {?} */
        let hasFound = false;
        for (const revK in revRelations) {
            if (revRelations.hasOwnProperty(revK)) {
                /** @type {?} */
                const revTables = revRelations[revK];
                hasFound = _.some(revTables, (fromTable) => {
                    /** @type {?} */
                    const fromTableDataProvider = fromTable.dataProvider();
                    /** @type {?} */
                    const filter = {};
                    filter[revK] = item.id;
                    /** @type {?} */
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
     * @private
     * @param {?} removedItems
     * @return {?}
     */
    removeReverseForeign(removedItems) {
        /** @type {?} */
        const revRelation = this._reverseForeignRelation;
        for (const revK in revRelation) {
            if (revRelation.hasOwnProperty(revK)) {
                /** @type {?} */
                const revTables = revRelation[revK];
                revTables.forEach((reverseTable) => {
                    /** @type {?} */
                    const dataProvider = reverseTable.dataProvider();
                    /** @type {?} */
                    const toBeRemoved = [];
                    removedItems.forEach((item) => {
                        /** @type {?} */
                        const filter = {};
                        filter[revK] = item.id;
                        /** @type {?} */
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
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this._dataProvider.get(id);
    }
    /**
     * @private
     * @param {?} thatItem
     * @return {?}
     */
    destroyFromTable(thatItem) {
        /** @type {?} */
        const removedItem = this._dataProvider.remove(thatItem);
        if (!removedItem) {
            return;
        }
        // Notify of its collection
        removedItem.set('invalidated', true);
        removedItem.trigger('destroy', removedItem);
        this.removeReverseForeign([removedItem]);
    }
    /**
     * @private
     * @param {?} thatItem
     * @param {?} foreignKey
     * @return {?}
     */
    getForeignModel(thatItem, foreignKey) {
        /** @type {?} */
        const value = thatItem.attributes[foreignKey];
        // If we do not have this foreignKey, then return a dummy one
        if (!value) {
            return this.dummyRecords.getDummyRecord(foreignKey);
        }
        /** @type {?} */
        const table = this._foreignRelation[foreignKey];
        return table.dataProvider().get(value);
    }
    /**
     * Adds an item in the Table and recursively add foreign items.
     * @param {?} model
     * @return {?}
     */
    add(model) {
        /** @type {?} */
        const selfContext = this;
        /** @type {?} */
        const dataProvider = this._dataProvider;
        /** @type {?} */
        const foreignRelation = this._foreignRelation;
        // Check if the item to be added is already in this table.
        /** @type {?} */
        const modelId = dataProvider.modelId(model);
        /** @type {?} */
        let addedItem = dataProvider.get(modelId);
        if (addedItem) {
            /** @type {?} */
            const newAttr = _.extend({}, addedItem.attributes, model);
            addedItem.set(newAttr);
            return addedItem;
        }
        // Otherwise a new item
        addedItem = dataProvider.add(model);
        // Add convenient methods
        addedItem.destroyFromTable = function () {
            /** @type {?} */
            const thatItem = this;
            selfContext.destroyFromTable(thatItem);
        };
        addedItem.getForeignModel = function (foreignKey) {
            /** @type {?} */
            const thatItem = this;
            return selfContext.getForeignModel(thatItem, foreignKey);
        };
        addedItem.hasAnyReference = function () {
            /** @type {?} */
            const thatItem = this;
            return selfContext.hasAnyReference(thatItem);
        };
        return addedItem;
    }
    /**
     * Add many items into a table.
     * @param {?} models
     * @return {?}
     */
    addMany(models) {
        return models.map(model => {
            return this.add(model);
        });
    }
    /**
     * Adds a foreign relation.
     * @param {?} foreignKey
     * @param {?} foreignTable
     * @return {?}
     */
    addForeignRelation(foreignKey, foreignTable) {
        if (this._foreignRelation[foreignKey]) {
            throw new Error('Foreign key exists: ' + foreignKey);
        }
        this._foreignRelation[foreignKey] = foreignTable;
    }
    /**
     * Add a reverse foreign relation.
     * @param {?} reverseForeignKey
     * @param {?} table
     * @return {?}
     */
    addReverseForeignRelation(reverseForeignKey, table) {
        /** @type {?} */
        const reverseTables = this._reverseForeignRelation[reverseForeignKey];
        if (reverseTables) {
            /** @type {?} */
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
     * @param {?} foreignKey
     * @return {?}
     */
    hasForeignRelation(foreignKey) {
        return !!this._foreignRelation[foreignKey];
    }
    /**
     * Checks if a given reverse foreign relation is present.
     * @param {?} reverseForeignKey
     * @return {?}
     */
    hasReverseForeignRelation(reverseForeignKey) {
        return !!this._reverseForeignRelation[reverseForeignKey];
    }
    /**
     * Destroys table
     * @return {?}
     */
    destroy() {
        // Remove constraint
        this._deleteConstraint.offChange(this._onDeletedHandler);
        this._dataProvider.reset();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const backbone$2 = backbone;
class DummyRecords {
    constructor() {
        this._data = {};
    }
    /**
     * @param {?} key
     * @return {?}
     */
    getDummyRecord(key) {
        if (!this._data[key]) {
            this._data[key] = new backbone$2.Model({});
        }
        return this._data[key];
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * @return {?}
     */
    getReference() {
        this._referenceCounter++;
        return this;
    }
    /**
     * Defines a table in the database.
     * @param {?} options
     * @return {?}
     */
    addTable(options) {
        return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
    }
    /**
     * Retrieves a table by name.
     * @param {?} name
     * @return {?}
     */
    getTable(name) {
        return this._tableCollection[name];
    }
    /**
     * Defines a foreign relation between two tables.
     * @param {?} name
     * @param {?} foreignKey
     * @param {?} foreignName
     * @return {?}
     */
    addForeignkey(name, foreignKey, foreignName) {
        // Constraints
        /** @type {?} */
        const table = this._tableCollection[name];
        if (!table) {
            throw new Error('Undefined table: ' + name);
        }
        /** @type {?} */
        const foreignTable = this._tableCollection[foreignName];
        if (!foreignTable) {
            throw new Error('Undefined foreign table: ' + foreignName);
        }
        table.addForeignRelation(foreignKey, foreignTable);
        foreignTable.addReverseForeignRelation(foreignKey, table);
    }
    /**
     * Destroys database
     * @return {?}
     */
    destroy() {
        this._referenceCounter--;
        if (this._referenceCounter === 0) {
            for (const k in this._tableCollection) {
                if (this._tableCollection.hasOwnProperty(k)) {
                    /** @type {?} */
                    const table = this._tableCollection[k];
                    table.destroy();
                }
            }
            this._tableCollection = {};
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const _$1 = underscore;
/** @type {?} */
const defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};
/**
 * @param {?} options
 * @return {?}
 */
function sendPromise(options) {
    /** @type {?} */
    const settings = _$1.extend({}, defaultOptions, options);
    /** @type {?} */
    const promise = new Promise((resolve, reject) => {
        /** @type {?} */
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
        send(xhrSettings);
    });
    return promise;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const $ = jquery;
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
function loadJsonUriP(url) {
    /** @type {?} */
    const deferred = $.ajax({
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
function pingP(url, options) {
    options = options || {};
    /** @type {?} */
    const ajaxParams = extend({ url: url }, options);
    return $.ajax(ajaxParams);
}
/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @param {?} url
 * @return {?}
 */
function loadHtmlP(url) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function (data$$1) {
        /*global DOMParser */
        /** @type {?} */
        const doc = new DOMParser().parseFromString(data$$1, 'text/html');
        return $(doc);
    });
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class MemoryBackend {
    constructor() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    set(key, value) {
        this._store[key] = value;
        return value;
    }
    /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    get(key) {
        return this._store[key] || null;
    }
    /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    remove(key) {
        delete this._store[key];
    }
    /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    length(key) {
        return Object.keys(this._store).length;
    }
    /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    key(index) {
        /** @type {?} */
        const keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    }
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    enabled() {
        return true;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const getEventDispatcher = function (obj) {
    if (!obj._eventDispatcher) {
        obj._eventDispatcher = new EventDispatcher({
            scope: obj,
            toggleEvent: function (name, state) {
                if (isNative(name) && obj.toggleNativeEvent) {
                    obj.toggleNativeEvent(name, state);
                }
            }
        });
    }
    return obj._eventDispatcher;
};
/**
 * @template T
 * @param {?} constructor
 * @return {?}
 */
function observableDecorator(constructor) {
    return class extends constructor {
        /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        fire(name, evt, bubble) {
            /** @type {?} */
            const self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }
            /** @type {?} */
            const newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                /** @type {?} */
                let parent = self.parent();
                while (parent && !newEvt.isPropagationStopped()) {
                    parent.fire(name, newEvt, false);
                    parent = parent.parent();
                }
            }
            return newEvt;
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        on(name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        off(name, callback) {
            return getEventDispatcher(this).off(name, callback);
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        once(name, callback) {
            return getEventDispatcher(this).once(name, callback);
        }
        /**
         * @param {?} name
         * @return {?}
         */
        hasEventListeners(name) {
            return getEventDispatcher(this).has(name);
        }
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const locache$1 = locache;
/** @type {?} */
const meld$1 = meld;
/** @type {?} */
const originalRemove = Object.getPrototypeOf(locache$1.locache).remove;
/** @type {?} */
const currentTime = function () {
    return new Date().getTime();
};
/**
 * @template T
 */
let SlidingExpirationCache = /**
 * @template T
 */
class SlidingExpirationCache {
    /**
     * @param {?} _defaultSeconds
     * @param {?=} scheduleInterval
     * @param {?=} ngZone
     */
    constructor(_defaultSeconds, scheduleInterval, ngZone) {
        this._defaultSeconds = _defaultSeconds;
        /** @type {?} */
        const backend = new MemoryBackend();
        this._cache = locache$1.locache.createCache({ storage: backend });
        this._cache.remove = meld$1.around(originalRemove, (input) => {
            /** @type {?} */
            const key = input.args[0];
            /** @type {?} */
            const onExpireEvtName = this.onExpireEventName(key);
            /** @type {?} */
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
            /** @type {?} */
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
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    onExpireEventName(key) {
        return 'onExpire:' + key;
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    afterRemoveEventName(key) {
        return 'afterRemove:' + key;
    }
    /**
     * @private
     * @param {?} key
     * @param {?} seconds
     * @return {?}
     */
    resetExpireKey(key, seconds) {
        /** @type {?} */
        const expirekey = this._cache.expirekey(key);
        /** @type {?} */
        const ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    }
    /**
     * @return {?}
     */
    get asObservable() {
        /** @type {?} */
        const self = this;
        /** @type {?} */
        const observable = self;
        return observable;
    }
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} seconds
     * @param {?=} afterRemoveCallback
     * @return {?}
     */
    set(key, value, seconds, afterRemoveCallback) {
        /** @type {?} */
        const expirekey = this._cache.expirekey(key);
        /** @type {?} */
        const valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            /** @type {?} */
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
    /**
     * @param {?} key
     * @param {?=} seconds
     * @return {?}
     */
    get(key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        /** @type {?} */
        const valueKey = this._cache.key(key);
        /** @type {?} */
        const value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    }
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    rmOnExpireHandler(key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    }
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    addOnExpireHandler(key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    }
    /**
     * @return {?}
     */
    get count() {
        return this._cache.length();
    }
    /**
     * @return {?}
     */
    reset() {
        /** @type {?} */
        const keys = this._cache.keys();
        keys.forEach((k) => {
            this.asObservable.off(this.onExpireEventName(k), null);
            originalRemove.call(this._cache, k);
            this.asObservable.fire(this.afterRemoveEventName(k), {});
        });
    }
    // must destory, or leaking ...
    /**
     * @return {?}
     */
    destroy() {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
};
/**
 * @template T
 */
SlidingExpirationCache = __decorate([
    observableDecorator,
    __metadata("design:paramtypes", [Number, Number, Object])
], SlidingExpirationCache);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DummyOAuthTokenCtorParams = {
    url: 'dummy',
    clientId: 'dummy',
    clientSecret: 'dummy',
    scope: 'all'
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const _$2 = underscore;
/**
 * @abstract
 */
class PolicyBase {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     * @return {?}
     */
    getTokenP() {
        if (!_$2.isEmpty(this.token) && !this.isExpired()) {
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
     * @return {?}
     */
    reset() {
        this.token = '';
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const $$1 = jquery;
/**
 * @param {?} data
 * @return {?}
 */
function adaptToOAuthToken(data$$1) {
    data$$1 = data$$1 || {};
    data$$1.expiresIn = data$$1.expiresIn || 0;
    data$$1.createdOn = data$$1.createdOn || 0;
    data$$1.token = data$$1.token || '';
    data$$1.refreshToken = data$$1.refreshToken || '';
    return data$$1;
}
class OAuthTokenPolicy extends PolicyBase {
    /**
     * @param {?} settings
     */
    constructor(settings) {
        super(settings);
        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope;
        this.expiresIn = null;
        this.createdOn = null;
        this.refreshToken = '';
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    readFrom(settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    }
    /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    persistent() {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    }
    /**
     * @return {?}
     */
    getParams() {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    }
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    getTokenInternal() {
        /** @type {?} */
        const params = this.getParams();
        return $$1.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then((resp) => {
            this.createdOn = new Date().getTime();
            this.expiresIn = resp.expires_in;
            this.refreshToken = resp.refreshToken || '';
            return (resp.access_token);
        });
    }
    /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    isExpired() {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        /** @type {?} */
        const expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        /** @type {?} */
        const now = new Date();
        /** @type {?} */
        const diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    }
    /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    applyTo(options) {
        options.beforeSend = (xhr) => {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(this.token)));
        };
    }
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    applyToV2(options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    }
    /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
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
     * @return {?}
     */
    reset() {
        super.reset();
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} data
 * @return {?}
 */
function adaptToOpenIDToken(data$$1) {
    data$$1 = data$$1 || {};
    /** @type {?} */
    const r = adaptToOAuthToken(data$$1);
    return Object.assign({}, r, { openId: data$$1.openId || '' });
}
class OpenIDPolicy extends OAuthTokenPolicy {
    constructor() {
        super(DummyOAuthTokenCtorParams);
        this._openId = '';
    }
    /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    persistent() {
        /** @type {?} */
        const r = super.persistent();
        return Object.assign({}, r, { openId: this._openId });
    }
    /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    readFrom(settings) {
        super.readFrom(settings);
        (/** @type {?} */ (this))._openId = settings.openId;
        return (/** @type {?} */ (this));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NullPolicy {
    /**
     * @return {?}
     */
    getTokenInternal() {
        throw new Error('NotImplemented');
    }
    /**
     * @param {?} options
     * @return {?}
     */
    applyTo(options) { }
    /**
     * @return {?}
     */
    isExpired() {
        return false;
    }
    /**
     * @param {?} settings
     * @return {?}
     */
    readFrom(settings) { }
    /**
     * @return {?}
     */
    persistent() { }
    /**
     * @param {?} options
     * @return {?}
     */
    applyToV2(options) { }
    /**
     * @param {?} options
     * @return {?}
     */
    applyToV3(options) { }
    /**
     * @return {?}
     */
    getTokenP() {
        throw new Error('NotImplemented');
    }
    /**
     * @return {?}
     */
    reset() { }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const _$4 = underscore;
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
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
        /** @type {?} */
        let k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    /** @type {?} */
    const checked = {};
    /** @type {?} */
    const objectB = (/** @type {?} */ (b));
    for (const k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
            checked[k] = true;
        }
    }
    /** @type {?} */
    const objectA = (/** @type {?} */ (a));
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
/**
 * @template T
 */
let UserCredential = 
// immutable
/**
 * @template T
 */
class UserCredential {
    /**
     * @param {?} authPolicy
     */
    constructor(authPolicy) {
        this.authPolicy = authPolicy;
        this._user = {};
        this._security = authPolicy;
    }
    /**
     * @return {?}
     */
    get asObservable() {
        /** @type {?} */
        const self = this;
        return (/** @type {?} */ (self));
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    security(value) {
        if (value) {
            this._security = value;
        }
        return this._security;
    }
    // Does not trigger any event
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    readFrom(data$$1) {
        this._user = _$4.extend(this._user, data$$1);
    }
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    setUser(data$$1) {
        if (isEquiva(this._user, data$$1)) {
            return;
        }
        this._user = data$$1;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    }
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    extendUser(data$$1) {
        /** @type {?} */
        const newData = _$4.extend({}, this._user, data$$1);
        this.setUser(newData);
    }
    /**
     * @template U
     * @return {?}
     */
    getUser() {
        return _$4.extend({}, this._user);
    }
    /**
     * @template U
     * @param {?} handler
     * @param {?=} likeBehaviorSubject
     * @return {?}
     */
    subscribe(handler, likeBehaviorSubject = false) {
        this.asObservable.on('change:user', handler);
        if (likeBehaviorSubject) {
            /** @type {?} */
            const newEvt = { data: this._user };
            handler((/** @type {?} */ (newEvt)));
        }
    }
    /**
     * @param {?} handler
     * @return {?}
     */
    unSubscribe(handler) {
        this.asObservable.off('change:user', handler);
    }
    /**
     * @return {?}
     */
    isUserKnown() {
        return !!(this._user && this._user.username);
    }
    /**
     * @return {?}
     */
    isAuthenticated() {
        return this.authPolicy && !this.authPolicy.isExpired();
    }
};
// immutable
/**
 * @template T
 */
UserCredential = __decorate([
    observableDecorator,
    __metadata("design:paramtypes", [Object])
], UserCredential);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const $$2 = jquery;
/** @type {?} */
const defaultAntiForgeryKey = '__RequestVerificationToken';
/** @type {?} */
const defaultElementTag = '';
/*
 <input name="__RequestVerificationToken" type="hidden"
 value="J8kl6w7KaBAteKOPeHW1IlG9RS7abCkbvQf2GwBlMVZZOX9FF-Bhc5mYmqXw4qe0MLraucQtKC-TAVh1rJEZ0SDfeLfqp-L5JrthIM9V0gp76-jnVz9J-rdYFhVeTT4Y0">
 */
/**
 * @param {?} url
 * @param {?} elementTag
 * @param {?} inputField
 * @return {?}
 */
function getTokenInternal(url, elementTag, inputField) {
    return $$2.ajax({
        url: url,
        // A page containing required tokens
        dataType: 'html text'
    }).then(function (data$$1) {
        /*global DOMParser */
        /** @type {?} */
        let doc;
        /** @type {?} */
        let token;
        /** @type {?} */
        let elm;
        token = '';
        doc = new DOMParser().parseFromString(data$$1, 'text/html');
        if (elementTag) {
            elm = $$2(doc).find(elementTag);
            if (elm.length > 0) {
                elm = $$2(doc).find(inputField);
                if (elm.length > 0) {
                    elm = elm.eq(0);
                    token = elm.attr('value');
                }
            }
        }
        else {
            elm = $$2(doc).find(inputField);
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
     * @param {?} settings
     */
    constructor(settings) {
        super(settings);
        this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        this._elementTag = settings.elementTag || defaultElementTag;
        this._expired = true;
    }
    /**
     * @return {?}
     */
    isExpired() {
        return this._expired;
    }
    /**
     * @return {?}
     */
    inputField() {
        return 'input[name="' + this._antiForgeryKey + '"]';
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    readFrom(settings) {
        this.token = settings.token;
    }
    /**
     * Returns the object that are persistentable.
     * @return {?}
     */
    persistent() {
        return {
            token: this.token
        };
    }
    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @throws {}
     * @return {?}
     */
    getTokenInternal() {
        /** @type {?} */
        const ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        /** @type {?} */
        const p = liftWithGuard(ret, function (token) {
            /** @type {?} */
            const isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    }
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @param {?} options
     * @return {?}
     */
    applyTo(options) {
        /** @type {?} */
        const data$$1 = options.data;
        data$$1[this._antiForgeryKey] = this.token;
    }
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    applyToV2(options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    }
    // TODO:
    /**
     * @param {?} options
     * @return {?}
     */
    applyToV3(options) {
    }
    /**
     * Resets the token and expired flag
     * @return {?}
     */
    reset() {
        super.reset();
        this._expired = true;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    /**
     * @param {?} settings
     * @param {?} payload
     */
    constructor(settings, payload) {
        super(settings);
        this._payload = Object.assign({}, payload);
    }
    /**
     * @return {?}
     */
    get payload() {
        return this._payload;
    }
    // override
    /**
     * @return {?}
     */
    getParams() {
        /** @type {?} */
        const p = super.getParams();
        return Object.assign({}, p, this._payload);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function reducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            /** @type {?} */
            const payload = action.payload.filter(x => {
                // Look for it in the current list
                /** @type {?} */
                const index = state.items.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return Object.assign({}, state, { items: [
                    ...state.items,
                    ...payload
                ] });
        }
        case 'REMOVE': {
            /** @type {?} */
            const newItems = state.items.filter(x => {
                /** @type {?} */
                const index = action.payload.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return Object.assign({}, state, { items: newItems });
        }
        case 'MODIFY': {
            // Nothing to do
            return state;
        }
        default:
            return state;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 * @return {?}
 */
function buildInitialState() {
    return {
        collection: {
            items: []
        }
    };
}
/**
 * @template T
 * @return {?}
 */
function buildReducerMap() {
    return {
        collection: reducer
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * @template T
 * @return {?}
 */
function factory() {
    /** @type {?} */
    const actionSubject = new ActionsSubject();
    /** @type {?} */
    const scannerActionSubject = new ScannedActionsSubject();
    /** @type {?} */
    const actionReducerFactory = combineReducers;
    /** @type {?} */
    const reducerManager = new ReducerManager(actionSubject, buildInitialState(), buildReducerMap(), actionReducerFactory);
    /** @type {?} */
    const stateObservable = new State(actionSubject, reducerManager, scannerActionSubject, buildInitialState());
    /** @type {?} */
    const store = new Store(stateObservable, actionSubject, reducerManager);
    return store;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 * @template T
 */
class CollectionAbstractStore {
    /**
     * @param {?} payload
     * @return {?}
     */
    add(payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    remove(payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    modify(payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class CollectionStore extends CollectionAbstractStore {
    constructor() {
        super();
        this._store = factory();
    }
    /**
     * @return {?}
     */
    getStore() {
        return this._store;
    }
    /**
     * @return {?}
     */
    getState() {
        return this._store.select('collection');
    }
}
CollectionStore.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CollectionStore.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const when$1 = when;
/** @type {?} */
const _$5 = underscore;
/**
 * @param {?} collection
 * @return {?}
 */
function hasNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return true;
    }
    return collection.hasNextPage();
}
/**
 * @param {?} collection
 * @return {?}
 */
function getNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return collection.getFirstPage();
    }
    return collection.getNextPage();
}
class AggregateCollection {
    /**
     * @param {?} _providerGenerator
     */
    constructor(_providerGenerator) {
        this._providerGenerator = _providerGenerator;
        this._workingProviders = [];
    }
    /**
     * @return {?}
     */
    hasNextPage() {
        // Case 1: The first time we request, we always have something.
        if (this._workingProviders.length === 0) {
            return true;
        }
        if (this._providerGenerator.hasMore()) {
            return true;
        }
        return _$5.some(this._workingProviders, function (elem) {
            return elem.hasNextPage();
        });
    }
    /**
     * @return {?}
     */
    getFirstPage() {
        // Generate providers
        return this._providerGenerator.getNext()
            .then((providers) => {
            providers = _$5.filter(providers, function (p) {
                return hasNextPage(p);
            });
            return providers;
        })
            .then((providers) => {
            this._workingProviders.length = 0;
            /** @type {?} */
            const promises = _$5.map(providers, function (p) {
                return getNextPage(p)
                    .then((resp) => {
                    this._workingProviders.push(p);
                    return resp;
                });
            });
            return when$1.settle(promises);
        });
    }
    /**
     * @return {?}
     */
    getNextPage() {
        return this.getFirstPage();
    }
    /**
     * @return {?}
     */
    reset() {
        this._providerGenerator.reset();
        this._workingProviders = [];
    }
    /**
     * @param {?} func
     * @return {?}
     */
    forEach(func) {
        this._workingProviders.forEach((p) => {
            p.forEach(func);
        });
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        // TODO:
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const backbone$3 = backbone;
/** @type {?} */
const meld$2 = meld;
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
 * @throws {Error}
 * @param {?} callback
 * @return {?}
 */
function mountSyncListener(callback) {
    // Collection
    /** @type {?} */
    const remover1 = meld$2.before(backbone$3.Collection.prototype, 'trigger', callback);
    /** @type {?} */
    const remover2 = meld$2.before(backbone$3.Model.prototype, 'trigger', callback);
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
 * @param {?} callback
 * @return {?}
 */
function mountSyncBeforeAdvice(callback) {
    return meld$2.before(backbone$3, 'sync', callback);
}
/**
 * The signature for the around advice.
 * @callback EventHubaroundAdviceSignature
 * @param {String} jointpoint the jointpoint for this advice.
 */
/**
 * Sets up an around advice.
 * @param {?} callback
 * @return {?}
 */
function mountSyncAroundAdvice(callback) {
    return meld$2.around(backbone$3, 'sync', callback);
}
/**
 * Sets up a pre-ajax callback.
 * @param {?} callback
 * @return {?}
 */
function mountAjaxBeforeAdvice(callback) {
    return meld$2.before(backbone$3, 'ajax', callback);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DataFlow = dataflow;
/** @type {?} */
const backbone$4 = backbone;
/** @type {?} */
const _$6 = underscore;
/**
 * The endpoint types for a backend service.
 * @type {?}
 */
const endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 * @type {?}
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
/** @type {?} */
const globalConfigurationMapping = {};
/** @type {?} */
const mountedFeatureRemovers = [];
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
    let remover = mountSyncBeforeAdvice(function (method, model, options) {
        options.methodKey = method;
        options.endPointKey = model.endPointKey || (model.collection ? model.collection.endPointKey : null);
        if (options.endPointKey) {
            /** @type {?} */
            const cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
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
            /** @type {?} */
            const cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
            const cfgOptions = cfg.options;
            /** @type {?} */
            const policyDelegate = cfgOptions.securityDelegate;
            /** @type {?} */
            const extraParams = cfgOptions.extraParams;
            if (cfgOptions.contentType === 'application/x-www-form-urlencoded' &&
                options.contentType === 'application/json') {
                options.data = JSON.parse(options.data);
                if (extraParams) {
                    _$6.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                options.data = urlEncode(options.data);
                options.contentType = cfgOptions.contentType;
            }
            else {
                if (extraParams) {
                    _$6.extend(options.data, extraParams);
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
        const options = jointpoint.args[2];
        if (options.endPointKey) {
            /** @type {?} */
            const cfg = globalConfigurationMapping[options.endPointKey];
            /** @type {?} */
            const cfgOptions = cfg.options;
            if (cfgOptions.syncDelegate) {
                /** @type {?} */
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
/** @type {?} */
const defaultLivePeroid = 60 * 5;
class GlobalProvider {
    /**
     * @param {?} ctorOptions
     */
    constructor(ctorOptions) {
        this._cache = new SlidingExpirationCache(defaultLivePeroid);
        this._dataflow = new DataFlow();
        this._myEndPointKeys = [];
        this._host = ctorOptions.webhost || '';
        this._uniqueNamePrefix = this._host ? (this._host.replace('.', '-') + '-') : '';
        // Mount features
        mountFeatures();
    }
    /**
     * @return {?}
     */
    get host() {
        return this._host;
    }
    /**
     * @return {?}
     */
    get configurationMapping() {
        return globalConfigurationMapping;
    }
    /**
     * Defines an endpoint for a kind of service.
     * @param {?} name
     * @param {?} tag
     * @param {?} options
     * @return {?}
     */
    addEndPoint(name, tag, options) {
        /** @type {?} */
        const cfgMapping = this.configurationMapping;
        /** @type {?} */
        const dataflow$$1 = this._dataflow;
        /** @type {?} */
        const uniqueName = this._uniqueNamePrefix + name;
        if (cfgMapping[uniqueName]) {
            throw new Error('Redefined endpoint: ' + name);
        }
        cfgMapping[uniqueName] = {
            options: _$6.extend(options, { endPointKey: uniqueName }),
            tag: tag
        };
        this._myEndPointKeys.push(uniqueName);
        // Set up data flow nodes (it is enough to use local names)
        if (tag === endPointEnum.model) {
            for (const k in syncMethodEnum) {
                // skip loop if the property is from prototype
                if (syncMethodEnum.hasOwnProperty(k)) {
                    /** @type {?} */
                    const value = syncMethodEnum[k];
                    dataflow$$1[name + ':' + value] = 1;
                }
            }
        }
        else {
            dataflow$$1[name + ':' + syncMethodEnum.read] = 1;
        }
    }
    /**
     * Retrieves the endpoint by the given name.
     * @param {?} name
     * @param {?=} ignoreCache
     * @return {?}
     */
    getEndPoint(name, ignoreCache) {
        /** @type {?} */
        const cache = this._cache;
        /** @type {?} */
        const uniqueName = this._uniqueNamePrefix + name;
        if (ignoreCache !== true) {
            /** @type {?} */
            const cachedValue = cache.get(uniqueName);
            if (cachedValue) {
                return cachedValue;
            }
        }
        /** @type {?} */
        const cfgMapping = this.configurationMapping;
        /** @type {?} */
        const cfg = cfgMapping[uniqueName];
        if (!cfg) {
            /** @type {?} */
            const error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }
        /** @type {?} */
        let value = null;
        if (cfg.tag === endPointEnum.model) {
            value = backbone$4.Model.extend(cfg.options);
        }
        else if (cfg.tag === endPointEnum.collection) {
            value = backbone$4.Collection.extend(cfg.options);
        }
        else if (cfg.tag === endPointEnum.pagedCollection) {
            value = backbone$4.PageableCollection.extend(cfg.options);
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
     * @param {?} endPointKey
     * @return {?}
     */
    getConfiguration(endPointKey) {
        /** @type {?} */
        const uniqueName = this._uniqueNamePrefix + endPointKey;
        /** @type {?} */
        const cfgMapping = this.configurationMapping;
        return cfgMapping[uniqueName];
    }
    /**
     * Provides the callback when some operations happen.
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    addWhenCallback(name, callback) {
        /** @type {?} */
        const dataflow$$1 = this._dataflow;
        dataflow$$1.when(name, callback);
    }
    /**
     * Defines the dependency.
     * @param {?} src
     * @param {?} dst
     * @return {?}
     */
    addDependency(src, dst) {
        /** @type {?} */
        const dataflow$$1 = this._dataflow;
        dataflow$$1.on(src, function () {
            dataflow$$1[dst] = dataflow$$1[dst] + 1;
        });
    }
    /**
     * Clean up all cached data provider
     * @return {?}
     */
    cleanupCache() {
        // Remove what we have in cache
        this._cache.reset();
    }
    /**
     * @return {?}
     */
    cleanMountedFeatures() {
        mountedFeatureRemovers.forEach(function (remover) {
            remover.remove();
        });
        mountedFeatureRemovers.length = 0;
    }
    /**
     * Destroy the provider to release resources
     * @return {?}
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
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// as polyfill for localstorage
// Do NOT use the LocalStorage as there is global variable which cannot be resolved
// and which is defined only in TINYMCE.
// import * as localStorage from 'polpware-tinymce-tailor/src/util/LocalStorage.js';
/** @type {?} */
const globalLocalStorage = window.localStorage;
/** @type {?} */
const _$7 = underscore;
/** @type {?} */
const find = _$7.find;
/** @type {?} */
const findIndex = _$7.findIndex;
/** @type {?} */
const union = _$7.union;
/**
 * Reads the value of an entity by its key.
 * @param {?} key
 * @param {?} ty
 * @return {?}
 */
function getEntity(key, ty) {
    /** @type {?} */
    let data$$1 = defaultValue(ty);
    try {
        /** @type {?} */
        let tmp = globalLocalStorage.getItem(key);
        if (tmp && tmp !== 'undefined') {
            tmp = JSON.parse(tmp);
            if (ok(tmp, ty)) {
                data$$1 = tmp;
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return data$$1;
}
/**
 * Updates the value of an entity by its key.
 * @param {?} key
 * @param {?} data
 * @param {?=} ty
 * @return {?}
 */
function updateEntity(key, data$$1, ty = null) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(data$$1));
    }
    catch (ex) {
        console.log(ex);
    }
}
/**
 * Cleans the value of an entity by its key.
 * @param {?} key
 * @param {?} ty
 * @return {?}
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
 * @param {?} key
 * @param {?} data
 * @param {?} upperBound
 * @return {?}
 */
function insertEntities(key, data$$1, upperBound) {
    /** @type {?} */
    let newData = [];
    /** @type {?} */
    const currentData = (/** @type {?} */ (getEntity(key, tyArray)));
    if (upperBound > 0 && currentData.length > upperBound) {
        newData = data$$1;
    }
    else {
        newData = union(currentData, data$$1);
    }
    updateEntity(key, newData, tyArray);
}
/**
 * Finds one element of an entity of type array.
 * @param {?} key
 * @param {?} id
 * @return {?}
 */
function findEntityById(key, id) {
    /** @type {?} */
    const data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
    return find(data$$1, { Id: id });
}
/**
 * Removes an element of an entity of type array.
 * @param {?} key
 * @param {?} id
 * @return {?}
 */
function removeEntityById(key, id) {
    /** @type {?} */
    const data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    const index = findIndex(data$$1, { Id: id });
    if (index === -1) {
        return;
    }
    data$$1.splice(index, 1);
    updateEntity(key, data$$1, tyArray);
}
/**
 * Inserts or udpates an element of an entity of type array.
 * @param {?} key
 * @param {?} entity
 * @return {?}
 */
function insertOrUpdateEntity(key, entity) {
    /** @type {?} */
    const data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    const index = findIndex(data$$1, { Id: entity.Id });
    if (index !== -1) {
        data$$1[index] = entity;
    }
    else {
        data$$1.push(entity);
    }
    updateEntity(key, data$$1, tyArray);
}
/**
 * Removes a group of entities by a given prefix.
 * @param {?} prefix
 * @return {?}
 */
function cleanEntityGroup(prefix) {
    /** @type {?} */
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
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LocalStorageTable {
    /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    getP(key) {
        /** @type {?} */
        const data$$1 = getEntity(key, tyObject);
        return lift(data$$1, null);
    }
    /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    removeP(key) {
        cleanEntity(key, tyObject);
        return lift(true, null);
    }
    /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    updateP(key, value) {
        updateEntity(key, value, tyObject);
        return lift(true, null);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class I18n {
    /**
     * @param {?} code
     * @return {?}
     */
    static getDictByCode(code) {
        return data[code];
    }
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    static add(code, items) {
        add(code, items);
    }
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    static translate(text, defaultText) {
        /** @type {?} */
        const value = translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    }
    /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    static recycleOthers(code) {
        /** @type {?} */
        const data$$1 = data;
        /** @type {?} */
        const recycleList = [];
        for (const key in data$$1) {
            // skip loop if the property is from prototype
            if (data$$1.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (let i = 0; i < recycleList.length; i++) {
            /** @type {?} */
            const k = recycleList[i];
            delete data$$1[k];
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const _$8 = underscore;
/** @type {?} */
const isString = _$8.isString;
/**
 * Retrieves a value from a variable by a given namespace nested structure.
 * @template T
 * @param {?} repo
 * @param {?} identifiers
 * @param {?=} startLevel
 * @return {?}
 */
function getByNamespace(repo, identifiers, startLevel = 1) {
    /** @type {?} */
    const restIdentifiers = identifiers.slice(startLevel);
    /** @type {?} */
    const restKey = restIdentifiers.join('.');
    if (repo[restKey]) {
        return repo[restKey];
    }
    /** @type {?} */
    let initRepo = repo;
    for (let index = startLevel; index < identifiers.length; index++) {
        if (!initRepo) {
            break;
        }
        /** @type {?} */
        const key = identifiers[index];
        initRepo = initRepo[key];
    }
    return initRepo;
}
class ResourceLoader {
    /**
     * Constructor
     * @param {?=} _cache
     */
    constructor(_cache = null) {
        this._cache = _cache;
        this._configuration = {};
    }
    /**
     * Configure a resource
     * @throws {Error}
     * @param {?} key
     * @param {?} uri
     * @param {?=} liveSeconds
     * @return {?}
     */
    register(key, uri, liveSeconds = 60) {
        /** @type {?} */
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
     * @param {?} key
     * @return {?}
     */
    undoRegister(key) {
        /** @type {?} */
        const configuration = this._configuration;
        if (configuration[key]) {
            delete configuration[key];
        }
    }
    /**
     * Returns a promise for the resource key.
     * @throws {Error}
     * @template T
     * @param {?} fullyQualifiedNamespace
     * @param {?} convertor
     * @return {?}
     */
    getPromise(fullyQualifiedNamespace, convertor) {
        /** @type {?} */
        const identifiers = fullyQualifiedNamespace.split('.');
        /** @type {?} */
        const topIdentifier = identifiers[0];
        /** @type {?} */
        const cache = this._cache;
        if (cache) {
            // Figure out the master key
            /** @type {?} */
            const repo = cache.get(topIdentifier, 60);
            if (repo) {
                /** @type {?} */
                const value = getByNamespace(repo, identifiers);
                if (value) {
                    // Return a promise
                    return lift(value, null);
                }
            }
        }
        /** @type {?} */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { RelationalTable, DummyRecords, RelationDatabase, sendPromise, loadJsonUriP, pingP, loadHtmlP, SlidingExpirationCache, MemoryBackend, adaptToOpenIDToken, OpenIDPolicy, PolicyBase, NullPolicy, UserCredential, AntiForgeryKeyPolicy, adaptToOAuthToken, OAuthTokenExtPolicy, OAuthTokenPolicy, DummyOAuthTokenCtorParams, observableDecorator, factory, CollectionStore, CollectionAbstractStore, reducer, buildInitialState, buildReducerMap, AggregateCollection, mountSyncListener, mountSyncBeforeAdvice, mountSyncAroundAdvice, mountAjaxBeforeAdvice, endPointEnum, syncMethodEnum, GlobalProvider, getEntity, updateEntity, cleanEntity, insertEntities, findEntityById, removeEntityById, insertOrUpdateEntity, cleanEntityGroup, LocalStorageTable, I18n, ResourceLoader };

//# sourceMappingURL=polpware-fe-data.js.map