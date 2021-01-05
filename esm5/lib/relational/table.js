/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { pushArray } from '@polpware/fe-utilities';
var backbone = dependencies.backbone;
var _ = dependencies.underscore;
var cjs = dependencies.constraintjs;
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
export { RelationalTable };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQVNuRCxJQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0FBQ3ZDLElBQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDbEMsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztBQXVCdEM7SUFZSSx5QkFBWSxPQUFnQyxFQUNqQyxZQUEwQjtRQURyQyxpQkEyQkM7UUExQlUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFakMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUdsQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDdkQ7YUFBTTtZQUNILElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGlC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QUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0Q7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCw0Q0FBa0IsR0FBbEIsVUFBbUIsVUFBa0I7UUFDakMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNILG1EQUF5QixHQUF6QixVQUEwQixpQkFBeUI7UUFDL0MsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUNBQU8sR0FBUDtRQUNJLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FBQyxBQXZQRCxJQXVQQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIHRhYmxlIGluIGEgcmVsYXRpb25hbCBkYXRhYmFzZS5cbiAqIFRoaXMgdGFibGUgaXMgb2JzZXJ2YWJsZSwgaS5lLiwgYW55IGNoYW5nZSBvbiB0aGlzIHRhYmxlIHdpbGwgYmUgbm90aWZpZWQgdG8gaXRzIGxpc3RlbmVycy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyBwdXNoQXJyYXkgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcbmltcG9ydCB7XG4gICAgSU1vZGVsTGlrZSxcbiAgICBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSxcbiAgICBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2UsXG4gICAgSUZ1bGxNb2RlbExpa2Vcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9iYWNrYm9uZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHVtbXlSZWNvcmRzIH0gZnJvbSAnLi9kdW1teS1yZWNvcmRzJztcblxuY29uc3QgYmFja2JvbmUgPSBkZXBlbmRlbmNpZXMuYmFja2JvbmU7XG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5jb25zdCBjanMgPSBkZXBlbmRlbmNpZXMuY29uc3RyYWludGpzO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGVPcHRpb25zIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY2FzY2FkZT86IGJvb2xlYW47XG4gICAgZGF0YVByb3ZpZGVyQ3Rvcj86IGFueTtcbiAgICBkYXRhUHJvdmlkZXJDdG9yT3B0aW9uPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsVGFibGUge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjYXNjYWRlOiBib29sZWFuO1xuICAgIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2U7XG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZTtcbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlO1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW107XG4gICAgYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnblRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBhZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcsIHRhYmxlOiBJUmVsYXRpb25hbFRhYmxlKTogdm9pZDtcbiAgICBoYXNGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBoYXNSZXZlcnNlRm9yZWlnblJlbGF0aW9uKHJldmVyc2VGb3JlaWduS2V5OiBzdHJpbmcpOiBib29sZWFuO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uYWxUYWJsZSBpbXBsZW1lbnRzIElSZWxhdGlvbmFsVGFibGUge1xuXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Nhc2NhZGU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWRkQ29uc3RyYWludDogYW55O1xuICAgIHByaXZhdGUgX2RlbGV0ZUNvbnN0cmFpbnQ6IGFueTtcbiAgICBwcml2YXRlIF9mb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZSB9O1xuICAgIHByaXZhdGUgX3JldmVyc2VGb3JlaWduUmVsYXRpb246IHsgW2tleTogc3RyaW5nXTogSVJlbGF0aW9uYWxUYWJsZVtdIH07XG5cbiAgICBwcml2YXRlIF9kYXRhUHJvdmlkZXI6IElGdWxsQmFja2JvbmVDb2xsZWN0aW9uTGlrZTtcbiAgICBwcml2YXRlIF9vbkRlbGV0ZWRIYW5kbGVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyxcbiAgICAgICAgcHVibGljIGR1bW15UmVjb3JkczogRHVtbXlSZWNvcmRzKSB7XG5cbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fY2FzY2FkZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2ZvcmVpZ25SZWxhdGlvbiA9IHt9O1xuICAgICAgICB0aGlzLl9yZXZlcnNlRm9yZWlnblJlbGF0aW9uID0ge307XG5cblxuICAgICAgICBpZiAob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhUHJvdmlkZXIgPSBuZXcgb3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjdG9yID0gYmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQob3B0aW9ucy5kYXRhUHJvdmlkZXJDdG9yT3B0aW9uIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFQcm92aWRlciA9IG5ldyBjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hZGRDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuICAgICAgICB0aGlzLl9kZWxldGVDb25zdHJhaW50ID0gY2pzLmNvbnN0cmFpbnQoW10pO1xuXG4gICAgICAgIC8vIFRvZG86IEZpZ3VyZSBvdXQgcGFyYW1ldGVyc1xuICAgICAgICB0aGlzLl9vbkRlbGV0ZWRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlZCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNldCB1cCBjb25zdHJhaW50XG4gICAgICAgIHRoaXMuX2RlbGV0ZUNvbnN0cmFpbnQub25DaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY2FzY2FkZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc2NhZGU7XG4gICAgfVxuXG4gICAgcHVibGljIGRhdGFQcm92aWRlcigpOiBJRnVsbEJhY2tib25lQ29sbGVjdGlvbkxpa2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgIH1cblxuICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgLi4uXG4gICAgcHVibGljIG9uRGVsZXRlZCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gaXRlbXMgYXJlIHN0aWxsIGluIHVzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGhhc0FueVJlZmVyZW5jZShpdGVtOiBJTW9kZWxMaWtlKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXRlbSBpcyBpbiB0aGlzIHRhYmxlIG9yIG5vdFxuICAgICAgICBjb25zdCBpdGVtSW5UYWJsZSA9IHRoaXMuX2RhdGFQcm92aWRlci5nZXQoaXRlbS5pZCk7XG4gICAgICAgIGlmICghaXRlbUluVGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJldlJlbGF0aW9ucyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGxldCBoYXNGb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IHJldksgaW4gcmV2UmVsYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAocmV2UmVsYXRpb25zLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25zW3JldktdO1xuICAgICAgICAgICAgICAgIGhhc0ZvdW5kID0gXy5zb21lKHJldlRhYmxlcywgKGZyb21UYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tVGFibGVEYXRhUHJvdmlkZXIgPSBmcm9tVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbcmV2S10gPSBpdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlVc2UgPSBmcm9tVGFibGVEYXRhUHJvdmlkZXIuZmluZFdoZXJlKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWFueVVzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhhc0ZvdW5kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92aW5nIGFueSBpdGVtcyBpbiBvdGhlciB0YWJsZXMgd2hpY2ggZGVwZW5kIG9uIHRoZSBkZWxldGVkIGl0ZW0uXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmVSZXZlcnNlRm9yZWlnbihyZW1vdmVkSXRlbXM6IElNb2RlbExpa2VbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCByZXZSZWxhdGlvbiA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb247XG4gICAgICAgIGZvciAoY29uc3QgcmV2SyBpbiByZXZSZWxhdGlvbikge1xuICAgICAgICAgICAgaWYgKHJldlJlbGF0aW9uLmhhc093blByb3BlcnR5KHJldkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2VGFibGVzID0gcmV2UmVsYXRpb25bcmV2S107XG4gICAgICAgICAgICAgICAgcmV2VGFibGVzLmZvckVhY2goKHJldmVyc2VUYWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhUHJvdmlkZXIgPSByZXZlcnNlVGFibGUuZGF0YVByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvQmVSZW1vdmVkID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcltyZXZLXSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnlJdGVtcyA9IGRhdGFQcm92aWRlci53aGVyZShmaWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEFycmF5KHRvQmVSZW1vdmVkLCBhbnlJdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0b0JlUmVtb3ZlZC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmRlc3Ryb3lGcm9tVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBtb2RlbCBpbiB0aGUgdGFibGUgYnkgaWQuXG4gICAgICovXG4gICAgZ2V0KGlkOiBhbnkpOiBJRnVsbE1vZGVsTGlrZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhUHJvdmlkZXIuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW06IElNb2RlbExpa2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlZEl0ZW0gPSB0aGlzLl9kYXRhUHJvdmlkZXIucmVtb3ZlKHRoYXRJdGVtKTtcbiAgICAgICAgaWYgKCFyZW1vdmVkSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBvZiBpdHMgY29sbGVjdGlvblxuICAgICAgICByZW1vdmVkSXRlbS5zZXQoJ2ludmFsaWRhdGVkJywgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZWRJdGVtLnRyaWdnZXIoJ2Rlc3Ryb3knLCByZW1vdmVkSXRlbSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVSZXZlcnNlRm9yZWlnbihbcmVtb3ZlZEl0ZW1dKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZvcmVpZ25Nb2RlbCh0aGF0SXRlbTogSU1vZGVsTGlrZSwgZm9yZWlnbktleTogc3RyaW5nKTogSU1vZGVsTGlrZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhhdEl0ZW0uYXR0cmlidXRlc1tmb3JlaWduS2V5XTtcblxuICAgICAgICAvLyBJZiB3ZSBkbyBub3QgaGF2ZSB0aGlzIGZvcmVpZ25LZXksIHRoZW4gcmV0dXJuIGEgZHVtbXkgb25lXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmR1bW15UmVjb3Jkcy5nZXREdW1teVJlY29yZChmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhYmxlID0gdGhpcy5fZm9yZWlnblJlbGF0aW9uW2ZvcmVpZ25LZXldO1xuICAgICAgICByZXR1cm4gdGFibGUuZGF0YVByb3ZpZGVyKCkuZ2V0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGFuIGl0ZW0gaW4gdGhlIFRhYmxlIGFuZCByZWN1cnNpdmVseSBhZGQgZm9yZWlnbiBpdGVtcy5cbiAgICAgKi9cbiAgICBhZGQobW9kZWw6IG9iamVjdCk6IElGdWxsTW9kZWxMaWtlIHtcblxuICAgICAgICBjb25zdCBzZWxmQ29udGV4dCA9IHRoaXM7XG5cbiAgICAgICAgY29uc3QgZGF0YVByb3ZpZGVyID0gdGhpcy5fZGF0YVByb3ZpZGVyO1xuICAgICAgICBjb25zdCBmb3JlaWduUmVsYXRpb24gPSB0aGlzLl9mb3JlaWduUmVsYXRpb247XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGl0ZW0gdG8gYmUgYWRkZWQgaXMgYWxyZWFkeSBpbiB0aGlzIHRhYmxlLlxuICAgICAgICBjb25zdCBtb2RlbElkID0gZGF0YVByb3ZpZGVyLm1vZGVsSWQobW9kZWwpO1xuICAgICAgICBsZXQgYWRkZWRJdGVtID0gZGF0YVByb3ZpZGVyLmdldChtb2RlbElkKTtcblxuICAgICAgICBpZiAoYWRkZWRJdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdBdHRyID0gXy5leHRlbmQoe30sIGFkZGVkSXRlbS5hdHRyaWJ1dGVzLCBtb2RlbCk7XG4gICAgICAgICAgICBhZGRlZEl0ZW0uc2V0KG5ld0F0dHIpO1xuICAgICAgICAgICAgcmV0dXJuIGFkZGVkSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSBhIG5ldyBpdGVtXG4gICAgICAgIGFkZGVkSXRlbSA9IGRhdGFQcm92aWRlci5hZGQobW9kZWwpO1xuXG4gICAgICAgIC8vIEFkZCBjb252ZW5pZW50IG1ldGhvZHNcbiAgICAgICAgYWRkZWRJdGVtLmRlc3Ryb3lGcm9tVGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHNlbGZDb250ZXh0LmRlc3Ryb3lGcm9tVGFibGUodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5nZXRGb3JlaWduTW9kZWwgPSBmdW5jdGlvbihmb3JlaWduS2V5OiBzdHJpbmcpOiBJTW9kZWxMaWtlIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5nZXRGb3JlaWduTW9kZWwodGhhdEl0ZW0sIGZvcmVpZ25LZXkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZGVkSXRlbS5oYXNBbnlSZWZlcmVuY2UgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXRJdGVtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmQ29udGV4dC5oYXNBbnlSZWZlcmVuY2UodGhhdEl0ZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhZGRlZEl0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIG1hbnkgaXRlbXMgaW50byBhIHRhYmxlLlxuICAgICAqL1xuICAgIGFkZE1hbnkobW9kZWxzOiBhbnlbXSk6IElGdWxsTW9kZWxMaWtlW10ge1xuICAgICAgICByZXR1cm4gbW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZm9yZWlnbiByZWxhdGlvbi5cbiAgICAgKi9cbiAgICBhZGRGb3JlaWduUmVsYXRpb24oZm9yZWlnbktleTogc3RyaW5nLCBmb3JlaWduVGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmVpZ25SZWxhdGlvbltmb3JlaWduS2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JlaWduIGtleSBleGlzdHM6ICcgKyBmb3JlaWduS2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV0gPSBmb3JlaWduVGFibGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uLlxuICAgICAqL1xuICAgIGFkZFJldmVyc2VGb3JlaWduUmVsYXRpb24ocmV2ZXJzZUZvcmVpZ25LZXk6IHN0cmluZywgdGFibGU6IElSZWxhdGlvbmFsVGFibGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZVRhYmxlcyA9IHRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgICAgICBpZiAocmV2ZXJzZVRhYmxlcykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSByZXZlcnNlVGFibGVzLmZpbmRJbmRleCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtID09PSB0YWJsZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXZlcnNlIGZvcmVpZ24gdGFibGUgZXhpc3RzOiAnICsgcmV2ZXJzZUZvcmVpZ25LZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXZlcnNlVGFibGVzLnB1c2godGFibGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZUZvcmVpZ25SZWxhdGlvbltyZXZlcnNlRm9yZWlnbktleV0gPSBbdGFibGVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9mb3JlaWduUmVsYXRpb25bZm9yZWlnbktleV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gcmV2ZXJzZSBmb3JlaWduIHJlbGF0aW9uIGlzIHByZXNlbnQuXG4gICAgICovXG4gICAgaGFzUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihyZXZlcnNlRm9yZWlnbktleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX3JldmVyc2VGb3JlaWduUmVsYXRpb25bcmV2ZXJzZUZvcmVpZ25LZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3lzIHRhYmxlXG4gICAgICovXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNvbnN0cmFpbnRcbiAgICAgICAgdGhpcy5fZGVsZXRlQ29uc3RyYWludC5vZmZDaGFuZ2UodGhpcy5fb25EZWxldGVkSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2RhdGFQcm92aWRlci5yZXNldCgpO1xuICAgIH1cbn1cblxuIl19