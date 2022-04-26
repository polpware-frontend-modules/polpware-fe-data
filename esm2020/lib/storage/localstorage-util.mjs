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
const globalLocalStorage = window.localStorage;
import { defaultValue, tyArray, ok as isType } from '@polpware/fe-utilities';
const _ = externalInterface.underscore, find = _.find, findIndex = _.findIndex, union = _.union;
/**
 * Reads the value of an entity by its key.
 * @function getEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 * @returns {*} The entity value.
 */
export function getEntity(key, ty) {
    let data = defaultValue(ty);
    try {
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
 * @function updateEntity
 * @param {String} key The entity key.
 * @param {*} data The new value to be replaced with.
 * @param {*} ty The type of the entity value.
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
 * @function cleanEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
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
 * @function insertEntities
 * @param {String} key The entity key.
 * @param {Array} data The value to be inserted.
 * @param {Number} upperBound The max number of elements allows for this entity value.
 */
export function insertEntities(key, data, upperBound) {
    let newData = [];
    const currentData = getEntity(key, tyArray);
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
 * @function findEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value. An Id field is assumed for each element.
 * @returns {*} The value of the found element.
 */
export function findEntityById(key, id) {
    const data = getEntity(key, tyArray);
    return find(data, { Id: id });
}
/**
 * Removes an element of an entity of type array.
 * @function removeEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value for the element to be removed.
 */
export function removeEntityById(key, id) {
    const data = getEntity(key, tyArray);
    const index = findIndex(data, { Id: id });
    if (index === -1) {
        return;
    }
    data.splice(index, 1);
    updateEntity(key, data, tyArray);
}
/**
 * Inserts or udpates an element of an entity of type array.
 * @function insertOrUpdateEntity
 * @param {String} key The entity key.
 * @param {Array} entity The new value of the entity.
 */
export function insertOrUpdateEntity(key, entity) {
    const data = getEntity(key, tyArray);
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
 * @function cleanEntityGroup
 * @param {String} prefix The prefix of the keys of the entities to be removed. We organize entities somewhat hirarchly.
 * @returns {Boolean}
 */
export function cleanEntityGroup(prefix) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLXV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvc3RvcmFnZS9sb2NhbHN0b3JhZ2UtdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDO0FBQy9ELCtCQUErQjtBQUMvQixtRkFBbUY7QUFDbkYsd0NBQXdDO0FBQ3hDLG9GQUFvRjtBQUVwRixNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFFL0MsT0FBTyxFQUNILFlBQVksRUFFWixPQUFPLEVBQ1AsRUFBRSxJQUFJLE1BQU0sRUFDZixNQUFNLHdCQUF3QixDQUFDO0FBRWhDLE1BQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFVBQVUsRUFDbEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQ2IsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQ3ZCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBTXBCOzs7Ozs7R0FNRztBQUVILE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBVyxFQUFFLEVBQVk7SUFDL0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLElBQUk7UUFDQSxJQUFJLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLFdBQVcsRUFBRTtZQUM1QixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxHQUFHLENBQUM7YUFDZDtTQUNKO0tBQ0o7SUFBQyxPQUFPLEVBQUUs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S0FDckI7SUFDRCxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBQ0Q7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsTUFBYztJQUMzQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxNQUFNLENBQUMsSUFBSSxrQkFBa0IsRUFBRTtRQUNoQyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtLQUNKO0lBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNuQixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLENBQUM7UUFDbkIsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgdHlwZS1zYWZldHkgb3BlcmF0aW9ucyBvZiBtYW5pcHVsYXRpbmcgTG9jYWxTdG9yYWdlIGRhdGEuXG4gKiBAbmFtZSBMb2NhbFN0b3JhZ2VVdGlsLmpzXG4gKiBAbW9kdWxlIGh5cGVyY29tL3N0b3JhZ2UvTG9jYWxTdG9yYWdlVXRpbFxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuaW1wb3J0ICogYXMgZXh0ZXJuYWxJbnRlcmZhY2UgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG4vLyBhcyBwb2x5ZmlsbCBmb3IgbG9jYWxzdG9yYWdlXG4vLyBEbyBOT1QgdXNlIHRoZSBMb2NhbFN0b3JhZ2UgYXMgdGhlcmUgaXMgZ2xvYmFsIHZhcmlhYmxlIHdoaWNoIGNhbm5vdCBiZSByZXNvbHZlZFxuLy8gYW5kIHdoaWNoIGlzIGRlZmluZWQgb25seSBpbiBUSU5ZTUNFLlxuLy8gaW1wb3J0ICogYXMgbG9jYWxTdG9yYWdlIGZyb20gJ3BvbHB3YXJlLXRpbnltY2UtdGFpbG9yL3NyYy91dGlsL0xvY2FsU3RvcmFnZS5qcyc7XG5cbmNvbnN0IGdsb2JhbExvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbmltcG9ydCB7XG4gICAgZGVmYXVsdFZhbHVlLFxuICAgIElUeXBlRGVmLFxuICAgIHR5QXJyYXksXG4gICAgb2sgYXMgaXNUeXBlXG59IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5jb25zdCBfID0gZXh0ZXJuYWxJbnRlcmZhY2UudW5kZXJzY29yZSxcbiAgICBmaW5kID0gXy5maW5kLFxuICAgIGZpbmRJbmRleCA9IF8uZmluZEluZGV4LFxuICAgIHVuaW9uID0gXy51bmlvbjtcblxuZXhwb3J0IGludGVyZmFjZSBJRW50aXR5IHtcbiAgICBJZDogYW55O1xufVxuXG4vKipcbiAqIFJlYWRzIHRoZSB2YWx1ZSBvZiBhbiBlbnRpdHkgYnkgaXRzIGtleS5cbiAqIEBmdW5jdGlvbiBnZXRFbnRpdHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0geyp9IHR5IFRoZSB0eXBlIG9mIHRoZSBlbnRpdHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGVudGl0eSB2YWx1ZS5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW50aXR5KGtleTogc3RyaW5nLCB0eTogSVR5cGVEZWYpOiBhbnkge1xuICAgIGxldCBkYXRhID0gZGVmYXVsdFZhbHVlKHR5KTtcbiAgICB0cnkge1xuICAgICAgICBsZXQgdG1wID0gZ2xvYmFsTG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgaWYgKHRtcCAmJiB0bXAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0bXAgPSBKU09OLnBhcnNlKHRtcCk7XG4gICAgICAgICAgICBpZiAoaXNUeXBlKHRtcCwgdHkpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRtcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG4vKipcbiAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGFuIGVudGl0eSBieSBpdHMga2V5LlxuICogQGZ1bmN0aW9uIHVwZGF0ZUVudGl0eVxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbmV3IHZhbHVlIHRvIGJlIHJlcGxhY2VkIHdpdGguXG4gKiBAcGFyYW0geyp9IHR5IFRoZSB0eXBlIG9mIHRoZSBlbnRpdHkgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVFbnRpdHkoa2V5OiBzdHJpbmcsIGRhdGE6IGFueSwgdHk6IElUeXBlRGVmID0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbExvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICB9XG59XG4vKipcbiAqIENsZWFucyB0aGUgdmFsdWUgb2YgYW4gZW50aXR5IGJ5IGl0cyBrZXkuXG4gKiBAZnVuY3Rpb24gY2xlYW5FbnRpdHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0geyp9IHR5IFRoZSB0eXBlIG9mIHRoZSBlbnRpdHkgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkVudGl0eShrZXk6IHN0cmluZywgdHk6IElUeXBlRGVmKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsTG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkZWZhdWx0VmFsdWUodHkpKSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgIH1cbn1cbi8qKlxuICogSW5zZXJ0cyB0aGUgZ2l2ZW4gZGF0YSBpbnRvIHRoZSB2YWx1ZSBvZiBhbiBlbnRpdHkgb2YgdHlwZSBhcnJheS5cbiAqIE5vdGUgdGhhdCB0aGUgaW5zZXJ0ZWQgZGF0YSBzaG91bGQgYmUgZGlzam9pbnQgd2l0aCB0aGUgY3VycmVudCBkYXRhXG4gKiBzdG9yZWQgaW4gdGhpcyBlbnRpdHkuIE90aGVyd2lzZSwgdGhlIGJlaGF2aW9yIG1heSBiZSB1bmRlZmluZWQuXG4gKiBAZnVuY3Rpb24gaW5zZXJ0RW50aXRpZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRhIFRoZSB2YWx1ZSB0byBiZSBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB1cHBlckJvdW5kIFRoZSBtYXggbnVtYmVyIG9mIGVsZW1lbnRzIGFsbG93cyBmb3IgdGhpcyBlbnRpdHkgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRFbnRpdGllcyhrZXk6IHN0cmluZywgZGF0YTogQXJyYXk8SUVudGl0eT4sIHVwcGVyQm91bmQ6IG51bWJlcikge1xuICAgIGxldCBuZXdEYXRhID0gW107XG4gICAgY29uc3QgY3VycmVudERhdGEgPSBnZXRFbnRpdHkoa2V5LCB0eUFycmF5KSBhcyBBcnJheTxJRW50aXR5PjtcbiAgICBpZiAodXBwZXJCb3VuZCA+IDAgJiYgY3VycmVudERhdGEubGVuZ3RoID4gdXBwZXJCb3VuZCkge1xuICAgICAgICBuZXdEYXRhID0gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdEYXRhID0gdW5pb24oY3VycmVudERhdGEsIGRhdGEpO1xuICAgIH1cbiAgICB1cGRhdGVFbnRpdHkoa2V5LCBuZXdEYXRhLCB0eUFycmF5KTtcbn1cbi8qKlxuICogRmluZHMgb25lIGVsZW1lbnQgb2YgYW4gZW50aXR5IG9mIHR5cGUgYXJyYXkuXG4gKiBAZnVuY3Rpb24gZmluZEVudGl0eUJ5SWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIGlkZW50aWZpZXIgdmFsdWUuIEFuIElkIGZpZWxkIGlzIGFzc3VtZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUgb2YgdGhlIGZvdW5kIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRW50aXR5QnlJZChrZXk6IHN0cmluZywgaWQpOiBJRW50aXR5IHtcbiAgICBjb25zdCBkYXRhID0gZ2V0RW50aXR5KGtleSwgdHlBcnJheSkgYXMgQXJyYXk8SUVudGl0eT47XG4gICAgcmV0dXJuIGZpbmQoZGF0YSwgeyBJZDogaWQgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbiBlbGVtZW50IG9mIGFuIGVudGl0eSBvZiB0eXBlIGFycmF5LlxuICogQGZ1bmN0aW9uIHJlbW92ZUVudGl0eUJ5SWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGVudGl0eSBrZXkuXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIGlkZW50aWZpZXIgdmFsdWUgZm9yIHRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFbnRpdHlCeUlkKGtleTogc3RyaW5nLCBpZCkge1xuICAgIGNvbnN0IGRhdGEgPSBnZXRFbnRpdHkoa2V5LCB0eUFycmF5KSBhcyBBcnJheTxJRW50aXR5PjtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbmRleChkYXRhLCB7IElkOiBpZCB9KTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHVwZGF0ZUVudGl0eShrZXksIGRhdGEsIHR5QXJyYXkpO1xufVxuLyoqXG4gKiBJbnNlcnRzIG9yIHVkcGF0ZXMgYW4gZWxlbWVudCBvZiBhbiBlbnRpdHkgb2YgdHlwZSBhcnJheS5cbiAqIEBmdW5jdGlvbiBpbnNlcnRPclVwZGF0ZUVudGl0eVxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZW50aXR5IGtleS5cbiAqIEBwYXJhbSB7QXJyYXl9IGVudGl0eSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBlbnRpdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRPclVwZGF0ZUVudGl0eShrZXk6IHN0cmluZywgZW50aXR5OiBJRW50aXR5KSB7XG4gICAgY29uc3QgZGF0YSA9IGdldEVudGl0eShrZXksIHR5QXJyYXkpIGFzIEFycmF5PElFbnRpdHk+O1xuICAgIGNvbnN0IGluZGV4ID0gZmluZEluZGV4KGRhdGEsIHsgSWQ6IGVudGl0eS5JZCB9KTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGRhdGFbaW5kZXhdID0gZW50aXR5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEucHVzaChlbnRpdHkpO1xuICAgIH1cbiAgICB1cGRhdGVFbnRpdHkoa2V5LCBkYXRhLCB0eUFycmF5KTtcbn1cbi8qKlxuICogUmVtb3ZlcyBhIGdyb3VwIG9mIGVudGl0aWVzIGJ5IGEgZ2l2ZW4gcHJlZml4LlxuICogQGZ1bmN0aW9uIGNsZWFuRW50aXR5R3JvdXBcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggVGhlIHByZWZpeCBvZiB0aGUga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gYmUgcmVtb3ZlZC4gV2Ugb3JnYW5pemUgZW50aXRpZXMgc29tZXdoYXQgaGlyYXJjaGx5LlxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkVudGl0eUdyb3VwKHByZWZpeDogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3Qga2V5cyA9IFtdO1xuICAgIGZvciAoY29uc3QgcCBpbiBnbG9iYWxMb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgaWYgKGdsb2JhbExvY2FsU3RvcmFnZS5oYXNPd25Qcm9wZXJ0eShwKSAmJlxuICAgICAgICAgICAgcC5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgIGtleXMucHVzaChwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgIGdsb2JhbExvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGspO1xuICAgIH0pO1xuICAgIHJldHVybiBrZXlzO1xufVxuIl19