import { send } from 'polpware-tinymce-tailor/src/util/XHR';
import { extend } from 'polpware-tinymce-tailor/src/util/Tools';
import * as EventDispatcher from 'polpware-tinymce-tailor/src/util/EventDispatcher';
import { isNative } from 'polpware-tinymce-tailor/src/util/EventDispatcher';
import { ActionsSubject, ScannedActionsSubject, combineReducers, ReducerManager, State, Store } from '@ngrx/store';
import { __assign, __extends, __spread, __decorate, __metadata } from 'tslib';
import { Injectable } from '@angular/core';
import { data, add, translate } from 'polpware-tinymce-tailor/src/util/I18n';
import { backbone, jquery, underscore, meld, when, locache, constraintjs, dataflow } from '@polpware/fe-dependencies';
import { pushArray, urlEncode, lift, safeParseInt, isArray, liftWithGuard, defaultValue, tyArray, ok, tyObject } from '@polpware/fe-utilities';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var backbone$1 = backbone;
/** @type {?} */
var _ = underscore;
/** @type {?} */
var cjs = constraintjs;
var RelationalTable = /** @class */ (function () {
    function RelationalTable(options, dummyRecords) {
        var _this = this;
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
            var ctor = backbone$1.Collection.extend(options.dataProviderCtorOption || {});
            this._dataProvider = new ctor();
        }
        this._addConstraint = cjs.constraint([]);
        this._deleteConstraint = cjs.constraint([]);
        // Todo: Figure out parameters
        this._onDeletedHandler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.onDeleted();
        };
        // Set up constraint
        this._deleteConstraint.onChange(this._onDeletedHandler);
    }
    Object.defineProperty(RelationalTable.prototype, "name", {
        get: /**
         * @return {?}
         */
        function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelationalTable.prototype, "cascade", {
        get: /**
         * @return {?}
         */
        function () {
            return this._cascade;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    RelationalTable.prototype.dataProvider = /**
     * @return {?}
     */
    function () {
        return this._dataProvider;
    };
    // TODO: Figure out ...
    // TODO: Figure out ...
    /**
     * @return {?}
     */
    RelationalTable.prototype.onDeleted = 
    // TODO: Figure out ...
    /**
     * @return {?}
     */
    function () {
    };
    /**
     * Check if the given items are still in use.
     */
    /**
     * Check if the given items are still in use.
     * @private
     * @param {?} item
     * @return {?}
     */
    RelationalTable.prototype.hasAnyReference = /**
     * Check if the given items are still in use.
     * @private
     * @param {?} item
     * @return {?}
     */
    function (item) {
        // Check if this item is in this table or not
        /** @type {?} */
        var itemInTable = this._dataProvider.get(item.id);
        if (!itemInTable) {
            return false;
        }
        /** @type {?} */
        var revRelations = this._reverseForeignRelation;
        /** @type {?} */
        var hasFound = false;
        var _loop_1 = function (revK) {
            if (revRelations.hasOwnProperty(revK)) {
                /** @type {?} */
                var revTables = revRelations[revK];
                hasFound = _.some(revTables, function (fromTable) {
                    /** @type {?} */
                    var fromTableDataProvider = fromTable.dataProvider();
                    /** @type {?} */
                    var filter = {};
                    filter[revK] = item.id;
                    /** @type {?} */
                    var anyUse = fromTableDataProvider.findWhere(filter);
                    return !!anyUse;
                });
                if (hasFound) {
                    return "break";
                }
            }
        };
        for (var revK in revRelations) {
            var state_1 = _loop_1(revK);
            if (state_1 === "break")
                break;
        }
        return hasFound;
    };
    /**
     * Removing any items in other tables which depend on the deleted item.
     */
    /**
     * Removing any items in other tables which depend on the deleted item.
     * @private
     * @param {?} removedItems
     * @return {?}
     */
    RelationalTable.prototype.removeReverseForeign = /**
     * Removing any items in other tables which depend on the deleted item.
     * @private
     * @param {?} removedItems
     * @return {?}
     */
    function (removedItems) {
        /** @type {?} */
        var revRelation = this._reverseForeignRelation;
        var _loop_2 = function (revK) {
            if (revRelation.hasOwnProperty(revK)) {
                /** @type {?} */
                var revTables = revRelation[revK];
                revTables.forEach(function (reverseTable) {
                    /** @type {?} */
                    var dataProvider = reverseTable.dataProvider();
                    /** @type {?} */
                    var toBeRemoved = [];
                    removedItems.forEach(function (item) {
                        /** @type {?} */
                        var filter = {};
                        filter[revK] = item.id;
                        /** @type {?} */
                        var anyItems = dataProvider.where(filter);
                        pushArray(toBeRemoved, anyItems);
                    });
                    toBeRemoved.forEach(function (item) {
                        item.destroyFromTable();
                    });
                });
            }
        };
        for (var revK in revRelation) {
            _loop_2(revK);
        }
    };
    /**
     * Gets the model in the table by id.
     */
    /**
     * Gets the model in the table by id.
     * @param {?} id
     * @return {?}
     */
    RelationalTable.prototype.get = /**
     * Gets the model in the table by id.
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this._dataProvider.get(id);
    };
    /**
     * @private
     * @param {?} thatItem
     * @return {?}
     */
    RelationalTable.prototype.destroyFromTable = /**
     * @private
     * @param {?} thatItem
     * @return {?}
     */
    function (thatItem) {
        /** @type {?} */
        var removedItem = this._dataProvider.remove(thatItem);
        if (!removedItem) {
            return;
        }
        // Notify of its collection
        removedItem.set('invalidated', true);
        removedItem.trigger('destroy', removedItem);
        this.removeReverseForeign([removedItem]);
    };
    /**
     * @private
     * @param {?} thatItem
     * @param {?} foreignKey
     * @return {?}
     */
    RelationalTable.prototype.getForeignModel = /**
     * @private
     * @param {?} thatItem
     * @param {?} foreignKey
     * @return {?}
     */
    function (thatItem, foreignKey) {
        /** @type {?} */
        var value = thatItem.attributes[foreignKey];
        // If we do not have this foreignKey, then return a dummy one
        if (!value) {
            return this.dummyRecords.getDummyRecord(foreignKey);
        }
        /** @type {?} */
        var table = this._foreignRelation[foreignKey];
        return table.dataProvider().get(value);
    };
    /**
     * Adds an item in the Table and recursively add foreign items.
     */
    /**
     * Adds an item in the Table and recursively add foreign items.
     * @param {?} model
     * @return {?}
     */
    RelationalTable.prototype.add = /**
     * Adds an item in the Table and recursively add foreign items.
     * @param {?} model
     * @return {?}
     */
    function (model) {
        /** @type {?} */
        var selfContext = this;
        /** @type {?} */
        var dataProvider = this._dataProvider;
        /** @type {?} */
        var foreignRelation = this._foreignRelation;
        // Check if the item to be added is already in this table.
        /** @type {?} */
        var modelId = dataProvider.modelId(model);
        /** @type {?} */
        var addedItem = dataProvider.get(modelId);
        if (addedItem) {
            /** @type {?} */
            var newAttr = _.extend({}, addedItem.attributes, model);
            addedItem.set(newAttr);
            return addedItem;
        }
        // Otherwise a new item
        addedItem = dataProvider.add(model);
        // Add convenient methods
        addedItem.destroyFromTable = function () {
            /** @type {?} */
            var thatItem = this;
            selfContext.destroyFromTable(thatItem);
        };
        addedItem.getForeignModel = function (foreignKey) {
            /** @type {?} */
            var thatItem = this;
            return selfContext.getForeignModel(thatItem, foreignKey);
        };
        addedItem.hasAnyReference = function () {
            /** @type {?} */
            var thatItem = this;
            return selfContext.hasAnyReference(thatItem);
        };
        return addedItem;
    };
    /**
     * Add many items into a table.
     */
    /**
     * Add many items into a table.
     * @param {?} models
     * @return {?}
     */
    RelationalTable.prototype.addMany = /**
     * Add many items into a table.
     * @param {?} models
     * @return {?}
     */
    function (models) {
        var _this = this;
        return models.map(function (model) {
            return _this.add(model);
        });
    };
    /**
     * Adds a foreign relation.
     */
    /**
     * Adds a foreign relation.
     * @param {?} foreignKey
     * @param {?} foreignTable
     * @return {?}
     */
    RelationalTable.prototype.addForeignRelation = /**
     * Adds a foreign relation.
     * @param {?} foreignKey
     * @param {?} foreignTable
     * @return {?}
     */
    function (foreignKey, foreignTable) {
        if (this._foreignRelation[foreignKey]) {
            throw new Error('Foreign key exists: ' + foreignKey);
        }
        this._foreignRelation[foreignKey] = foreignTable;
    };
    /**
     * Add a reverse foreign relation.
     */
    /**
     * Add a reverse foreign relation.
     * @param {?} reverseForeignKey
     * @param {?} table
     * @return {?}
     */
    RelationalTable.prototype.addReverseForeignRelation = /**
     * Add a reverse foreign relation.
     * @param {?} reverseForeignKey
     * @param {?} table
     * @return {?}
     */
    function (reverseForeignKey, table) {
        /** @type {?} */
        var reverseTables = this._reverseForeignRelation[reverseForeignKey];
        if (reverseTables) {
            /** @type {?} */
            var index = reverseTables.findIndex(function (elem) {
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
    };
    /**
     * Check if a given foreign relation is present.
     */
    /**
     * Check if a given foreign relation is present.
     * @param {?} foreignKey
     * @return {?}
     */
    RelationalTable.prototype.hasForeignRelation = /**
     * Check if a given foreign relation is present.
     * @param {?} foreignKey
     * @return {?}
     */
    function (foreignKey) {
        return !!this._foreignRelation[foreignKey];
    };
    /**
     * Checks if a given reverse foreign relation is present.
     */
    /**
     * Checks if a given reverse foreign relation is present.
     * @param {?} reverseForeignKey
     * @return {?}
     */
    RelationalTable.prototype.hasReverseForeignRelation = /**
     * Checks if a given reverse foreign relation is present.
     * @param {?} reverseForeignKey
     * @return {?}
     */
    function (reverseForeignKey) {
        return !!this._reverseForeignRelation[reverseForeignKey];
    };
    /**
     * Destroys table
     */
    /**
     * Destroys table
     * @return {?}
     */
    RelationalTable.prototype.destroy = /**
     * Destroys table
     * @return {?}
     */
    function () {
        // Remove constraint
        this._deleteConstraint.offChange(this._onDeletedHandler);
        this._dataProvider.reset();
    };
    return RelationalTable;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var backbone$2 = backbone;
var DummyRecords = /** @class */ (function () {
    function DummyRecords() {
        this._data = {};
    }
    /**
     * @param {?} key
     * @return {?}
     */
    DummyRecords.prototype.getDummyRecord = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (!this._data[key]) {
            this._data[key] = new backbone$2.Model({});
        }
        return this._data[key];
    };
    return DummyRecords;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var RelationDatabase = /** @class */ (function () {
    /**
     * Represents a relational database.
     */
    function RelationDatabase() {
        this._referenceCounter = 1;
        this._tableCollection = {};
        this._dummyRecords = new DummyRecords();
    }
    /**
     * Gets a reference of the file system database
     */
    /**
     * Gets a reference of the file system database
     * @return {?}
     */
    RelationDatabase.prototype.getReference = /**
     * Gets a reference of the file system database
     * @return {?}
     */
    function () {
        this._referenceCounter++;
        return this;
    };
    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    /**
     * Defines a table in the database.
     * @param {?} options
     * @return {?}
     */
    RelationDatabase.prototype.addTable = /**
     * Defines a table in the database.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
    };
    /**
     * Retrieves a table by name.
     */
    /**
     * Retrieves a table by name.
     * @param {?} name
     * @return {?}
     */
    RelationDatabase.prototype.getTable = /**
     * Retrieves a table by name.
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this._tableCollection[name];
    };
    /**
     * Defines a foreign relation between two tables.
     */
    /**
     * Defines a foreign relation between two tables.
     * @param {?} name
     * @param {?} foreignKey
     * @param {?} foreignName
     * @return {?}
     */
    RelationDatabase.prototype.addForeignkey = /**
     * Defines a foreign relation between two tables.
     * @param {?} name
     * @param {?} foreignKey
     * @param {?} foreignName
     * @return {?}
     */
    function (name, foreignKey, foreignName) {
        // Constraints
        /** @type {?} */
        var table = this._tableCollection[name];
        if (!table) {
            throw new Error('Undefined table: ' + name);
        }
        /** @type {?} */
        var foreignTable = this._tableCollection[foreignName];
        if (!foreignTable) {
            throw new Error('Undefined foreign table: ' + foreignName);
        }
        table.addForeignRelation(foreignKey, foreignTable);
        foreignTable.addReverseForeignRelation(foreignKey, table);
    };
    /**
     * Destroys database
     */
    /**
     * Destroys database
     * @return {?}
     */
    RelationDatabase.prototype.destroy = /**
     * Destroys database
     * @return {?}
     */
    function () {
        this._referenceCounter--;
        if (this._referenceCounter === 0) {
            for (var k in this._tableCollection) {
                if (this._tableCollection.hasOwnProperty(k)) {
                    /** @type {?} */
                    var table = this._tableCollection[k];
                    table.destroy();
                }
            }
            this._tableCollection = {};
        }
    };
    return RelationDatabase;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var _$1 = underscore;
/** @type {?} */
var defaultOptions = {
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
    var settings = _$1.extend({}, defaultOptions, options);
    /** @type {?} */
    var promise = new Promise(function (resolve, reject) {
        /** @type {?} */
        var xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: function (output, xhr, input) {
                resolve({
                    response: output,
                    xhr: xhr,
                    settings: input
                });
            },
            error: function (output, xhr, input) {
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
var $ = jquery;
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
    var deferred = $.ajax({
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
    var ajaxParams = extend({ url: url }, options);
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
        var doc = new DOMParser().parseFromString(data$$1, 'text/html');
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
var  /**
 * @template T
 */
MemoryBackend = /** @class */ (function () {
    function MemoryBackend() {
        this._store = {};
    }
    /**
     * Sets a key-value pair
     */
    /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    MemoryBackend.prototype.set = /**
     * Sets a key-value pair
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        this._store[key] = value;
        return value;
    };
    /**
     * Gets the value for a given key.
     */
    /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.get = /**
     * Gets the value for a given key.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this._store[key] || null;
    };
    /**
     * Removes the given key and its corresponding value.
     */
    /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.remove = /**
     * Removes the given key and its corresponding value.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        delete this._store[key];
    };
    /**
     * Returns the number of stored items.
     */
    /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    MemoryBackend.prototype.length = /**
     * Returns the number of stored items.
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return Object.keys(this._store).length;
    };
    /**
     * Retuns the ith key in the store table.
     */
    /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    MemoryBackend.prototype.key = /**
     * Retuns the ith key in the store table.
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var keys = Object.keys(this._store);
        if (index >= 0 && index < keys.length) {
            return keys[index];
        }
        return '';
    };
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    MemoryBackend.prototype.enabled = /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     * @return {?}
     */
    function () {
        return true;
    };
    return MemoryBackend;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var getEventDispatcher = function (obj) {
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
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        class_1.prototype.fire = /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        function (name, evt, bubble) {
            /** @type {?} */
            var self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }
            /** @type {?} */
            var newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                /** @type {?} */
                var parent_1 = self.parent();
                while (parent_1 && !newEvt.isPropagationStopped()) {
                    parent_1.fire(name, newEvt, false);
                    parent_1 = parent_1.parent();
                }
            }
            return newEvt;
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        class_1.prototype.on = /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        function (name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        class_1.prototype.off = /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (name, callback) {
            return getEventDispatcher(this).off(name, callback);
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        class_1.prototype.once = /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (name, callback) {
            return getEventDispatcher(this).once(name, callback);
        };
        /**
         * @param {?} name
         * @return {?}
         */
        class_1.prototype.hasEventListeners = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return getEventDispatcher(this).has(name);
        };
        return class_1;
    }(constructor));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var locache$1 = locache;
/** @type {?} */
var meld$1 = meld;
/** @type {?} */
var originalRemove = Object.getPrototypeOf(locache$1.locache).remove;
/** @type {?} */
var currentTime = function () {
    return new Date().getTime();
};
/**
 * @template T
 */
var SlidingExpirationCache = /** @class */ (function () {
    function SlidingExpirationCache(_defaultSeconds, scheduleInterval, ngZone) {
        var _this = this;
        this._defaultSeconds = _defaultSeconds;
        /** @type {?} */
        var backend = new MemoryBackend();
        this._cache = locache$1.locache.createCache({ storage: backend });
        this._cache.remove = meld$1.around(originalRemove, function (input) {
            /** @type {?} */
            var key = input.args[0];
            /** @type {?} */
            var onExpireEvtName = _this.onExpireEventName(key);
            /** @type {?} */
            var event = _this.asObservable.fire(onExpireEvtName, {});
            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                _this.resetExpireKey(key, _this._defaultSeconds);
                return false;
            }
            // Otherwise, continue the original logic
            // Remove all listener
            _this.asObservable.off(onExpireEvtName, null);
            input.proceed();
            // fire event
            /** @type {?} */
            var afterRemoveEvtName = _this.afterRemoveEventName(key);
            _this.asObservable.fire(afterRemoveEvtName, {});
            return true;
        });
        // interval
        if (scheduleInterval) {
            if (ngZone) {
                ngZone.runOutsideAngular(function () {
                    _this._timeInterval = setInterval(function () {
                        _this._cache.cleanup();
                    }, scheduleInterval * 1000);
                });
            }
            else {
                this._timeInterval = setInterval(function () {
                    _this._cache.cleanup();
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
    SlidingExpirationCache.prototype.onExpireEventName = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return 'onExpire:' + key;
    };
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    SlidingExpirationCache.prototype.afterRemoveEventName = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return 'afterRemove:' + key;
    };
    /**
     * @private
     * @param {?} key
     * @param {?} seconds
     * @return {?}
     */
    SlidingExpirationCache.prototype.resetExpireKey = /**
     * @private
     * @param {?} key
     * @param {?} seconds
     * @return {?}
     */
    function (key, seconds) {
        /** @type {?} */
        var expirekey = this._cache.expirekey(key);
        /** @type {?} */
        var ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    };
    Object.defineProperty(SlidingExpirationCache.prototype, "asObservable", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var self = this;
            /** @type {?} */
            var observable = self;
            return observable;
        },
        enumerable: true,
        configurable: true
    });
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} seconds
     * @param {?=} afterRemoveCallback
     * @return {?}
     */
    SlidingExpirationCache.prototype.set = 
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} seconds
     * @param {?=} afterRemoveCallback
     * @return {?}
     */
    function (key, value, seconds, afterRemoveCallback) {
        /** @type {?} */
        var expirekey = this._cache.expirekey(key);
        /** @type {?} */
        var valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            /** @type {?} */
            var ms = seconds * 1000;
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
    };
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    /**
     * @param {?} key
     * @param {?=} seconds
     * @return {?}
     */
    SlidingExpirationCache.prototype.get = 
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    /**
     * @param {?} key
     * @param {?=} seconds
     * @return {?}
     */
    function (key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        /** @type {?} */
        var valueKey = this._cache.key(key);
        /** @type {?} */
        var value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    };
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    SlidingExpirationCache.prototype.rmOnExpireHandler = /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    function (key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    };
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    SlidingExpirationCache.prototype.addOnExpireHandler = /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    function (key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    };
    Object.defineProperty(SlidingExpirationCache.prototype, "count", {
        get: /**
         * @return {?}
         */
        function () {
            return this._cache.length();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SlidingExpirationCache.prototype.reset = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var keys = this._cache.keys();
        keys.forEach(function (k) {
            _this.asObservable.off(_this.onExpireEventName(k), null);
            originalRemove.call(_this._cache, k);
            _this.asObservable.fire(_this.afterRemoveEventName(k), {});
        });
    };
    // must destory, or leaking ...
    // must destory, or leaking ...
    /**
     * @return {?}
     */
    SlidingExpirationCache.prototype.destroy = 
    // must destory, or leaking ...
    /**
     * @return {?}
     */
    function () {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    };
    /**
     * @template T
     */
    SlidingExpirationCache = __decorate([
        observableDecorator,
        __metadata("design:paramtypes", [Number, Number, Object])
    ], SlidingExpirationCache);
    return SlidingExpirationCache;
}());

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
var DummyOAuthTokenCtorParams = {
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
var _$2 = underscore;
/**
 * @abstract
 */
var  /**
 * @abstract
 */
PolicyBase = /** @class */ (function () {
    function PolicyBase(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     * @return {?}
     */
    PolicyBase.prototype.getTokenP = /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!_$2.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }
        return this.getTokenInternal()
            .then(function (token) {
            return _this.token = token;
        });
    };
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     * @return {?}
     */
    PolicyBase.prototype.reset = /**
     * Reset the security policy, e.g.,
     * removing established token.
     * @return {?}
     */
    function () {
        this.token = '';
    };
    return PolicyBase;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var $$1 = jquery;
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
var OAuthTokenPolicy = /** @class */ (function (_super) {
    __extends(OAuthTokenPolicy, _super);
    function OAuthTokenPolicy(settings) {
        var _this = _super.call(this, settings) || this;
        _this.clientId = settings.clientId;
        _this.clientSecret = settings.clientSecret;
        _this.scope = settings.scope;
        _this.expiresIn = null;
        _this.createdOn = null;
        _this.refreshToken = '';
        return _this;
    }
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    OAuthTokenPolicy.prototype.readFrom = /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    function (settings) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    };
    /**
     * Returns the data that are persistentable.
     */
    /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.persistent = /**
     * Returns the data that are persistentable.
     * @return {?}
     */
    function () {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    };
    /**
     * @return {?}
     */
    OAuthTokenPolicy.prototype.getParams = /**
     * @return {?}
     */
    function () {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    };
    // TODO: Support progress loading
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    OAuthTokenPolicy.prototype.getTokenInternal = 
    // TODO: Support progress loading
    /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var params = this.getParams();
        return $$1.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then(function (resp) {
            _this.createdOn = new Date().getTime();
            _this.expiresIn = resp.expires_in;
            _this.refreshToken = resp.refreshToken || '';
            return (resp.access_token);
        });
    };
    /**
     * Returns if the token is expired or not.
     */
    /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.isExpired = /**
     * Returns if the token is expired or not.
     * @return {?}
     */
    function () {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        /** @type {?} */
        var expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        /** @type {?} */
        var now = new Date();
        /** @type {?} */
        var diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    };
    /**
     * Applys the token to the given options.
     */
    /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyTo = /**
     * Applys the token to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(_this.token)));
        };
    };
    /**
     * Apply security policy to the given options.
     */
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyToV2 = /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    };
    /**
     * App security policy the given options, used for our customized XHR.
     */
    /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
     */
    OAuthTokenPolicy.prototype.applyToV3 = /**
     * App security policy the given options, used for our customized XHR.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    };
    /**
     * Resets the token and its assoicated information.
     */
    /**
     * Resets the token and its assoicated information.
     * @return {?}
     */
    OAuthTokenPolicy.prototype.reset = /**
     * Resets the token and its assoicated information.
     * @return {?}
     */
    function () {
        _super.prototype.reset.call(this);
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    };
    return OAuthTokenPolicy;
}(PolicyBase));

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
    var r = adaptToOAuthToken(data$$1);
    return __assign({}, r, { openId: data$$1.openId || '' });
}
var OpenIDPolicy = /** @class */ (function (_super) {
    __extends(OpenIDPolicy, _super);
    function OpenIDPolicy() {
        var _this = _super.call(this, DummyOAuthTokenCtorParams) || this;
        _this._openId = '';
        return _this;
    }
    /**
     * Returns the necessary information for peristence.
     */
    /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    OpenIDPolicy.prototype.persistent = /**
     * Returns the necessary information for peristence.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var r = _super.prototype.persistent.call(this);
        return __assign({}, r, { openId: this._openId });
    };
    /**
     * Reads credential from the given settings.
     */
    /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    OpenIDPolicy.prototype.readFrom = /**
     * Reads credential from the given settings.
     * @template THIS
     * @this {THIS}
     * @param {?} settings
     * @return {THIS}
     */
    function (settings) {
        _super.prototype.readFrom.call(this, settings);
        (/** @type {?} */ (this))._openId = settings.openId;
        return (/** @type {?} */ (this));
    };
    return OpenIDPolicy;
}(OAuthTokenPolicy));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NullPolicy = /** @class */ (function () {
    function NullPolicy() {
    }
    /**
     * @return {?}
     */
    NullPolicy.prototype.getTokenInternal = /**
     * @return {?}
     */
    function () {
        throw new Error('NotImplemented');
    };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyTo = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.isExpired = /**
     * @return {?}
     */
    function () {
        return false;
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    NullPolicy.prototype.readFrom = /**
     * @param {?} settings
     * @return {?}
     */
    function (settings) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.persistent = /**
     * @return {?}
     */
    function () { };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyToV2 = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyToV3 = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.getTokenP = /**
     * @return {?}
     */
    function () {
        throw new Error('NotImplemented');
    };
    /**
     * @return {?}
     */
    NullPolicy.prototype.reset = /**
     * @return {?}
     */
    function () { };
    return NullPolicy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var _$4 = underscore;
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
        var k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    /** @type {?} */
    var checked = {};
    /** @type {?} */
    var objectB = (/** @type {?} */ (b));
    for (var k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
            checked[k] = true;
        }
    }
    /** @type {?} */
    var objectA = (/** @type {?} */ (a));
    for (var k in objectA) {
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
var UserCredential = /** @class */ (function () {
    /**
     * @constructor Credential
     */
    function UserCredential(authPolicy) {
        this.authPolicy = authPolicy;
        this._user = {};
        this._security = authPolicy;
    }
    Object.defineProperty(UserCredential.prototype, "asObservable", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var self = this;
            return (/** @type {?} */ (self));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?=} value
     * @return {?}
     */
    UserCredential.prototype.security = /**
     * @param {?=} value
     * @return {?}
     */
    function (value) {
        if (value) {
            this._security = value;
        }
        return this._security;
    };
    // Does not trigger any event
    // Does not trigger any event
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    UserCredential.prototype.readFrom = 
    // Does not trigger any event
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    function (data$$1) {
        this._user = _$4.extend(this._user, data$$1);
    };
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    UserCredential.prototype.setUser = /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    function (data$$1) {
        if (isEquiva(this._user, data$$1)) {
            return;
        }
        this._user = data$$1;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    };
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    UserCredential.prototype.extendUser = /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    function (data$$1) {
        /** @type {?} */
        var newData = _$4.extend({}, this._user, data$$1);
        this.setUser(newData);
    };
    /**
     * @template U
     * @return {?}
     */
    UserCredential.prototype.getUser = /**
     * @template U
     * @return {?}
     */
    function () {
        return _$4.extend({}, this._user);
    };
    /**
     * @template U
     * @param {?} handler
     * @param {?=} likeBehaviorSubject
     * @return {?}
     */
    UserCredential.prototype.subscribe = /**
     * @template U
     * @param {?} handler
     * @param {?=} likeBehaviorSubject
     * @return {?}
     */
    function (handler, likeBehaviorSubject) {
        if (likeBehaviorSubject === void 0) { likeBehaviorSubject = false; }
        this.asObservable.on('change:user', handler);
        if (likeBehaviorSubject) {
            /** @type {?} */
            var newEvt = { data: this._user };
            handler((/** @type {?} */ (newEvt)));
        }
    };
    /**
     * @param {?} handler
     * @return {?}
     */
    UserCredential.prototype.unSubscribe = /**
     * @param {?} handler
     * @return {?}
     */
    function (handler) {
        this.asObservable.off('change:user', handler);
    };
    /**
     * @return {?}
     */
    UserCredential.prototype.isUserKnown = /**
     * @return {?}
     */
    function () {
        return !!(this._user && this._user.username);
    };
    /**
     * @return {?}
     */
    UserCredential.prototype.isAuthenticated = /**
     * @return {?}
     */
    function () {
        return this.authPolicy && !this.authPolicy.isExpired();
    };
    // immutable
    /**
     * @template T
     */
    UserCredential = __decorate([
        observableDecorator,
        __metadata("design:paramtypes", [Object])
    ], UserCredential);
    return UserCredential;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var $$2 = jquery;
/** @type {?} */
var defaultAntiForgeryKey = '__RequestVerificationToken';
/** @type {?} */
var defaultElementTag = '';
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
        var doc;
        /** @type {?} */
        var token;
        /** @type {?} */
        var elm;
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
var AntiForgeryKeyPolicy = /** @class */ (function (_super) {
    __extends(AntiForgeryKeyPolicy, _super);
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    function AntiForgeryKeyPolicy(settings) {
        var _this = _super.call(this, settings) || this;
        _this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        _this._elementTag = settings.elementTag || defaultElementTag;
        _this._expired = true;
        return _this;
    }
    /**
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.isExpired = /**
     * @return {?}
     */
    function () {
        return this._expired;
    };
    /**
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.inputField = /**
     * @return {?}
     */
    function () {
        return 'input[name="' + this._antiForgeryKey + '"]';
    };
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.readFrom = /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @param {?} settings
     * @return {?}
     */
    function (settings) {
        this.token = settings.token;
    };
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    /**
     * Returns the object that are persistentable.
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.persistent = /**
     * Returns the object that are persistentable.
     * @return {?}
     */
    function () {
        return {
            token: this.token
        };
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
    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @throws {}
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.getTokenInternal = /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @throws {}
     * @return {?}
     */
    function () {
        /** @type {?} */
        var ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        /** @type {?} */
        var p = liftWithGuard(ret, function (token) {
            /** @type {?} */
            var isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    };
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @param {?} options
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.applyTo = /**
     * Applys the anti-forgery key and its value to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var data$$1 = options.data;
        data$$1[this._antiForgeryKey] = this.token;
    };
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.applyToV2 = /**
     * Apply security policy to the given options.
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    };
    // TODO:
    // TODO:
    /**
     * @param {?} options
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.applyToV3 = 
    // TODO:
    /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
    };
    /**
     * Resets the token and expired flag
     * @function reset
     */
    /**
     * Resets the token and expired flag
     * @return {?}
     */
    AntiForgeryKeyPolicy.prototype.reset = /**
     * Resets the token and expired flag
     * @return {?}
     */
    function () {
        _super.prototype.reset.call(this);
        this._expired = true;
    };
    return AntiForgeryKeyPolicy;
}(PolicyBase));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OAuthTokenExtPolicy = /** @class */ (function (_super) {
    __extends(OAuthTokenExtPolicy, _super);
    function OAuthTokenExtPolicy(settings, payload) {
        var _this = _super.call(this, settings) || this;
        _this._payload = __assign({}, payload);
        return _this;
    }
    Object.defineProperty(OAuthTokenExtPolicy.prototype, "payload", {
        get: /**
         * @return {?}
         */
        function () {
            return this._payload;
        },
        enumerable: true,
        configurable: true
    });
    // override
    // override
    /**
     * @return {?}
     */
    OAuthTokenExtPolicy.prototype.getParams = 
    // override
    /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var p = _super.prototype.getParams.call(this);
        return __assign({}, p, this._payload);
    };
    return OAuthTokenExtPolicy;
}(OAuthTokenPolicy));

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
            var payload = action.payload.filter(function (x) {
                // Look for it in the current list
                /** @type {?} */
                var index = state.items.findIndex(function (y) {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return __assign({}, state, { items: __spread(state.items, payload) });
        }
        case 'REMOVE': {
            /** @type {?} */
            var newItems = state.items.filter(function (x) {
                /** @type {?} */
                var index = action.payload.findIndex(function (y) {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return __assign({}, state, { items: newItems });
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
    var actionSubject = new ActionsSubject();
    /** @type {?} */
    var scannerActionSubject = new ScannedActionsSubject();
    /** @type {?} */
    var actionReducerFactory = combineReducers;
    /** @type {?} */
    var reducerManager = new ReducerManager(actionSubject, buildInitialState(), buildReducerMap(), actionReducerFactory);
    /** @type {?} */
    var stateObservable = new State(actionSubject, reducerManager, scannerActionSubject, buildInitialState());
    /** @type {?} */
    var store = new Store(stateObservable, actionSubject, reducerManager);
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
var  /**
 * @abstract
 * @template T
 */
CollectionAbstractStore = /** @class */ (function () {
    function CollectionAbstractStore() {
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.add = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    };
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.remove = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    };
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.modify = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    };
    return CollectionAbstractStore;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
var CollectionStore = /** @class */ (function (_super) {
    __extends(CollectionStore, _super);
    function CollectionStore() {
        var _this = _super.call(this) || this;
        _this._store = factory();
        return _this;
    }
    /**
     * @return {?}
     */
    CollectionStore.prototype.getStore = /**
     * @return {?}
     */
    function () {
        return this._store;
    };
    /**
     * @return {?}
     */
    CollectionStore.prototype.getState = /**
     * @return {?}
     */
    function () {
        return this._store.select('collection');
    };
    CollectionStore.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CollectionStore.ctorParameters = function () { return []; };
    return CollectionStore;
}(CollectionAbstractStore));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var when$1 = when;
/** @type {?} */
var _$5 = underscore;
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
var AggregateCollection = /** @class */ (function () {
    function AggregateCollection(_providerGenerator) {
        this._providerGenerator = _providerGenerator;
        this._workingProviders = [];
    }
    /**
     * @return {?}
     */
    AggregateCollection.prototype.hasNextPage = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    AggregateCollection.prototype.getFirstPage = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Generate providers
        return this._providerGenerator.getNext()
            .then(function (providers) {
            providers = _$5.filter(providers, function (p) {
                return hasNextPage(p);
            });
            return providers;
        })
            .then(function (providers) {
            _this._workingProviders.length = 0;
            /** @type {?} */
            var promises = _$5.map(providers, function (p) {
                var _this = this;
                return getNextPage(p)
                    .then(function (resp) {
                    _this._workingProviders.push(p);
                    return resp;
                });
            });
            return when$1.settle(promises);
        });
    };
    /**
     * @return {?}
     */
    AggregateCollection.prototype.getNextPage = /**
     * @return {?}
     */
    function () {
        return this.getFirstPage();
    };
    /**
     * @return {?}
     */
    AggregateCollection.prototype.reset = /**
     * @return {?}
     */
    function () {
        this._providerGenerator.reset();
        this._workingProviders = [];
    };
    /**
     * @param {?} func
     * @return {?}
     */
    AggregateCollection.prototype.forEach = /**
     * @param {?} func
     * @return {?}
     */
    function (func) {
        this._workingProviders.forEach(function (p) {
            p.forEach(func);
        });
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AggregateCollection.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        // TODO:
    };
    return AggregateCollection;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var backbone$3 = backbone;
/** @type {?} */
var meld$2 = meld;
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
    var remover1 = meld$2.before(backbone$3.Collection.prototype, 'trigger', callback);
    /** @type {?} */
    var remover2 = meld$2.before(backbone$3.Model.prototype, 'trigger', callback);
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
var DataFlow = dataflow;
/** @type {?} */
var backbone$4 = backbone;
/** @type {?} */
var _$6 = underscore;
/**
 * The endpoint types for a backend service.
 * @type {?}
 */
var endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};
/**
 * The sync types defined in the backbone js.
 * @type {?}
 */
var syncMethodEnum = {
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
        var dataflow$$1 = this._dataflow;
        /** @type {?} */
        var uniqueName = this._uniqueNamePrefix + name;
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
            for (var k in syncMethodEnum) {
                // skip loop if the property is from prototype
                if (syncMethodEnum.hasOwnProperty(k)) {
                    /** @type {?} */
                    var value = syncMethodEnum[k];
                    dataflow$$1[name + ':' + value] = 1;
                }
            }
        }
        else {
            dataflow$$1[name + ':' + syncMethodEnum.read] = 1;
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
        var dataflow$$1 = this._dataflow;
        dataflow$$1.when(name, callback);
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
        var dataflow$$1 = this._dataflow;
        dataflow$$1.on(src, function () {
            dataflow$$1[dst] = dataflow$$1[dst] + 1;
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
var globalLocalStorage = window.localStorage;
/** @type {?} */
var _$7 = underscore;
/** @type {?} */
var find = _$7.find;
/** @type {?} */
var findIndex = _$7.findIndex;
/** @type {?} */
var union = _$7.union;
/**
 * Reads the value of an entity by its key.
 * @param {?} key
 * @param {?} ty
 * @return {?}
 */
function getEntity(key, ty) {
    /** @type {?} */
    var data$$1 = defaultValue(ty);
    try {
        /** @type {?} */
        var tmp = globalLocalStorage.getItem(key);
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
function updateEntity(key, data$$1, ty) {
    if (ty === void 0) { ty = null; }
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
    var newData = [];
    /** @type {?} */
    var currentData = (/** @type {?} */ (getEntity(key, tyArray)));
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
    var data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
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
    var data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    var index = findIndex(data$$1, { Id: id });
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
    var data$$1 = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    var index = findIndex(data$$1, { Id: entity.Id });
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
    var keys = [];
    for (var p in globalLocalStorage) {
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
var LocalStorageTable = /** @class */ (function () {
    function LocalStorageTable() {
    }
    /**
     * Gets the value for the given key.
     * @function getP
     * @param {String} key The key to be searched for.
     * @returns {Promise}
     * @throws {Error}
     */
    /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    LocalStorageTable.prototype.getP = /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var data$$1 = getEntity(key, tyObject);
        return lift(data$$1, null);
    };
    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    LocalStorageTable.prototype.removeP = /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    function (key) {
        cleanEntity(key, tyObject);
        return lift(true, null);
    };
    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    LocalStorageTable.prototype.updateP = /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        updateEntity(key, value, tyObject);
        return lift(true, null);
    };
    return LocalStorageTable;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var I18n = /** @class */ (function () {
    function I18n() {
    }
    /**
     * @param {?} code
     * @return {?}
     */
    I18n.getDictByCode = /**
     * @param {?} code
     * @return {?}
     */
    function (code) {
        return data[code];
    };
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    I18n.add = /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    function (code, items) {
        add(code, items);
    };
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    I18n.translate = /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    function (text, defaultText) {
        /** @type {?} */
        var value = translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    };
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    I18n.recycleOthers = /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    function (code) {
        /** @type {?} */
        var data$$1 = data;
        /** @type {?} */
        var recycleList = [];
        for (var key in data$$1) {
            // skip loop if the property is from prototype
            if (data$$1.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (var i = 0; i < recycleList.length; i++) {
            /** @type {?} */
            var k = recycleList[i];
            delete data$$1[k];
        }
    };
    return I18n;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var _$8 = underscore;
/** @type {?} */
var isString = _$8.isString;
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