export declare class I18n {
    static getDictByCode(code: string): any;
    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    static add(code: string, items: any): void;
    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    static translate(text: string, defaultText: string): any;
    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    static recycleOthers(code: string): void;
}
