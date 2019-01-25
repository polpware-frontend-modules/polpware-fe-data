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
const globalLocalStorage = window.localStorage;
import { defaultValue, tyArray, ok as isType } from '@polpware/fe-utilities';
/** @type {?} */
const _ = externalInterface.underscore;
/** @type {?} */
const find = _.find;
/** @type {?} */
const findIndex = _.findIndex;
/** @type {?} */
const union = _.union;
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
    let data = defaultValue(ty);
    try {
        /** @type {?} */
        let tmp = globalLocalStorage.getItem(key);
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
export function updateEntity(key, data, ty = null) {
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
    let newData = [];
    /** @type {?} */
    const currentData = (/** @type {?} */ (getEntity(key, tyArray)));
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
    const data = (/** @type {?} */ (getEntity(key, tyArray)));
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
    const data = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    const index = findIndex(data, { Id: id });
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
    const data = (/** @type {?} */ (getEntity(key, tyArray)));
    /** @type {?} */
    const index = findIndex(data, { Id: entity.Id });
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
    const keys = [];
    for (const p in globalLocalStorage) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXV0aWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zdG9yYWdlL2xvY2Fsc3RvcmFnZS11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7Ozs7O01BTXpELGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZO0FBRTlDLE9BQU8sRUFDSCxZQUFZLEVBRVosT0FBTyxFQUNQLEVBQUUsSUFBSSxNQUFNLEVBQ2YsTUFBTSx3QkFBd0IsQ0FBQzs7TUFFMUIsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFVBQVU7O01BQ2xDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTs7TUFDYixTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVM7O01BQ3ZCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSzs7OztBQUVuQiw2QkFFQzs7O0lBREcscUJBQVE7Ozs7Ozs7O0FBV1osTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFXLEVBQUUsRUFBWTs7UUFDM0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUM7SUFDM0IsSUFBSTs7WUFDSSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUN6QyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO1lBQzVCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDakIsSUFBSSxHQUFHLEdBQUcsQ0FBQzthQUNkO1NBQ0o7S0FDSjtJQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNuQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7Ozs7Ozs7O0FB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QUU7UUFDaEMsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7S0FDSjtJQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1FBQ25CLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIHR5cGUtc2FmZXR5IG9wZXJhdGlvbnMgb2YgbWFuaXB1bGF0aW5nIExvY2FsU3RvcmFnZSBkYXRhLlxuICogQG5hbWUgTG9jYWxTdG9yYWdlVXRpbC5qc1xuICogQG1vZHVsZSBoeXBlcmNvbS9zdG9yYWdlL0xvY2FsU3RvcmFnZVV0aWxcbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cbmltcG9ydCAqIGFzIGV4dGVybmFsSW50ZXJmYWNlIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuLy8gYXMgcG9seWZpbGwgZm9yIGxvY2Fsc3RvcmFnZVxuLy8gRG8gTk9UIHVzZSB0aGUgTG9jYWxTdG9yYWdlIGFzIHRoZXJlIGlzIGdsb2JhbCB2YXJpYWJsZSB3aGljaCBjYW5ub3QgYmUgcmVzb2x2ZWRcbi8vIGFuZCB3aGljaCBpcyBkZWZpbmVkIG9ubHkgaW4gVElOWU1DRS5cbi8vIGltcG9ydCAqIGFzIGxvY2FsU3RvcmFnZSBmcm9tICdwb2xwd2FyZS10aW55bWNlLXRhaWxvci9zcmMvdXRpbC9Mb2NhbFN0b3JhZ2UuanMnO1xuXG5jb25zdCBnbG9iYWxMb2NhbFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG5pbXBvcnQge1xuICAgIGRlZmF1bHRWYWx1ZSxcbiAgICBJVHlwZURlZixcbiAgICB0eUFycmF5LFxuICAgIG9rIGFzIGlzVHlwZVxufSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuY29uc3QgXyA9IGV4dGVybmFsSW50ZXJmYWNlLnVuZGVyc2NvcmUsXG4gICAgZmluZCA9IF8uZmluZCxcbiAgICBmaW5kSW5kZXggPSBfLmZpbmRJbmRleCxcbiAgICB1bmlvbiA9IF8udW5pb247XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eSB7XG4gICAgSWQ6IGFueTtcbn1cblxuLyoqXG4gKiBSZWFkcyB0aGUgdmFsdWUgb2YgYW4gZW50aXR5IGJ5IGl0cyBrZXkuXG4gKiBAZnVuY3Rpb24gZ2V0RW50aXR5XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHsqfSB0eSBUaGUgdHlwZSBvZiB0aGUgZW50aXR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFRoZSBlbnRpdHkgdmFsdWUuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudGl0eShrZXk6IHN0cmluZywgdHk6IElUeXBlRGVmKTogYW55IHtcbiAgICBsZXQgZGF0YSA9IGRlZmF1bHRWYWx1ZSh0eSk7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHRtcCA9IGdsb2JhbExvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmICh0bXAgJiYgdG1wICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG1wID0gSlNPTi5wYXJzZSh0bXApO1xuICAgICAgICAgICAgaWYgKGlzVHlwZSh0bXAsIHR5KSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0bXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmxvZyhleCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuLyoqXG4gKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiBhbiBlbnRpdHkgYnkgaXRzIGtleS5cbiAqIEBmdW5jdGlvbiB1cGRhdGVFbnRpdHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0geyp9IGRhdGEgVGhlIG5ldyB2YWx1ZSB0byBiZSByZXBsYWNlZCB3aXRoLlxuICogQHBhcmFtIHsqfSB0eSBUaGUgdHlwZSBvZiB0aGUgZW50aXR5IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRW50aXR5KGtleTogc3RyaW5nLCBkYXRhOiBhbnksIHR5OiBJVHlwZURlZiA9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgICBnbG9iYWxMb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmxvZyhleCk7XG4gICAgfVxufVxuLyoqXG4gKiBDbGVhbnMgdGhlIHZhbHVlIG9mIGFuIGVudGl0eSBieSBpdHMga2V5LlxuICogQGZ1bmN0aW9uIGNsZWFuRW50aXR5XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHsqfSB0eSBUaGUgdHlwZSBvZiB0aGUgZW50aXR5IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5FbnRpdHkoa2V5OiBzdHJpbmcsIHR5OiBJVHlwZURlZikge1xuICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbExvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGVmYXVsdFZhbHVlKHR5KSkpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICB9XG59XG4vKipcbiAqIEluc2VydHMgdGhlIGdpdmVuIGRhdGEgaW50byB0aGUgdmFsdWUgb2YgYW4gZW50aXR5IG9mIHR5cGUgYXJyYXkuXG4gKiBOb3RlIHRoYXQgdGhlIGluc2VydGVkIGRhdGEgc2hvdWxkIGJlIGRpc2pvaW50IHdpdGggdGhlIGN1cnJlbnQgZGF0YVxuICogc3RvcmVkIGluIHRoaXMgZW50aXR5LiBPdGhlcndpc2UsIHRoZSBiZWhhdmlvciBtYXkgYmUgdW5kZWZpbmVkLlxuICogQGZ1bmN0aW9uIGluc2VydEVudGl0aWVzXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHtBcnJheX0gZGF0YSBUaGUgdmFsdWUgdG8gYmUgaW5zZXJ0ZWQuXG4gKiBAcGFyYW0ge051bWJlcn0gdXBwZXJCb3VuZCBUaGUgbWF4IG51bWJlciBvZiBlbGVtZW50cyBhbGxvd3MgZm9yIHRoaXMgZW50aXR5IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0RW50aXRpZXMoa2V5OiBzdHJpbmcsIGRhdGE6IEFycmF5PElFbnRpdHk+LCB1cHBlckJvdW5kOiBudW1iZXIpIHtcbiAgICBsZXQgbmV3RGF0YSA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnREYXRhID0gZ2V0RW50aXR5KGtleSwgdHlBcnJheSkgYXMgQXJyYXk8SUVudGl0eT47XG4gICAgaWYgKHVwcGVyQm91bmQgPiAwICYmIGN1cnJlbnREYXRhLmxlbmd0aCA+IHVwcGVyQm91bmQpIHtcbiAgICAgICAgbmV3RGF0YSA9IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RGF0YSA9IHVuaW9uKGN1cnJlbnREYXRhLCBkYXRhKTtcbiAgICB9XG4gICAgdXBkYXRlRW50aXR5KGtleSwgbmV3RGF0YSwgdHlBcnJheSk7XG59XG4vKipcbiAqIEZpbmRzIG9uZSBlbGVtZW50IG9mIGFuIGVudGl0eSBvZiB0eXBlIGFycmF5LlxuICogQGZ1bmN0aW9uIGZpbmRFbnRpdHlCeUlkXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBpZGVudGlmaWVyIHZhbHVlLiBBbiBJZCBmaWVsZCBpcyBhc3N1bWVkIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlIG9mIHRoZSBmb3VuZCBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEVudGl0eUJ5SWQoa2V5OiBzdHJpbmcsIGlkKTogSUVudGl0eSB7XG4gICAgY29uc3QgZGF0YSA9IGdldEVudGl0eShrZXksIHR5QXJyYXkpIGFzIEFycmF5PElFbnRpdHk+O1xuICAgIHJldHVybiBmaW5kKGRhdGEsIHsgSWQ6IGlkIH0pO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYW4gZWxlbWVudCBvZiBhbiBlbnRpdHkgb2YgdHlwZSBhcnJheS5cbiAqIEBmdW5jdGlvbiByZW1vdmVFbnRpdHlCeUlkXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBlbnRpdHkga2V5LlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBpZGVudGlmaWVyIHZhbHVlIGZvciB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRW50aXR5QnlJZChrZXk6IHN0cmluZywgaWQpIHtcbiAgICBjb25zdCBkYXRhID0gZ2V0RW50aXR5KGtleSwgdHlBcnJheSkgYXMgQXJyYXk8SUVudGl0eT47XG4gICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXgoZGF0YSwgeyBJZDogaWQgfSk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB1cGRhdGVFbnRpdHkoa2V5LCBkYXRhLCB0eUFycmF5KTtcbn1cbi8qKlxuICogSW5zZXJ0cyBvciB1ZHBhdGVzIGFuIGVsZW1lbnQgb2YgYW4gZW50aXR5IG9mIHR5cGUgYXJyYXkuXG4gKiBAZnVuY3Rpb24gaW5zZXJ0T3JVcGRhdGVFbnRpdHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0ge0FycmF5fSBlbnRpdHkgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZW50aXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0T3JVcGRhdGVFbnRpdHkoa2V5OiBzdHJpbmcsIGVudGl0eTogSUVudGl0eSkge1xuICAgIGNvbnN0IGRhdGEgPSBnZXRFbnRpdHkoa2V5LCB0eUFycmF5KSBhcyBBcnJheTxJRW50aXR5PjtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbmRleChkYXRhLCB7IElkOiBlbnRpdHkuSWQgfSk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBkYXRhW2luZGV4XSA9IGVudGl0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhLnB1c2goZW50aXR5KTtcbiAgICB9XG4gICAgdXBkYXRlRW50aXR5KGtleSwgZGF0YSwgdHlBcnJheSk7XG59XG4vKipcbiAqIFJlbW92ZXMgYSBncm91cCBvZiBlbnRpdGllcyBieSBhIGdpdmVuIHByZWZpeC5cbiAqIEBmdW5jdGlvbiBjbGVhbkVudGl0eUdyb3VwXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IFRoZSBwcmVmaXggb2YgdGhlIGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIGJlIHJlbW92ZWQuIFdlIG9yZ2FuaXplIGVudGl0aWVzIHNvbWV3aGF0IGhpcmFyY2hseS5cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5FbnRpdHlHcm91cChwcmVmaXg6IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHAgaW4gZ2xvYmFsTG9jYWxTdG9yYWdlKSB7XG4gICAgICAgIGlmIChnbG9iYWxMb2NhbFN0b3JhZ2UuaGFzT3duUHJvcGVydHkocCkgJiZcbiAgICAgICAgICAgIHAuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICBnbG9iYWxMb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrKTtcbiAgICB9KTtcbiAgICByZXR1cm4ga2V5cztcbn1cbiJdfQ==