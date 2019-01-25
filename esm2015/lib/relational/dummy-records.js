/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
const backbone = dependencies.backbone;
export class DummyRecords {
    constructor() {
        this._data = {};
    }
    /**
     * @param {?} key
     * @return {?}
     */
    getDummyRecord(key) {
        if (!this._data[key]) {
            this._data[key] = new backbone.Model({});
        }
        return this._data[key];
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    DummyRecords.prototype._data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktcmVjb3Jkcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3JlbGF0aW9uYWwvZHVtbXktcmVjb3Jkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUlBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7O01BSXBELFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUTtBQUV0QyxNQUFNLE9BQU8sWUFBWTtJQUlyQjtRQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRUQsY0FBYyxDQUFDLEdBQVc7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKOzs7Ozs7SUFaRyw2QkFBNkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgYSBnbG9iYWwgZHVtbXkgcmVjb3JkcyBmb3IgdGFibGVzLiBFYWNoIHRhYmxlIGlzIGNvbmZpZ3VyZWQgd2l0aCBhIGR1bW15IHJlY29yZC5cbiAqL1xuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBJTW9kZWxMaWtlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9iYWNrYm9uZS5pbnRlcmZhY2UnO1xuXG5jb25zdCBiYWNrYm9uZSA9IGRlcGVuZGVuY2llcy5iYWNrYm9uZTtcblxuZXhwb3J0IGNsYXNzIER1bW15UmVjb3JkcyB7XG5cbiAgICBwcml2YXRlIF9kYXRhOiB7IFtrZXk6IHN0cmluZ106IElNb2RlbExpa2UgfTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgZ2V0RHVtbXlSZWNvcmQoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kYXRhW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IG5ldyBiYWNrYm9uZS5Nb2RlbCh7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICB9XG59XG4iXX0=