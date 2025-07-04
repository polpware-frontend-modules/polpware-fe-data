import { IAntiForgeryKeyCtorOptions } from './interfaces';
import { PolicyBase } from './policy-base';
export declare class AntiForgeryKeyPolicy extends PolicyBase {
    private _antiForgeryKey;
    private _elementTag;
    private _expired;
    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    constructor(settings: IAntiForgeryKeyCtorOptions);
    isExpired(): boolean;
    inputField(): string;
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    readFrom(settings: any): void;
    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    persistent(): {
        token: string;
    };
    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * @function getTokenP
     * @param {String}[url] The URL where the response from it may contain
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @returns {Promise}
     * @throws {}
     */
    getTokenInternal(): PromiseLike<string>;
    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    applyTo(options: any): void;
    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    applyToV2(options: any): void;
    applyToV3(options: any): void;
    /**
     * Resets the token and expired flag
     * @function reset
     */
    reset(): void;
}
