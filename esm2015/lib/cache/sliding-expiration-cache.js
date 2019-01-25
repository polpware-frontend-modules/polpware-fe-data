/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
//
// Author:: Tom Tang <polpware@gmail.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.
import * as dependencies from '@polpware/fe-dependencies';
import { MemoryBackend } from './memory-backend';
import { observableDecorator } from '../decorators/observable.decorator';
/** @type {?} */
const locache = dependencies.locache;
/** @type {?} */
const meld = dependencies.meld;
/** @type {?} */
const originalRemove = Object.getPrototypeOf(locache.locache).remove;
/** @type {?} */
const currentTime = function () {
    return new Date().getTime();
};
const ɵ0 = currentTime;
/**
 * @template T
 */
let SlidingExpirationCache = /**
 * @template T
 */
class SlidingExpirationCache {
    /**
     * @param {?} _defaultSeconds
     * @param {?=} scheduleInterval
     * @param {?=} ngZone
     */
    constructor(_defaultSeconds, scheduleInterval, ngZone) {
        this._defaultSeconds = _defaultSeconds;
        /** @type {?} */
        const backend = new MemoryBackend();
        this._cache = locache.locache.createCache({ storage: backend });
        this._cache.remove = meld.around(originalRemove, (input) => {
            /** @type {?} */
            const key = input.args[0];
            /** @type {?} */
            const onExpireEvtName = this.onExpireEventName(key);
            /** @type {?} */
            const event = this.asObservable.fire(onExpireEvtName, {});
            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                this.resetExpireKey(key, this._defaultSeconds);
                return false;
            }
            // Otherwise, continue the original logic
            // Remove all listener
            this.asObservable.off(onExpireEvtName, null);
            input.proceed();
            // fire event
            /** @type {?} */
            const afterRemoveEvtName = this.afterRemoveEventName(key);
            this.asObservable.fire(afterRemoveEvtName, {});
            return true;
        });
        // interval
        if (scheduleInterval) {
            if (ngZone) {
                ngZone.runOutsideAngular(() => {
                    this._timeInterval = setInterval(() => {
                        this._cache.cleanup();
                    }, scheduleInterval * 1000);
                });
            }
            else {
                this._timeInterval = setInterval(() => {
                    this._cache.cleanup();
                }, scheduleInterval * 1000);
            }
        }
        else {
            this._timeInterval = null;
        }
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    onExpireEventName(key) {
        return 'onExpire:' + key;
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    afterRemoveEventName(key) {
        return 'afterRemove:' + key;
    }
    /**
     * @private
     * @param {?} key
     * @param {?} seconds
     * @return {?}
     */
    resetExpireKey(key, seconds) {
        /** @type {?} */
        const expirekey = this._cache.expirekey(key);
        /** @type {?} */
        const ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    }
    /**
     * @return {?}
     */
    get asObservable() {
        /** @type {?} */
        const self = this;
        /** @type {?} */
        const observable = self;
        return observable;
    }
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    /**
     * @param {?} key
     * @param {?} value
     * @param {?} seconds
     * @param {?=} afterRemoveCallback
     * @return {?}
     */
    set(key, value, seconds, afterRemoveCallback) {
        /** @type {?} */
        const expirekey = this._cache.expirekey(key);
        /** @type {?} */
        const valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            /** @type {?} */
            const ms = seconds * 1000;
            this._cache.storage.set(expirekey, currentTime() + ms);
        }
        else {
            // Remove the expire key, if no timeout is set
            this._cache.storage.remove(expirekey);
        }
        if (afterRemoveCallback) {
            this.asObservable.once(this.afterRemoveEventName(key), afterRemoveCallback);
        }
        return this._cache.storage.set(valueKey, value);
    }
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    /**
     * @param {?} key
     * @param {?=} seconds
     * @return {?}
     */
    get(key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        /** @type {?} */
        const valueKey = this._cache.key(key);
        /** @type {?} */
        const value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    }
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    rmOnExpireHandler(key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    }
    /**
     * @param {?} key
     * @param {?} callback
     * @return {?}
     */
    addOnExpireHandler(key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    }
    /**
     * @return {?}
     */
    get count() {
        return this._cache.length();
    }
    /**
     * @return {?}
     */
    reset() {
        /** @type {?} */
        const keys = this._cache.keys();
        keys.forEach((k) => {
            this.asObservable.off(this.onExpireEventName(k), null);
            originalRemove.call(this._cache, k);
            this.asObservable.fire(this.afterRemoveEventName(k), {});
        });
    }
    // must destory, or leaking ...
    /**
     * @return {?}
     */
    destroy() {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
};
/**
 * @template T
 */
SlidingExpirationCache = tslib_1.__decorate([
    observableDecorator,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Object])
], SlidingExpirationCache);
export { SlidingExpirationCache };
if (false) {
    /**
     * @type {?}
     * @private
     */
    SlidingExpirationCache.prototype._cache;
    /**
     * @type {?}
     * @private
     */
    SlidingExpirationCache.prototype._timeInterval;
    /**
     * @type {?}
     * @private
     */
    SlidingExpirationCache.prototype._defaultSeconds;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvY2FjaGUvc2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOztNQVNuRSxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU87O01BQzlCLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSTs7TUFFeEIsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU07O01BRTlELFdBQVcsR0FBRztJQUNoQixPQUFPLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEMsQ0FBQzs7Ozs7SUFHWSxzQkFBc0I7OztNQUF0QixzQkFBc0I7Ozs7OztJQUsvQixZQUFvQixlQUF1QixFQUN2QyxnQkFBeUIsRUFBRSxNQUFvQjtRQUQvQixvQkFBZSxHQUFmLGVBQWUsQ0FBUTs7Y0FHakMsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFLO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQWlCLEVBQUUsRUFBRTs7a0JBRTdELEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7a0JBQ25CLGVB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LGtCQUFrQixDQUFDLEdBQVcsRUFBRSxRQUFpRDtRQUM3RSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQzs7OztJQUVELElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7O0lBRUQsS0FBSzs7Y0FDSyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZELGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7OztJQUdELE9BQU87UUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyQztJQUNMLENBQUM7Q0FDSixDQUFBOzs7O0FBeEpZLHNCQUFzQjtJQURsQyxtQkFBbUI7O0dBQ1Asc0JBQXNCLENBd0psQztTQXhKWSxzQkFBc0I7Ozs7OztJQUUvQix3Q0FBb0I7Ozs7O0lBQ3BCLCtDQUEyQjs7Ozs7SUFFZixpREFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvL1xyXG4vLyBBdXRob3I6OiBUb20gVGFuZyA8cG9scHdhcmVAZ21haWwuY29tPlxyXG4vLyBDb3B5cmlnaHQ6OiBDb3B5cmlnaHQgKGMpIDIwMTcsIFhpYW9sb25nIFRhbmdcclxuLy9cclxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbi8vIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuLy8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbi8vIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuLy9cclxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbi8vXHJcbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4vL1xyXG4vLyBFeGNlcHQgYXMgY29udGFpbmVkIGluIHRoaXMgbm90aWNlLCB0aGUgbmFtZShzKSBvZiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vIGhvbGRlcnMgc2hhbGwgbm90IGJlIHVzZWQgaW4gYWR2ZXJ0aXNpbmcgb3Igb3RoZXJ3aXNlIHRvIHByb21vdGUgdGhlXHJcbi8vIHNhbGUsIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGlzIFNvZnR3YXJlIHdpdGhvdXQgcHJpb3Igd3JpdHRlblxyXG4vLyBhdXRob3JpemF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xyXG5cclxuaW1wb3J0IHsgTWVtb3J5QmFja2VuZCB9IGZyb20gJy4vbWVtb3J5LWJhY2tlbmQnO1xyXG5pbXBvcnQgeyBvYnNlcnZhYmxlRGVjb3JhdG9yIH0gZnJvbSAnLi4vZGVjb3JhdG9ycy9vYnNlcnZhYmxlLmRlY29yYXRvcic7XHJcblxyXG5pbXBvcnQgeyBJRXZlbnRBcmdzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ldmVudC1hcmdzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElPYnNlcnZhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9vYnNlcnZhYmxlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElKb2lucG9pbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2pvaW50LXBvaW50LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElOZ1pvbmVMaWtlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9uZy16b25lLWxpa2UuaW50ZXJmYWNlJztcclxuXHJcbmltcG9ydCB7IElTbGlkaW5nRXhwaXJlQ2FjaGUgfSBmcm9tICcuL3NsaWRpbmctZXhwaXJlLWNhY2hlLmludGVyZmFjZSc7XHJcblxyXG5jb25zdCBsb2NhY2hlID0gZGVwZW5kZW5jaWVzLmxvY2FjaGU7XHJcbmNvbnN0IG1lbGQgPSBkZXBlbmRlbmNpZXMubWVsZDtcclxuXHJcbmNvbnN0IG9yaWdpbmFsUmVtb3ZlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGxvY2FjaGUubG9jYWNoZSkucmVtb3ZlO1xyXG5cclxuY29uc3QgY3VycmVudFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxufTtcclxuXHJcbkBvYnNlcnZhYmxlRGVjb3JhdG9yXHJcbmV4cG9ydCBjbGFzcyBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlPFQ+IGltcGxlbWVudHMgSVNsaWRpbmdFeHBpcmVDYWNoZTxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FjaGU6IGFueTtcclxuICAgIHByaXZhdGUgX3RpbWVJbnRlcnZhbDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlZmF1bHRTZWNvbmRzOiBudW1iZXIsXHJcbiAgICAgICAgc2NoZWR1bGVJbnRlcnZhbD86IG51bWJlciwgbmdab25lPzogSU5nWm9uZUxpa2UpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYmFja2VuZCA9IG5ldyBNZW1vcnlCYWNrZW5kPFQ+KCk7XHJcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBsb2NhY2hlLmxvY2FjaGUuY3JlYXRlQ2FjaGUoeyBzdG9yYWdlOiBiYWNrZW5kIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jYWNoZS5yZW1vdmUgPSBtZWxkLmFyb3VuZChvcmlnaW5hbFJlbW92ZSwgKGlucHV0OiBJSm9pbnBvaW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBpbnB1dC5hcmdzWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBvbkV4cGlyZUV2dE5hbWUgPSB0aGlzLm9uRXhwaXJlRXZlbnROYW1lKGtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5hc09ic2VydmFibGUuZmlyZShvbkV4cGlyZUV2dE5hbWUsIHt9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSBldmVudCBpcyBzdG9wcGVkLCB0aGVuIHN0b3AgZG9pbmcgaXRcclxuICAgICAgICAgICAgLy8gbW9yZSB0aW1lIGlzIHJlcXVpcmVkIC4uLlxyXG4gICAgICAgICAgICBpZiAoZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRFeHBpcmVLZXkoa2V5LCB0aGlzLl9kZWZhdWx0U2Vjb25kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY29udGludWUgdGhlIG9yaWdpbmFsIGxvZ2ljXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUub2ZmKG9uRXhwaXJlRXZ0TmFtZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIGlucHV0LnByb2NlZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpcmUgZXZlbnRcclxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJSZW1vdmVFdnROYW1lID0gdGhpcy5hZnRlclJlbW92ZUV2ZW50TmFtZShrZXkpO1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKGFmdGVyUmVtb3ZlRXZ0TmFtZSwge30pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGludGVydmFsXHJcbiAgICAgICAgaWYgKHNjaGVkdWxlSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgaWYgKG5nWm9uZSkge1xyXG4gICAgICAgICAgICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLmNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBzY2hlZHVsZUludGVydmFsICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBzY2hlZHVsZUludGVydmFsICogMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXhwaXJlRXZlbnROYW1lKGtleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ29uRXhwaXJlOicgKyBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZnRlclJlbW92ZUV2ZW50TmFtZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdhZnRlclJlbW92ZTonICsga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzZXRFeHBpcmVLZXkoa2V5OiBzdHJpbmcsIHNlY29uZHM6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGV4cGlyZWtleSA9IHRoaXMuX2NhY2hlLmV4cGlyZWtleShrZXkpO1xyXG4gICAgICAgIGNvbnN0IG1zID0gc2Vjb25kcyAqIDEwMDA7XHJcbiAgICAgICAgdGhpcy5fY2FjaGUuc3RvcmFnZS5zZXQoZXhwaXJla2V5LCBjdXJyZW50VGltZSgpICsgbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhc09ic2VydmFibGUoKTogSU9ic2VydmFibGUge1xyXG4gICAgICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZTogSU9ic2VydmFibGUgPSBzZWxmO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdpdmVuIGEga2V5LCBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCBudW1iZXIgb2Ygc2Vjb25kcyBzdG9yZSB0aGUgdmFsdWVcclxuICAgIC8vIGluIHRoZSBzdG9yYWdlIGJhY2tlbmQuXHJcbiAgICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBULCBzZWNvbmRzOiBudW1iZXIsIGFmdGVyUmVtb3ZlQ2FsbGJhY2s/OiAoZXZ0OiBJRXZlbnRBcmdzPHt9PikgPT4gSUV2ZW50QXJnczx7fT4pIHtcclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJla2V5ID0gdGhpcy5fY2FjaGUuZXhwaXJla2V5KGtleSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVLZXkgPSB0aGlzLl9jYWNoZS5rZXkoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZHMpIHtcclxuICAgICAgICAgICAgLy8gVGhlIHRpbWUgc3RvcmVkIGlzIGluIG1pbGxpc2Vjb25kcywgYnV0IHRoaXMgZnVuY3Rpb24gZXhwZWN0c1xyXG4gICAgICAgICAgICAvLyBzZWNvbmRzLCBzbyBtdWx0aXBseSBieSAxMDAwLlxyXG4gICAgICAgICAgICBjb25zdCBtcyA9IHNlY29uZHMgKiAxMDAwO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZS5zdG9yYWdlLnNldChleHBpcmVrZXksIGN1cnJlbnRUaW1lKCkgKyBtcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBleHBpcmUga2V5LCBpZiBubyB0aW1lb3V0IGlzIHNldFxyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZS5zdG9yYWdlLnJlbW92ZShleHBpcmVrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFmdGVyUmVtb3ZlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUub25jZSh0aGlzLmFmdGVyUmVtb3ZlRXZlbnROYW1lKGtleSksIGFmdGVyUmVtb3ZlQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLnN0b3JhZ2Uuc2V0KHZhbHVlS2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmV0Y2ggYSB2YWx1ZSBmcm9tIHRoZSBjYWNoZS4gRWl0aGVyIHJldHVybnMgdGhlIHZhbHVlLCBvciBpZiBpdFxyXG4gICAgLy8gZG9lc24ndCBleGlzdCAob3IgaGFzIGV4cGlyZWQpIHJldHVybiBudWxsLlxyXG4gICAgZ2V0KGtleTogc3RyaW5nLCBzZWNvbmRzPzogbnVtYmVyKTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBoYXMgZXhwaXJlZCwgYmVmb3JlIHJldHVybmluZyBudWxsIHJlbW92ZSB0aGUga2V5XHJcbiAgICAgICAgLy8gZnJvbSB0aGUgc3RvcmFnZSBiYWNrZW5kIHRvIGZyZWUgdXAgdGhlIHNwYWNlLlxyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZS5oYXNFeHBpcmVkKGtleSkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlLnJlbW92ZShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWVLZXkgPSB0aGlzLl9jYWNoZS5rZXkoa2V5KTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2NhY2hlLnN0b3JhZ2UuZ2V0KHZhbHVlS2V5KTtcclxuXHJcbiAgICAgICAgLy8gU2xpZGUgdGhlIGV4cGlyZSBrZVxyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0RXhwaXJlS2V5KGtleSwgc2Vjb25kcyB8fCB0aGlzLl9kZWZhdWx0U2Vjb25kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB2YWx1ZSBpc24ndCB0cnV0aHksIGl0IG11c3QgYmUgYW4gZW1wdHkgc3RyaW5nIG9yIHNpbWlsYXIsIHNvXHJcbiAgICAgICAgLy8ganVzdCByZXR1cm4gdGhhdC5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcm1PbkV4cGlyZUhhbmRsZXIoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZ0OiBJRXZlbnRBcmdzPHt9PikgPT4gSUV2ZW50QXJnczx7fT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vZmYodGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrZXkpLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkT25FeHBpcmVIYW5kbGVyKGtleTogc3RyaW5nLCBjYWxsYmFjazogKGV2dDogSUV2ZW50QXJnczx7fT4pID0+IElFdmVudEFyZ3M8e30+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hc09ic2VydmFibGUub24odGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrZXkpLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZS5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5fY2FjaGUua2V5cygpO1xyXG4gICAgICAgIGtleXMuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vZmYodGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrKSwgbnVsbCk7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsUmVtb3ZlLmNhbGwodGhpcy5fY2FjaGUsIGspO1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKHRoaXMuYWZ0ZXJSZW1vdmVFdmVudE5hbWUoayksIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBtdXN0IGRlc3RvcnksIG9yIGxlYWtpbmcgLi4uXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3RpbWVJbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==