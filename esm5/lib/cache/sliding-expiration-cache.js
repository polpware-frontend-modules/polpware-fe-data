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
import * as tslib_1 from "tslib";
import * as dependencies from '@polpware/fe-dependencies';
import { MemoryBackend } from './memory-backend';
import { observableDecorator } from '../decorators/observable.decorator';
var locache = dependencies.locache;
var meld = dependencies.meld;
var originalRemove = Object.getPrototypeOf(locache.locache).remove;
var currentTime = function () {
    return new Date().getTime();
};
var ɵ0 = currentTime;
var SlidingExpirationCache = /** @class */ (function () {
    function SlidingExpirationCache(_defaultSeconds, scheduleInterval, ngZone) {
        var _this = this;
        this._defaultSeconds = _defaultSeconds;
        var backend = new MemoryBackend();
        this._cache = locache.locache.createCache({ storage: backend });
        this._cache.remove = meld.around(originalRemove, function (input) {
            var key = input.args[0];
            var onExpireEvtName = _this.onExpireEventName(key);
            var event = _this.asObservable.fire(onExpireEvtName, {});
            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                _this.resetExpireKey(key, _this._defaultSeconds);
                return false;
            }
            // Otherwise, continue the original logic
            // Remove all listener
            _this.asObservable.off(onExpireEvtName, null);
            input.proceed();
            // fire event
            var afterRemoveEvtName = _this.afterRemoveEventName(key);
            _this.asObservable.fire(afterRemoveEvtName, {});
            return true;
        });
        // interval
        if (scheduleInterval) {
            if (ngZone) {
                ngZone.runOutsideAngular(function () {
                    _this._timeInterval = setInterval(function () {
                        _this._cache.cleanup();
                    }, scheduleInterval * 1000);
                });
            }
            else {
                this._timeInterval = setInterval(function () {
                    _this._cache.cleanup();
                }, scheduleInterval * 1000);
            }
        }
        else {
            this._timeInterval = null;
        }
    }
    SlidingExpirationCache.prototype.onExpireEventName = function (key) {
        return 'onExpire:' + key;
    };
    SlidingExpirationCache.prototype.afterRemoveEventName = function (key) {
        return 'afterRemove:' + key;
    };
    SlidingExpirationCache.prototype.resetExpireKey = function (key, seconds) {
        var expirekey = this._cache.expirekey(key);
        var ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    };
    Object.defineProperty(SlidingExpirationCache.prototype, "asObservable", {
        get: function () {
            var self = this;
            var observable = self;
            return observable;
        },
        enumerable: true,
        configurable: true
    });
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    SlidingExpirationCache.prototype.set = function (key, value, seconds, afterRemoveCallback) {
        var expirekey = this._cache.expirekey(key);
        var valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            var ms = seconds * 1000;
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
    };
    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    SlidingExpirationCache.prototype.get = function (key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        var valueKey = this._cache.key(key);
        var value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    };
    SlidingExpirationCache.prototype.rmOnExpireHandler = function (key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    };
    SlidingExpirationCache.prototype.addOnExpireHandler = function (key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    };
    Object.defineProperty(SlidingExpirationCache.prototype, "count", {
        get: function () {
            return this._cache.length();
        },
        enumerable: true,
        configurable: true
    });
    SlidingExpirationCache.prototype.reset = function () {
        var _this = this;
        var keys = this._cache.keys();
        keys.forEach(function (k) {
            _this.asObservable.off(_this.onExpireEventName(k), null);
            originalRemove.call(_this._cache, k);
            _this.asObservable.fire(_this.afterRemoveEventName(k), {});
        });
    };
    // must destory, or leaking ...
    SlidingExpirationCache.prototype.destroy = function () {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    };
    SlidingExpirationCache = tslib_1.__decorate([
        observableDecorator,
        tslib_1.__metadata("design:paramtypes", [Number, Number, Object])
    ], SlidingExpirationCache);
    return SlidingExpirationCache;
}());
export { SlidingExpirationCache };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvY2FjaGUvc2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUU7QUFDRix5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRix3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUscUVBQXFFO0FBQ3JFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLGtFQUFrRTtBQUNsRSxxRUFBcUU7QUFDckUsd0RBQXdEO0FBQ3hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLGtFQUFrRTtBQUNsRSxFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsaUJBQWlCOztBQUVqQixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQVN6RSxJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO0FBQ3JDLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBRXJFLElBQU0sV0FBVyxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQyxDQUFDLENBQUM7O0FBR0Y7SUFLSSxnQ0FBb0IsZUFBdUIsRUFDdkMsZ0JB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QUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZELGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0JBQStCO0lBQy9CLHdDQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyQztJQUNMLENBQUM7SUF2SlEsc0JBQXNCO1FBRGxDLG1CQUFtQjs7T0FDUCxzQkFBc0IsQ0F3SmxDO0lBQUQsNkJBQUM7Q0FBQSxBQXhKRCxJQXdKQztTQXhKWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvL1xyXG4vLyBBdXRob3I6OiBUb20gVGFuZyA8cG9scHdhcmVAZ21haWwuY29tPlxyXG4vLyBDb3B5cmlnaHQ6OiBDb3B5cmlnaHQgKGMpIDIwMTcsIFhpYW9sb25nIFRhbmdcclxuLy9cclxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbi8vIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuLy8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbi8vIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuLy9cclxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbi8vXHJcbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4vL1xyXG4vLyBFeGNlcHQgYXMgY29udGFpbmVkIGluIHRoaXMgbm90aWNlLCB0aGUgbmFtZShzKSBvZiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vIGhvbGRlcnMgc2hhbGwgbm90IGJlIHVzZWQgaW4gYWR2ZXJ0aXNpbmcgb3Igb3RoZXJ3aXNlIHRvIHByb21vdGUgdGhlXHJcbi8vIHNhbGUsIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGlzIFNvZnR3YXJlIHdpdGhvdXQgcHJpb3Igd3JpdHRlblxyXG4vLyBhdXRob3JpemF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xyXG5cclxuaW1wb3J0IHsgTWVtb3J5QmFja2VuZCB9IGZyb20gJy4vbWVtb3J5LWJhY2tlbmQnO1xyXG5pbXBvcnQgeyBvYnNlcnZhYmxlRGVjb3JhdG9yIH0gZnJvbSAnLi4vZGVjb3JhdG9ycy9vYnNlcnZhYmxlLmRlY29yYXRvcic7XHJcblxyXG5pbXBvcnQgeyBJRXZlbnRBcmdzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ldmVudC1hcmdzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElPYnNlcnZhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9vYnNlcnZhYmxlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElKb2lucG9pbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2pvaW50LXBvaW50LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElOZ1pvbmVMaWtlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9uZy16b25lLWxpa2UuaW50ZXJmYWNlJztcclxuXHJcbmltcG9ydCB7IElTbGlkaW5nRXhwaXJlQ2FjaGUgfSBmcm9tICcuL3NsaWRpbmctZXhwaXJlLWNhY2hlLmludGVyZmFjZSc7XHJcblxyXG5jb25zdCBsb2NhY2hlID0gZGVwZW5kZW5jaWVzLmxvY2FjaGU7XHJcbmNvbnN0IG1lbGQgPSBkZXBlbmRlbmNpZXMubWVsZDtcclxuXHJcbmNvbnN0IG9yaWdpbmFsUmVtb3ZlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGxvY2FjaGUubG9jYWNoZSkucmVtb3ZlO1xyXG5cclxuY29uc3QgY3VycmVudFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxufTtcclxuXHJcbkBvYnNlcnZhYmxlRGVjb3JhdG9yXHJcbmV4cG9ydCBjbGFzcyBTbGlkaW5nRXhwaXJhdGlvbkNhY2hlPFQ+IGltcGxlbWVudHMgSVNsaWRpbmdFeHBpcmVDYWNoZTxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FjaGU6IGFueTtcclxuICAgIHByaXZhdGUgX3RpbWVJbnRlcnZhbDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlZmF1bHRTZWNvbmRzOiBudW1iZXIsXHJcbiAgICAgICAgc2NoZWR1bGVJbnRlcnZhbD86IG51bWJlciwgbmdab25lPzogSU5nWm9uZUxpa2UpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYmFja2VuZCA9IG5ldyBNZW1vcnlCYWNrZW5kPFQ+KCk7XHJcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBsb2NhY2hlLmxvY2FjaGUuY3JlYXRlQ2FjaGUoeyBzdG9yYWdlOiBiYWNrZW5kIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jYWNoZS5yZW1vdmUgPSBtZWxkLmFyb3VuZChvcmlnaW5hbFJlbW92ZSwgKGlucHV0OiBJSm9pbnBvaW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBpbnB1dC5hcmdzWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBvbkV4cGlyZUV2dE5hbWUgPSB0aGlzLm9uRXhwaXJlRXZlbnROYW1lKGtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5hc09ic2VydmFibGUuZmlyZShvbkV4cGlyZUV2dE5hbWUsIHt9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSBldmVudCBpcyBzdG9wcGVkLCB0aGVuIHN0b3AgZG9pbmcgaXRcclxuICAgICAgICAgICAgLy8gbW9yZSB0aW1lIGlzIHJlcXVpcmVkIC4uLlxyXG4gICAgICAgICAgICBpZiAoZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRFeHBpcmVLZXkoa2V5LCB0aGlzLl9kZWZhdWx0U2Vjb25kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY29udGludWUgdGhlIG9yaWdpbmFsIGxvZ2ljXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUub2ZmKG9uRXhwaXJlRXZ0TmFtZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIGlucHV0LnByb2NlZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpcmUgZXZlbnRcclxuICAgICAgICAgICAgY29uc3QgYWZ0ZXJSZW1vdmVFdnROYW1lID0gdGhpcy5hZnRlclJlbW92ZUV2ZW50TmFtZShrZXkpO1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKGFmdGVyUmVtb3ZlRXZ0TmFtZSwge30pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGludGVydmFsXHJcbiAgICAgICAgaWYgKHNjaGVkdWxlSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgaWYgKG5nWm9uZSkge1xyXG4gICAgICAgICAgICAgICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLmNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBzY2hlZHVsZUludGVydmFsICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBzY2hlZHVsZUludGVydmFsICogMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXhwaXJlRXZlbnROYW1lKGtleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ29uRXhwaXJlOicgKyBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZnRlclJlbW92ZUV2ZW50TmFtZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdhZnRlclJlbW92ZTonICsga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzZXRFeHBpcmVLZXkoa2V5OiBzdHJpbmcsIHNlY29uZHM6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGV4cGlyZWtleSA9IHRoaXMuX2NhY2hlLmV4cGlyZWtleShrZXkpO1xyXG4gICAgICAgIGNvbnN0IG1zID0gc2Vjb25kcyAqIDEwMDA7XHJcbiAgICAgICAgdGhpcy5fY2FjaGUuc3RvcmFnZS5zZXQoZXhwaXJla2V5LCBjdXJyZW50VGltZSgpICsgbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhc09ic2VydmFibGUoKTogSU9ic2VydmFibGUge1xyXG4gICAgICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZTogSU9ic2VydmFibGUgPSBzZWxmO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdpdmVuIGEga2V5LCBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCBudW1iZXIgb2Ygc2Vjb25kcyBzdG9yZSB0aGUgdmFsdWVcclxuICAgIC8vIGluIHRoZSBzdG9yYWdlIGJhY2tlbmQuXHJcbiAgICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBULCBzZWNvbmRzOiBudW1iZXIsIGFmdGVyUmVtb3ZlQ2FsbGJhY2s/OiAoZXZ0OiBJRXZlbnRBcmdzPHt9PikgPT4gSUV2ZW50QXJnczx7fT4pIHtcclxuXHJcbiAgICAgICAgY29uc3QgZXhwaXJla2V5ID0gdGhpcy5fY2FjaGUuZXhwaXJla2V5KGtleSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVLZXkgPSB0aGlzLl9jYWNoZS5rZXkoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZHMpIHtcclxuICAgICAgICAgICAgLy8gVGhlIHRpbWUgc3RvcmVkIGlzIGluIG1pbGxpc2Vjb25kcywgYnV0IHRoaXMgZnVuY3Rpb24gZXhwZWN0c1xyXG4gICAgICAgICAgICAvLyBzZWNvbmRzLCBzbyBtdWx0aXBseSBieSAxMDAwLlxyXG4gICAgICAgICAgICBjb25zdCBtcyA9IHNlY29uZHMgKiAxMDAwO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZS5zdG9yYWdlLnNldChleHBpcmVrZXksIGN1cnJlbnRUaW1lKCkgKyBtcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBleHBpcmUga2V5LCBpZiBubyB0aW1lb3V0IGlzIHNldFxyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZS5zdG9yYWdlLnJlbW92ZShleHBpcmVrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFmdGVyUmVtb3ZlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUub25jZSh0aGlzLmFmdGVyUmVtb3ZlRXZlbnROYW1lKGtleSksIGFmdGVyUmVtb3ZlQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLnN0b3JhZ2Uuc2V0KHZhbHVlS2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmV0Y2ggYSB2YWx1ZSBmcm9tIHRoZSBjYWNoZS4gRWl0aGVyIHJldHVybnMgdGhlIHZhbHVlLCBvciBpZiBpdFxyXG4gICAgLy8gZG9lc24ndCBleGlzdCAob3IgaGFzIGV4cGlyZWQpIHJldHVybiBudWxsLlxyXG4gICAgZ2V0KGtleTogc3RyaW5nLCBzZWNvbmRzPzogbnVtYmVyKTogVCB8IG51bGwge1xyXG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBoYXMgZXhwaXJlZCwgYmVmb3JlIHJldHVybmluZyBudWxsIHJlbW92ZSB0aGUga2V5XHJcbiAgICAgICAgLy8gZnJvbSB0aGUgc3RvcmFnZSBiYWNrZW5kIHRvIGZyZWUgdXAgdGhlIHNwYWNlLlxyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZS5oYXNFeHBpcmVkKGtleSkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlLnJlbW92ZShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWVLZXkgPSB0aGlzLl9jYWNoZS5rZXkoa2V5KTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2NhY2hlLnN0b3JhZ2UuZ2V0KHZhbHVlS2V5KTtcclxuXHJcbiAgICAgICAgLy8gU2xpZGUgdGhlIGV4cGlyZSBrZVxyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0RXhwaXJlS2V5KGtleSwgc2Vjb25kcyB8fCB0aGlzLl9kZWZhdWx0U2Vjb25kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB2YWx1ZSBpc24ndCB0cnV0aHksIGl0IG11c3QgYmUgYW4gZW1wdHkgc3RyaW5nIG9yIHNpbWlsYXIsIHNvXHJcbiAgICAgICAgLy8ganVzdCByZXR1cm4gdGhhdC5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcm1PbkV4cGlyZUhhbmRsZXIoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZ0OiBJRXZlbnRBcmdzPHt9PikgPT4gSUV2ZW50QXJnczx7fT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vZmYodGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrZXkpLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkT25FeHBpcmVIYW5kbGVyKGtleTogc3RyaW5nLCBjYWxsYmFjazogKGV2dDogSUV2ZW50QXJnczx7fT4pID0+IElFdmVudEFyZ3M8e30+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hc09ic2VydmFibGUub24odGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrZXkpLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZS5sZW5ndGgoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5fY2FjaGUua2V5cygpO1xyXG4gICAgICAgIGtleXMuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vZmYodGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrKSwgbnVsbCk7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsUmVtb3ZlLmNhbGwodGhpcy5fY2FjaGUsIGspO1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKHRoaXMuYWZ0ZXJSZW1vdmVFdmVudE5hbWUoayksIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBtdXN0IGRlc3RvcnksIG9yIGxlYWtpbmcgLi4uXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3RpbWVJbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==