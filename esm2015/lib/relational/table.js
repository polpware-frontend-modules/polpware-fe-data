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
const backbone = dependencies.backbone;
/** @type {?} */
const _ = dependencies.underscore;
/** @type {?} */
const cjs = dependencies.constraintjs;
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
export class RelationalTable {
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
            const ctor = backbone.Collection.extend(options.dataProviderCtorOption || {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztNQVM3QyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVE7O01BQ2hDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVTs7TUFDM0IsR0FBRyxHQUFHLFlBQVksQ0FBQyxZQUFZOzs7O0FBRXJDLDZDQUtDOzs7SUFKRyx1Q0FBYTs7SUFDYiwwQ0FBa0I7O0lBQ2xCLG1EQUF1Qjs7SUFDdkIseURBQTZCOzs7OztBQUdqQyxzQ0FZQzs7O0lBWEcsZ0NBQWE7O0lBQ2IsbUNBQWlCOzs7O0lBQ2pCLDBEQUE0Qzs7Ozs7SUFDNUMsbURBQTZCOzs7OztJQUM3QixzREFBbUM7Ozs7O0lBQ25DLDJEQUF5Qzs7Ozs7O0lBQ3pDLHdGQUE2RTs7Ozs7O0lBQzdFLCtGQUFvRjs7Ozs7SUFDcEYsMEVBQWdEOzs7OztJQUNoRCx3RkFBOEQ7Ozs7SUFDOUQscURBQWdCOztBQUdwQixNQUFNLE9BQU8sZUFBZTs7Ozs7SUFZeEIsWUFBWSxPQUFnQyxFQUNqQyxZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUVqQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBR2xDLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdC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Q0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELENBQUM7Ozs7O0lBS0QsT0FBTztRQUNILG9CQUFvQjtRQUNwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsQ0FBQztDQUNKOzs7Ozs7SUFyUEcsZ0NBQXNCOzs7OztJQUN0QixtQ0FBMEI7Ozs7O0lBQzFCLHlDQUE0Qjs7Ozs7SUFDNUIsNENBQStCOzs7OztJQUMvQiwyQ0FBOEQ7Ozs7O0lBQzlELGtEQUF1RTs7Ozs7SUFFdkUsd0NBQW1EOzs7OztJQUNuRCw0Q0FBK0I7O0lBRzNCLHVDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIHRhYmxlIGluIGEgcmVsYXRpb25hbCBkYXRhYmFzZS5cbiAqIFRoaXMgdGFibGUgaXMgb2JzZXJ2YWJsZSwgaS5lLiwgYW55IGNoYW5nZSBvbiB0aGlzIHRhYmxlIHdpbGwgYmUgbm90aWZpZWQgdG8gaXRzIGxpc3RlbmVycy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyBwdXNoQXJyYXkgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcbmltcG9ydCB7XG4gICAgSU1vZGVsTGlrZSxcbiAgICBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSxcbiAgICBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2UsXG4gICAgSUZ1bGxNb2RlbExpa2Vcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9iYWNrYm9uZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHVtbXlSZWNvcmRzIH0gZnJvbSAnLi9kdW1teS1yZWNvcmRzJztcblxuY29uc3QgYmFja2JvbmUgPSBkZXBlbmRlbmNpZXMuYmFja2JvbmU7XG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5jb25zdCBjanMgPSBkZXBlbmRlbmNpZXMuY29uc3RyYWludGpzO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGVPcHRpb25zIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY2FzY2FkZT86IGJvb2xlYW47XG4gICAgZGF0YVByb3ZpZGVyQ3Rvcj86IGFueTtcbiAgICBkYXRhUHJvdmlkZXJDdG9yT3B0aW9uPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGUge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjYXNjYWRlOiBib29sZWFuO1xuICAgIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2U7XG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZTtcbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlO1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW107XG4gICAgYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnblRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBhZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcsIHRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBoYXNGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBoYXNSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcpOiBib29sZWFuO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uYWxUYWJsZSBpbXBsZW1lbnRzIElSZWxhdGlvbmFsVGFibGUge1xuXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Nhc2NhZGU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWRkQ29uc3RyYWludDogYW55O1xuICAgIHByaXZhdGUgX2RlbGV0ZUNvbnN0cmFpbnQ6IGFueTtcbiAgICBwcml2YXRlIF9mb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZSB9O1xuICAgIHByaXZhdGUgX3JldmVyc2VGb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZVtdIH07XG5cbiAgICBwcml2YXRlIF9kYXRhUHJvdmlkZXI6IElGdWxsQmFja2JvbmVDb2xsZWN0aW9uTGlrZTtcbiAgICBwcml2YXRlIF9vbkRlbGV0ZWRIYW5kbGVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyxcbiAgICAgICAgcHVibGljIGR1bW15UmVjb3JkczogRHVtbXlSZWNvcmRzKSB7XG5cbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fY2FzY2FkZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2ZvcmVpZ25SZWxhdGlvbiA9IHt9O1xuICAgICAgICB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uID0ge307XG5cblxuICAgICAgICBpZiAob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIgPSBuZXcgb3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjdG9yID0gYmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yT3B0aW9uIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFQcm92aWRlciA9IG5ldyBjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hZGRDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuICAgICAgICB0aGlzLl9kZWxldGVDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuXG4gICAgICAgIC8vIFRvZG86IEZpZ3VyZSBvdXQgcGFyYW1ldGVyc1xuICAgICAgICB0aGlzLl9vbkRlbGV0ZWRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlZCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNldCB1cCBjb25zdHJhaW50XG4gICAgICAgIHRoaXMuX2RlbGV0ZUNvbnN0cmFpbnQub25DaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY2FzY2FkZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc2NhZGU7XG4gICAgfVxuXG4gICAgcHVibGljIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgIH1cblxuICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgLi4uXG4gICAgcHVibGljIG9uRGVsZXRlZCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gaXRlbXMgYXJlIHN0aWxsIGluIHVzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGhhc0FueVJlZmVyZW5jZShpdGVtOiBJTW9kZWxMaWtlKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXRlbSBpcyBpbiB0aGlzIHRhYmxlIG9yIG5vdFxuICAgICAgICBjb25zdCBpdGVtSW5UYWJsZSA9IHRoaXMuX2RhdGFQcm92aWRlci5nZXQoaXRlbS5pZCk7XG4gICAgICAgIGlmICghaXRlbUluVGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJldlJlbGF0aW9ucyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGxldCBoYXNGb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IHJldksgaW4gcmV2UmVsYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAocmV2UmVsYXRpb25zLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25zW3JldktdO1xuICAgICAgICAgICAgICAgIGhhc0ZvdW5kID0gXy5zb21lKHJldlRhYmxlcywgKGZyb21UYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tVGFibGVEYXRhUHJvdmlkZXIgPSBmcm9tVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbcmV2S10gPSBpdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlVc2UgPSBmcm9tVGFibGVEYXRhUHJvdmlkZXIuZmluZFdoZXJlKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWFueVVzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhhc0ZvdW5kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92aW5nIGFueSBpdGVtcyBpbiBvdGhlciB0YWJsZXMgd2hpY2ggZGVwZW5kIG9uIHRoZSBkZWxldGVkIGl0ZW0uXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmVSZXZlcnNlRm9yZWlnbihyZW1vdmVkSXRlbXM6IElNb2RlbExpa2VbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCByZXZSZWxhdGlvbiA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGZvciAoY29uc3QgcmV2SyBpbiByZXZSZWxhdGlvbikge1xuICAgICAgICAgICAgaWYgKHJldlJlbGF0aW9uLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25bcmV2S107XG4gICAgICAgICAgICAgICAgcmV2VGFibGVzLmZvckVhY2goKHJldmVyc2VUYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhUHJvdmlkZXIgPSByZXZlcnNlVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvQmVSZW1vdmVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcltyZXZLXSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlJdGVtcyA9IGRhdGFQcm92aWRlci53aGVyZShmaWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEFycmF5KHRvQmVSZW1vdmVkLCBhbnlJdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0b0JlUmVtb3ZlZC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmRlc3Ryb3lGcm9tVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBtb2RlbCBpbiB0aGUgdGFibGUgYnkgaWQuXG4gICAgICovXG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhUHJvdmlkZXIuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW06IElNb2RlbExpa2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlZEl0ZW0gPSB0aGlzLl9kYXRhUHJvdmlkZXIucmVtb3ZlKHRoYXRJdGVtKTtcbiAgICAgICAgaWYgKCFyZW1vdmVkSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBvZiBpdHMgY29sbGVjdGlvblxuICAgICAgICByZW1vdmVkSXRlbS5zZXQoJ2ludmFsaWRhdGVkJywgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZWRJdGVtLnRyaWdnZXIoJ2Rlc3Ryb3knLCByZW1vdmVkSXRlbSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVSZXZlcnNlRm9yZWlnbihbcmVtb3ZlZEl0ZW1dKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZvcmVpZ25Nb2RlbCh0aGF0SXRlbTogSU1vZGVsTGlrZSwgZm9yZWlnbktleTogc3RyaW5nKTogSU1vZGVsTGlrZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhhdEl0ZW0uYXR0cmlidXRlc1tmb3JlaWduS2V5XTtcblxuICAgICAgICAvLyBJZiB3ZSBkbyBub3QgaGF2ZSB0aGlzIGZvcmVpZ25LZXksIHRoZW4gcmV0dXJuIGEgZHVtbXkgb25lXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmR1bW15UmVjb3Jkcy5nZXREdW1teVJlY29yZChmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhYmxlID0gdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldO1xuICAgICAgICByZXR1cm4gdGFibGUuZGF0YVByb3ZpZGVyKCkuZ2V0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGFuIGl0ZW0gaW4gdGhlIFRhYmxlIGFuZCByZWN1cnNpdmVseSBhZGQgZm9yZWlnbiBpdGVtcy5cbiAgICAgKi9cbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlIHtcblxuICAgICAgICBjb25zdCBzZWxmQ29udGV4dCA9IHRoaXM7XG5cbiAgICAgICAgY29uc3QgZGF0YVByb3ZpZGVyID0gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgICAgICBjb25zdCBmb3JlaWduUmVsYXRpb24gPSB0aGlzLl9mb3JlaWduUmVsYXRpb247XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGl0ZW0gdG8gYmUgYWRkZWQgaXMgYWxyZWFkeSBpbiB0aGlzIHRhYmxlLlxuICAgICAgICBjb25zdCBtb2RlbElkID0gZGF0YVByb3ZpZGVyLm1vZGVsSWQobW9kZWwpO1xuICAgICAgICBsZXQgYWRkZWRJdGVtID0gZGF0YVByb3ZpZGVyLmdldChtb2RlbElkKTtcblxuICAgICAgICBpZiAoYWRkZWRJdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdBdHRyID0gXy5leHRlbmQoe30sIGFkZGVkSXRlbS5hdHRyaWJ1dGVzLCBtb2RlbCk7XG4gICAgICAgICAgICBhZGRlZEl0ZW0uc2V0KG5ld0F0dHIpO1xuICAgICAgICAgICAgcmV0dXJuIGFkZGVkSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSBhIG5ldyBpdGVtXG4gICAgICAgIGFkZGVkSXRlbSA9IGRhdGFQcm92aWRlci5hZGQobW9kZWwpO1xuXG4gICAgICAgIC8vIEFkZCBjb252ZW5pZW50IG1ldGhvZHNcbiAgICAgICAgYWRkZWRJdGVtLmRlc3Ryb3lGcm9tVGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHNlbGZDb250ZXh0LmRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5nZXRGb3JlaWduTW9kZWwgPSBmdW5jdGlvbihmb3JlaWduS2V5OiBzdHJpbmcpOiBJTW9kZWxMaWtlIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5nZXRGb3JlaWduTW9kZWwodGhhdEl0ZW0sIGZvcmVpZ25LZXkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5oYXNBbnlSZWZlcmVuY2UgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5oYXNBbnlSZWZlcmVuY2UodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhZGRlZEl0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIG1hbnkgaXRlbXMgaW50byBhIHRhYmxlLlxuICAgICAqL1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW10ge1xuICAgICAgICByZXR1cm4gbW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZm9yZWlnbiByZWxhdGlvbi5cbiAgICAgKi9cbiAgICBhZGRGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nLCBmb3JlaWduVGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmVpZ25SZWxhdGlvbltmb3JlaWduS2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JlaWduIGtleSBleGlzdHM6ICcgKyBmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV0gPSBmb3JlaWduVGFibGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uLlxuICAgICAqL1xuICAgIGFkZFJldmVyc2VGb3JlaWduUmVsYXRpb24ocmV2ZXJzZUZvcmVpZ25LZXk6IHN0cmluZywgdGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZVRhYmxlcyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgICAgICBpZiAocmV2ZXJzZVRhYmxlcykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSByZXZlcnNlVGFibGVzLmZpbmRJbmRleCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtID09PSB0YWJsZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXZlcnNlIGZvcmVpZ24gdGFibGUgZXhpc3RzOiAnICsgcmV2ZXJzZUZvcmVpZ25LZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXZlcnNlVGFibGVzLnB1c2godGFibGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZUZvcmVpZ25SZWxhdGlvbltyZXZlcnNlRm9yZWlnbktleV0gPSBbdGFibGVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3lzIHRhYmxlXG4gICAgICovXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNvbnN0cmFpbnRcbiAgICAgICAgdGhpcy5fZGVsZXRlQ29uc3RyYWludC5vZmZDaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2RhdGFQcm92aWRlci5yZXNldCgpO1xuICAgIH1cbn1cblxuIl19