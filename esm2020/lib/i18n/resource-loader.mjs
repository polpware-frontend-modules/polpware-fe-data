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
import * as externalInterface from '@polpware/fe-dependencies';
import { lift } from '@polpware/fe-utilities';
import { loadJsonUriP } from '../net/curl';
const _ = externalInterface.underscore;
const isString = _.isString;
/**
 * Retrieves a value from a variable by a given namespace nested structure.
 * @function getByNamespace
 * @param {Object} repo
 * @param {*} fullyQualifiedNamespace A string or an arry of string defining the namespace.
 * @param {Number}[] startLevel
 * @returns {*}
 */
function getByNamespace(repo, identifiers, startLevel = 1) {
    const restIdentifiers = identifiers.slice(startLevel);
    const restKey = restIdentifiers.join('.');
    if (repo[restKey]) {
        return repo[restKey];
    }
    let initRepo = repo;
    for (let index = startLevel; index < identifiers.length; index++) {
        if (!initRepo) {
            break;
        }
        const key = identifiers[index];
        initRepo = initRepo[key];
    }
    return initRepo;
}
/**
 * @class Resources
 */
export class ResourceLoader {
    /**
     * Constructor
     * @function init
     */
    constructor(_cache = null) {
        this._cache = _cache;
        this._configuration = {};
    }
    /**
     * Configure a resource
     * @function register
     * @param {String} key The resource key.
     * @param {String} uri The resource URI.
     * @param {Number} liveSeconds The cache period.
     * @throws {Error}
     */
    register(key, uri, liveSeconds = 60) {
        const configuration = this._configuration;
        if (configuration[key]) {
            throw new Error('Registering an existing resource key: ' + key);
        }
        configuration[key] = {
            uri: uri,
            liveSeconds: liveSeconds
        };
    }
    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    undoRegister(key) {
        const configuration = this._configuration;
        if (configuration[key]) {
            delete configuration[key];
        }
    }
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    getPromise(fullyQualifiedNamespace, convertor) {
        const identifiers = fullyQualifiedNamespace.split('.');
        const topIdentifier = identifiers[0];
        const cache = this._cache;
        if (cache) {
            // Figure out the master key
            const repo = cache.get(topIdentifier, 60);
            if (repo) {
                const value = getByNamespace(repo, identifiers);
                if (value) {
                    // Return a promise
                    return lift(value, null);
                }
            }
        }
        const entry = this._configuration[topIdentifier];
        if (!entry) {
            throw new Error('Get unregistered resource: ' + topIdentifier);
        }
        // Otherwise, load it
        return loadJsonUriP(entry.uri).then((content) => {
            content = convertor(content);
            // Cache the new value
            if (cache) {
                cache.set(topIdentifier, content, entry.liveSeconds);
            }
            return getByNamespace(content, identifiers);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcG9scHdhcmUvZmUtZGF0YS9zcmMvbGliL2kxOG4vcmVzb3VyY2UtbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFHSCxPQUFPLEtBQUssaUJBQWlCLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFXLElBQUksRUFBVyxNQUFNLHdCQUF3QixDQUFDO0FBSWhFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFHM0MsTUFBTSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFHNUI7Ozs7Ozs7R0FPRztBQUNILFNBQVMsY0FBYyxDQUFJLElBQTBCLEVBQ2pELFdBQTBCLEVBQzFCLGFBQXFCLENBQUM7SUFFdEIsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEI7SUFFRCxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUM7SUFDekIsS0FBSyxJQUFJLEtBQUssR0FBRyxVQUFVLEVBQUUsS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLE1BQU07U0FDVDtRQUNELE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQU9EOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFJdkI7OztPQUdHO0lBQ0gsWUFBb0IsU0FBbUMsSUFBSTtRQUF2QyxXQUFNLEdBQU4sTUFBTSxDQUFpQztRQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFFBQVEsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFFLGNBQXNCLEVBQUU7UUFDdkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHO1lBQ2pCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQztJQUNOLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsWUFBWSxDQUFDLEdBQVc7UUFDcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSCxVQUFVLENBQUksdUJBQStCLEVBQ3pDLFNBQXVCO1FBQ3ZCLE1BQU0sV0FBVyxHQUFHLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNQLDRCQUE0QjtZQUM1QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQyxJQUFJLElBQUksRUFBRTtnQkFDTixNQUFNLEtBQUssR0FBRyxjQUFjLENBQUksSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEtBQUssRUFBRTtvQkFDUCxtQkFBbUI7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDNUI7YUFDSjtTQUNKO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxhQUFhLENBQUMsQ0FBQztTQUNsRTtRQUVELHFCQUFxQjtRQUNyQixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDNUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixzQkFBc0I7WUFDdEIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN4RDtZQUNELE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIFJlc291cmNlcyBjbGFzcy5cbiAqIFdpdGggdGhpcyBjbGFzcywgeW91IG1heSBjb25maWd1cmUgYSBidW5jaCBvZiByZXNvdXJjZXNcbiAqIGFjY2Vzc2libGUgZnJvbSBnbG9iYWwgVVJJcywgc3VjaCBhcyBVUkxzLlxuICogT25jZSB0aGUgcmVxdWVzdGVkIHJlc291cmNlcyBhcmUgbG9hZGVkLCB0aGV5IG1heSBiZVxuICogY2FjaGVkIGluIHRoZSBtZW1vcnkuXG4gKiBOb3RlIHRoYXQgdGhlIHJlc291cmNlcyBhcmUgZXhwZWN0ZWQgdG8gYmUgb3JnYW5pemVkIGluXG4gKiBhIGNvbW1vbiBuYW1lc3BhY2UgaGllcmFyY2h5LlxuICogRS5nLixcbiAqIHgueS56IGNvcnJlc3BvbmRzIHRvIGEganNvbiByZXNvdXJjZSBsaWtlOlxuICogICAge1xuICogICAgICAgeToge1xuICogICAgICAgICAgICAgejogMTEyXG4gKiAgICAgICAgICB9XG4gKiAgICB9XG4gKiBAYXV0aG9yIFhpYW9sb25nIFRhbmcgPHh4bG9uZ3RhbmdAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IEBtZVxuICovXG5cblxuaW1wb3J0ICogYXMgZXh0ZXJuYWxJbnRlcmZhY2UgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyByZXBsYWNlLCBsaWZ0LCBjb252ZXJ0IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmltcG9ydCB7IElTbGlkaW5nRXhwaXJlQ2FjaGUgfSBmcm9tICcuLi9jYWNoZS9zbGlkaW5nLWV4cGlyZS1jYWNoZS5pbnRlcmZhY2UnO1xuXG5pbXBvcnQgeyBsb2FkSnNvblVyaVAgfSBmcm9tICcuLi9uZXQvY3VybCc7XG5cblxuY29uc3QgXyA9IGV4dGVybmFsSW50ZXJmYWNlLnVuZGVyc2NvcmU7XG5jb25zdCBpc1N0cmluZyA9IF8uaXNTdHJpbmc7XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIGEgdmFyaWFibGUgYnkgYSBnaXZlbiBuYW1lc3BhY2UgbmVzdGVkIHN0cnVjdHVyZS5cbiAqIEBmdW5jdGlvbiBnZXRCeU5hbWVzcGFjZVxuICogQHBhcmFtIHtPYmplY3R9IHJlcG9cbiAqIEBwYXJhbSB7Kn0gZnVsbHlRdWFsaWZpZWROYW1lc3BhY2UgQSBzdHJpbmcgb3IgYW4gYXJyeSBvZiBzdHJpbmcgZGVmaW5pbmcgdGhlIG5hbWVzcGFjZS5cbiAqIEBwYXJhbSB7TnVtYmVyfVtdIHN0YXJ0TGV2ZWxcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBnZXRCeU5hbWVzcGFjZTxUPihyZXBvOiB7IFtrZXk6IHN0cmluZ106IFQgfSxcbiAgICBpZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPixcbiAgICBzdGFydExldmVsOiBudW1iZXIgPSAxKTogVCB7XG5cbiAgICBjb25zdCByZXN0SWRlbnRpZmllcnMgPSBpZGVudGlmaWVycy5zbGljZShzdGFydExldmVsKTtcbiAgICBjb25zdCByZXN0S2V5ID0gcmVzdElkZW50aWZpZXJzLmpvaW4oJy4nKTtcbiAgICBpZiAocmVwb1tyZXN0S2V5XSkge1xuICAgICAgICByZXR1cm4gcmVwb1tyZXN0S2V5XTtcbiAgICB9XG5cbiAgICBsZXQgaW5pdFJlcG86IGFueSA9IHJlcG87XG4gICAgZm9yIChsZXQgaW5kZXggPSBzdGFydExldmVsOyBpbmRleCA8IGlkZW50aWZpZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBpZiAoIWluaXRSZXBvKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBrZXkgPSBpZGVudGlmaWVyc1tpbmRleF07XG4gICAgICAgIGluaXRSZXBvID0gaW5pdFJlcG9ba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGluaXRSZXBvO1xufVxuXG5pbnRlcmZhY2UgSUNvbmZpZ3VyYXRpb25FbnRyeSB7XG4gICAgdXJpOiBzdHJpbmc7XG4gICAgbGl2ZVNlY29uZHM6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBAY2xhc3MgUmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUxvYWRlciB7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiB7IFtrZXk6IHN0cmluZ106IElDb25maWd1cmF0aW9uRW50cnkgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICogQGZ1bmN0aW9uIGluaXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jYWNoZTogSVNsaWRpbmdFeHBpcmVDYWNoZTxhbnk+ID0gbnVsbCkge1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlIGEgcmVzb3VyY2VcbiAgICAgKiBAZnVuY3Rpb24gcmVnaXN0ZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSByZXNvdXJjZSBrZXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVyaSBUaGUgcmVzb3VyY2UgVVJJLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsaXZlU2Vjb25kcyBUaGUgY2FjaGUgcGVyaW9kLlxuICAgICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyKGtleTogc3RyaW5nLCB1cmk6IHN0cmluZywgbGl2ZVNlY29uZHM6IG51bWJlciA9IDYwKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSB0aGlzLl9jb25maWd1cmF0aW9uO1xuICAgICAgICBpZiAoY29uZmlndXJhdGlvbltrZXldKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZ2lzdGVyaW5nIGFuIGV4aXN0aW5nIHJlc291cmNlIGtleTogJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlndXJhdGlvbltrZXldID0ge1xuICAgICAgICAgICAgdXJpOiB1cmksXG4gICAgICAgICAgICBsaXZlU2Vjb25kczogbGl2ZVNlY29uZHNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgcmVnaXN0ZXJlZCBpdGVtXG4gICAgICogQGZ1bmN0aW9uIHVuZG9SZWdpc3RlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIHJlc291cmNlIGtleSB0byBiZSByZW1vdmVkLlxuICAgICAqL1xuICAgIHVuZG9SZWdpc3RlcihrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlndXJhdGlvbjtcbiAgICAgICAgaWYgKGNvbmZpZ3VyYXRpb25ba2V5XSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZ3VyYXRpb25ba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlc291cmNlIGtleS5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0UHJvbWlzZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmdWxseVF1YWxpZmllZE5hbWVzcGFjZSBUaGUgcmVzb3VyY2Uga2V5LlxuICAgICAqIEByZXR1cm5zIHsqfSBUaGUgcmVzb3VyY2UgdmFsdWUuXG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgZ2V0UHJvbWlzZTxUPihmdWxseVF1YWxpZmllZE5hbWVzcGFjZTogc3RyaW5nLFxuICAgICAgICBjb252ZXJ0b3I6IChhbnkpID0+IGFueSk6IFByb21pc2VMaWtlPFQ+IHtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBmdWxseVF1YWxpZmllZE5hbWVzcGFjZS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCB0b3BJZGVudGlmaWVyID0gaWRlbnRpZmllcnNbMF07XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5fY2FjaGU7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgLy8gRmlndXJlIG91dCB0aGUgbWFzdGVyIGtleVxuICAgICAgICAgICAgY29uc3QgcmVwbyA9IGNhY2hlLmdldCh0b3BJZGVudGlmaWVyLCA2MCk7XG4gICAgICAgICAgICBpZiAocmVwbykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0QnlOYW1lc3BhY2U8VD4ocmVwbywgaWRlbnRpZmllcnMpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaWZ0KHZhbHVlLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX2NvbmZpZ3VyYXRpb25bdG9wSWRlbnRpZmllcl07XG4gICAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR2V0IHVucmVnaXN0ZXJlZCByZXNvdXJjZTogJyArIHRvcElkZW50aWZpZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBsb2FkIGl0XG4gICAgICAgIHJldHVybiBsb2FkSnNvblVyaVAoZW50cnkudXJpKS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICBjb250ZW50ID0gY29udmVydG9yKGNvbnRlbnQpO1xuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG5ldyB2YWx1ZVxuICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUuc2V0KHRvcElkZW50aWZpZXIsIGNvbnRlbnQsIGVudHJ5LmxpdmVTZWNvbmRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRCeU5hbWVzcGFjZShjb250ZW50LCBpZGVudGlmaWVycyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==