/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Provides i18n service. This module is designed as
 * a delegate of the tinymce I18n service.
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as _i18n from 'polpware-tinymce-tailor/src/util/I18n';
export class I18n {
    /**
     * @param {?} code
     * @return {?}
     */
    static getDictByCode(code) {
        return _i18n.data[code];
    }
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    static add(code, items) {
        _i18n.add(code, items);
    }
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    static translate(text, defaultText) {
        /** @type {?} */
        const value = _i18n.translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    }
    /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    static recycleOthers(code) {
        /** @type {?} */
        const data = _i18n.data;
        /** @type {?} */
        const recycleList = [];
        for (const key in data) {
            // skip loop if the property is from prototype
            if (data.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (let i = 0; i < recycleList.length; i++) {
            /** @type {?} */
            const k = recycleList[i];
            delete data[k];
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2kxOG4vZGljdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sS0FBSyxLQUFLLE1BQU0sdUNBQXVDLENBQUM7QUFFL0QsTUFBTSxPQUFPLElBQUk7Ozs7O0lBRWIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7Ozs7OztJQU1ELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBWSxFQUFFLEtBQVU7UUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQzs7Ozs7Ozs7SUFVRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQVksRUFBRSxXQUFtQjs7Y0FDeEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxXQUFXLEVBQUU7WUFDL0IsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDOzs7Ozs7SUFPRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7O2NBQ3ZCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSTs7Y0FDakIsV0FBVyxHQUFHLEVBQUU7UUFDdEIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDcEIsOENBQThDO1lBQzlDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUMxQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCwwQkFBMEI7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2tCQUNuQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgaTE4biBzZXJ2aWNlLiBUaGlzIG1vZHVsZSBpcyBkZXNpZ25lZCBhc1xuICogYSBkZWxlZ2F0ZSBvZiB0aGUgdGlueW1jZSBJMThuIHNlcnZpY2UuXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5pbXBvcnQgKiBhcyBfaTE4biBmcm9tICdwb2xwd2FyZS10aW55bWNlLXRhaWxvci9zcmMvdXRpbC9JMThuJztcblxuZXhwb3J0IGNsYXNzIEkxOG4ge1xuXG4gICAgc3RhdGljIGdldERpY3RCeUNvZGUoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBfaTE4bi5kYXRhW2NvZGVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGxhbmd1Z2UgZGljdGlvbmFyeSBhbmQgc2V0IHRoZSBjdXJyZW50XG4gICAgICogY29kZSBhcyB0aGUgY3VycmVudCBsYW5ndWFnZS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkKGNvZGU6IHN0cmluZywgaXRlbXM6IGFueSkge1xuICAgICAgICBfaTE4bi5hZGQoY29kZSwgaXRlbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRybnNhbHRlcyBhIGdpdmVuIHRleHQuIElmIHRoZSBnaXZlbiB0ZXh0XG4gICAgICogaXMgbWlzc2luZyBpbiB0aGUgZGljdGlvbmFyeSwgdXNlIHRoZSBnaXZlbiBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBmdW5jdGlvbiB0cmFuc2xhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBBIHRleHQgdG8gYmUgdHJhbnNsYXRlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGVmYXVsdFRleHQgVGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHRyYW5zbGF0aW9uIGZvciB0aGUgZ2l2ZW4gdGV4dC5cbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNsYXRlKHRleHQ6IHN0cmluZywgZGVmYXVsdFRleHQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IF9pMThuLnRyYW5zbGF0ZSh0ZXh0KTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0ZXh0ICYmIGRlZmF1bHRUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdW51c2VkIGxhbmd1YWdlcyB0byByZWxlYXNlIG1lbW9yeS5cbiAgICAgKiBAZnVuY3Rpb24gcmVjeWNsZU90aGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2RlIFRoZSBsYW5ndWFnZSBjb2RlIHdoaWNoIHNob3VsZCBub3QgcmVsZWFzZWQuXG4gICAgICovXG4gICAgc3RhdGljIHJlY3ljbGVPdGhlcnMoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBfaTE4bi5kYXRhO1xuICAgICAgICBjb25zdCByZWN5Y2xlTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAvLyBza2lwIGxvb3AgaWYgdGhlIHByb3BlcnR5IGlzIGZyb20gcHJvdG90eXBlXG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gY29kZSkge1xuICAgICAgICAgICAgICAgIHJlY3ljbGVMaXN0LnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKmpzbGludCBwbHVzcGx1czogdHJ1ZSAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY3ljbGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gcmVjeWNsZUxpc3RbaV07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtrXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==