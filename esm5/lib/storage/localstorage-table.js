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
/**
 * @class LocalStorageTable
 */
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
    LocalStorageTable.prototype.getP = function (key) {
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
    LocalStorageTable.prototype.removeP = function (key) {
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
    LocalStorageTable.prototype.updateP = function (key, value) {
        localStorageUtil.updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    };
    return LocalStorageTable;
}());
export { LocalStorageTable };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXRhYmxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZS9sb2NhbHN0b3JhZ2UtdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLHdCQUF3QixDQUFDO0FBRXZELE9BQU8sS0FBSyxnQkFBZ0IsTUFBTSxxQkFBcUIsQ0FBQztBQUV4RDs7R0FFRztBQUNIO0lBQUE7SUFzQ0EsQ0FBQztJQXBDRzs7Ozs7O09BTUc7SUFDSCxnQ0FBSSxHQUFKLFVBQUssR0FBVztRQUNaLElBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILG1DQUFPLEdBQVAsVUFBUSxHQUFXO1FBQ2YsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsbUNBQU8sR0FBUCxVQUFRLEdBQVcsRUFBRSxLQUFhO1FBQzlCLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTCx3QkFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIEVuY2Fwc3VsYXRlcyB0aGUgbG9jYWwgc3RvcmFnZSBzZXJ2aWNlIGludG8gb25lXG4gKiBwcm92aWRpbmcgcHJtb2lzZS1hd2FyZSBzZXJ2aWNlcy5cbiAqIEBuYW1lIExvY2FsU3RvcmFnZVRhYmxlLmpzXG4gKiBAbW9kdWxlIGh5cGVyY29tL3N0b3JhZ2UvTG9jYWxTdG9yYWdlVGFibGVcbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cblxuaW1wb3J0ICogYXMgcG9scHdhcmVVdGlsIGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5pbXBvcnQgKiBhcyBsb2NhbFN0b3JhZ2VVdGlsIGZyb20gJy4vbG9jYWxzdG9yYWdlLXV0aWwnO1xuXG4vKipcbiAqIEBjbGFzcyBMb2NhbFN0b3JhZ2VUYWJsZVxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlVGFibGUge1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQGZ1bmN0aW9uIGdldFBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYmUgc2VhcmNoZWQgZm9yLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgICAqL1xuICAgIGdldFAoa2V5OiBzdHJpbmcpOiBQcm9taXNlTGlrZTxvYmplY3Q+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGxvY2FsU3RvcmFnZVV0aWwuZ2V0RW50aXR5KGtleSwgcG9scHdhcmVVdGlsLnR5T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHBvbHB3YXJlVXRpbC5saWZ0KGRhdGEsIG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGtleSBmcm9tIHRoZSBrZXljaGFpbi5cbiAgICAgKiBAZnVuY3Rpb24gcmVtb3ZlUFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBiZSByZW1vdmVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgICAqL1xuICAgIHJlbW92ZVAoa2V5OiBzdHJpbmcpOiBQcm9taXNlTGlrZTxib29sZWFuPiB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVV0aWwuY2xlYW5FbnRpdHkoa2V5LCBwb2xwd2FyZVV0aWwudHlPYmplY3QpO1xuICAgICAgICByZXR1cm4gcG9scHdhcmVVdGlsLmxpZnQodHJ1ZSwgbnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIHNlYXJjaGVkIGZvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgVGhlIG5ldyB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICB1cGRhdGVQKGtleTogc3RyaW5nLCB2YWx1ZTogb2JqZWN0KTogUHJvbWlzZUxpa2U8Ym9vbGVhbj4ge1xuICAgICAgICBsb2NhbFN0b3JhZ2VVdGlsLnVwZGF0ZUVudGl0eShrZXksIHZhbHVlLCBwb2xwd2FyZVV0aWwudHlPYmplY3QpO1xuICAgICAgICByZXR1cm4gcG9scHdhcmVVdGlsLmxpZnQodHJ1ZSwgbnVsbCk7XG4gICAgfVxuXG59XG4iXX0=