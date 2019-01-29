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
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
var _i18n = dependencies.I18n;
var I18n = /** @class */ (function () {
    function I18n() {
    }
    /**
     * @param {?} code
     * @return {?}
     */
    I18n.getDictByCode = /**
     * @param {?} code
     * @return {?}
     */
    function (code) {
        return _i18n.data[code];
    };
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    I18n.add = /**
     * Add a languge dictionary and set the current
     * code as the current language.
     * @param {?} code
     * @param {?} items
     * @return {?}
     */
    function (code, items) {
        _i18n.add(code, items);
    };
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    I18n.translate = /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @param {?} text
     * @param {?} defaultText
     * @return {?}
     */
    function (text, defaultText) {
        /** @type {?} */
        var value = _i18n.translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    };
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    I18n.recycleOthers = /**
     * Removes unused languages to release memory.
     * @param {?} code
     * @return {?}
     */
    function (code) {
        /** @type {?} */
        var data = _i18n.data;
        /** @type {?} */
        var recycleList = [];
        for (var key in data) {
            // skip loop if the property is from prototype
            if (data.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (var i = 0; i < recycleList.length; i++) {
            /** @type {?} */
            var k = recycleList[i];
            delete data[k];
        }
    };
    return I18n;
}());
export { I18n };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2kxOG4vZGljdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7O0lBRXBELEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSTtBQUUvQjtJQUFBO0lBa0RBLENBQUM7Ozs7O0lBaERVLGtCQUFhOzs7O0lBQXBCLFVBQXFCLElBQVk7UUFDN0IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7Ozs7Ozs7O0lBQ0ksUUFBRzs7Ozs7OztJQUFWLFVBQVcsSUFBWSxFQUFFLEtBQVU7UUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7Ozs7Ozs7O0lBQ0ksY0FBUzs7Ozs7OztJQUFoQixVQUFpQixJQUFZLEVBQUUsV0FBbUI7O1lBQ3hDLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNuQyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksV0FBVyxFQUFFO1lBQy9CLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7OztJQUNJLGtCQUFhOzs7OztJQUFwQixVQUFxQixJQUFZOztZQUN2QixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUk7O1lBQ2pCLFdBQVcsR0FBRyxFQUFFO1FBQ3RCLEtBQUssSUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3BCLDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDMUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtTQUNKO1FBQ0QsMEJBQTBCO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztnQkFDbkMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7SUFDTCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFsREQsSUFrREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGkxOG4gc2VydmljZS4gVGhpcyBtb2R1bGUgaXMgZGVzaWduZWQgYXNcbiAqIGEgZGVsZWdhdGUgb2YgdGhlIHRpbnltY2UgSTE4biBzZXJ2aWNlLlxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmNvbnN0IF9pMThuID0gZGVwZW5kZW5jaWVzLkkxOG47XG5cbmV4cG9ydCBjbGFzcyBJMThuIHtcblxuICAgIHN0YXRpYyBnZXREaWN0QnlDb2RlKGNvZGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gX2kxOG4uZGF0YVtjb2RlXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBsYW5ndWdlIGRpY3Rpb25hcnkgYW5kIHNldCB0aGUgY3VycmVudFxuICAgICAqIGNvZGUgYXMgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UuXG4gICAgICovXG4gICAgc3RhdGljIGFkZChjb2RlOiBzdHJpbmcsIGl0ZW1zOiBhbnkpIHtcbiAgICAgICAgX2kxOG4uYWRkKGNvZGUsIGl0ZW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcm5zYWx0ZXMgYSBnaXZlbiB0ZXh0LiBJZiB0aGUgZ2l2ZW4gdGV4dFxuICAgICAqIGlzIG1pc3NpbmcgaW4gdGhlIGRpY3Rpb25hcnksIHVzZSB0aGUgZ2l2ZW4gZGVmYXVsdCB2YWx1ZS5cbiAgICAgKiBAZnVuY3Rpb24gdHJhbnNsYXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHQgQSB0ZXh0IHRvIGJlIHRyYW5zbGF0ZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRlZmF1bHRUZXh0IFRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGdpdmVuIHRleHQuXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh0ZXh0OiBzdHJpbmcsIGRlZmF1bHRUZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBfaTE4bi50cmFuc2xhdGUodGV4dCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGV4dCAmJiBkZWZhdWx0VGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRUZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHVudXNlZCBsYW5ndWFnZXMgdG8gcmVsZWFzZSBtZW1vcnkuXG4gICAgICogQGZ1bmN0aW9uIHJlY3ljbGVPdGhlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29kZSBUaGUgbGFuZ3VhZ2UgY29kZSB3aGljaCBzaG91bGQgbm90IHJlbGVhc2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyByZWN5Y2xlT3RoZXJzKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBkYXRhID0gX2kxOG4uZGF0YTtcbiAgICAgICAgY29uc3QgcmVjeWNsZUxpc3QgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgLy8gc2tpcCBsb29wIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIHByb3RvdHlwZVxuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZWN5Y2xlTGlzdC5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypqc2xpbnQgcGx1c3BsdXM6IHRydWUgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN5Y2xlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgayA9IHJlY3ljbGVMaXN0W2ldO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFba107XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=