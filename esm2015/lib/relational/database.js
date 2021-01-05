/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */
import { RelationalTable } from './table';
import { DummyRecords } from './dummy-records';
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
     */
    getReference() {
        this._referenceCounter++;
        return this;
    }
    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    addTable(options) {
        return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
    }
    /**
     * Retrieves a table by name.
     */
    getTable(name) {
        return this._tableCollection[name];
    }
    /**
     * Defines a foreign relation between two tables.
     */
    addForeignkey(name, foreignKey, foreignName) {
        // Constraints
        const table = this._tableCollection[name];
        if (!table) {
            throw new Error('Undefined table: ' + name);
        }
        const foreignTable = this._tableCollection[foreignName];
        if (!foreignTable) {
            throw new Error('Undefined foreign table: ' + foreignName);
        }
        table.addForeignRelation(foreignKey, foreignTable);
        foreignTable.addReverseForeignRelation(foreignKey, table);
    }
    /**
     * Destroys database
     */
    destroy() {
        this._referenceCounter--;
        if (this._referenceCounter === 0) {
            for (const k in this._tableCollection) {
                if (this._tableCollection.hasOwnProperty(k)) {
                    const table = this._tableCollection[k];
                    table.destroy();
                }
            }
            this._tableCollection = {};
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbmFsL2RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFJSCxPQUFPLEVBQTZDLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFVL0MsTUFBTSxPQUFPLGdCQUFnQjtJQU16Qjs7T0FFRztJQUNIO1FBQ0ksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxZQUFZO1FBQ1IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxRQUFRLENBQUMsT0FBZ0M7UUFDckMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFDLElBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsYUFBYSxDQUFDLElBQVksRUFBRSxVQUFrQixFQUFFLFdBQW1CO1FBQy9ELGNBQWM7UUFDZCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsRUFBRTtZQUM5QixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbkI7YUFDSjtZQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7U0FDOUI7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgYSByZWxhdGlvbmFsIGRhdGFiYXNlIHdoaWNoIHN1cHBvcnRzIGZvcmVpZ24ga2V5cyBhbmQgcHJpbWFyeSBrZXlzLlxuICogQWxzbyB0aGlzIGRhdGFiYXNlIHN1cHBvcnQgY2FzY2FkaW5nIGRlbGV0aW9uIGFuZCBhZGRpdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IElSZWxhdGlvbmFsVGFibGVPcHRpb25zLCBJUmVsYXRpb25hbFRhYmxlLCBSZWxhdGlvbmFsVGFibGUgfSBmcm9tICcuL3RhYmxlJztcbmltcG9ydCB7IER1bW15UmVjb3JkcyB9IGZyb20gJy4vZHVtbXktcmVjb3Jkcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlbGF0aW9uYWxEYXRhYmFzZSB7XG4gICAgZ2V0UmVmZXJlbmNlKCk6IElSZWxhdGlvbmFsRGF0YWJhc2U7XG4gICAgYWRkVGFibGUob3B0aW9uczogSVJlbGF0aW9uYWxUYWJsZU9wdGlvbnMpOiBJUmVsYXRpb25hbFRhYmxlO1xuICAgIGdldFRhYmxlKG5hbWU6IHN0cmluZyk6IElSZWxhdGlvbmFsVGFibGU7XG4gICAgYWRkRm9yZWlnbmtleShuYW1lOiBzdHJpbmcsIGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnbk5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gICAgZGVzdHJveSgpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUmVsYXRpb25EYXRhYmFzZSBpbXBsZW1lbnRzIElSZWxhdGlvbmFsRGF0YWJhc2Uge1xuXG4gICAgcHJpdmF0ZSBfdGFibGVDb2xsZWN0aW9uOiB7IFtrZXk6IHN0cmluZ106IElSZWxhdGlvbmFsVGFibGUgfTtcbiAgICBwcml2YXRlIF9yZWZlcmVuY2VDb3VudGVyOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfZHVtbXlSZWNvcmRzOiBEdW1teVJlY29yZHM7XG5cbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIGEgcmVsYXRpb25hbCBkYXRhYmFzZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcmVmZXJlbmNlQ291bnRlciA9IDE7XG4gICAgICAgIHRoaXMuX3RhYmxlQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgICB0aGlzLl9kdW1teVJlY29yZHMgPSBuZXcgRHVtbXlSZWNvcmRzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHJlZmVyZW5jZSBvZiB0aGUgZmlsZSBzeXN0ZW0gZGF0YWJhc2VcbiAgICAgKi9cbiAgICBnZXRSZWZlcmVuY2UoKTogSVJlbGF0aW9uYWxEYXRhYmFzZSB7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZUNvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIHRhYmxlIGluIHRoZSBkYXRhYmFzZS5cbiAgICAgKiBAZnVuY3Rpb24gYWRkVGFibGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgKi9cbiAgICBhZGRUYWJsZShvcHRpb25zOiBJUmVsYXRpb25hbFRhYmxlT3B0aW9ucyk6IElSZWxhdGlvbmFsVGFibGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFibGVDb2xsZWN0aW9uW29wdGlvbnMubmFtZV0gPSBuZXcgUmVsYXRpb25hbFRhYmxlKG9wdGlvbnMsIHRoaXMuX2R1bW15UmVjb3Jkcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGEgdGFibGUgYnkgbmFtZS5cbiAgICAgKi9cbiAgICBnZXRUYWJsZShuYW1lOiBzdHJpbmcpOiBJUmVsYXRpb25hbFRhYmxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlQ29sbGVjdGlvbltuYW1lXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGEgZm9yZWlnbiByZWxhdGlvbiBiZXR3ZWVuIHR3byB0YWJsZXMuXG4gICAgICovXG4gICAgYWRkRm9yZWlnbmtleShuYW1lOiBzdHJpbmcsIGZvcmVpZ25LZXk6IHN0cmluZywgZm9yZWlnbk5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyBDb25zdHJhaW50c1xuICAgICAgICBjb25zdCB0YWJsZSA9IHRoaXMuX3RhYmxlQ29sbGVjdGlvbltuYW1lXTtcbiAgICAgICAgaWYgKCF0YWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgdGFibGU6ICcgKyBuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcmVpZ25UYWJsZSA9IHRoaXMuX3RhYmxlQ29sbGVjdGlvbltmb3JlaWduTmFtZV07XG4gICAgICAgIGlmICghZm9yZWlnblRhYmxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBmb3JlaWduIHRhYmxlOiAnICsgZm9yZWlnbk5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFibGUuYWRkRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXksIGZvcmVpZ25UYWJsZSk7XG4gICAgICAgIGZvcmVpZ25UYWJsZS5hZGRSZXZlcnNlRm9yZWlnblJlbGF0aW9uKGZvcmVpZ25LZXksIHRhYmxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyBkYXRhYmFzZVxuICAgICAqL1xuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZUNvdW50ZXItLTtcbiAgICAgICAgaWYgKHRoaXMuX3JlZmVyZW5jZUNvdW50ZXIgPT09IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBpbiB0aGlzLl90YWJsZUNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGFibGVDb2xsZWN0aW9uLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlID0gdGhpcy5fdGFibGVDb2xsZWN0aW9uW2tdO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdGFibGVDb2xsZWN0aW9uID0ge307XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=