/**
 * @fileOverview
 * Provides i18n service. This module is designed as
 * a delegate of the tinymce I18n service.
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';
const _i18n = dependencies.I18n;
export class I18n {
    static getDictByCode(code) {
        return _i18n.data[code];
    }
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    static add(code, items) {
        _i18n.add(code, items);
    }
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    static translate(text, defaultText) {
        const value = _i18n.translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    }
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    static recycleOthers(code) {
        const data = _i18n.data;
        const recycleList = [];
        for (const key in data) {
            // skip loop if the property is from prototype
            if (data.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (let i = 0; i < recycleList.length; i++) {
            const k = recycleList[i];
            delete data[k];
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BvbHB3YXJlL2ZlLWRhdGEvc3JjL2xpYi9pMThuL2RpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBRWhDLE1BQU0sT0FBTyxJQUFJO0lBRWIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBVTtRQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBWSxFQUFFLFdBQW1CO1FBQzlDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLFdBQVcsRUFBRTtZQUMvQixPQUFPLFdBQVcsQ0FBQztTQUN0QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDeEIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3BCLDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDMUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtTQUNKO1FBQ0QsMEJBQTBCO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHJvdmlkZXMgaTE4biBzZXJ2aWNlLiBUaGlzIG1vZHVsZSBpcyBkZXNpZ25lZCBhc1xuICogYSBkZWxlZ2F0ZSBvZiB0aGUgdGlueW1jZSBJMThuIHNlcnZpY2UuXG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuY29uc3QgX2kxOG4gPSBkZXBlbmRlbmNpZXMuSTE4bjtcblxuZXhwb3J0IGNsYXNzIEkxOG4ge1xuXG4gICAgc3RhdGljIGdldERpY3RCeUNvZGUoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBfaTE4bi5kYXRhW2NvZGVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGxhbmd1Z2UgZGljdGlvbmFyeSBhbmQgc2V0IHRoZSBjdXJyZW50XG4gICAgICogY29kZSBhcyB0aGUgY3VycmVudCBsYW5ndWFnZS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkKGNvZGU6IHN0cmluZywgaXRlbXM6IGFueSkge1xuICAgICAgICBfaTE4bi5hZGQoY29kZSwgaXRlbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRybnNhbHRlcyBhIGdpdmVuIHRleHQuIElmIHRoZSBnaXZlbiB0ZXh0XG4gICAgICogaXMgbWlzc2luZyBpbiB0aGUgZGljdGlvbmFyeSwgdXNlIHRoZSBnaXZlbiBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBmdW5jdGlvbiB0cmFuc2xhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBBIHRleHQgdG8gYmUgdHJhbnNsYXRlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGVmYXVsdFRleHQgVGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHRyYW5zbGF0aW9uIGZvciB0aGUgZ2l2ZW4gdGV4dC5cbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNsYXRlKHRleHQ6IHN0cmluZywgZGVmYXVsdFRleHQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IF9pMThuLnRyYW5zbGF0ZSh0ZXh0KTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0ZXh0ICYmIGRlZmF1bHRUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdW51c2VkIGxhbmd1YWdlcyB0byByZWxlYXNlIG1lbW9yeS5cbiAgICAgKiBAZnVuY3Rpb24gcmVjeWNsZU90aGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2RlIFRoZSBsYW5ndWFnZSBjb2RlIHdoaWNoIHNob3VsZCBub3QgcmVsZWFzZWQuXG4gICAgICovXG4gICAgc3RhdGljIHJlY3ljbGVPdGhlcnMoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBfaTE4bi5kYXRhO1xuICAgICAgICBjb25zdCByZWN5Y2xlTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAvLyBza2lwIGxvb3AgaWYgdGhlIHByb3BlcnR5IGlzIGZyb20gcHJvdG90eXBlXG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gY29kZSkge1xuICAgICAgICAgICAgICAgIHJlY3ljbGVMaXN0LnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKmpzbGludCBwbHVzcGx1czogdHJ1ZSAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY3ljbGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gcmVjeWNsZUxpc3RbaV07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtrXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==