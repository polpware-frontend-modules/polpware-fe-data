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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQVNuRCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDbEMsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztBQXVCdEMsTUFBTSxPQUFPLGVBQWU7SUFZeEIsWUFBWSxPQUFnQyxFQUNqQyxZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUVqQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBR2xDLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN2RDthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUNuQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMs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VUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gseUJBQXlCLENBQUMsaUJBQXlCO1FBQy9DLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU87UUFDSCxvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIHRhYmxlIGluIGEgcmVsYXRpb25hbCBkYXRhYmFzZS5cbiAqIFRoaXMgdGFibGUgaXMgb2JzZXJ2YWJsZSwgaS5lLiwgYW55IGNoYW5nZSBvbiB0aGlzIHRhYmxlIHdpbGwgYmUgbm90aWZpZWQgdG8gaXRzIGxpc3RlbmVycy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyBwdXNoQXJyYXkgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcbmltcG9ydCB7XG4gICAgSU1vZGVsTGlrZSxcbiAgICBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSxcbiAgICBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2UsXG4gICAgSUZ1bGxNb2RlbExpa2Vcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9iYWNrYm9uZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHVtbXlSZWNvcmRzIH0gZnJvbSAnLi9kdW1teS1yZWNvcmRzJztcblxuY29uc3QgYmFja2JvbmUgPSBkZXBlbmRlbmNpZXMuYmFja2JvbmU7XG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5jb25zdCBjanMgPSBkZXBlbmRlbmNpZXMuY29uc3RyYWludGpzO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGVPcHRpb25zIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY2FzY2FkZT86IGJvb2xlYW47XG4gICAgZGF0YVByb3ZpZGVyQ3Rvcj86IGFueTtcbiAgICBkYXRhUHJvdmlkZXJDdG9yT3B0aW9uPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGUge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjYXNjYWRlOiBib29sZWFuO1xuICAgIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2U7XG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZTtcbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlO1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW107XG4gICAgYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnblRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBhZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcsIHRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBoYXNGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBoYXNSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcpOiBib29sZWFuO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uYWxUYWJsZSBpbXBsZW1lbnRzIElSZWxhdGlvbmFsVGFibGUge1xuXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Nhc2NhZGU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWRkQ29uc3RyYWludDogYW55O1xuICAgIHByaXZhdGUgX2RlbGV0ZUNvbnN0cmFpbnQ6IGFueTtcbiAgICBwcml2YXRlIF9mb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZSB9O1xuICAgIHByaXZhdGUgX3JldmVyc2VGb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZVtdIH07XG5cbiAgICBwcml2YXRlIF9kYXRhUHJvdmlkZXI6IElGdWxsQmFja2JvbmVDb2xsZWN0aW9uTGlrZTtcbiAgICBwcml2YXRlIF9vbkRlbGV0ZWRIYW5kbGVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyxcbiAgICAgICAgcHVibGljIGR1bW15UmVjb3JkczogRHVtbXlSZWNvcmRzKSB7XG5cbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fY2FzY2FkZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2ZvcmVpZ25SZWxhdGlvbiA9IHt9O1xuICAgICAgICB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uID0ge307XG5cblxuICAgICAgICBpZiAob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIgPSBuZXcgb3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjdG9yID0gYmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yT3B0aW9uIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFQcm92aWRlciA9IG5ldyBjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hZGRDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuICAgICAgICB0aGlzLl9kZWxldGVDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuXG4gICAgICAgIC8vIFRvZG86IEZpZ3VyZSBvdXQgcGFyYW1ldGVyc1xuICAgICAgICB0aGlzLl9vbkRlbGV0ZWRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlZCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNldCB1cCBjb25zdHJhaW50XG4gICAgICAgIHRoaXMuX2RlbGV0ZUNvbnN0cmFpbnQub25DaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY2FzY2FkZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc2NhZGU7XG4gICAgfVxuXG4gICAgcHVibGljIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgIH1cblxuICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgLi4uXG4gICAgcHVibGljIG9uRGVsZXRlZCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gaXRlbXMgYXJlIHN0aWxsIGluIHVzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGhhc0FueVJlZmVyZW5jZShpdGVtOiBJTW9kZWxMaWtlKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXRlbSBpcyBpbiB0aGlzIHRhYmxlIG9yIG5vdFxuICAgICAgICBjb25zdCBpdGVtSW5UYWJsZSA9IHRoaXMuX2RhdGFQcm92aWRlci5nZXQoaXRlbS5pZCk7XG4gICAgICAgIGlmICghaXRlbUluVGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJldlJlbGF0aW9ucyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGxldCBoYXNGb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IHJldksgaW4gcmV2UmVsYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAocmV2UmVsYXRpb25zLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25zW3JldktdO1xuICAgICAgICAgICAgICAgIGhhc0ZvdW5kID0gXy5zb21lKHJldlRhYmxlcywgKGZyb21UYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tVGFibGVEYXRhUHJvdmlkZXIgPSBmcm9tVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbcmV2S10gPSBpdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlVc2UgPSBmcm9tVGFibGVEYXRhUHJvdmlkZXIuZmluZFdoZXJlKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWFueVVzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhhc0ZvdW5kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92aW5nIGFueSBpdGVtcyBpbiBvdGhlciB0YWJsZXMgd2hpY2ggZGVwZW5kIG9uIHRoZSBkZWxldGVkIGl0ZW0uXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmVSZXZlcnNlRm9yZWlnbihyZW1vdmVkSXRlbXM6IElNb2RlbExpa2VbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCByZXZSZWxhdGlvbiA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGZvciAoY29uc3QgcmV2SyBpbiByZXZSZWxhdGlvbikge1xuICAgICAgICAgICAgaWYgKHJldlJlbGF0aW9uLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25bcmV2S107XG4gICAgICAgICAgICAgICAgcmV2VGFibGVzLmZvckVhY2goKHJldmVyc2VUYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhUHJvdmlkZXIgPSByZXZlcnNlVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvQmVSZW1vdmVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcltyZXZLXSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlJdGVtcyA9IGRhdGFQcm92aWRlci53aGVyZShmaWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEFycmF5KHRvQmVSZW1vdmVkLCBhbnlJdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0b0JlUmVtb3ZlZC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmRlc3Ryb3lGcm9tVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBtb2RlbCBpbiB0aGUgdGFibGUgYnkgaWQuXG4gICAgICovXG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhUHJvdmlkZXIuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW06IElNb2RlbExpa2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlZEl0ZW0gPSB0aGlzLl9kYXRhUHJvdmlkZXIucmVtb3ZlKHRoYXRJdGVtKTtcbiAgICAgICAgaWYgKCFyZW1vdmVkSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBvZiBpdHMgY29sbGVjdGlvblxuICAgICAgICByZW1vdmVkSXRlbS5zZXQoJ2ludmFsaWRhdGVkJywgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZWRJdGVtLnRyaWdnZXIoJ2Rlc3Ryb3knLCByZW1vdmVkSXRlbSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVSZXZlcnNlRm9yZWlnbihbcmVtb3ZlZEl0ZW1dKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZvcmVpZ25Nb2RlbCh0aGF0SXRlbTogSU1vZGVsTGlrZSwgZm9yZWlnbktleTogc3RyaW5nKTogSU1vZGVsTGlrZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhhdEl0ZW0uYXR0cmlidXRlc1tmb3JlaWduS2V5XTtcblxuICAgICAgICAvLyBJZiB3ZSBkbyBub3QgaGF2ZSB0aGlzIGZvcmVpZ25LZXksIHRoZW4gcmV0dXJuIGEgZHVtbXkgb25lXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmR1bW15UmVjb3Jkcy5nZXREdW1teVJlY29yZChmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhYmxlID0gdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldO1xuICAgICAgICByZXR1cm4gdGFibGUuZGF0YVByb3ZpZGVyKCkuZ2V0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGFuIGl0ZW0gaW4gdGhlIFRhYmxlIGFuZCByZWN1cnNpdmVseSBhZGQgZm9yZWlnbiBpdGVtcy5cbiAgICAgKi9cbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlIHtcblxuICAgICAgICBjb25zdCBzZWxmQ29udGV4dCA9IHRoaXM7XG5cbiAgICAgICAgY29uc3QgZGF0YVByb3ZpZGVyID0gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgICAgICBjb25zdCBmb3JlaWduUmVsYXRpb24gPSB0aGlzLl9mb3JlaWduUmVsYXRpb247XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGl0ZW0gdG8gYmUgYWRkZWQgaXMgYWxyZWFkeSBpbiB0aGlzIHRhYmxlLlxuICAgICAgICBjb25zdCBtb2RlbElkID0gZGF0YVByb3ZpZGVyLm1vZGVsSWQobW9kZWwpO1xuICAgICAgICBsZXQgYWRkZWRJdGVtID0gZGF0YVByb3ZpZGVyLmdldChtb2RlbElkKTtcblxuICAgICAgICBpZiAoYWRkZWRJdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdBdHRyID0gXy5leHRlbmQoe30sIGFkZGVkSXRlbS5hdHRyaWJ1dGVzLCBtb2RlbCk7XG4gICAgICAgICAgICBhZGRlZEl0ZW0uc2V0KG5ld0F0dHIpO1xuICAgICAgICAgICAgcmV0dXJuIGFkZGVkSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSBhIG5ldyBpdGVtXG4gICAgICAgIGFkZGVkSXRlbSA9IGRhdGFQcm92aWRlci5hZGQobW9kZWwpO1xuXG4gICAgICAgIC8vIEFkZCBjb252ZW5pZW50IG1ldGhvZHNcbiAgICAgICAgYWRkZWRJdGVtLmRlc3Ryb3lGcm9tVGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHNlbGZDb250ZXh0LmRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5nZXRGb3JlaWduTW9kZWwgPSBmdW5jdGlvbihmb3JlaWduS2V5OiBzdHJpbmcpOiBJTW9kZWxMaWtlIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5nZXRGb3JlaWduTW9kZWwodGhhdEl0ZW0sIGZvcmVpZ25LZXkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5oYXNBbnlSZWZlcmVuY2UgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5oYXNBbnlSZWZlcmVuY2UodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhZGRlZEl0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIG1hbnkgaXRlbXMgaW50byBhIHRhYmxlLlxuICAgICAqL1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW10ge1xuICAgICAgICByZXR1cm4gbW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZm9yZWlnbiByZWxhdGlvbi5cbiAgICAgKi9cbiAgICBhZGRGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nLCBmb3JlaWduVGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmVpZ25SZWxhdGlvbltmb3JlaWduS2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JlaWduIGtleSBleGlzdHM6ICcgKyBmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV0gPSBmb3JlaWduVGFibGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uLlxuICAgICAqL1xuICAgIGFkZFJldmVyc2VGb3JlaWduUmVsYXRpb24ocmV2ZXJzZUZvcmVpZ25LZXk6IHN0cmluZywgdGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZVRhYmxlcyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgICAgICBpZiAocmV2ZXJzZVRhYmxlcykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSByZXZlcnNlVGFibGVzLmZpbmRJbmRleCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtID09PSB0YWJsZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXZlcnNlIGZvcmVpZ24gdGFibGUgZXhpc3RzOiAnICsgcmV2ZXJzZUZvcmVpZ25LZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXZlcnNlVGFibGVzLnB1c2godGFibGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZUZvcmVpZ25SZWxhdGlvbltyZXZlcnNlRm9yZWlnbktleV0gPSBbdGFibGVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3lzIHRhYmxlXG4gICAgICovXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNvbnN0cmFpbnRcbiAgICAgICAgdGhpcy5fZGVsZXRlQ29uc3RyYWludC5vZmZDaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2RhdGFQcm92aWRlci5yZXNldCgpO1xuICAgIH1cbn1cblxuIl19