/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Encapsulates the local storage service into one
 * providing prmoise-aware services.
 * @name LocalStorageTable.js
 * @module hypercom/storage/LocalStorageTable
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as polpwareUtil from '@polpware/fe-utilities';
import * as localStorageUtil from './localstorage-util';
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
    /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    LocalStorageTable.prototype.getP = /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var data = localStorageUtil.getEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(data, null);
    };
    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    LocalStorageTable.prototype.removeP = /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    function (key) {
        localStorageUtil.cleanEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    };
    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    LocalStorageTable.prototype.updateP = /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        localStorageUtil.updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    };
    return LocalStorageTable;
}());
export { LocalStorageTable };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXRhYmxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZS9sb2NhbHN0b3JhZ2UtdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVVBLE9BQU8sS0FBSyxZQUFZLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQsT0FBTyxLQUFLLGdCQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBS3hEO0lBQUE7SUFzQ0EsQ0FBQztJQXBDRzs7Ozs7O09BTUc7Ozs7Ozs7SUFDSCxnQ0FBSTs7Ozs7O0lBQUosVUFBSyxHQUFXOztZQUNOLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDbkUsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7OztPQU1HOzs7Ozs7O0lBQ0gsbUNBQU87Ozs7OztJQUFQLFVBQVEsR0FBVztRQUNmLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7T0FNRzs7Ozs7Ozs7SUFDSCxtQ0FBTzs7Ozs7OztJQUFQLFVBQVEsR0FBVyxFQUFFLEtBQWE7UUFDOUIsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVMLHdCQUFDO0FBQUQsQ0FBQyxBQXRDRCxJQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRW5jYXBzdWxhdGVzIHRoZSBsb2NhbCBzdG9yYWdlIHNlcnZpY2UgaW50byBvbmVcbiAqIHByb3ZpZGluZyBwcm1vaXNlLWF3YXJlIHNlcnZpY2VzLlxuICogQG5hbWUgTG9jYWxTdG9yYWdlVGFibGUuanNcbiAqIEBtb2R1bGUgaHlwZXJjb20vc3RvcmFnZS9Mb2NhbFN0b3JhZ2VUYWJsZVxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuXG5pbXBvcnQgKiBhcyBwb2xwd2FyZVV0aWwgZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmltcG9ydCAqIGFzIGxvY2FsU3RvcmFnZVV0aWwgZnJvbSAnLi9sb2NhbHN0b3JhZ2UtdXRpbCc7XG5cbi8qKlxuICogQGNsYXNzIExvY2FsU3RvcmFnZVRhYmxlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VUYWJsZSB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleS5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0UFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBiZSBzZWFyY2hlZCBmb3IuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgZ2V0UChrZXk6IHN0cmluZyk6IFByb21pc2VMaWtlPG9iamVjdD4ge1xuICAgICAgICBjb25zdCBkYXRhID0gbG9jYWxTdG9yYWdlVXRpbC5nZXRFbnRpdHkoa2V5LCBwb2xwd2FyZVV0aWwudHlPYmplY3QpO1xuICAgICAgICByZXR1cm4gcG9scHdhcmVVdGlsLmxpZnQoZGF0YSwgbnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUga2V5IGZyb20gdGhlIGtleWNoYWluLlxuICAgICAqIEBmdW5jdGlvbiByZW1vdmVQXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIHJlbW92ZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgcmVtb3ZlUChrZXk6IHN0cmluZyk6IFByb21pc2VMaWtlPGJvb2xlYW4+IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlVXRpbC5jbGVhbkVudGl0eShrZXksIHBvbHB3YXJlVXRpbC50eU9iamVjdCk7XG4gICAgICAgIHJldHVybiBwb2xwd2FyZVV0aWwubGlmdCh0cnVlLCBudWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYmUgc2VhcmNoZWQgZm9yLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgbmV3IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgICAqL1xuICAgIHVwZGF0ZVAoa2V5OiBzdHJpbmcsIHZhbHVlOiBvYmplY3QpOiBQcm9taXNlTGlrZTxib29sZWFuPiB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVV0aWwudXBkYXRlRW50aXR5KGtleSwgdmFsdWUsIHBvbHB3YXJlVXRpbC50eU9iamVjdCk7XG4gICAgICAgIHJldHVybiBwb2xwd2FyZVV0aWwubGlmdCh0cnVlLCBudWxsKTtcbiAgICB9XG5cbn1cbiJdfQ==