/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { pushArray } from '@polpware/fe-utilities';
/** @type {?} */
var backbone = dependencies.backbone;
/** @type {?} */
var _ = dependencies.underscore;
/** @type {?} */
var cjs = dependencies.constraintjs;
/**
 * @record
 */
export function IRelationalTableOptions() { }
if (false) {
    /** @type {?} */
    IRelationalTableOptions.prototype.name;
    /** @type {?|undefined} */
    IRelationalTableOptions.prototype.cascade;
    /** @type {?|undefined} */
    IRelationalTableOptions.prototype.dataProviderCtor;
    /** @type {?|undefined} */
    IRelationalTableOptions.prototype.dataProviderCtorOption;
}
/**
 * @record
 */
export function IRelationalTable() { }
if (false) {
    /** @type {?} */
    IRelationalTable.prototype.name;
    /** @type {?} */
    IRelationalTable.prototype.cascade;
    /**
     * @return {?}
     */
    IRelationalTable.prototype.dataProvider = function () { };
    /**
     * @param {?} id
     * @return {?}
     */
    IRelationalTable.prototype.get = function (id) { };
    /**
     * @param {?} model
     * @return {?}
     */
    IRelationalTable.prototype.add = function (model) { };
    /**
     * @param {?} models
     * @return {?}
     */
    IRelationalTable.prototype.addMany = function (models) { };
    /**
     * @param {?} foreignKey
     * @param {?} foreignTable
     * @return {?}
     */
    IRelationalTable.prototype.addForeignRelation = function (foreignKey, foreignTable) { };
    /**
     * @param {?} reverseForeignKey
     * @param {?} table
     * @return {?}
     */
    IRelationalTable.prototype.addReverseForeignRelation = function (reverseForeignKey, table) { };
    /**
     * @param {?} foreignKey
     * @return {?}
     */
    IRelationalTable.prototype.hasForeignRelation = function (foreignKey) { };
    /**
     * @param {?} reverseForeignKey
     * @return {?}
     */
    IRelationalTable.prototype.hasReverseForeignRelation = function (reverseForeignKey) { };
    /**
     * @return {?}
     */
    IRelationalTable.prototype.destroy = function () { };
}
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
export { RelationalTable };
if (false) {
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._name;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._cascade;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._addConstraint;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._deleteConstraint;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._foreignRelation;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._reverseForeignRelation;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._dataProvider;
    /**
     * @type {?}
     * @private
     */
    RelationalTable.prototype._onDeletedHandler;
    /** @type {?} */
    RelationalTable.prototype.dummyRecords;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQVM3QyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVE7O0lBQ2hDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVTs7SUFDM0IsR0FBRyxHQUFHLFlBQVksQ0FBQyxZQUFZOzs7O0FBRXJDLDZDQUtDOzs7SUFKRyx1Q0FBYTs7SUFDYiwwQ0FBa0I7O0lBQ2xCLG1EQUF1Qjs7SUFDdkIseURBQTZCOzs7OztBQUdqQyxzQ0FZQzs7O0lBWEcsZ0NBQWE7O0lBQ2IsbUNBQWlCOzs7O0lBQ2pCLDBEQUE0Qzs7Ozs7SUFDNUMsbURBQTZCOzs7OztJQUM3QixzREFBbUM7Ozs7O0lBQ25DLDJEQUF5Qzs7Ozs7O0lBQ3pDLHdGQUE2RTs7Ozs7O0lBQzdFLCtGQUFvRjs7Ozs7SUFDcEYsMEVBQWdEOzs7OztJQUNoRCx3RkFBOEQ7Ozs7SUFDOUQscURBQWdCOztBQUdwQjtJQVlJLHlCQUFZLE9BQWdDLEVBQ2pDLFlBQTBCO1FBRHJDLGlCQTJCQztRQTFCVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUVqQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBR2xDLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUUs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SSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDSCxJQUFJLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCw0Q0FBa0I7Ozs7O0lBQWxCLFVBQW1CLFVBQWtCO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILG1EQUF5Qjs7Ozs7SUFBekIsVUFBMEIsaUJBQXlCO1FBQy9DLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxpQ0FBTzs7OztJQUFQO1FBQ0ksb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQUFDLEFBdlBELElBdVBDOzs7Ozs7O0lBclBHLGdDQUFzQjs7Ozs7SUFDdEIsbUNBQTBCOzs7OztJQUMxQix5Q0FBNEI7Ozs7O0lBQzVCLDRDQUErQjs7Ozs7SUFDL0IsMkNBQThEOzs7OztJQUM5RCxrREFBdUU7Ozs7O0lBRXZFLHdDQUFtRDs7Ozs7SUFDbkQsNENBQStCOztJQUczQix1Q0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgYSB0YWJsZSBpbiBhIHJlbGF0aW9uYWwgZGF0YWJhc2UuXG4gKiBUaGlzIHRhYmxlIGlzIG9ic2VydmFibGUsIGkuZS4sIGFueSBjaGFuZ2Ugb24gdGhpcyB0YWJsZSB3aWxsIGJlIG5vdGlmaWVkIHRvIGl0cyBsaXN0ZW5lcnMuXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgcHVzaEFycmF5IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5pbXBvcnQge1xuICAgIElNb2RlbExpa2UsXG4gICAgSUJhY2tib25lQ29sbGVjdGlvbkxpa2UsXG4gICAgSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlLFxuICAgIElGdWxsTW9kZWxMaWtlXG59IGZyb20gJy4uL2ludGVyZmFjZXMvYmFja2JvbmUuaW50ZXJmYWNlJztcbmltcG9ydCB7IER1bW15UmVjb3JkcyB9IGZyb20gJy4vZHVtbXktcmVjb3Jkcyc7XG5cbmNvbnN0IGJhY2tib25lID0gZGVwZW5kZW5jaWVzLmJhY2tib25lO1xuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuY29uc3QgY2pzID0gZGVwZW5kZW5jaWVzLmNvbnN0cmFpbnRqcztcblxuZXhwb3J0IGludGVyZmFjZSBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNhc2NhZGU/OiBib29sZWFuO1xuICAgIGRhdGFQcm92aWRlckN0b3I/OiBhbnk7XG4gICAgZGF0YVByb3ZpZGVyQ3Rvck9wdGlvbj86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVsYXRpb25hbFRhYmxlIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY2FzY2FkZTogYm9vbGVhbjtcbiAgICBkYXRhUHJvdmlkZXIoKTogSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlO1xuICAgIGdldChpZDogYW55KTogSUZ1bGxNb2RlbExpa2U7XG4gICAgYWRkKG1vZGVsOiBvYmplY3QpOiBJRnVsbE1vZGVsTGlrZTtcbiAgICBhZGRNYW55KG1vZGVsczogYW55W10pOiBJRnVsbE1vZGVsTGlrZVtdO1xuICAgIGFkZEZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25UYWJsZTogSVJlbGF0aW9uYWxUYWJsZSk6IHZvaWQ7XG4gICAgYWRkUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nLCB0YWJsZTogSVJlbGF0aW9uYWxUYWJsZSk6IHZvaWQ7XG4gICAgaGFzRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgaGFzUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBkZXN0cm95KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBSZWxhdGlvbmFsVGFibGUgaW1wbGVtZW50cyBJUmVsYXRpb25hbFRhYmxlIHtcblxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIF9jYXNjYWRlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2FkZENvbnN0cmFpbnQ6IGFueTtcbiAgICBwcml2YXRlIF9kZWxldGVDb25zdHJhaW50OiBhbnk7XG4gICAgcHJpdmF0ZSBfZm9yZWlnblJlbGF0aW9uOiB7IFtrZXk6IHN0cmluZ106IElSZWxhdGlvbmFsVGFibGUgfTtcbiAgICBwcml2YXRlIF9yZXZlcnNlRm9yZWlnblJlbGF0aW9uOiB7IFtrZXk6IHN0cmluZ106IElSZWxhdGlvbmFsVGFibGVbXSB9O1xuXG4gICAgcHJpdmF0ZSBfZGF0YVByb3ZpZGVyOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2U7XG4gICAgcHJpdmF0ZSBfb25EZWxldGVkSGFuZGxlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSVJlbGF0aW9uYWxUYWJsZU9wdGlvbnMsXG4gICAgICAgIHB1YmxpYyBkdW1teVJlY29yZHM6IER1bW15UmVjb3Jkcykge1xuXG4gICAgICAgIHRoaXMuX25hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgICAgIHRoaXMuX2Nhc2NhZGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9mb3JlaWduUmVsYXRpb24gPSB7fTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUZvcmVpZ25SZWxhdGlvbiA9IHt9O1xuXG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3Rvcikge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVByb3ZpZGVyID0gbmV3IG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3RvcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3RvciA9IGJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3Rvck9wdGlvbiB8fCB7fSk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIgPSBuZXcgY3RvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWRkQ29uc3RyYWludCA9IGNqcy5jb25zdHJhaW50KFtdKTtcbiAgICAgICAgdGhpcy5fZGVsZXRlQ29uc3RyYWludCA9IGNqcy5jb25zdHJhaW50KFtdKTtcblxuICAgICAgICAvLyBUb2RvOiBGaWd1cmUgb3V0IHBhcmFtZXRlcnNcbiAgICAgICAgdGhpcy5fb25EZWxldGVkSGFuZGxlciA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkRlbGV0ZWQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTZXQgdXAgY29uc3RyYWludFxuICAgICAgICB0aGlzLl9kZWxldGVDb25zdHJhaW50Lm9uQ2hhbmdlKHRoaXMuX29uRGVsZXRlZEhhbmRsZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNhc2NhZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXNjYWRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBkYXRhUHJvdmlkZXIoKTogSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFQcm92aWRlcjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBGaWd1cmUgb3V0IC4uLlxuICAgIHB1YmxpYyBvbkRlbGV0ZWQoKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIGl0ZW1zIGFyZSBzdGlsbCBpbiB1c2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBoYXNBbnlSZWZlcmVuY2UoaXRlbTogSU1vZGVsTGlrZSk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGl0ZW0gaXMgaW4gdGhpcyB0YWJsZSBvciBub3RcbiAgICAgICAgY29uc3QgaXRlbUluVGFibGUgPSB0aGlzLl9kYXRhUHJvdmlkZXIuZ2V0KGl0ZW0uaWQpO1xuICAgICAgICBpZiAoIWl0ZW1JblRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXZSZWxhdGlvbnMgPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uO1xuICAgICAgICBsZXQgaGFzRm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCByZXZLIGluIHJldlJlbGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKHJldlJlbGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShyZXZLKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldlRhYmxlcyA9IHJldlJlbGF0aW9uc1tyZXZLXTtcbiAgICAgICAgICAgICAgICBoYXNGb3VuZCA9IF8uc29tZShyZXZUYWJsZXMsIChmcm9tVGFibGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbVRhYmxlRGF0YVByb3ZpZGVyID0gZnJvbVRhYmxlLmRhdGFQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW3JldktdID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW55VXNlID0gZnJvbVRhYmxlRGF0YVByb3ZpZGVyLmZpbmRXaGVyZShmaWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFhbnlVc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0ZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoYXNGb3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmluZyBhbnkgaXRlbXMgaW4gb3RoZXIgdGFibGVzIHdoaWNoIGRlcGVuZCBvbiB0aGUgZGVsZXRlZCBpdGVtLlxuICAgICAqL1xuICAgIHByaXZhdGUgcmVtb3ZlUmV2ZXJzZUZvcmVpZ24ocmVtb3ZlZEl0ZW1zOiBJTW9kZWxMaWtlW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmV2UmVsYXRpb24gPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uO1xuICAgICAgICBmb3IgKGNvbnN0IHJldksgaW4gcmV2UmVsYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChyZXZSZWxhdGlvbi5oYXNPd25Qcm9wZXJ0eShyZXZLKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldlRhYmxlcyA9IHJldlJlbGF0aW9uW3JldktdO1xuICAgICAgICAgICAgICAgIHJldlRhYmxlcy5mb3JFYWNoKChyZXZlcnNlVGFibGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVByb3ZpZGVyID0gcmV2ZXJzZVRhYmxlLmRhdGFQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b0JlUmVtb3ZlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbcmV2S10gPSBpdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW55SXRlbXMgPSBkYXRhUHJvdmlkZXIud2hlcmUoZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hBcnJheSh0b0JlUmVtb3ZlZCwgYW55SXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9CZVJlbW92ZWQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5kZXN0cm95RnJvbVRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbW9kZWwgaW4gdGhlIHRhYmxlIGJ5IGlkLlxuICAgICAqL1xuICAgIGdldChpZDogYW55KTogSUZ1bGxNb2RlbExpa2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVByb3ZpZGVyLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95RnJvbVRhYmxlKHRoYXRJdGVtOiBJTW9kZWxMaWtlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbW92ZWRJdGVtID0gdGhpcy5fZGF0YVByb3ZpZGVyLnJlbW92ZSh0aGF0SXRlbSk7XG4gICAgICAgIGlmICghcmVtb3ZlZEl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RpZnkgb2YgaXRzIGNvbGxlY3Rpb25cbiAgICAgICAgcmVtb3ZlZEl0ZW0uc2V0KCdpbnZhbGlkYXRlZCcsIHRydWUpO1xuICAgICAgICByZW1vdmVkSXRlbS50cmlnZ2VyKCdkZXN0cm95JywgcmVtb3ZlZEl0ZW0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUmV2ZXJzZUZvcmVpZ24oW3JlbW92ZWRJdGVtXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGb3JlaWduTW9kZWwodGhhdEl0ZW06IElNb2RlbExpa2UsIGZvcmVpZ25LZXk6IHN0cmluZyk6IElNb2RlbExpa2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoYXRJdGVtLmF0dHJpYnV0ZXNbZm9yZWlnbktleV07XG5cbiAgICAgICAgLy8gSWYgd2UgZG8gbm90IGhhdmUgdGhpcyBmb3JlaWduS2V5LCB0aGVuIHJldHVybiBhIGR1bW15IG9uZVxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kdW1teVJlY29yZHMuZ2V0RHVtbXlSZWNvcmQoZm9yZWlnbktleSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWJsZSA9IHRoaXMuX2ZvcmVpZ25SZWxhdGlvbltmb3JlaWduS2V5XTtcbiAgICAgICAgcmV0dXJuIHRhYmxlLmRhdGFQcm92aWRlcigpLmdldCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhbiBpdGVtIGluIHRoZSBUYWJsZSBhbmQgcmVjdXJzaXZlbHkgYWRkIGZvcmVpZ24gaXRlbXMuXG4gICAgICovXG4gICAgYWRkKG1vZGVsOiBvYmplY3QpOiBJRnVsbE1vZGVsTGlrZSB7XG5cbiAgICAgICAgY29uc3Qgc2VsZkNvbnRleHQgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IGRhdGFQcm92aWRlciA9IHRoaXMuX2RhdGFQcm92aWRlcjtcbiAgICAgICAgY29uc3QgZm9yZWlnblJlbGF0aW9uID0gdGhpcy5fZm9yZWlnblJlbGF0aW9uO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBpdGVtIHRvIGJlIGFkZGVkIGlzIGFscmVhZHkgaW4gdGhpcyB0YWJsZS5cbiAgICAgICAgY29uc3QgbW9kZWxJZCA9IGRhdGFQcm92aWRlci5tb2RlbElkKG1vZGVsKTtcbiAgICAgICAgbGV0IGFkZGVkSXRlbSA9IGRhdGFQcm92aWRlci5nZXQobW9kZWxJZCk7XG5cbiAgICAgICAgaWYgKGFkZGVkSXRlbSkge1xuICAgICAgICAgICAgY29uc3QgbmV3QXR0ciA9IF8uZXh0ZW5kKHt9LCBhZGRlZEl0ZW0uYXR0cmlidXRlcywgbW9kZWwpO1xuICAgICAgICAgICAgYWRkZWRJdGVtLnNldChuZXdBdHRyKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRlZEl0ZW07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgYSBuZXcgaXRlbVxuICAgICAgICBhZGRlZEl0ZW0gPSBkYXRhUHJvdmlkZXIuYWRkKG1vZGVsKTtcblxuICAgICAgICAvLyBBZGQgY29udmVuaWVudCBtZXRob2RzXG4gICAgICAgIGFkZGVkSXRlbS5kZXN0cm95RnJvbVRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmQ29udGV4dC5kZXN0cm95RnJvbVRhYmxlKHRoYXRJdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRlZEl0ZW0uZ2V0Rm9yZWlnbk1vZGVsID0gZnVuY3Rpb24oZm9yZWlnbktleTogc3RyaW5nKTogSU1vZGVsTGlrZSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gc2VsZkNvbnRleHQuZ2V0Rm9yZWlnbk1vZGVsKHRoYXRJdGVtLCBmb3JlaWduS2V5KTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRlZEl0ZW0uaGFzQW55UmVmZXJlbmNlID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gc2VsZkNvbnRleHQuaGFzQW55UmVmZXJlbmNlKHRoYXRJdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYWRkZWRJdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBtYW55IGl0ZW1zIGludG8gYSB0YWJsZS5cbiAgICAgKi9cbiAgICBhZGRNYW55KG1vZGVsczogYW55W10pOiBJRnVsbE1vZGVsTGlrZVtdIHtcbiAgICAgICAgcmV0dXJuIG1vZGVscy5tYXAobW9kZWwgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGZvcmVpZ24gcmVsYXRpb24uXG4gICAgICovXG4gICAgYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnblRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm9yZWlnbiBrZXkgZXhpc3RzOiAnICsgZm9yZWlnbktleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldID0gZm9yZWlnblRhYmxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHJldmVyc2UgZm9yZWlnbiByZWxhdGlvbi5cbiAgICAgKi9cbiAgICBhZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcsIHRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJldmVyc2VUYWJsZXMgPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uW3JldmVyc2VGb3JlaWduS2V5XTtcbiAgICAgICAgaWYgKHJldmVyc2VUYWJsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcmV2ZXJzZVRhYmxlcy5maW5kSW5kZXgoKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbSA9PT0gdGFibGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmV2ZXJzZSBmb3JlaWduIHRhYmxlIGV4aXN0czogJyArIHJldmVyc2VGb3JlaWduS2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV2ZXJzZVRhYmxlcy5wdXNoKHRhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldID0gW3RhYmxlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgZ2l2ZW4gZm9yZWlnbiByZWxhdGlvbiBpcyBwcmVzZW50LlxuICAgICAqL1xuICAgIGhhc0ZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhIGdpdmVuIHJldmVyc2UgZm9yZWlnbiByZWxhdGlvbiBpcyBwcmVzZW50LlxuICAgICAqL1xuICAgIGhhc1JldmVyc2VGb3JlaWduUmVsYXRpb24ocmV2ZXJzZUZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uW3JldmVyc2VGb3JlaWduS2V5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyB0YWJsZVxuICAgICAqL1xuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIC8vIFJlbW92ZSBjb25zdHJhaW50XG4gICAgICAgIHRoaXMuX2RlbGV0ZUNvbnN0cmFpbnQub2ZmQ2hhbmdlKHRoaXMuX29uRGVsZXRlZEhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIucmVzZXQoKTtcbiAgICB9XG59XG5cbiJdfQ==