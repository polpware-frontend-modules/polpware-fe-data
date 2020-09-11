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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2kxOG4vZGljdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFFaEMsTUFBTSxPQUFPLElBQUk7SUFFYixNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDN0IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQVksRUFBRSxLQUFVO1FBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZLEVBQUUsV0FBbUI7UUFDOUMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksV0FBVyxFQUFFO1lBQy9CLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDN0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN4QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDcEIsOENBQThDO1lBQzlDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUMxQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCwwQkFBMEI7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBQcm92aWRlcyBpMThuIHNlcnZpY2UuIFRoaXMgbW9kdWxlIGlzIGRlc2lnbmVkIGFzXG4gKiBhIGRlbGVnYXRlIG9mIHRoZSB0aW55bWNlIEkxOG4gc2VydmljZS5cbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5jb25zdCBfaTE4biA9IGRlcGVuZGVuY2llcy5JMThuO1xuXG5leHBvcnQgY2xhc3MgSTE4biB7XG5cbiAgICBzdGF0aWMgZ2V0RGljdEJ5Q29kZShjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIF9pMThuLmRhdGFbY29kZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgbGFuZ3VnZSBkaWN0aW9uYXJ5IGFuZCBzZXQgdGhlIGN1cnJlbnRcbiAgICAgKiBjb2RlIGFzIHRoZSBjdXJyZW50IGxhbmd1YWdlLlxuICAgICAqL1xuICAgIHN0YXRpYyBhZGQoY29kZTogc3RyaW5nLCBpdGVtczogYW55KSB7XG4gICAgICAgIF9pMThuLmFkZChjb2RlLCBpdGVtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJuc2FsdGVzIGEgZ2l2ZW4gdGV4dC4gSWYgdGhlIGdpdmVuIHRleHRcbiAgICAgKiBpcyBtaXNzaW5nIGluIHRoZSBkaWN0aW9uYXJ5LCB1c2UgdGhlIGdpdmVuIGRlZmF1bHQgdmFsdWUuXG4gICAgICogQGZ1bmN0aW9uIHRyYW5zbGF0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IEEgdGV4dCB0byBiZSB0cmFuc2xhdGVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkZWZhdWx0VGV4dCBUaGUgZGVmYXVsdCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiB0ZXh0LlxuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2xhdGUodGV4dDogc3RyaW5nLCBkZWZhdWx0VGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gX2kxOG4udHJhbnNsYXRlKHRleHQpO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRleHQgJiYgZGVmYXVsdFRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB1bnVzZWQgbGFuZ3VhZ2VzIHRvIHJlbGVhc2UgbWVtb3J5LlxuICAgICAqIEBmdW5jdGlvbiByZWN5Y2xlT3RoZXJzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNvZGUgVGhlIGxhbmd1YWdlIGNvZGUgd2hpY2ggc2hvdWxkIG5vdCByZWxlYXNlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgcmVjeWNsZU90aGVycyhjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IF9pMThuLmRhdGE7XG4gICAgICAgIGNvbnN0IHJlY3ljbGVMaXN0ID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIC8vIHNraXAgbG9vcCBpZiB0aGUgcHJvcGVydHkgaXMgZnJvbSBwcm90b3R5cGVcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVjeWNsZUxpc3QucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qanNsaW50IHBsdXNwbHVzOiB0cnVlICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVjeWNsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSByZWN5Y2xlTGlzdFtpXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2tdO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19