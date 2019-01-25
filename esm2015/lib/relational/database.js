/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */
import { RelationalTable } from './table';
import { DummyRecords } from './dummy-records';
/**
 * @record
 */
export function IRelationalDatabase() { }
if (false) {
    /**
     * @return {?}
     */
    IRelationalDatabase.prototype.getReference = function () { };
    /**
     * @param {?} options
     * @return {?}
     */
    IRelationalDatabase.prototype.addTable = function (options) { };
    /**
     * @param {?} name
     * @return {?}
     */
    IRelationalDatabase.prototype.getTable = function (name) { };
    /**
     * @param {?} name
     * @param {?} foreignKey
     * @param {?} foreignName
     * @return {?}
     */
    IRelationalDatabase.prototype.addForeignkey = function (name, foreignKey, foreignName) { };
    /**
     * @return {?}
     */
    IRelationalDatabase.prototype.destroy = function () { };
}
export class RelationDatabase {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    RelationDatabase.prototype._tableCollection;
    /**
     * @type {?}
     * @private
     */
    RelationDatabase.prototype._referenceCounter;
    /**
     * @type {?}
     * @private
     */
    RelationDatabase.prototype._dummyRecords;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL2RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBNkMsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUUvQyx5Q0FNQzs7Ozs7SUFMRyw2REFBb0M7Ozs7O0lBQ3BDLGdFQUE2RDs7Ozs7SUFDN0QsNkRBQXlDOzs7Ozs7O0lBQ3pDLDJGQUEyRTs7OztJQUMzRSx3REFBZ0I7O0FBR3BCLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7SUFTekI7UUFDSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQzVDLENBQUM7Ozs7O0lBS0QsWUFBWTtRQUNSLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7OztJQU9ELFFBQVEsQ0FBQyxPQUFnQztRQUNyQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRyxDQUFDOzs7Ozs7SUFLRCxRQUFRLENBQUMsSUFBWTtRQUNqQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7OztJQUtELGFBQWEsQ0FBQyxJQUFZLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjs7O2NBRXpELEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxDQUFDO1NBQy9DOztjQUVLLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixHQUFHLFdBQVcsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRCxZQUFZLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7Ozs7O0lBS0QsT0FBTztRQUNILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsRUFBRTtZQUM5QixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFOzswQkFDbkMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbkI7YUFDSjtZQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7U0FDOUI7SUFDTCxDQUFDO0NBQ0o7Ozs7OztJQXZFRyw0Q0FBOEQ7Ozs7O0lBQzlELDZDQUFrQzs7Ozs7SUFDbEMseUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBEZWZpbmVzIGEgcmVsYXRpb25hbCBkYXRhYmFzZSB3aGljaCBzdXBwb3J0cyBmb3JlaWduIGtleXMgYW5kIHByaW1hcnkga2V5cy5cbiAqIEFsc28gdGhpcyBkYXRhYmFzZSBzdXBwb3J0IGNhc2NhZGluZyBkZWxldGlvbiBhbmQgYWRkaXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucywgSVJlbGF0aW9uYWxUYWJsZSwgUmVsYXRpb25hbFRhYmxlIH0gZnJvbSAnLi90YWJsZSc7XG5pbXBvcnQgeyBEdW1teVJlY29yZHMgfSBmcm9tICcuL2R1bW15LXJlY29yZHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsRGF0YWJhc2Uge1xuICAgIGdldFJlZmVyZW5jZSgpOiBJUmVsYXRpb25hbERhdGFiYXNlO1xuICAgIGFkZFRhYmxlKG9wdGlvbnM6IElSZWxhdGlvbmFsVGFibGVPcHRpb25zKTogSVJlbGF0aW9uYWxUYWJsZTtcbiAgICBnZXRUYWJsZShuYW1lOiBzdHJpbmcpOiBJUmVsYXRpb25hbFRhYmxlO1xuICAgIGFkZEZvcmVpZ25rZXkobmFtZTogc3RyaW5nLCBmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25OYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uRGF0YWJhc2UgaW1wbGVtZW50cyBJUmVsYXRpb25hbERhdGFiYXNlIHtcblxuICAgIHByaXZhdGUgX3RhYmxlQ29sbGVjdGlvbjogeyBba2V5OiBzdHJpbmddOiBJUmVsYXRpb25hbFRhYmxlIH07XG4gICAgcHJpdmF0ZSBfcmVmZXJlbmNlQ291bnRlcjogbnVtYmVyO1xuICAgIHByaXZhdGUgX2R1bW15UmVjb3JkczogRHVtbXlSZWNvcmRzO1xuXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyBhIHJlbGF0aW9uYWwgZGF0YWJhc2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZUNvdW50ZXIgPSAxO1xuICAgICAgICB0aGlzLl90YWJsZUNvbGxlY3Rpb24gPSB7fTtcbiAgICAgICAgdGhpcy5fZHVtbXlSZWNvcmRzID0gbmV3IER1bW15UmVjb3JkcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSByZWZlcmVuY2Ugb2YgdGhlIGZpbGUgc3lzdGVtIGRhdGFiYXNlXG4gICAgICovXG4gICAgZ2V0UmVmZXJlbmNlKCk6IElSZWxhdGlvbmFsRGF0YWJhc2Uge1xuICAgICAgICB0aGlzLl9yZWZlcmVuY2VDb3VudGVyKys7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB0YWJsZSBpbiB0aGUgZGF0YWJhc2UuXG4gICAgICogQGZ1bmN0aW9uIGFkZFRhYmxlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICovXG4gICAgYWRkVGFibGUob3B0aW9uczogSVJlbGF0aW9uYWxUYWJsZU9wdGlvbnMpOiBJUmVsYXRpb25hbFRhYmxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlQ29sbGVjdGlvbltvcHRpb25zLm5hbWVdID0gbmV3IFJlbGF0aW9uYWxUYWJsZShvcHRpb25zLCB0aGlzLl9kdW1teVJlY29yZHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhIHRhYmxlIGJ5IG5hbWUuXG4gICAgICovXG4gICAgZ2V0VGFibGUobmFtZTogc3RyaW5nKTogSVJlbGF0aW9uYWxUYWJsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZUNvbGxlY3Rpb25bbmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIGZvcmVpZ24gcmVsYXRpb24gYmV0d2VlbiB0d28gdGFibGVzLlxuICAgICAqL1xuICAgIGFkZEZvcmVpZ25rZXkobmFtZTogc3RyaW5nLCBmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgLy8gQ29uc3RyYWludHNcbiAgICAgICAgY29uc3QgdGFibGUgPSB0aGlzLl90YWJsZUNvbGxlY3Rpb25bbmFtZV07XG4gICAgICAgIGlmICghdGFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIHRhYmxlOiAnICsgbmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JlaWduVGFibGUgPSB0aGlzLl90YWJsZUNvbGxlY3Rpb25bZm9yZWlnbk5hbWVdO1xuICAgICAgICBpZiAoIWZvcmVpZ25UYWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgZm9yZWlnbiB0YWJsZTogJyArIGZvcmVpZ25OYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYmxlLmFkZEZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5LCBmb3JlaWduVGFibGUpO1xuICAgICAgICBmb3JlaWduVGFibGUuYWRkUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5LCB0YWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveXMgZGF0YWJhc2VcbiAgICAgKi9cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZWZlcmVuY2VDb3VudGVyLS07XG4gICAgICAgIGlmICh0aGlzLl9yZWZlcmVuY2VDb3VudGVyID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gdGhpcy5fdGFibGVDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlQ29sbGVjdGlvbi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZSA9IHRoaXMuX3RhYmxlQ29sbGVjdGlvbltrXTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RhYmxlQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19