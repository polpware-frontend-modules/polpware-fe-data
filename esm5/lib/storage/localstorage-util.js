/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Provides type-safety operations of manipulating LocalStorage data.
 * @name LocalStorageUtil.js
 * @module hypercom/storage/LocalStorageUtil
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as externalInterface from '@polpware/fe-dependencies';
// as polyfill for localstorage
// Do NOT use the LocalStorage as there is global variable which cannot be resolved
// and which is defined only in TINYMCE.
// import * as localStorage from 'polpware-tinymce-tailor/src/util/LocalStorage.js';
/** @type {?} */
var globalLocalStorage = window.localStorage;
import { defaultValue, tyArray, ok as isType } from '@polpware/fe-utilities';
/** @type {?} */
var _ = externalInterface.underscore;
/** @type {?} */
var find = _.find;
/** @type {?} */
var findIndex = _.findIndex;
/** @type {?} */
var union = _.union;
/**
 * @record
 */
export function IEntity() { }
if (false) {
    /** @type {?} */
    IEntity.prototype.Id;
}
/**
 * Reads the value of an entity by its key.
 * @param {?} key
 * @param {?} ty
 * @return {?}
 */
export function getEntity(key, ty) {
    /** @type {?} */
    var data = defaultValue(ty);
    try {
        /** @type {?} */
        var tmp = globalLocalStorage.getItem(key);
        if (tmp && tmp !== 'undefined') {
            tmp = JSON.parse(tmp);
            if (isType(tmp, ty)) {
                data = tmp;
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return data;
}
/**
 * Updates the value of an entity by its key.
 * @param {?} key
 * @param {?} data
 * @param {?=} ty
 * @return {?}
 */
export function updateEntity(key, data, ty) {
    if (ty === void 0) { ty = null; }
    try {
        globalLocalStorage.setItem(key, JSON.stringify(data));
    }
    catch (ex) {
        console.log(ex);
    }
}
/**
 * Cleans the value of an entity by its key.
 * @param {?} key
 * @param {?} ty
 * @return {?}
 */
export function cleanEntity(key, ty) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(defaultValue(ty)));
    }
    catch (ex) {
        console.log(ex);
    }
}
/**
 * Inserts the given data into the value of an entity of type array.
 * Note that the inserted data should be disjoint with the current data
 * stored in this entity. Otherwise, the behavior may be undefined.
 * @param {?} key
 * @param {?} data
 * @param {?} upperBound
 * @return {?}
 */
export function insertEntities(key, data, upperBound) {
    /** @type {?} */
    var newData = [];
    /** @type {?} */
    var currentData = (/** @type {?} */ (getEntity(key, tyArray)));
    if (upperBound > 0 && currentData.length > upperBound) {
        newData = data;
    }
    else {
        newData = union(currentData, data);
    }
    updateEntity(key, newData, tyArray);
}
/**
 * Finds one element of an entity of type array.
 * @param {?} key
 * @param {?} id
 * @return {?}
 */
export function findEntityById(key, id) {
    /** @type {?} */
    var data = (/** @type {?} */ (getEntity(key, tyArray)));
    return find(data, { Id: id });
}
/**
 * Removes an element of an entity of type array.
 * @param {?} key
 * @param {?} id
 * @return {?}
 */
export function removeEntityById(key, id) {
    /** @type {?} */
    var data = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    var index = findIndex(data, { Id: id });
    if (index === -1) {
        return;
    }
    data.splice(index, 1);
    updateEntity(key, data, tyArray);
}
/**
 * Inserts or udpates an element of an entity of type array.
 * @param {?} key
 * @param {?} entity
 * @return {?}
 */
export function insertOrUpdateEntity(key, entity) {
    /** @type {?} */
    var data = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    var index = findIndex(data, { Id: entity.Id });
    if (index !== -1) {
        data[index] = entity;
    }
    else {
        data.push(entity);
    }
    updateEntity(key, data, tyArray);
}
/**
 * Removes a group of entities by a given prefix.
 * @param {?} prefix
 * @return {?}
 */
