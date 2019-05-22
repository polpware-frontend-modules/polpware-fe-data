(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@polpware/fe-dependencies'), require('@polpware/fe-utilities'), require('@ngrx/store'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@polpware/fe-data', ['exports', '@polpware/fe-dependencies', '@polpware/fe-utilities', '@ngrx/store', '@angular/core'], factory) :
    (global = global || self, factory((global.polpware = global.polpware || {}, global.polpware['fe-data'] = {}), global.feDependencies, global.feUtilities, global.store, global.ng.core));
}(this, function (exports, feDependencies, feUtilities, store, core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileOverview
     * Defines a table in a relational database.
     * This table is observable, i.e., any change on this table will be notified to its listeners.
     */
    var backbone = feDependencies.backbone;
    var _ = feDependencies.underscore;
    var cjs = feDependencies.constraintjs;
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
                var ctor = backbone.Collection.extend(options.dataProviderCtorOption || {});
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
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RelationalTable.prototype, "cascade", {
            get: function () {
                return this._cascade;
            },
            enumerable: true,
            configurable: true
        });
        RelationalTable.prototype.dataProvider = function () {
            return this._dataProvider;
        };
        // TODO: Figure out ...
        RelationalTable.prototype.onDeleted = function () {
        };
        /**
         * Check if the given items are still in use.
         */
        RelationalTable.prototype.hasAnyReference = function (item) {
            // Check if this item is in this table or not
            var itemInTable = this._dataProvider.get(item.id);
            if (!itemInTable) {
                return false;
            }
            var revRelations = this._reverseForeignRelation;
            var hasFound = false;
            var _loop_1 = function (revK) {
                if (revRelations.hasOwnProperty(revK)) {
                    var revTables = revRelations[revK];
                    hasFound = _.some(revTables, function (fromTable) {
                        var fromTableDataProvider = fromTable.dataProvider();
                        var filter = {};
                        filter[revK] = item.id;
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
        RelationalTable.prototype.removeReverseForeign = function (removedItems) {
            var revRelation = this._reverseForeignRelation;
            var _loop_2 = function (revK) {
                if (revRelation.hasOwnProperty(revK)) {
                    var revTables = revRelation[revK];
                    revTables.forEach(function (reverseTable) {
                        var dataProvider = reverseTable.dataProvider();
                        var toBeRemoved = [];
                        removedItems.forEach(function (item) {
                            var filter = {};
                            filter[revK] = item.id;
                            var anyItems = dataProvider.where(filter);
                            feUtilities.pushArray(toBeRemoved, anyItems);
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
        RelationalTable.prototype.get = function (id) {
            return this._dataProvider.get(id);
        };
        RelationalTable.prototype.destroyFromTable = function (thatItem) {
            var removedItem = this._dataProvider.remove(thatItem);
            if (!removedItem) {
                return;
            }
            // Notify of its collection
            removedItem.set('invalidated', true);
            removedItem.trigger('destroy', removedItem);
            this.removeReverseForeign([removedItem]);
        };
        RelationalTable.prototype.getForeignModel = function (thatItem, foreignKey) {
            var value = thatItem.attributes[foreignKey];
            // If we do not have this foreignKey, then return a dummy one
            if (!value) {
                return this.dummyRecords.getDummyRecord(foreignKey);
            }
            var table = this._foreignRelation[foreignKey];
            return table.dataProvider().get(value);
        };
        /**
         * Adds an item in the Table and recursively add foreign items.
         */
        RelationalTable.prototype.add = function (model) {
            var selfContext = this;
            var dataProvider = this._dataProvider;
            var foreignRelation = this._foreignRelation;
            // Check if the item to be added is already in this table.
            var modelId = dataProvider.modelId(model);
            var addedItem = dataProvider.get(modelId);
            if (addedItem) {
                var newAttr = _.extend({}, addedItem.attributes, model);
                addedItem.set(newAttr);
                return addedItem;
            }
            // Otherwise a new item
            addedItem = dataProvider.add(model);
            // Add convenient methods
            addedItem.destroyFromTable = function () {
                var thatItem = this;
                selfContext.destroyFromTable(thatItem);
            };
            addedItem.getForeignModel = function (foreignKey) {
                var thatItem = this;
                return selfContext.getForeignModel(thatItem, foreignKey);
            };
            addedItem.hasAnyReference = function () {
                var thatItem = this;
                return selfContext.hasAnyReference(thatItem);
            };
            return addedItem;
        };
        /**
         * Add many items into a table.
         */
        RelationalTable.prototype.addMany = function (models) {
            var _this = this;
            return models.map(function (model) {
                return _this.add(model);
            });
        };
        /**
         * Adds a foreign relation.
         */
        RelationalTable.prototype.addForeignRelation = function (foreignKey, foreignTable) {
            if (this._foreignRelation[foreignKey]) {
                throw new Error('Foreign key exists: ' + foreignKey);
            }
            this._foreignRelation[foreignKey] = foreignTable;
        };
        /**
         * Add a reverse foreign relation.
         */
        RelationalTable.prototype.addReverseForeignRelation = function (reverseForeignKey, table) {
            var reverseTables = this._reverseForeignRelation[reverseForeignKey];
            if (reverseTables) {
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
        RelationalTable.prototype.hasForeignRelation = function (foreignKey) {
            return !!this._foreignRelation[foreignKey];
        };
        /**
         * Checks if a given reverse foreign relation is present.
         */
        RelationalTable.prototype.hasReverseForeignRelation = function (reverseForeignKey) {
            return !!this._reverseForeignRelation[reverseForeignKey];
        };
        /**
         * Destroys table
         */
        RelationalTable.prototype.destroy = function () {
            // Remove constraint
            this._deleteConstraint.offChange(this._onDeletedHandler);
            this._dataProvider.reset();
        };
        return RelationalTable;
    }());

    /**
     * @fileOverview
     * Defines a global dummy records for tables. Each table is configured with a dummy record.
     */
    var backbone$1 = feDependencies.backbone;
    var DummyRecords = /** @class */ (function () {
        function DummyRecords() {
            this._data = {};
        }
        DummyRecords.prototype.getDummyRecord = function (key) {
            if (!this._data[key]) {
                this._data[key] = new backbone$1.Model({});
            }
            return this._data[key];
        };
        return DummyRecords;
    }());

    /**
     * @fileOverview
     * Defines a relational database which supports foreign keys and primary keys.
     * Also this database support cascading deletion and addition.
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
        RelationDatabase.prototype.getReference = function () {
            this._referenceCounter++;
            return this;
        };
        /**
         * Defines a table in the database.
         * @function addTable
         * @param {Object} settings
         */
        RelationDatabase.prototype.addTable = function (options) {
            return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
        };
        /**
         * Retrieves a table by name.
         */
        RelationDatabase.prototype.getTable = function (name) {
            return this._tableCollection[name];
        };
        /**
         * Defines a foreign relation between two tables.
         */
        RelationDatabase.prototype.addForeignkey = function (name, foreignKey, foreignName) {
            // Constraints
            var table = this._tableCollection[name];
            if (!table) {
                throw new Error('Undefined table: ' + name);
            }
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
        RelationDatabase.prototype.destroy = function () {
            this._referenceCounter--;
            if (this._referenceCounter === 0) {
                for (var k in this._tableCollection) {
                    if (this._tableCollection.hasOwnProperty(k)) {
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
     * @fileOverview
     * Defines a class for performing XHR in an exception way and in a promise way
     */
    var XHR = feDependencies.XHR;
    var _$1 = feDependencies.underscore;
    var defaultOptions = {
        async: true,
        content_type: '',
        response_type: 'json',
        requestheaders: [],
        success_scope: null,
        error_scope: null,
        scope: null
    };
    function sendPromise(options) {
        var settings = _$1.extend({}, defaultOptions, options);
        var promise = new Promise(function (resolve, reject) {
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
                xhrSettings.data = feUtilities.urlEncode(xhrSettings.data);
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
    var tools = feDependencies.Tools;
    var $ = feDependencies.jquery;
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
        var deferred = $.ajax({
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
        var ajaxParams = tools.extend({ url: url }, options);
        return $.ajax(ajaxParams);
    }
    /**
     * Reads a the response from a given url and
     * parses it into a jquery object.
     * @function loadHtmlP
     * @param {String} url
     * @returns {Promise}
     */
    function loadHtmlP(url) {
        return $.ajax({
            url: url,
            dataType: 'html text'
        }).then(function (data) {
            /*global DOMParser */
            var doc = new DOMParser().parseFromString(data, 'text/html');
            return $(doc);
        });
    }

    var MemoryBackend = /** @class */ (function () {
        function MemoryBackend() {
            this._store = {};
        }
        /**
         * Sets a key-value pair
         */
        MemoryBackend.prototype.set = function (key, value) {
            this._store[key] = value;
            return value;
        };
        /**
         * Gets the value for a given key.
         */
        MemoryBackend.prototype.get = function (key) {
            return this._store[key] || null;
        };
        /**
         * Removes the given key and its corresponding value.
         */
        MemoryBackend.prototype.remove = function (key) {
            delete this._store[key];
        };
        /**
         * Returns the number of stored items.
         */
        MemoryBackend.prototype.length = function (key) {
            return Object.keys(this._store).length;
        };
        /**
         * Retuns the ith key in the store table.
         */
        MemoryBackend.prototype.key = function (index) {
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
        MemoryBackend.prototype.enabled = function () {
            return true;
        };
        return MemoryBackend;
    }());

    //
    var EventDispatcher = feDependencies.EventDispatcher;
    var getEventDispatcher = function (obj) {
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
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.fire = function (name, evt, bubble) {
                var self = this;
                // Prevent all events except the remove event after the instance has been removed
                if (self.removed && name !== 'remove') {
                    return null;
                }
                var newEvt = getEventDispatcher(self).fire(name, evt, bubble);
                // Bubble event up to parents
                if (bubble !== false && self.parent) {
                    var parent_1 = self.parent();
                    while (parent_1 && !newEvt.isPropagationStopped()) {
                        parent_1.fire(name, newEvt, false);
                        parent_1 = parent_1.parent();
                    }
                }
                return newEvt;
            };
            class_1.prototype.on = function (name, callback, prepend) {
                return getEventDispatcher(this).on(name, callback, prepend);
            };
            class_1.prototype.off = function (name, callback) {
                return getEventDispatcher(this).off(name, callback);
            };
            class_1.prototype.once = function (name, callback) {
                return getEventDispatcher(this).once(name, callback);
            };
            class_1.prototype.hasEventListeners = function (name) {
                return getEventDispatcher(this).has(name);
            };
            return class_1;
        }(constructor));
    }

    //
    var locache = feDependencies.locache;
    var meld = feDependencies.meld;
    var originalRemove = Object.getPrototypeOf(locache.locache).remove;
    var currentTime = function () {
        return new Date().getTime();
    };
    var ɵ0 = currentTime;
    var SlidingExpirationCache = /** @class */ (function () {
        function SlidingExpirationCache(_defaultSeconds, scheduleInterval, ngZone) {
            var _this = this;
            this._defaultSeconds = _defaultSeconds;
            var backend = new MemoryBackend();
            this._cache = locache.locache.createCache({ storage: backend });
            this._cache.remove = meld.around(originalRemove, function (input) {
                var key = input.args[0];
                var onExpireEvtName = _this.onExpireEventName(key);
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
        SlidingExpirationCache.prototype.onExpireEventName = function (key) {
            return 'onExpire:' + key;
        };
        SlidingExpirationCache.prototype.afterRemoveEventName = function (key) {
            return 'afterRemove:' + key;
        };
        SlidingExpirationCache.prototype.resetExpireKey = function (key, seconds) {
            var expirekey = this._cache.expirekey(key);
            var ms = seconds * 1000;
            this._cache.storage.set(expirekey, currentTime() + ms);
        };
        Object.defineProperty(SlidingExpirationCache.prototype, "asObservable", {
            get: function () {
                var self = this;
                var observable = self;
                return observable;
            },
            enumerable: true,
            configurable: true
        });
        // Given a key, a value and an optional number of seconds store the value
        // in the storage backend.
        SlidingExpirationCache.prototype.set = function (key, value, seconds, afterRemoveCallback) {
            var expirekey = this._cache.expirekey(key);
            var valueKey = this._cache.key(key);
            if (seconds) {
                // The time stored is in milliseconds, but this function expects
                // seconds, so multiply by 1000.
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
        SlidingExpirationCache.prototype.get = function (key, seconds) {
            // If the value has expired, before returning null remove the key
            // from the storage backend to free up the space.
            if (this._cache.hasExpired(key)) {
                if (this._cache.remove(key)) {
                    return null;
                }
            }
            var valueKey = this._cache.key(key);
            var value = this._cache.storage.get(valueKey);
            // Slide the expire ke
            if (value) {
                this.resetExpireKey(key, seconds || this._defaultSeconds);
            }
            // If value isn't truthy, it must be an empty string or similar, so
            // just return that.
            return value;
        };
        SlidingExpirationCache.prototype.rmOnExpireHandler = function (key, callback) {
            this.asObservable.off(this.onExpireEventName(key), callback);
        };
        SlidingExpirationCache.prototype.addOnExpireHandler = function (key, callback) {
            this.asObservable.on(this.onExpireEventName(key), callback);
        };
        Object.defineProperty(SlidingExpirationCache.prototype, "count", {
            get: function () {
                return this._cache.length();
            },
            enumerable: true,
            configurable: true
        });
        SlidingExpirationCache.prototype.reset = function () {
            var _this = this;
            var keys = this._cache.keys();
            keys.forEach(function (k) {
                _this.asObservable.off(_this.onExpireEventName(k), null);
                originalRemove.call(_this._cache, k);
                _this.asObservable.fire(_this.afterRemoveEventName(k), {});
            });
        };
        // must destory, or leaking ...
        SlidingExpirationCache.prototype.destroy = function () {
            this.reset();
            if (this._timeInterval) {
                clearInterval(this._timeInterval);
            }
        };
        SlidingExpirationCache = __decorate([
            observableDecorator,
            __metadata("design:paramtypes", [Number, Number, Object])
        ], SlidingExpirationCache);
        return SlidingExpirationCache;
    }());

    var DummyOAuthTokenCtorParams = {
        url: 'dummy',
        clientId: 'dummy',
        clientSecret: 'dummy',
        scope: 'all'
    };

    /**
     * @fileOverview
     * A base class for defining security plicies.
     */
    var _$2 = feDependencies.underscore;
    var PolicyBase = /** @class */ (function () {
        function PolicyBase(settings) {
            this.url = settings.url;
            this.token = '';
        }
        /**
         * The interface for retrieving the token from a remote server.
         * This method internally dispatches the call to another method
         * and cache the token.
         */
        PolicyBase.prototype.getTokenP = function () {
            var _this = this;
            if (!_$2.isEmpty(this.token) && !this.isExpired()) {
                return feUtilities.lift(this.token, null);
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
        PolicyBase.prototype.reset = function () {
            this.token = '';
        };
        return PolicyBase;
    }());

    /**
     * @fileOverview
     * Defines a base class for retrieving OAuth2 tokens.
     */
    var $$1 = feDependencies.jquery;
    function adaptToOAuthToken(data) {
        data = data || {};
        data.expiresIn = data.expiresIn || 0;
        data.createdOn = data.createdOn || 0;
        data.token = data.token || '';
        data.refreshToken = data.refreshToken || '';
        return data;
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
            _this.response = null;
            return _this;
        }
        /**
         * Feeds the policy with some settings from outside,
         * usually from local storage
         */
        OAuthTokenPolicy.prototype.readFrom = function (settings) {
            this.expiresIn = settings.expiresIn;
            this.createdOn = settings.createdOn;
            this.token = settings.token;
            this.refreshToken = settings.refreshToken;
        };
        /**
         * Returns the data that are persistentable.
         */
        OAuthTokenPolicy.prototype.persistent = function () {
            return {
                expiresIn: this.expiresIn,
                createdOn: this.createdOn,
                token: this.token,
                refreshToken: this.refreshToken
            };
        };
        OAuthTokenPolicy.prototype.getParams = function () {
            return {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: this.scope,
                grant_type: this.grantType
            };
        };
        // TODO: Support progress loading
        OAuthTokenPolicy.prototype.getTokenInternal = function () {
            var _this = this;
            var params = this.getParams();
            return $$1.ajax({
                url: this.url,
                data: params,
                method: 'POST'
            }).then(function (resp) {
                // Put down the response
                _this.response = resp;
                _this.createdOn = new Date().getTime();
                _this.expiresIn = resp.expires_in;
                _this.refreshToken = resp.refreshToken || '';
                resp.scope && (_this.scope = resp.scope);
                return (resp.access_token);
            });
        };
        /**
         * Returns if the token is expired or not.
         */
        OAuthTokenPolicy.prototype.isExpired = function () {
            if (!this.token || this.token.length < 1) {
                return true;
            }
            if (!this.createdOn) {
                return true;
            }
            var expiresIn = feUtilities.safeParseInt(this.expiresIn);
            if (expiresIn <= 0) {
                return true;
            }
            var now = new Date();
            var diff = now.getTime() - this.createdOn;
            if (diff < expiresIn * 1000) {
                return false;
            }
            return true;
        };
        /**
         * Applys the token to the given options.
         */
        OAuthTokenPolicy.prototype.applyTo = function (options) {
            var _this = this;
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader('Authorization', ('Bearer '.concat(_this.token)));
            };
        };
        /**
         * Apply security policy to the given options.
         */
        OAuthTokenPolicy.prototype.applyToV2 = function (options) {
            options.headers = options.headers || {};
            options.headers = {
                Authorization: 'Bearer '.concat(this.token)
            };
        };
        /**
         * App security policy the given options, used for our customized XHR.
         */
        OAuthTokenPolicy.prototype.applyToV3 = function (options) {
            options.requestheaders = options.requestheaders || [];
            options.requestheaders.push({
                key: 'Authorization',
                value: 'Bearer '.concat(this.token)
            });
        };
        /**
         * Resets the token and its assoicated information.
         */
        OAuthTokenPolicy.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.refreshToken = '';
            this.expiresIn = null;
            this.createdOn = null;
        };
        return OAuthTokenPolicy;
    }(PolicyBase));

    /**
     * @fileOverview
     * OpenID token policy, built upon OAuth2 token policy
     */
    function adaptToOpenIDToken(data) {
        data = data || {};
        var r = adaptToOAuthToken(data);
        return __assign({}, r, { openId: data.openId || '' });
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
        OpenIDPolicy.prototype.persistent = function () {
            var r = _super.prototype.persistent.call(this);
            return __assign({}, r, { openId: this._openId });
        };
        /**
         * Reads credential from the given settings.
         */
        OpenIDPolicy.prototype.readFrom = function (settings) {
            _super.prototype.readFrom.call(this, settings);
            this._openId = settings.openId;
            return this;
        };
        return OpenIDPolicy;
    }(OAuthTokenPolicy));

    var NullPolicy = /** @class */ (function () {
        function NullPolicy() {
        }
        NullPolicy.prototype.getTokenInternal = function () {
            throw new Error('NotImplemented');
        };
        NullPolicy.prototype.applyTo = function (options) { };
        NullPolicy.prototype.isExpired = function () {
            return false;
        };
        NullPolicy.prototype.readFrom = function (settings) { };
        NullPolicy.prototype.persistent = function () { };
        NullPolicy.prototype.applyToV2 = function (options) { };
        NullPolicy.prototype.applyToV3 = function (options) { };
        NullPolicy.prototype.getTokenP = function () {
            throw new Error('NotImplemented');
        };
        NullPolicy.prototype.reset = function () { };
        return NullPolicy;
    }());

    var _$3 = feDependencies.underscore;
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
        if (feUtilities.isArray(b) && feUtilities.isArray(a)) {
            if (a.length !== b.length) {
                return false;
            }
            var k = a.length;
            while (k--) {
                if (!isEquiva(a[k], b[k])) {
                    return false;
                }
            }
        }
        var checked = {};
        var objectB = b;
        for (var k in objectB) {
            if (objectB.hasOwnProperty(k)) {
                if (!isEquiva(a[k], b[k])) {
                    return false;
                }
                checked[k] = true;
            }
        }
        var objectA = a;
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
            get: function () {
                var self = this;
                return self;
            },
            enumerable: true,
            configurable: true
        });
        UserCredential.prototype.security = function (value) {
            if (value) {
                this._security = value;
            }
            return this._security;
        };
        // Does not trigger any event
        UserCredential.prototype.readFrom = function (data) {
            this._user = _$3.extend(this._user, data);
        };
        UserCredential.prototype.setUser = function (data) {
            if (isEquiva(this._user, data)) {
                return;
            }
            this._user = data;
            this.asObservable.fire('change:user', {
                data: this._user
            });
        };
        UserCredential.prototype.extendUser = function (data) {
            var newData = _$3.extend({}, this._user, data);
            this.setUser(newData);
        };
        UserCredential.prototype.getUser = function () {
            return _$3.extend({}, this._user);
        };
        UserCredential.prototype.subscribe = function (handler, likeBehaviorSubject) {
            if (likeBehaviorSubject === void 0) { likeBehaviorSubject = false; }
            this.asObservable.on('change:user', handler);
            if (likeBehaviorSubject) {
                var newEvt = { data: this._user };
                handler(newEvt);
            }
        };
        UserCredential.prototype.unSubscribe = function (handler) {
            this.asObservable.off('change:user', handler);
        };
        UserCredential.prototype.isUserKnown = function () {
            return !!(this._user && this._user.username);
        };
        UserCredential.prototype.isAuthenticated = function () {
            return this.authPolicy && !this.authPolicy.isExpired();
        };
        UserCredential = __decorate([
            observableDecorator,
            __metadata("design:paramtypes", [Object])
        ], UserCredential);
        return UserCredential;
    }());

    var $$2 = feDependencies.jquery;
    var defaultAntiForgeryKey = '__RequestVerificationToken';
    var defaultElementTag = '';
    /*
     <input name="__RequestVerificationToken" type="hidden"
     value="J8kl6w7KaBAteKOPeHW1IlG9RS7abCkbvQf2GwBlMVZZOX9FF-Bhc5mYmqXw4qe0MLraucQtKC-TAVh1rJEZ0SDfeLfqp-L5JrthIM9V0gp76-jnVz9J-rdYFhVeTT4Y0">
     */
    function getTokenInternal(url, elementTag, inputField) {
        return $$2.ajax({
            url: url,
            dataType: 'html text'
        }).then(function (data) {
            /*global DOMParser */
            var doc, token, elm;
            token = '';
            doc = new DOMParser().parseFromString(data, 'text/html');
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
        AntiForgeryKeyPolicy.prototype.isExpired = function () {
            return this._expired;
        };
        AntiForgeryKeyPolicy.prototype.inputField = function () {
            return 'input[name="' + this._antiForgeryKey + '"]';
        };
        /**
         * Feeds the policy with some settings from outside,
         * usually from local storage
         * @function readFrom
         * @param {Object} settings
         * @returns {Object}
         */
        AntiForgeryKeyPolicy.prototype.readFrom = function (settings) {
            this.token = settings.token;
        };
        /**
         * Returns the object that are persistentable.
         * @function persistent
         * @returns {Object}
         */
        AntiForgeryKeyPolicy.prototype.persistent = function () {
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
        AntiForgeryKeyPolicy.prototype.getTokenInternal = function () {
            var ret = getTokenInternal(this.url, this._elementTag, this.inputField());
            var p = feUtilities.liftWithGuard(ret, function (token) {
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
        AntiForgeryKeyPolicy.prototype.applyTo = function (options) {
            var data = options.data;
            data[this._antiForgeryKey] = this.token;
        };
        /**
         * Apply security policy to the given options.
         * @function applyToV2
         * @param {Object} options A params field is expected.
         */
        AntiForgeryKeyPolicy.prototype.applyToV2 = function (options) {
            options.params = options.params || {};
            options.params[this._antiForgeryKey] = this.token;
        };
        // TODO:
        AntiForgeryKeyPolicy.prototype.applyToV3 = function (options) {
        };
        /**
         * Resets the token and expired flag
         * @function reset
         */
        AntiForgeryKeyPolicy.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._expired = true;
        };
        return AntiForgeryKeyPolicy;
    }(PolicyBase));

    var OAuthTokenExtPolicy = /** @class */ (function (_super) {
        __extends(OAuthTokenExtPolicy, _super);
        function OAuthTokenExtPolicy(settings, payload) {
            var _this = _super.call(this, settings) || this;
            _this._payload = __assign({}, payload);
            return _this;
        }
        Object.defineProperty(OAuthTokenExtPolicy.prototype, "payload", {
            get: function () {
                return this._payload;
            },
            enumerable: true,
            configurable: true
        });
        // override
        OAuthTokenExtPolicy.prototype.getParams = function () {
            var p = _super.prototype.getParams.call(this);
            return __assign({}, p, this._payload);
        };
        return OAuthTokenExtPolicy;
    }(OAuthTokenPolicy));

    function reducer(state, action) {
        switch (action.type) {
            case 'ADD': {
                var payload = action.payload.filter(function (x) {
                    // Look for it in the current list
                    var index = state.items.findIndex(function (y) {
                        return x.id === y.id;
                    });
                    return index === -1;
                });
                return __assign({}, state, { items: __spread(state.items, payload) });
            }
            case 'REMOVE': {
                var newItems = state.items.filter(function (x) {
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
        var actionSubject = new store.ActionsSubject();
        var scannerActionSubject = new store.ScannedActionsSubject();
        var actionReducerFactory = store.combineReducers;
        var reducerManager = new store.ReducerManager(actionSubject, buildInitialState(), buildReducerMap(), actionReducerFactory);
        var stateObservable = new store.State(actionSubject, reducerManager, scannerActionSubject, buildInitialState());
        var store$1 = new store.Store(stateObservable, actionSubject, reducerManager);
        return store$1;
    }

    var CollectionAbstractStore = /** @class */ (function () {
        function CollectionAbstractStore() {
        }
        CollectionAbstractStore.prototype.add = function (payload) {
            this.getStore().dispatch({
                type: 'ADD',
                payload: payload
            });
        };
        CollectionAbstractStore.prototype.remove = function (payload) {
            this.getStore().dispatch({
                type: 'REMOVE',
                payload: payload
            });
        };
        CollectionAbstractStore.prototype.modify = function (payload) {
            this.getStore().dispatch({
                type: 'MODIFY',
                payload: payload
            });
        };
        return CollectionAbstractStore;
    }());

    var CollectionStore = /** @class */ (function (_super) {
        __extends(CollectionStore, _super);
        function CollectionStore() {
            var _this = _super.call(this) || this;
            _this._store = factory();
            return _this;
        }
        CollectionStore.prototype.getStore = function () {
            return this._store;
        };
        CollectionStore.prototype.getState = function () {
            return this._store.select('collection');
        };
        CollectionStore = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [])
        ], CollectionStore);
        return CollectionStore;
    }(CollectionAbstractStore));

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
    var when = feDependencies.when;
    var _$4 = feDependencies.underscore;
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
    var AggregateCollection = /** @class */ (function () {
        function AggregateCollection(_providerGenerator) {
            this._providerGenerator = _providerGenerator;
            this._workingProviders = [];
        }
        AggregateCollection.prototype.hasNextPage = function () {
            // Case 1: The first time we request, we always have something.
            if (this._workingProviders.length === 0) {
                return true;
            }
            if (this._providerGenerator.hasMore()) {
                return true;
            }
            return _$4.some(this._workingProviders, function (elem) {
                return elem.hasNextPage();
            });
        };
        AggregateCollection.prototype.getFirstPage = function () {
            var _this = this;
            // Generate providers
            return this._providerGenerator.getNext()
                .then(function (providers) {
                providers = _$4.filter(providers, function (p) {
                    return hasNextPage(p);
                });
                return providers;
            })
                .then(function (providers) {
                _this._workingProviders.length = 0;
                var promises = _$4.map(providers, function (p) {
                    var _this = this;
                    return getNextPage(p)
                        .then(function (resp) {
                        _this._workingProviders.push(p);
                        return resp;
                    });
                });
                return when.settle(promises);
            });
        };
        AggregateCollection.prototype.getNextPage = function () {
            return this.getFirstPage();
        };
        AggregateCollection.prototype.reset = function () {
            this._providerGenerator.reset();
            this._workingProviders = [];
        };
        AggregateCollection.prototype.forEach = function (func) {
            this._workingProviders.forEach(function (p) {
                p.forEach(func);
            });
        };
        AggregateCollection.prototype.get = function (id) {
            // TODO:
        };
        return AggregateCollection;
    }());

    /**
     * @fileOverview
     * A decorator to Backbone. It tracks all sync events of the Backbone
     * in a nonintrusive manner.
     */
    var backbone$2 = feDependencies.backbone;
    var meld$1 = feDependencies.meld;
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
        var remover1 = meld$1.before(backbone$2.Collection.prototype, 'trigger', callback);
        var remover2 = meld$1.before(backbone$2.Model.prototype, 'trigger', callback);
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
        return meld$1.before(backbone$2, 'sync', callback);
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
        return meld$1.around(backbone$2, 'sync', callback);
    }
    /**
     * Sets up a pre-ajax callback.
     * @function mountAjaxBeforeAdvice
     * @param {Function} callback
     */
    function mountAjaxBeforeAdvice(callback) {
        return meld$1.before(backbone$2, 'ajax', callback);
    }

    /**
     * @fileOverview
     * Provides a layer of backend service abstraction.
     * Defines the backend services. This class is built onto the backbone js, but with
     * enhanced abilities of managing the dependency among all services of the backend,
     * and caching some type of objects for a period of time.
     */
    var DataFlow = feDependencies.dataflow;
    var backbone$3 = feDependencies.backbone;
    var _$5 = feDependencies.underscore;
    /**
     * The endpoint types for a backend service.
     */
    var endPointEnum = {
        model: 1,
        collection: 2,
        pagedCollection: 3
    };
    /**
     * The sync types defined in the backbone js.
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
                        _$5.extend(options.data, extraParams);
                    }
                    if (policyDelegate) {
                        policyDelegate(options);
                    }
                    options.data = feUtilities.urlEncode(options.data);
                    options.contentType = cfgOptions.contentType;
                }
                else {
                    if (extraParams) {
                        _$5.extend(options.data, extraParams);
                    }
                    if (policyDelegate) {
                        policyDelegate(options);
                    }
                    if (options.contentType === 'application/x-www-form-urlencoded') {
                        options.data = feUtilities.urlEncode(options.data);
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
                options: _$5.extend(options, { endPointKey: uniqueName }),
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
                value = backbone$3.Model.extend(cfg.options);
            }
            else if (cfg.tag === endPointEnum.collection) {
                value = backbone$3.Collection.extend(cfg.options);
            }
            else if (cfg.tag === endPointEnum.pagedCollection) {
                value = backbone$3.PageableCollection.extend(cfg.options);
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
    var globalLocalStorage = window.localStorage;
    var _$6 = feDependencies.underscore, find = _$6.find, findIndex = _$6.findIndex, union = _$6.union;
    /**
     * Reads the value of an entity by its key.
     * @function getEntity
     * @param {String} key The entity key.
     * @param {*} ty The type of the entity value.
     * @returns {*} The entity value.
     */
    function getEntity(key, ty) {
        var data = feUtilities.defaultValue(ty);
        try {
            var tmp = globalLocalStorage.getItem(key);
            if (tmp && tmp !== 'undefined') {
                tmp = JSON.parse(tmp);
                if (feUtilities.ok(tmp, ty)) {
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
    function updateEntity(key, data, ty) {
        if (ty === void 0) { ty = null; }
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
            globalLocalStorage.setItem(key, JSON.stringify(feUtilities.defaultValue(ty)));
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
        var newData = [];
        var currentData = getEntity(key, feUtilities.tyArray);
        if (upperBound > 0 && currentData.length > upperBound) {
            newData = data;
        }
        else {
            newData = union(currentData, data);
        }
        updateEntity(key, newData, feUtilities.tyArray);
    }
    /**
     * Finds one element of an entity of type array.
     * @function findEntityById
     * @param {String} key The entity key.
     * @param {Number} id The identifier value. An Id field is assumed for each element.
     * @returns {*} The value of the found element.
     */
    function findEntityById(key, id) {
        var data = getEntity(key, feUtilities.tyArray);
        return find(data, { Id: id });
    }
    /**
     * Removes an element of an entity of type array.
     * @function removeEntityById
     * @param {String} key The entity key.
     * @param {Number} id The identifier value for the element to be removed.
     */
    function removeEntityById(key, id) {
        var data = getEntity(key, feUtilities.tyArray);
        var index = findIndex(data, { Id: id });
        if (index === -1) {
            return;
        }
        data.splice(index, 1);
        updateEntity(key, data, feUtilities.tyArray);
    }
    /**
     * Inserts or udpates an element of an entity of type array.
     * @function insertOrUpdateEntity
     * @param {String} key The entity key.
     * @param {Array} entity The new value of the entity.
     */
    function insertOrUpdateEntity(key, entity) {
        var data = getEntity(key, feUtilities.tyArray);
        var index = findIndex(data, { Id: entity.Id });
        if (index !== -1) {
            data[index] = entity;
        }
        else {
            data.push(entity);
        }
        updateEntity(key, data, feUtilities.tyArray);
    }
    /**
     * Removes a group of entities by a given prefix.
     * @function cleanEntityGroup
     * @param {String} prefix The prefix of the keys of the entities to be removed. We organize entities somewhat hirarchly.
     * @returns {Boolean}
     */
    function cleanEntityGroup(prefix) {
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
        LocalStorageTable.prototype.getP = function (key) {
            var data = getEntity(key, feUtilities.tyObject);
            return feUtilities.lift(data, null);
        };
        /**
         * Removes the key from the keychain.
         * @function removeP
         * @param {String} key The key to be removed.
         * @returns {Promise}
         * @throws {Error}
         */
        LocalStorageTable.prototype.removeP = function (key) {
            cleanEntity(key, feUtilities.tyObject);
            return feUtilities.lift(true, null);
        };
        /**
         * Updates the value for the given key.
         * @param {String} key The key to be searched for.
         * @param {Object} value The new value.
         * @returns {Promise}
         * @throws {Error}
         */
        LocalStorageTable.prototype.updateP = function (key, value) {
            updateEntity(key, value, feUtilities.tyObject);
            return feUtilities.lift(true, null);
        };
        return LocalStorageTable;
    }());

    /**
     * @fileOverview
     * Provides i18n service. This module is designed as
     * a delegate of the tinymce I18n service.
     * @author Xiaolong Tang <xxlongtang@gmail.com>
     * @license Copyright @me
     */
    var _i18n = feDependencies.I18n;
    var I18n = /** @class */ (function () {
        function I18n() {
        }
        I18n.getDictByCode = function (code) {
            return _i18n.data[code];
        };
        /**
         * Add a languge dictionary and set the current
         * code as the current language.
         */
        I18n.add = function (code, items) {
            _i18n.add(code, items);
        };
        /**
         * Trnsaltes a given text. If the given text
         * is missing in the dictionary, use the given default value.
         * @function translate
         * @param {String} text A text to be translated.
         * @param {String} defaultText The default value.
         * @returns {String} The translation for the given text.
         */
        I18n.translate = function (text, defaultText) {
            var value = _i18n.translate(text);
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
        I18n.recycleOthers = function (code) {
            var data = _i18n.data;
            var recycleList = [];
            for (var key in data) {
                // skip loop if the property is from prototype
                if (data.hasOwnProperty(key) && key !== code) {
                    recycleList.push(key);
                }
            }
            /*jslint plusplus: true */
            for (var i = 0; i < recycleList.length; i++) {
                var k = recycleList[i];
                delete data[k];
            }
        };
        return I18n;
    }());

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
    var _$7 = feDependencies.underscore;
    var isString = _$7.isString;
    /**
     * Retrieves a value from a variable by a given namespace nested structure.
     * @function getByNamespace
     * @param {Object} repo
     * @param {*} fullyQualifiedNamespace A string or an arry of string defining the namespace.
     * @param {Number}[] startLevel
     * @returns {*}
     */
    function getByNamespace(repo, identifiers, startLevel) {
        if (startLevel === void 0) { startLevel = 1; }
        var restIdentifiers = identifiers.slice(startLevel);
        var restKey = restIdentifiers.join('.');
        if (repo[restKey]) {
            return repo[restKey];
        }
        var initRepo = repo;
        for (var index = startLevel; index < identifiers.length; index++) {
            if (!initRepo) {
                break;
            }
            var key = identifiers[index];
            initRepo = initRepo[key];
        }
        return initRepo;
    }
    /**
     * @class Resources
     */
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
        ResourceLoader.prototype.register = function (key, uri, liveSeconds) {
            if (liveSeconds === void 0) { liveSeconds = 60; }
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
        ResourceLoader.prototype.undoRegister = function (key) {
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
        ResourceLoader.prototype.getPromise = function (fullyQualifiedNamespace, convertor) {
            var identifiers = fullyQualifiedNamespace.split('.');
            var topIdentifier = identifiers[0];
            var cache = this._cache;
            if (cache) {
                // Figure out the master key
                var repo = cache.get(topIdentifier, 60);
                if (repo) {
                    var value = getByNamespace(repo, identifiers);
                    if (value) {
                        // Return a promise
                        return feUtilities.lift(value, null);
                    }
                }
            }
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

    exports.AggregateCollection = AggregateCollection;
    exports.AntiForgeryKeyPolicy = AntiForgeryKeyPolicy;
    exports.CollectionAbstractStore = CollectionAbstractStore;
    exports.CollectionStore = CollectionStore;
    exports.DummyOAuthTokenCtorParams = DummyOAuthTokenCtorParams;
    exports.DummyRecords = DummyRecords;
    exports.GlobalProvider = GlobalProvider;
    exports.I18n = I18n;
    exports.LocalStorageTable = LocalStorageTable;
    exports.MemoryBackend = MemoryBackend;
    exports.NullPolicy = NullPolicy;
    exports.OAuthTokenExtPolicy = OAuthTokenExtPolicy;
    exports.OAuthTokenPolicy = OAuthTokenPolicy;
    exports.OpenIDPolicy = OpenIDPolicy;
    exports.PolicyBase = PolicyBase;
    exports.RelationDatabase = RelationDatabase;
    exports.RelationalTable = RelationalTable;
    exports.ResourceLoader = ResourceLoader;
    exports.SlidingExpirationCache = SlidingExpirationCache;
    exports.UserCredential = UserCredential;
    exports.adaptToOAuthToken = adaptToOAuthToken;
    exports.adaptToOpenIDToken = adaptToOpenIDToken;
    exports.buildInitialState = buildInitialState;
    exports.buildReducerMap = buildReducerMap;
    exports.cleanEntity = cleanEntity;
    exports.cleanEntityGroup = cleanEntityGroup;
    exports.endPointEnum = endPointEnum;
    exports.factory = factory;
    exports.findEntityById = findEntityById;
    exports.getEntity = getEntity;
    exports.insertEntities = insertEntities;
    exports.insertOrUpdateEntity = insertOrUpdateEntity;
    exports.loadHtmlP = loadHtmlP;
    exports.loadJsonUriP = loadJsonUriP;
    exports.mountAjaxBeforeAdvice = mountAjaxBeforeAdvice;
    exports.mountSyncAroundAdvice = mountSyncAroundAdvice;
    exports.mountSyncBeforeAdvice = mountSyncBeforeAdvice;
    exports.mountSyncListener = mountSyncListener;
    exports.observableDecorator = observableDecorator;
    exports.pingP = pingP;
    exports.reducer = reducer;
    exports.removeEntityById = removeEntityById;
    exports.sendPromise = sendPromise;
    exports.syncMethodEnum = syncMethodEnum;
    exports.updateEntity = updateEntity;
    exports.ɵ0 = ɵ0;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polpware-fe-data.umd.js.map
