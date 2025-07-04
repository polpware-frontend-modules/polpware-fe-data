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
export class LocalStorageTable {
    /**
     * Gets the value for the given key.
     * @function getP
     * @param {String} key The key to be searched for.
     * @returns {Promise}
     * @throws {Error}
     */
    getP(key) {
        const data = localStorageUtil.getEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(data, null);
    }
    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    removeP(key) {
        localStorageUtil.cleanEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    updateP(key, value) {
        localStorageUtil.updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcG9scHdhcmUvZmUtZGF0YS9zcmMvbGliL3N0b3JhZ2UvbG9jYWxzdG9yYWdlLXRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxLQUFLLFlBQVksTUFBTSx3QkFBd0IsQ0FBQztBQUV2RCxPQUFPLEtBQUssZ0JBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFFeEQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBRTFCOzs7Ozs7T0FNRztJQUNILElBQUksQ0FBQyxHQUFXO1FBQ1osTUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEUsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsT0FBTyxDQUFDLEdBQVc7UUFDZixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxPQUFPLENBQUMsR0FBVyxFQUFFLEtBQWE7UUFDOUIsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBFbmNhcHN1bGF0ZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugc2VydmljZSBpbnRvIG9uZVxuICogcHJvdmlkaW5nIHBybW9pc2UtYXdhcmUgc2VydmljZXMuXG4gKiBAbmFtZSBMb2NhbFN0b3JhZ2VUYWJsZS5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS9zdG9yYWdlL0xvY2FsU3RvcmFnZVRhYmxlXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5cbmltcG9ydCAqIGFzIHBvbHB3YXJlVXRpbCBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0ICogYXMgbG9jYWxTdG9yYWdlVXRpbCBmcm9tICcuL2xvY2Fsc3RvcmFnZS11dGlsJztcblxuLyoqXG4gKiBAY2xhc3MgTG9jYWxTdG9yYWdlVGFibGVcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZVRhYmxlIHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBmdW5jdGlvbiBnZXRQXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIHNlYXJjaGVkIGZvci5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICBnZXRQKGtleTogc3RyaW5nKTogUHJvbWlzZUxpa2U8b2JqZWN0PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBsb2NhbFN0b3JhZ2VVdGlsLmdldEVudGl0eShrZXksIHBvbHB3YXJlVXRpbC50eU9iamVjdCk7XG4gICAgICAgIHJldHVybiBwb2xwd2FyZVV0aWwubGlmdChkYXRhLCBudWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBrZXkgZnJvbSB0aGUga2V5Y2hhaW4uXG4gICAgICogQGZ1bmN0aW9uIHJlbW92ZVBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICByZW1vdmVQKGtleTogc3RyaW5nKTogUHJvbWlzZUxpa2U8Ym9vbGVhbj4ge1xuICAgICAgICBsb2NhbFN0b3JhZ2VVdGlsLmNsZWFuRW50aXR5KGtleSwgcG9scHdhcmVVdGlsLnR5T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHBvbHB3YXJlVXRpbC5saWZ0KHRydWUsIG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBiZSBzZWFyY2hlZCBmb3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBuZXcgdmFsdWUuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgdXBkYXRlUChrZXk6IHN0cmluZywgdmFsdWU6IG9iamVjdCk6IFByb21pc2VMaWtlPGJvb2xlYW4+IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlVXRpbC51cGRhdGVFbnRpdHkoa2V5LCB2YWx1ZSwgcG9scHdhcmVVdGlsLnR5T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHBvbHB3YXJlVXRpbC5saWZ0KHRydWUsIG51bGwpO1xuICAgIH1cblxufVxuIl19