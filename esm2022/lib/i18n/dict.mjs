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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BvbHB3YXJlL2ZlLWRhdGEvc3JjL2xpYi9pMThuL2RpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBRWhDLE1BQU0sT0FBTyxJQUFJO0lBRWIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBVTtRQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBWSxFQUFFLFdBQW1CO1FBQzlDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBWTtRQUM3QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDO1FBQ0QsMEJBQTBCO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFByb3ZpZGVzIGkxOG4gc2VydmljZS4gVGhpcyBtb2R1bGUgaXMgZGVzaWduZWQgYXNcbiAqIGEgZGVsZWdhdGUgb2YgdGhlIHRpbnltY2UgSTE4biBzZXJ2aWNlLlxuICogQGF1dGhvciBYaWFvbG9uZyBUYW5nIDx4eGxvbmd0YW5nQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIENvcHlyaWdodCBAbWVcbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmNvbnN0IF9pMThuID0gZGVwZW5kZW5jaWVzLkkxOG47XG5cbmV4cG9ydCBjbGFzcyBJMThuIHtcblxuICAgIHN0YXRpYyBnZXREaWN0QnlDb2RlKGNvZGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gX2kxOG4uZGF0YVtjb2RlXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBsYW5ndWdlIGRpY3Rpb25hcnkgYW5kIHNldCB0aGUgY3VycmVudFxuICAgICAqIGNvZGUgYXMgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UuXG4gICAgICovXG4gICAgc3RhdGljIGFkZChjb2RlOiBzdHJpbmcsIGl0ZW1zOiBhbnkpIHtcbiAgICAgICAgX2kxOG4uYWRkKGNvZGUsIGl0ZW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcm5zYWx0ZXMgYSBnaXZlbiB0ZXh0LiBJZiB0aGUgZ2l2ZW4gdGV4dFxuICAgICAqIGlzIG1pc3NpbmcgaW4gdGhlIGRpY3Rpb25hcnksIHVzZSB0aGUgZ2l2ZW4gZGVmYXVsdCB2YWx1ZS5cbiAgICAgKiBAZnVuY3Rpb24gdHJhbnNsYXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHQgQSB0ZXh0IHRvIGJlIHRyYW5zbGF0ZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRlZmF1bHRUZXh0IFRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGdpdmVuIHRleHQuXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh0ZXh0OiBzdHJpbmcsIGRlZmF1bHRUZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBfaTE4bi50cmFuc2xhdGUodGV4dCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGV4dCAmJiBkZWZhdWx0VGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRUZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHVudXNlZCBsYW5ndWFnZXMgdG8gcmVsZWFzZSBtZW1vcnkuXG4gICAgICogQGZ1bmN0aW9uIHJlY3ljbGVPdGhlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29kZSBUaGUgbGFuZ3VhZ2UgY29kZSB3aGljaCBzaG91bGQgbm90IHJlbGVhc2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyByZWN5Y2xlT3RoZXJzKGNvZGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBkYXRhID0gX2kxOG4uZGF0YTtcbiAgICAgICAgY29uc3QgcmVjeWNsZUxpc3QgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgLy8gc2tpcCBsb29wIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIHByb3RvdHlwZVxuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZWN5Y2xlTGlzdC5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypqc2xpbnQgcGx1c3BsdXM6IHRydWUgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN5Y2xlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgayA9IHJlY3ljbGVMaXN0W2ldO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFba107XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=