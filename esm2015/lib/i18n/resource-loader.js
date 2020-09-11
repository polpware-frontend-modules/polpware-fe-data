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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtbG9hZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvaTE4bi9yZXNvdXJjZS1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUdILE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQVcsSUFBSSxFQUFXLE1BQU0sd0JBQXdCLENBQUM7QUFJaEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUczQyxNQUFNLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7QUFDdkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUc1Qjs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxjQUFjLENBQUksSUFBMEIsRUFDakQsV0FBMEIsRUFDMUIsYUFBcUIsQ0FBQztJQUV0QixNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4QjtJQUVELElBQUksUUFBUSxHQUFRLElBQUksQ0FBQztJQUN6QixLQUFLLElBQUksS0FBSyxHQUFHLFVBQVUsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM5RCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsTUFBTTtTQUNUO1FBQ0QsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUI7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBT0Q7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUl2Qjs7O09BR0c7SUFDSCxZQUFvQixTQUFtQyxJQUFJO1FBQXZDLFdBQU0sR0FBTixNQUFNLENBQWlDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsUUFBUSxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQUUsY0FBc0IsRUFBRTtRQUN2RCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDbkU7UUFDRCxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUc7WUFDakIsR0FBRyxFQUFFLEdBQUc7WUFDUixXQUFXLEVBQUUsV0FBVztTQUMzQixDQUFDO0lBQ04sQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsR0FBVztRQUNwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUNILFVBQVUsQ0FBSSx1QkFBK0IsRUFDekMsU0FBdUI7UUFDdkIsTUFBTSxXQUFXLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzFCLElBQUksS0FBSyxFQUFFO1lBQ1AsNEJBQTRCO1lBQzVCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLElBQUksSUFBSSxFQUFFO2dCQUNOLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBSSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ25ELElBQUksS0FBSyxFQUFFO29CQUNQLG1CQUFtQjtvQkFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUM1QjthQUNKO1NBQ0o7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLGFBQWEsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQscUJBQXFCO1FBQ3JCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM1QyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLHNCQUFzQjtZQUN0QixJQUFJLEtBQUssRUFBRTtnQkFDUCxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3hEO1lBQ0QsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBEZWZpbmVzIGEgUmVzb3VyY2VzIGNsYXNzLlxuICogV2l0aCB0aGlzIGNsYXNzLCB5b3UgbWF5IGNvbmZpZ3VyZSBhIGJ1bmNoIG9mIHJlc291cmNlc1xuICogYWNjZXNzaWJsZSBmcm9tIGdsb2JhbCBVUklzLCBzdWNoIGFzIFVSTHMuXG4gKiBPbmNlIHRoZSByZXF1ZXN0ZWQgcmVzb3VyY2VzIGFyZSBsb2FkZWQsIHRoZXkgbWF5IGJlXG4gKiBjYWNoZWQgaW4gdGhlIG1lbW9yeS5cbiAqIE5vdGUgdGhhdCB0aGUgcmVzb3VyY2VzIGFyZSBleHBlY3RlZCB0byBiZSBvcmdhbml6ZWQgaW5cbiAqIGEgY29tbW9uIG5hbWVzcGFjZSBoaWVyYXJjaHkuXG4gKiBFLmcuLFxuICogeC55LnogY29ycmVzcG9uZHMgdG8gYSBqc29uIHJlc291cmNlIGxpa2U6XG4gKiAgICB7XG4gKiAgICAgICB5OiB7XG4gKiAgICAgICAgICAgICB6OiAxMTJcbiAqICAgICAgICAgIH1cbiAqICAgIH1cbiAqIEBhdXRob3IgWGlhb2xvbmcgVGFuZyA8eHhsb25ndGFuZ0BnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgQG1lXG4gKi9cblxuXG5pbXBvcnQgKiBhcyBleHRlcm5hbEludGVyZmFjZSBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7IHJlcGxhY2UsIGxpZnQsIGNvbnZlcnQgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgSVNsaWRpbmdFeHBpcmVDYWNoZSB9IGZyb20gJy4uL2NhY2hlL3NsaWRpbmctZXhwaXJlLWNhY2hlLmludGVyZmFjZSc7XG5cbmltcG9ydCB7IGxvYWRKc29uVXJpUCB9IGZyb20gJy4uL25ldC9jdXJsJztcblxuXG5jb25zdCBfID0gZXh0ZXJuYWxJbnRlcmZhY2UudW5kZXJzY29yZTtcbmNvbnN0IGlzU3RyaW5nID0gXy5pc1N0cmluZztcblxuXG4vKipcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gYSB2YXJpYWJsZSBieSBhIGdpdmVuIG5hbWVzcGFjZSBuZXN0ZWQgc3RydWN0dXJlLlxuICogQGZ1bmN0aW9uIGdldEJ5TmFtZXNwYWNlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVwb1xuICogQHBhcmFtIHsqfSBmdWxseVF1YWxpZmllZE5hbWVzcGFjZSBBIHN0cmluZyBvciBhbiBhcnJ5IG9mIHN0cmluZyBkZWZpbmluZyB0aGUgbmFtZXNwYWNlLlxuICogQHBhcmFtIHtOdW1iZXJ9W10gc3RhcnRMZXZlbFxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGdldEJ5TmFtZXNwYWNlPFQ+KHJlcG86IHsgW2tleTogc3RyaW5nXTogVCB9LFxuICAgIGlkZW50aWZpZXJzOiBBcnJheTxzdHJpbmc+LFxuICAgIHN0YXJ0TGV2ZWw6IG51bWJlciA9IDEpOiBUIHtcblxuICAgIGNvbnN0IHJlc3RJZGVudGlmaWVycyA9IGlkZW50aWZpZXJzLnNsaWNlKHN0YXJ0TGV2ZWwpO1xuICAgIGNvbnN0IHJlc3RLZXkgPSByZXN0SWRlbnRpZmllcnMuam9pbignLicpO1xuICAgIGlmIChyZXBvW3Jlc3RLZXldKSB7XG4gICAgICAgIHJldHVybiByZXBvW3Jlc3RLZXldO1xuICAgIH1cblxuICAgIGxldCBpbml0UmVwbzogYW55ID0gcmVwbztcbiAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0TGV2ZWw7IGluZGV4IDwgaWRlbnRpZmllcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmICghaW5pdFJlcG8pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleSA9IGlkZW50aWZpZXJzW2luZGV4XTtcbiAgICAgICAgaW5pdFJlcG8gPSBpbml0UmVwb1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdFJlcG87XG59XG5cbmludGVyZmFjZSBJQ29uZmlndXJhdGlvbkVudHJ5IHtcbiAgICB1cmk6IHN0cmluZztcbiAgICBsaXZlU2Vjb25kczogbnVtYmVyO1xufVxuXG4vKipcbiAqIEBjbGFzcyBSZXNvdXJjZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlTG9hZGVyIHtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IHsgW2tleTogc3RyaW5nXTogSUNvbmZpZ3VyYXRpb25FbnRyeSB9O1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBAZnVuY3Rpb24gaW5pdFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NhY2hlOiBJU2xpZGluZ0V4cGlyZUNhY2hlPGFueT4gPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmUgYSByZXNvdXJjZVxuICAgICAqIEBmdW5jdGlvbiByZWdpc3RlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIHJlc291cmNlIGtleS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJpIFRoZSByZXNvdXJjZSBVUkkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxpdmVTZWNvbmRzIFRoZSBjYWNoZSBwZXJpb2QuXG4gICAgICogQHRocm93cyB7RXJyb3J9XG4gICAgICovXG4gICAgcmVnaXN0ZXIoa2V5OiBzdHJpbmcsIHVyaTogc3RyaW5nLCBsaXZlU2Vjb25kczogbnVtYmVyID0gNjApIHtcbiAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbiA9IHRoaXMuX2NvbmZpZ3VyYXRpb247XG4gICAgICAgIGlmIChjb25maWd1cmF0aW9uW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVnaXN0ZXJpbmcgYW4gZXhpc3RpbmcgcmVzb3VyY2Uga2V5OiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWd1cmF0aW9uW2tleV0gPSB7XG4gICAgICAgICAgICB1cmk6IHVyaSxcbiAgICAgICAgICAgIGxpdmVTZWNvbmRzOiBsaXZlU2Vjb25kc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSByZWdpc3RlcmVkIGl0ZW1cbiAgICAgKiBAZnVuY3Rpb24gdW5kb1JlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgcmVzb3VyY2Uga2V5IHRvIGJlIHJlbW92ZWQuXG4gICAgICovXG4gICAgdW5kb1JlZ2lzdGVyKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSB0aGlzLl9jb25maWd1cmF0aW9uO1xuICAgICAgICBpZiAoY29uZmlndXJhdGlvbltrZXldKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlndXJhdGlvbltrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVzb3VyY2Uga2V5LlxuICAgICAqIEBmdW5jdGlvbiBnZXRQcm9taXNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZ1bGx5UXVhbGlmaWVkTmFtZXNwYWNlIFRoZSByZXNvdXJjZSBrZXkuXG4gICAgICogQHJldHVybnMgeyp9IFRoZSByZXNvdXJjZSB2YWx1ZS5cbiAgICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICAgKi9cbiAgICBnZXRQcm9taXNlPFQ+KGZ1bGx5UXVhbGlmaWVkTmFtZXNwYWNlOiBzdHJpbmcsXG4gICAgICAgIGNvbnZlcnRvcjogKGFueSkgPT4gYW55KTogUHJvbWlzZUxpa2U8VD4ge1xuICAgICAgICBjb25zdCBpZGVudGlmaWVycyA9IGZ1bGx5UXVhbGlmaWVkTmFtZXNwYWNlLnNwbGl0KCcuJyk7XG4gICAgICAgIGNvbnN0IHRvcElkZW50aWZpZXIgPSBpZGVudGlmaWVyc1swXTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAvLyBGaWd1cmUgb3V0IHRoZSBtYXN0ZXIga2V5XG4gICAgICAgICAgICBjb25zdCByZXBvID0gY2FjaGUuZ2V0KHRvcElkZW50aWZpZXIsIDYwKTtcbiAgICAgICAgICAgIGlmIChyZXBvKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRCeU5hbWVzcGFjZTxUPihyZXBvLCBpZGVudGlmaWVycyk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpZnQodmFsdWUsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fY29uZmlndXJhdGlvblt0b3BJZGVudGlmaWVyXTtcbiAgICAgICAgaWYgKCFlbnRyeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHZXQgdW5yZWdpc3RlcmVkIHJlc291cmNlOiAnICsgdG9wSWRlbnRpZmllcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UsIGxvYWQgaXRcbiAgICAgICAgcmV0dXJuIGxvYWRKc29uVXJpUChlbnRyeS51cmkpLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb252ZXJ0b3IoY29udGVudCk7XG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbmV3IHZhbHVlXG4gICAgICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5zZXQodG9wSWRlbnRpZmllciwgY29udGVudCwgZW50cnkubGl2ZVNlY29uZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdldEJ5TmFtZXNwYWNlKGNvbnRlbnQsIGlkZW50aWZpZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19