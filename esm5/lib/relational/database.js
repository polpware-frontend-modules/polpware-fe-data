/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */
import { RelationalTable } from './table';
import { DummyRecords } from './dummy-records';
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
export { RelationDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL2RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFJSCxPQUFPLEVBQTZDLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFVL0M7SUFNSTs7T0FFRztJQUNIO1FBQ0ksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx1Q0FBWSxHQUFaO1FBQ0ksSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxtQ0FBUSxHQUFSLFVBQVMsT0FBZ0M7UUFDckMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOztPQUVHO0lBQ0gsbUNBQVEsR0FBUixVQUFTLElBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0NBQWEsR0FBYixVQUFjLElBQVksRUFBRSxVQUFrQixFQUFFLFdBQW1CO1FBQy9ELGNBQWM7UUFDZCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFFRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0NBQU8sR0FBUDtRQUNJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsRUFBRTtZQUM5QixLQUFLLElBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN6QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbkI7YUFDSjtZQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBekVELElBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBEZWZpbmVzIGEgcmVsYXRpb25hbCBkYXRhYmFzZSB3aGljaCBzdXBwb3J0cyBmb3JlaWduIGtleXMgYW5kIHByaW1hcnkga2V5cy5cbiAqIEFsc28gdGhpcyBkYXRhYmFzZSBzdXBwb3J0IGNhc2NhZGluZyBkZWxldGlvbiBhbmQgYWRkaXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucywgSVJlbGF0aW9uYWxUYWJsZSwgUmVsYXRpb25hbFRhYmxlIH0gZnJvbSAnLi90YWJsZSc7XG5pbXBvcnQgeyBEdW1teVJlY29yZHMgfSBmcm9tICcuL2R1bW15LXJlY29yZHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZWxhdGlvbmFsRGF0YWJhc2Uge1xuICAgIGdldFJlZmVyZW5jZSgpOiBJUmVsYXRpb25hbERhdGFiYXNlO1xuICAgIGFkZFRhYmxlKG9wdGlvbnM6IElSZWxhdGlvbmFsVGFibGVPcHRpb25zKTogSVJlbGF0aW9uYWxUYWJsZTtcbiAgICBnZXRUYWJsZShuYW1lOiBzdHJpbmcpOiBJUmVsYXRpb25hbFRhYmxlO1xuICAgIGFkZEZvcmVpZ25rZXkobmFtZTogc3RyaW5nLCBmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25OYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uRGF0YWJhc2UgaW1wbGVtZW50cyBJUmVsYXRpb25hbERhdGFiYXNlIHtcblxuICAgIHByaXZhdGUgX3RhYmxlQ29sbGVjdGlvbjogeyBba2V5OiBzdHJpbmddOiBJUmVsYXRpb25hbFRhYmxlIH07XG4gICAgcHJpdmF0ZSBfcmVmZXJlbmNlQ291bnRlcjogbnVtYmVyO1xuICAgIHByaXZhdGUgX2R1bW15UmVjb3JkczogRHVtbXlSZWNvcmRzO1xuXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyBhIHJlbGF0aW9uYWwgZGF0YWJhc2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZUNvdW50ZXIgPSAxO1xuICAgICAgICB0aGlzLl90YWJsZUNvbGxlY3Rpb24gPSB7fTtcbiAgICAgICAgdGhpcy5fZHVtbXlSZWNvcmRzID0gbmV3IER1bW15UmVjb3JkcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSByZWZlcmVuY2Ugb2YgdGhlIGZpbGUgc3lzdGVtIGRhdGFiYXNlXG4gICAgICovXG4gICAgZ2V0UmVmZXJlbmNlKCk6IElSZWxhdGlvbmFsRGF0YWJhc2Uge1xuICAgICAgICB0aGlzLl9yZWZlcmVuY2VDb3VudGVyKys7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB0YWJsZSBpbiB0aGUgZGF0YWJhc2UuXG4gICAgICogQGZ1bmN0aW9uIGFkZFRhYmxlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAgICovXG4gICAgYWRkVGFibGUob3B0aW9uczogSVJlbGF0aW9uYWxUYWJsZU9wdGlvbnMpOiBJUmVsYXRpb25hbFRhYmxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlQ29sbGVjdGlvbltvcHRpb25zLm5hbWVdID0gbmV3IFJlbGF0aW9uYWxUYWJsZShvcHRpb25zLCB0aGlzLl9kdW1teVJlY29yZHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhIHRhYmxlIGJ5IG5hbWUuXG4gICAgICovXG4gICAgZ2V0VGFibGUobmFtZTogc3RyaW5nKTogSVJlbGF0aW9uYWxUYWJsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZUNvbGxlY3Rpb25bbmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIGZvcmVpZ24gcmVsYXRpb24gYmV0d2VlbiB0d28gdGFibGVzLlxuICAgICAqL1xuICAgIGFkZEZvcmVpZ25rZXkobmFtZTogc3RyaW5nLCBmb3JlaWduS2V5OiBzdHJpbmcsIGZvcmVpZ25OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgLy8gQ29uc3RyYWludHNcbiAgICAgICAgY29uc3QgdGFibGUgPSB0aGlzLl90YWJsZUNvbGxlY3Rpb25bbmFtZV07XG4gICAgICAgIGlmICghdGFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIHRhYmxlOiAnICsgbmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JlaWduVGFibGUgPSB0aGlzLl90YWJsZUNvbGxlY3Rpb25bZm9yZWlnbk5hbWVdO1xuICAgICAgICBpZiAoIWZvcmVpZ25UYWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgZm9yZWlnbiB0YWJsZTogJyArIGZvcmVpZ25OYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYmxlLmFkZEZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5LCBmb3JlaWduVGFibGUpO1xuICAgICAgICBmb3JlaWduVGFibGUuYWRkUmV2ZXJzZUZvcmVpZ25SZWxhdGlvbihmb3JlaWduS2V5LCB0YWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveXMgZGF0YWJhc2VcbiAgICAgKi9cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZWZlcmVuY2VDb3VudGVyLS07XG4gICAgICAgIGlmICh0aGlzLl9yZWZlcmVuY2VDb3VudGVyID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gdGhpcy5fdGFibGVDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlQ29sbGVjdGlvbi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZSA9IHRoaXMuX3RhYmxlQ29sbGVjdGlvbltrXTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RhYmxlQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19