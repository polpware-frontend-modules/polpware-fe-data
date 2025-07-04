/**
 * @fileOverview
 * Defines a Resources class.
 * With this class, you may configure a bunch of resources
 * accessible from global URIs, such as URLs.
 * Once the requested resources are loaded, they may be
 * cached in the memory.
 * Note that the resources are expected to be organized in
 * a common namespace hierarchy.
 * E.g.,
 * x.y.z corresponds to a json resource like:
 *    {
 *       y: {
 *             z: 112
 *          }
 *    }
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import { ISlidingExpireCache } from '../cache/sliding-expire-cache.interface';
/**
 * @class Resources
 */
export declare class ResourceLoader {
    private _cache;
    private _configuration;
    /**
     * Constructor
     * @function init
     */
    constructor(_cache?: ISlidingExpireCache<any>);
    /**
     * Configure a resource
     * @function register
     * @param {String} key The resource key.
     * @param {String} uri The resource URI.
     * @param {Number} liveSeconds The cache period.
     * @throws {Error}
     */
    register(key: string, uri: string, liveSeconds?: number): void;
    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    undoRegister(key: string): void;
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    getPromise<T>(fullyQualifiedNamespace: string, convertor: (any: any) => any): PromiseLike<T>;
}