export function cleanEntityGroup(prefix) {
    /** @type {?} */
    var keys = [];
    for (var p in globalLocalStorage) {
        if (globalLocalStorage.hasOwnProperty(p) &&
            p.indexOf(prefix) === 0) {
            keys.push(p);
        }
    }
    if (keys.length === 0) {
        return keys;
    }
    keys.forEach(function (k) {
        globalLocalStorage.removeItem(k);
    });
    return keys;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXV0aWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zdG9yYWdlL2xvY2Fsc3RvcmFnZS11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7Ozs7O0lBTXpELGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZO0FBRTlDLE9BQU8sRUFDSCxZQUFZLEVBRVosT0FBTyxFQUNQLEVBQUUsSUFBSSxNQUFNLEVBQ2YsTUFBTSx3QkFBd0IsQ0FBQzs7SUFFMUIsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFVBQVU7O0lBQ2xDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTs7SUFDYixTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVM7O0lBQ3ZCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSzs7OztBQUVuQiw2QkFFQzs7O0lBREcscUJBQVE7Ozs7Ozs7O0FBV1osTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFXLEVBQUUsRUFBWTs7UUFDM0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUM7SUFDM0IsSUFBSTs7WUFDSSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUN6QyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO1lBQzVCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDakIsSUFBSSxHQUFHLEdBQUcsQ0FBQzthQUNkO1NBQ0o7S0FDSjtJQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNuQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7Ozs7Ozs7O0FB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Q0FBQyxJQUFJLGtCQUFrQixFQUFFO1FBQ2hDLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO0tBQ0o7SUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztRQUNuQixrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyB0eXBlLXNhZmV0eSBvcGVyYXRpb25zIG9mIG1hbmlwdWxhdGluZyBMb2NhbFN0b3JhZ2UgZGF0YS5cbiAqIEBuYW1lIExvY2FsU3RvcmFnZVV0aWwuanNcbiAqIEBtb2R1bGUgaHlwZXJjb20vc3RvcmFnZS9Mb2NhbFN0b3JhZ2VVdGlsXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5pbXBvcnQgKiBhcyBleHRlcm5hbEludGVyZmFjZSBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcbi8vIGFzIHBvbHlmaWxsIGZvciBsb2NhbHN0b3JhZ2Vcbi8vIERvIE5PVCB1c2UgdGhlIExvY2FsU3RvcmFnZSBhcyB0aGVyZSBpcyBnbG9iYWwgdmFyaWFibGUgd2hpY2ggY2Fubm90IGJlIHJlc29sdmVkXG4vLyBhbmQgd2hpY2ggaXMgZGVmaW5lZCBvbmx5IGluIFRJTllNQ0UuXG4vLyBpbXBvcnQgKiBhcyBsb2NhbFN0b3JhZ2UgZnJvbSAncG9scHdhcmUtdGlueW1jZS10YWlsb3Ivc3JjL3V0aWwvTG9jYWxTdG9yYWdlLmpzJztcblxuY29uc3QgZ2xvYmFsTG9jYWxTdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcblxuaW1wb3J0IHtcbiAgICBkZWZhdWx0VmFsdWUsXG4gICAgSVR5cGVEZWYsXG4gICAgdHlBcnJheSxcbiAgICBvayBhcyBpc1R5cGVcbn0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmNvbnN0IF8gPSBleHRlcm5hbEludGVyZmFjZS51bmRlcnNjb3JlLFxuICAgIGZpbmQgPSBfLmZpbmQsXG4gICAgZmluZEluZGV4ID0gXy5maW5kSW5kZXgsXG4gICAgdW5pb24gPSBfLnVuaW9uO1xuXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHkge1xuICAgIElkOiBhbnk7XG59XG5cbi8qKlxuICogUmVhZHMgdGhlIHZhbHVlIG9mIGFuIGVudGl0eSBieSBpdHMga2V5LlxuICogQGZ1bmN0aW9uIGdldEVudGl0eVxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7Kn0gdHkgVGhlIHR5cGUgb2YgdGhlIGVudGl0eSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBUaGUgZW50aXR5IHZhbHVlLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnRpdHkoa2V5OiBzdHJpbmcsIHR5OiBJVHlwZURlZik6IGFueSB7XG4gICAgbGV0IGRhdGEgPSBkZWZhdWx0VmFsdWUodHkpO1xuICAgIHRyeSB7XG4gICAgICAgIGxldCB0bXAgPSBnbG9iYWxMb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBpZiAodG1wICYmIHRtcCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRtcCA9IEpTT04ucGFyc2UodG1wKTtcbiAgICAgICAgICAgIGlmIChpc1R5cGUodG1wLCB0eSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cbi8qKlxuICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgYW4gZW50aXR5IGJ5IGl0cyBrZXkuXG4gKiBAZnVuY3Rpb24gdXBkYXRlRW50aXR5XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHsqfSBkYXRhIFRoZSBuZXcgdmFsdWUgdG8gYmUgcmVwbGFjZWQgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gdHkgVGhlIHR5cGUgb2YgdGhlIGVudGl0eSB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUVudGl0eShrZXk6IHN0cmluZywgZGF0YTogYW55LCB0eTogSVR5cGVEZWYgPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsTG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgIH1cbn1cbi8qKlxuICogQ2xlYW5zIHRoZSB2YWx1ZSBvZiBhbiBlbnRpdHkgYnkgaXRzIGtleS5cbiAqIEBmdW5jdGlvbiBjbGVhbkVudGl0eVxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7Kn0gdHkgVGhlIHR5cGUgb2YgdGhlIGVudGl0eSB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuRW50aXR5KGtleTogc3RyaW5nLCB0eTogSVR5cGVEZWYpIHtcbiAgICB0cnkge1xuICAgICAgICBnbG9iYWxMb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRlZmF1bHRWYWx1ZSh0eSkpKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmxvZyhleCk7XG4gICAgfVxufVxuLyoqXG4gKiBJbnNlcnRzIHRoZSBnaXZlbiBkYXRhIGludG8gdGhlIHZhbHVlIG9mIGFuIGVudGl0eSBvZiB0eXBlIGFycmF5LlxuICogTm90ZSB0aGF0IHRoZSBpbnNlcnRlZCBkYXRhIHNob3VsZCBiZSBkaXNqb2ludCB3aXRoIHRoZSBjdXJyZW50IGRhdGFcbiAqIHN0b3JlZCBpbiB0aGlzIGVudGl0eS4gT3RoZXJ3aXNlLCB0aGUgYmVoYXZpb3IgbWF5IGJlIHVuZGVmaW5lZC5cbiAqIEBmdW5jdGlvbiBpbnNlcnRFbnRpdGllc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgVGhlIHZhbHVlIHRvIGJlIGluc2VydGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IHVwcGVyQm91bmQgVGhlIG1heCBudW1iZXIgb2YgZWxlbWVudHMgYWxsb3dzIGZvciB0aGlzIGVudGl0eSB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEVudGl0aWVzKGtleTogc3RyaW5nLCBkYXRhOiBBcnJheTxJRW50aXR5PiwgdXBwZXJCb3VuZDogbnVtYmVyKSB7XG4gICAgbGV0IG5ld0RhdGEgPSBbXTtcbiAgICBjb25zdCBjdXJyZW50RGF0YSA9IGdldEVudGl0eShrZXksIHR5QXJyYXkpIGFzIEFycmF5PElFbnRpdHk+O1xuICAgIGlmICh1cHBlckJvdW5kID4gMCAmJiBjdXJyZW50RGF0YS5sZW5ndGggPiB1cHBlckJvdW5kKSB7XG4gICAgICAgIG5ld0RhdGEgPSBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0RhdGEgPSB1bmlvbihjdXJyZW50RGF0YSwgZGF0YSk7XG4gICAgfVxuICAgIHVwZGF0ZUVudGl0eShrZXksIG5ld0RhdGEsIHR5QXJyYXkpO1xufVxuLyoqXG4gKiBGaW5kcyBvbmUgZWxlbWVudCBvZiBhbiBlbnRpdHkgb2YgdHlwZSBhcnJheS5cbiAqIEBmdW5jdGlvbiBmaW5kRW50aXR5QnlJZFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgaWRlbnRpZmllciB2YWx1ZS4gQW4gSWQgZmllbGQgaXMgYXNzdW1lZCBmb3IgZWFjaCBlbGVtZW50LlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSBvZiB0aGUgZm91bmQgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFbnRpdHlCeUlkKGtleTogc3RyaW5nLCBpZCk6IElFbnRpdHkge1xuICAgIGNvbnN0IGRhdGEgPSBnZXRFbnRpdHkoa2V5LCB0eUFycmF5KSBhcyBBcnJheTxJRW50aXR5PjtcbiAgICByZXR1cm4gZmluZChkYXRhLCB7IElkOiBpZCB9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFuIGVsZW1lbnQgb2YgYW4gZW50aXR5IG9mIHR5cGUgYXJyYXkuXG4gKiBAZnVuY3Rpb24gcmVtb3ZlRW50aXR5QnlJZFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgaWRlbnRpZmllciB2YWx1ZSBmb3IgdGhlIGVsZW1lbnQgdG8gYmUgcmVtb3ZlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUVudGl0eUJ5SWQoa2V5OiBzdHJpbmcsIGlkKSB7XG4gICAgY29uc3QgZGF0YSA9IGdldEVudGl0eShrZXksIHR5QXJyYXkpIGFzIEFycmF5PElFbnRpdHk+O1xuICAgIGNvbnN0IGluZGV4ID0gZmluZEluZGV4KGRhdGEsIHsgSWQ6IGlkIH0pO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgdXBkYXRlRW50aXR5KGtleSwgZGF0YSwgdHlBcnJheSk7XG59XG4vKipcbiAqIEluc2VydHMgb3IgdWRwYXRlcyBhbiBlbGVtZW50IG9mIGFuIGVudGl0eSBvZiB0eXBlIGFycmF5LlxuICogQGZ1bmN0aW9uIGluc2VydE9yVXBkYXRlRW50aXR5XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHtBcnJheX0gZW50aXR5IFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVudGl0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydE9yVXBkYXRlRW50aXR5KGtleTogc3RyaW5nLCBlbnRpdHk6IElFbnRpdHkpIHtcbiAgICBjb25zdCBkYXRhID0gZ2V0RW50aXR5KGtleSwgdHlBcnJheSkgYXMgQXJyYXk8SUVudGl0eT47XG4gICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXgoZGF0YSwgeyBJZDogZW50aXR5LklkIH0pO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgZGF0YVtpbmRleF0gPSBlbnRpdHk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YS5wdXNoKGVudGl0eSk7XG4gICAgfVxuICAgIHVwZGF0ZUVudGl0eShrZXksIGRhdGEsIHR5QXJyYXkpO1xufVxuLyoqXG4gKiBSZW1vdmVzIGEgZ3JvdXAgb2YgZW50aXRpZXMgYnkgYSBnaXZlbiBwcmVmaXguXG4gKiBAZnVuY3Rpb24gY2xlYW5FbnRpdHlHcm91cFxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeCBUaGUgcHJlZml4IG9mIHRoZSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byBiZSByZW1vdmVkLiBXZSBvcmdhbml6ZSBlbnRpdGllcyBzb21ld2hhdCBoaXJhcmNobHkuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuRW50aXR5R3JvdXAocHJlZml4OiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBjb25zdCBrZXlzID0gW107XG4gICAgZm9yIChjb25zdCBwIGluIGdsb2JhbExvY2FsU3RvcmFnZSkge1xuICAgICAgICBpZiAoZ2xvYmFsTG9jYWxTdG9yYWdlLmhhc093blByb3BlcnR5KHApICYmXG4gICAgICAgICAgICBwLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAga2V5cy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgZ2xvYmFsTG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oayk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGtleXM7XG59XG4iXX0=