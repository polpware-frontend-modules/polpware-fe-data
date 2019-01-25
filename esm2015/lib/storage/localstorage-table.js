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
export class LocalStorageTable {
    /**
     * Gets the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    getP(key) {
        /** @type {?} */
        const data = localStorageUtil.getEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(data, null);
    }
    /**
     * Removes the key from the keychain.
     * @throws {Error}
     * @param {?} key
     * @return {?}
     */
    removeP(key) {
        localStorageUtil.cleanEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
    /**
     * Updates the value for the given key.
     * @throws {Error}
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    updateP(key, value) {
        localStorageUtil.updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXRhYmxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZS9sb2NhbHN0b3JhZ2UtdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVVBLE9BQU8sS0FBSyxZQUFZLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQsT0FBTyxLQUFLLGdCQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBS3hELE1BQU0sT0FBTyxpQkFBaUI7Ozs7Ozs7SUFTMUIsSUFBSSxDQUFDLEdBQVc7O2NBQ04sSUFBSSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUNuRSxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7Ozs7SUFTRCxPQUFPLENBQUMsR0FBVztRQUNmLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQzs7Ozs7Ozs7SUFTRCxPQUFPLENBQUMsR0FBVyxFQUFFLEtBQWE7UUFDOUIsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBFbmNhcHN1bGF0ZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugc2VydmljZSBpbnRvIG9uZVxuICogcHJvdmlkaW5nIHBybW9pc2UtYXdhcmUgc2VydmljZXMuXG4gKiBAbmFtZSBMb2NhbFN0b3JhZ2VUYWJsZS5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS9zdG9yYWdlL0xvY2FsU3RvcmFnZVRhYmxlXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5cbmltcG9ydCAqIGFzIHBvbHB3YXJlVXRpbCBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0ICogYXMgbG9jYWxTdG9yYWdlVXRpbCBmcm9tICcuL2xvY2Fsc3RvcmFnZS11dGlsJztcblxuLyoqXG4gKiBAY2xhc3MgTG9jYWxTdG9yYWdlVGFibGVcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZVRhYmxlIHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBmdW5jdGlvbiBnZXRQXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIHNlYXJjaGVkIGZvci5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICBnZXRQKGtleTogc3RyaW5nKTogUHJvbWlzZUxpa2U8b2JqZWN0PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBsb2NhbFN0b3JhZ2VVdGlsLmdldEVudGl0eShrZXksIHBvbHB3YXJlVXRpbC50eU9iamVjdCk7XG4gICAgICAgIHJldHVybiBwb2xwd2FyZVV0aWwubGlmdChkYXRhLCBudWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBrZXkgZnJvbSB0aGUga2V5Y2hhaW4uXG4gICAgICogQGZ1bmN0aW9uIHJlbW92ZVBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICByZW1vdmVQKGtleTogc3RyaW5nKTogUHJvbWlzZUxpa2U8Ym9vbGVhbj4ge1xuICAgICAgICBsb2NhbFN0b3JhZ2VVdGlsLmNsZWFuRW50aXR5KGtleSwgcG9scHdhcmVVdGlsLnR5T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHBvbHB3YXJlVXRpbC5saWZ0KHRydWUsIG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBiZSBzZWFyY2hlZCBmb3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBuZXcgdmFsdWUuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgdXBkYXRlUChrZXk6IHN0cmluZywgdmFsdWU6IG9iamVjdCk6IFByb21pc2VMaWtlPGJvb2xlYW4+IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlVXRpbC51cGRhdGVFbnRpdHkoa2V5LCB2YWx1ZSwgcG9scHdhcmVVdGlsLnR5T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHBvbHB3YXJlVXRpbC5saWZ0KHRydWUsIG51bGwpO1xuICAgIH1cblxufVxuIl19