/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { pushArray } from '@polpware/fe-utilities';
const backbone = dependencies.backbone;
const _ = dependencies.underscore;
const cjs = dependencies.constraintjs;
export class RelationalTable {
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
                hasFound = _.some(revTables, (fromTable) => {
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
            const newAttr = _.extend({}, addedItem.attributes, model);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvcmVsYXRpb25hbC90YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFTbkQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztBQUN2QyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBQ2xDLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7QUF1QnRDLE1BQU0sT0FBTyxlQUFlO0lBWXhCLFlBQVksT0FBZ0MsRUFDakMsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFakMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUdsQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDdkQ7YUFBTTtZQUNILE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxD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QUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNILHlCQUF5QixDQUFDLGlCQUF5QjtRQUMvQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFPO1FBQ0gsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgYSB0YWJsZSBpbiBhIHJlbGF0aW9uYWwgZGF0YWJhc2UuXG4gKiBUaGlzIHRhYmxlIGlzIG9ic2VydmFibGUsIGkuZS4sIGFueSBjaGFuZ2Ugb24gdGhpcyB0YWJsZSB3aWxsIGJlIG5vdGlmaWVkIHRvIGl0cyBsaXN0ZW5lcnMuXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgcHVzaEFycmF5IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5pbXBvcnQge1xuICAgIElNb2RlbExpa2UsXG4gICAgSUJhY2tib25lQ29sbGVjdGlvbkxpa2UsXG4gICAgSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlLFxuICAgIElGdWxsTW9kZWxMaWtlXG59IGZyb20gJy4uL2ludGVyZmFjZXMvYmFja2JvbmUuaW50ZXJmYWNlJztcbmltcG9ydCB7IER1bW15UmVjb3JkcyB9IGZyb20gJy4vZHVtbXktcmVjb3Jkcyc7XG5cbmNvbnN0IGJhY2tib25lID0gZGVwZW5kZW5jaWVzLmJhY2tib25lO1xuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuY29uc3QgY2pzID0gZGVwZW5kZW5jaWVzLmNvbnN0cmFpbnRqcztcblxuZXhwb3J0IGludGVyZmFjZSBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNhc2NhZGU/OiBib29sZWFuO1xuICAgIGRhdGFQcm92aWRlckN0b3I/OiBhbnk7XG4gICAgZGF0YVByb3ZpZGVyQ3Rvck9wdGlvbj86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVsYXRpb25hbFRhYmxlIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY2FzY2FkZTogYm9vbGVhbjtcbiAgICBkYXRhUHJvdmlkZXIoKTogSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlO1xuICAgIGdldChpZDogYW55KTogSUZ1bGxNb2RlbExpa2U7XG4gICAgYWRkKG1vZGVsOiBvYmplY3QpOiBJRnVsbE1vZGVsTGlrZTtcbiAgICBhZGRNYW55KG1vZGVsczogYW55W10pOiBJRnVsbE1vZGVsTGlrZVtdO1xuICAgIGFkZEZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25UYWJsZTogSVJlbGF0aW9uYWxUYWJsZSk6IHZvaWQ7XG4gICAgYWRkUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nLCB0YWJsZTogSVJlbGF0aW9uYWxUYWJsZSk6IHZvaWQ7XG4gICAgaGFzRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW47XG4gICAgaGFzUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBkZXN0cm95KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBSZWxhdGlvbmFsVGFibGUgaW1wbGVtZW50cyBJUmVsYXRpb25hbFRhYmxlIHtcblxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIF9jYXNjYWRlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2FkZENvbnN0cmFpbnQ6IGFueTtcbiAgICBwcml2YXRlIF9kZWxldGVDb25zdHJhaW50OiBhbnk7XG4gICAgcHJpdmF0ZSBfZm9yZWlnblJlbGF0aW9uOiB7IFtrZXk6IHN0cmluZ106IElSZWxhdGlvbmFsVGFibGUgfTtcbiAgICBwcml2YXRlIF9yZXZlcnNlRm9yZWlnblJlbGF0aW9uOiB7IFtrZXk6IHN0cmluZ106IElSZWxhdGlvbmFsVGFibGVbXSB9O1xuXG4gICAgcHJpdmF0ZSBfZGF0YVByb3ZpZGVyOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2U7XG4gICAgcHJpdmF0ZSBfb25EZWxldGVkSGFuZGxlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSVJlbGF0aW9uYWxUYWJsZU9wdGlvbnMsXG4gICAgICAgIHB1YmxpYyBkdW1teVJlY29yZHM6IER1bW15UmVjb3Jkcykge1xuXG4gICAgICAgIHRoaXMuX25hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgICAgIHRoaXMuX2Nhc2NhZGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9mb3JlaWduUmVsYXRpb24gPSB7fTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUZvcmVpZ25SZWxhdGlvbiA9IHt9O1xuXG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3Rvcikge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVByb3ZpZGVyID0gbmV3IG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3RvcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3RvciA9IGJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKG9wdGlvbnMuZGF0YVByb3ZpZGVyQ3Rvck9wdGlvbiB8fCB7fSk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIgPSBuZXcgY3RvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWRkQ29uc3RyYWludCA9IGNqcy5jb25zdHJhaW50KFtdKTtcbiAgICAgICAgdGhpcy5fZGVsZXRlQ29uc3RyYWludCA9IGNqcy5jb25zdHJhaW50KFtdKTtcblxuICAgICAgICAvLyBUb2RvOiBGaWd1cmUgb3V0IHBhcmFtZXRlcnNcbiAgICAgICAgdGhpcy5fb25EZWxldGVkSGFuZGxlciA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkRlbGV0ZWQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTZXQgdXAgY29uc3RyYWludFxuICAgICAgICB0aGlzLl9kZWxldGVDb25zdHJhaW50Lm9uQ2hhbmdlKHRoaXMuX29uRGVsZXRlZEhhbmRsZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNhc2NhZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXNjYWRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBkYXRhUHJvdmlkZXIoKTogSUZ1bGxCYWNrYm9uZUNvbGxlY3Rpb25MaWtlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFQcm92aWRlcjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBGaWd1cmUgb3V0IC4uLlxuICAgIHB1YmxpYyBvbkRlbGV0ZWQoKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIGl0ZW1zIGFyZSBzdGlsbCBpbiB1c2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBoYXNBbnlSZWZlcmVuY2UoaXRlbTogSU1vZGVsTGlrZSk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGl0ZW0gaXMgaW4gdGhpcyB0YWJsZSBvciBub3RcbiAgICAgICAgY29uc3QgaXRlbUluVGFibGUgPSB0aGlzLl9kYXRhUHJvdmlkZXIuZ2V0KGl0ZW0uaWQpO1xuICAgICAgICBpZiAoIWl0ZW1JblRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXZSZWxhdGlvbnMgPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uO1xuICAgICAgICBsZXQgaGFzRm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCByZXZLIGluIHJldlJlbGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKHJldlJlbGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShyZXZLKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldlRhYmxlcyA9IHJldlJlbGF0aW9uc1tyZXZLXTtcbiAgICAgICAgICAgICAgICBoYXNGb3VuZCA9IF8uc29tZShyZXZUYWJsZXMsIChmcm9tVGFibGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbVRhYmxlRGF0YVByb3ZpZGVyID0gZnJvbVRhYmxlLmRhdGFQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW3JldktdID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW55VXNlID0gZnJvbVRhYmxlRGF0YVByb3ZpZGVyLmZpbmRXaGVyZShmaWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFhbnlVc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0ZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoYXNGb3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmluZyBhbnkgaXRlbXMgaW4gb3RoZXIgdGFibGVzIHdoaWNoIGRlcGVuZCBvbiB0aGUgZGVsZXRlZCBpdGVtLlxuICAgICAqL1xuICAgIHByaXZhdGUgcmVtb3ZlUmV2ZXJzZUZvcmVpZ24ocmVtb3ZlZEl0ZW1zOiBJTW9kZWxMaWtlW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmV2UmVsYXRpb24gPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uO1xuICAgICAgICBmb3IgKGNvbnN0IHJldksgaW4gcmV2UmVsYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChyZXZSZWxhdGlvbi5oYXNPd25Qcm9wZXJ0eShyZXZLKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldlRhYmxlcyA9IHJldlJlbGF0aW9uW3JldktdO1xuICAgICAgICAgICAgICAgIHJldlRhYmxlcy5mb3JFYWNoKChyZXZlcnNlVGFibGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVByb3ZpZGVyID0gcmV2ZXJzZVRhYmxlLmRhdGFQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b0JlUmVtb3ZlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbcmV2S10gPSBpdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW55SXRlbXMgPSBkYXRhUHJvdmlkZXIud2hlcmUoZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hBcnJheSh0b0JlUmVtb3ZlZCwgYW55SXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9CZVJlbW92ZWQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5kZXN0cm95RnJvbVRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbW9kZWwgaW4gdGhlIHRhYmxlIGJ5IGlkLlxuICAgICAqL1xuICAgIGdldChpZDogYW55KTogSUZ1bGxNb2RlbExpa2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVByb3ZpZGVyLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXN0cm95RnJvbVRhYmxlKHRoYXRJdGVtOiBJTW9kZWxMaWtlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbW92ZWRJdGVtID0gdGhpcy5fZGF0YVByb3ZpZGVyLnJlbW92ZSh0aGF0SXRlbSk7XG4gICAgICAgIGlmICghcmVtb3ZlZEl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RpZnkgb2YgaXRzIGNvbGxlY3Rpb25cbiAgICAgICAgcmVtb3ZlZEl0ZW0uc2V0KCdpbnZhbGlkYXRlZCcsIHRydWUpO1xuICAgICAgICByZW1vdmVkSXRlbS50cmlnZ2VyKCdkZXN0cm95JywgcmVtb3ZlZEl0ZW0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlUmV2ZXJzZUZvcmVpZ24oW3JlbW92ZWRJdGVtXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGb3JlaWduTW9kZWwodGhhdEl0ZW06IElNb2RlbExpa2UsIGZvcmVpZ25LZXk6IHN0cmluZyk6IElNb2RlbExpa2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoYXRJdGVtLmF0dHJpYnV0ZXNbZm9yZWlnbktleV07XG5cbiAgICAgICAgLy8gSWYgd2UgZG8gbm90IGhhdmUgdGhpcyBmb3JlaWduS2V5LCB0aGVuIHJldHVybiBhIGR1bW15IG9uZVxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kdW1teVJlY29yZHMuZ2V0RHVtbXlSZWNvcmQoZm9yZWlnbktleSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWJsZSA9IHRoaXMuX2ZvcmVpZ25SZWxhdGlvbltmb3JlaWduS2V5XTtcbiAgICAgICAgcmV0dXJuIHRhYmxlLmRhdGFQcm92aWRlcigpLmdldCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhbiBpdGVtIGluIHRoZSBUYWJsZSBhbmQgcmVjdXJzaXZlbHkgYWRkIGZvcmVpZ24gaXRlbXMuXG4gICAgICovXG4gICAgYWRkKG1vZGVsOiBvYmplY3QpOiBJRnVsbE1vZGVsTGlrZSB7XG5cbiAgICAgICAgY29uc3Qgc2VsZkNvbnRleHQgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IGRhdGFQcm92aWRlciA9IHRoaXMuX2RhdGFQcm92aWRlcjtcbiAgICAgICAgY29uc3QgZm9yZWlnblJlbGF0aW9uID0gdGhpcy5fZm9yZWlnblJlbGF0aW9uO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBpdGVtIHRvIGJlIGFkZGVkIGlzIGFscmVhZHkgaW4gdGhpcyB0YWJsZS5cbiAgICAgICAgY29uc3QgbW9kZWxJZCA9IGRhdGFQcm92aWRlci5tb2RlbElkKG1vZGVsKTtcbiAgICAgICAgbGV0IGFkZGVkSXRlbSA9IGRhdGFQcm92aWRlci5nZXQobW9kZWxJZCk7XG5cbiAgICAgICAgaWYgKGFkZGVkSXRlbSkge1xuICAgICAgICAgICAgY29uc3QgbmV3QXR0ciA9IF8uZXh0ZW5kKHt9LCBhZGRlZEl0ZW0uYXR0cmlidXRlcywgbW9kZWwpO1xuICAgICAgICAgICAgYWRkZWRJdGVtLnNldChuZXdBdHRyKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRlZEl0ZW07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgYSBuZXcgaXRlbVxuICAgICAgICBhZGRlZEl0ZW0gPSBkYXRhUHJvdmlkZXIuYWRkKG1vZGVsKTtcblxuICAgICAgICAvLyBBZGQgY29udmVuaWVudCBtZXRob2RzXG4gICAgICAgIGFkZGVkSXRlbS5kZXN0cm95RnJvbVRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmQ29udGV4dC5kZXN0cm95RnJvbVRhYmxlKHRoYXRJdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRlZEl0ZW0uZ2V0Rm9yZWlnbk1vZGVsID0gZnVuY3Rpb24oZm9yZWlnbktleTogc3RyaW5nKTogSU1vZGVsTGlrZSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gc2VsZkNvbnRleHQuZ2V0Rm9yZWlnbk1vZGVsKHRoYXRJdGVtLCBmb3JlaWduS2V5KTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRlZEl0ZW0uaGFzQW55UmVmZXJlbmNlID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBjb25zdCB0aGF0SXRlbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gc2VsZkNvbnRleHQuaGFzQW55UmVmZXJlbmNlKHRoYXRJdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYWRkZWRJdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBtYW55IGl0ZW1zIGludG8gYSB0YWJsZS5cbiAgICAgKi9cbiAgICBhZGRNYW55KG1vZGVsczogYW55W10pOiBJRnVsbE1vZGVsTGlrZVtdIHtcbiAgICAgICAgcmV0dXJuIG1vZGVscy5tYXAobW9kZWwgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGZvcmVpZ24gcmVsYXRpb24uXG4gICAgICovXG4gICAgYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnblRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm9yZWlnbiBrZXkgZXhpc3RzOiAnICsgZm9yZWlnbktleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldID0gZm9yZWlnblRhYmxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHJldmVyc2UgZm9yZWlnbiByZWxhdGlvbi5cbiAgICAgKi9cbiAgICBhZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcsIHRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJldmVyc2VUYWJsZXMgPSB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uW3JldmVyc2VGb3JlaWduS2V5XTtcbiAgICAgICAgaWYgKHJldmVyc2VUYWJsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcmV2ZXJzZVRhYmxlcy5maW5kSW5kZXgoKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbSA9PT0gdGFibGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmV2ZXJzZSBmb3JlaWduIHRhYmxlIGV4aXN0czogJyArIHJldmVyc2VGb3JlaWduS2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV2ZXJzZVRhYmxlcy5wdXNoKHRhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldID0gW3RhYmxlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgZ2l2ZW4gZm9yZWlnbiByZWxhdGlvbiBpcyBwcmVzZW50LlxuICAgICAqL1xuICAgIGhhc0ZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhIGdpdmVuIHJldmVyc2UgZm9yZWlnbiByZWxhdGlvbiBpcyBwcmVzZW50LlxuICAgICAqL1xuICAgIGhhc1JldmVyc2VGb3JlaWduUmVsYXRpb24ocmV2ZXJzZUZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uW3JldmVyc2VGb3JlaWduS2V5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyB0YWJsZVxuICAgICAqL1xuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIC8vIFJlbW92ZSBjb25zdHJhaW50XG4gICAgICAgIHRoaXMuX2RlbGV0ZUNvbnN0cmFpbnQub2ZmQ2hhbmdlKHRoaXMuX29uRGVsZXRlZEhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIucmVzZXQoKTtcbiAgICB9XG59XG5cbiJdfQ==