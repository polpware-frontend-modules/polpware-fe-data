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
import { __decorate, __metadata } from "tslib";
import * as dependencies from '@polpware/fe-dependencies';
import { MemoryBackend } from './memory-backend';
import { observableDecorator } from '../decorators/observable.decorator';
var locache = dependencies.locache;
var meld = dependencies.meld;
var originalRemove = Object.getPrototypeOf(locache.locache).remove;
var currentTime = function () {
    return new Date().getTime();
};
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
    SlidingExpirationCache.ctorParameters = function () { return [
        { type: Number },
        { type: Number },
        { type: undefined }
    ]; };
    SlidingExpirationCache = __decorate([
        observableDecorator,
        __metadata("design:paramtypes", [Number, Number, Object])
    ], SlidingExpirationCache);
    return SlidingExpirationCache;
}());
export { SlidingExpirationCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvY2FjaGUvc2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUU7QUFDRix5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRix3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUscUVBQXFFO0FBQ3JFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLGtFQUFrRTtBQUNsRSxxRUFBcUU7QUFDckUsd0RBQXdEO0FBQ3hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLGtFQUFrRTtBQUNsRSxFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsaUJBQWlCOztBQUVqQixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQVN6RSxJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO0FBQ3JDLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBRXJFLElBQU0sV0FBVyxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFHRjtJQUtJLGdDQUFvQixlQUF1QixFQUN2QyxnQkFBeUIsRUFBRSxNQUFvQjtRQURuRCxpQkFnREM7UUFoRG1CLG9CQUFlLEdBQWYsZUFBZSxDQUFRO1FBR3ZDLElBQU0sT0FBTyxHQUFHLElBQUksYUFBYSxFQUFLLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQUMsS0FBaUI7WUFFL0QsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFNLGVBQWUsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEQsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTFELDhDQUE4QztZQUM5Qyw0QkFBNEI7WUFDNUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDNUIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUMvQyxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUVELHlDQUF5QztZQUN6QyxzQkFBc0I7WUFDdEIsS0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVoQixhQUFhO1lBQ2IsSUFBTSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFL0MsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxXQUFXO1FBQ1gsSUFBSSxnQkFBZ0IsRUFBRTtZQUNsQixJQUFJLE1BQU0sRUFBRTtnQkFDUixNQUFNLENBQUMsaUJBQWlCLENBQUM7b0JBQ3JCLEtBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDO3dCQUM3QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUMxQixDQUFDLEVBQUUsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2FBQ047aUJBQ0k7Z0JBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7b0JBQzdCLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzFCLENBQUMsRUFBRSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUMvQjtTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFFTyxrREFBaUIsR0FBekIsVUFBMEIsR0FBVztRQUNqQyxPQUFPLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDN0IsQ0FBQztJQUVPLHFEQUFvQixHQUE1QixVQUE2QixHQUFXO1FBQ3BDLE9BQU8sY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUNoQyxDQUFDO0lBRU8sK0NBQWMsR0FBdEIsVUFBdUIsR0FBVyxFQUFFLE9BQWU7UUFDL0MsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsSUFBTSxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxzQkFBSSxnREFBWTthQUFoQjtZQUNJLElBQU0sSUFBSSxHQUFRLElBQUksQ0FBQztZQUN2QixJQUFNLFVBQVUsR0FBZ0IsSUFBSSxDQUFDO1lBQ3JDLE9BQU8sVUFBVSxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQseUVBQXlFO0lBQ3pFLDBCQUEwQjtJQUMxQixvQ0FBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVEsRUFBRSxPQUFlLEVBQUUsbUJBQTZEO1FBRXJHLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRDLElBQUksT0FBTyxFQUFFO1lBQ1QsZ0VBQWdFO1lBQ2hFLGdDQUFnQztZQUNoQyxJQUFNLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNILDhDQUE4QztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDekM7UUFFRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsOENBQThDO0lBQzlDLG9DQUFHLEdBQUgsVUFBSSxHQUFXLEVBQUUsT0FBZ0I7UUFDN0IsaUVBQWlFO1FBQ2pFLGlEQUFpRDtRQUNqRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUVELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoRCxzQkFBc0I7UUFDdEIsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsbUVBQW1FO1FBQ25FLG9CQUFvQjtRQUNwQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsa0RBQWlCLEdBQWpCLFVBQWtCLEdBQVcsRUFBRSxRQUFpRDtRQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELG1EQUFrQixHQUFsQixVQUFtQixHQUFXLEVBQUUsUUFBaUQ7UUFDN0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxzQkFBVyx5Q0FBSzthQUFoQjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTtJQUVELHNDQUFLLEdBQUw7UUFBQSxpQkFPQztRQU5HLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7WUFDWCxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkQsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwrQkFBK0I7SUFDL0Isd0NBQU8sR0FBUDtRQUNJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUViLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQzs7Ozs7O0lBdkpRLHNCQUFzQjtRQURsQyxtQkFBbUI7O09BQ1Asc0JBQXNCLENBd0psQztJQUFELDZCQUFDO0NBQUEsQUF4SkQsSUF3SkM7U0F4Slksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLy9cclxuLy8gQXV0aG9yOjogVG9tIFRhbmcgPHBvbHB3YXJlQGdtYWlsLmNvbT5cclxuLy8gQ29weXJpZ2h0OjogQ29weXJpZ2h0IChjKSAyMDE3LCBYaWFvbG9uZyBUYW5nXHJcbi8vXHJcbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xyXG4vLyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcclxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXHJcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcclxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXHJcbi8vIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xyXG4vLyB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbi8vXHJcbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXHJcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4vL1xyXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxyXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcclxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcclxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxyXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXHJcbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxyXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuLy9cclxuLy8gRXhjZXB0IGFzIGNvbnRhaW5lZCBpbiB0aGlzIG5vdGljZSwgdGhlIG5hbWUocykgb2YgdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4vLyBob2xkZXJzIHNoYWxsIG5vdCBiZSB1c2VkIGluIGFkdmVydGlzaW5nIG9yIG90aGVyd2lzZSB0byBwcm9tb3RlIHRoZVxyXG4vLyBzYWxlLCB1c2Ugb3Igb3RoZXIgZGVhbGluZ3MgaW4gdGhpcyBTb2Z0d2FyZSB3aXRob3V0IHByaW9yIHdyaXR0ZW5cclxuLy8gYXV0aG9yaXphdGlvbi5cclxuXHJcbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcclxuXHJcbmltcG9ydCB7IE1lbW9yeUJhY2tlbmQgfSBmcm9tICcuL21lbW9yeS1iYWNrZW5kJztcclxuaW1wb3J0IHsgb2JzZXJ2YWJsZURlY29yYXRvciB9IGZyb20gJy4uL2RlY29yYXRvcnMvb2JzZXJ2YWJsZS5kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgSUV2ZW50QXJncyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZXZlbnQtYXJncy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBJT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvb2JzZXJ2YWJsZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBJSm9pbnBvaW50IH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9qb2ludC1wb2ludC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBJTmdab25lTGlrZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvbmctem9uZS1saWtlLmludGVyZmFjZSc7XHJcblxyXG5pbXBvcnQgeyBJU2xpZGluZ0V4cGlyZUNhY2hlIH0gZnJvbSAnLi9zbGlkaW5nLWV4cGlyZS1jYWNoZS5pbnRlcmZhY2UnO1xyXG5cclxuY29uc3QgbG9jYWNoZSA9IGRlcGVuZGVuY2llcy5sb2NhY2hlO1xyXG5jb25zdCBtZWxkID0gZGVwZW5kZW5jaWVzLm1lbGQ7XHJcblxyXG5jb25zdCBvcmlnaW5hbFJlbW92ZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihsb2NhY2hlLmxvY2FjaGUpLnJlbW92ZTtcclxuXHJcbmNvbnN0IGN1cnJlbnRUaW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbn07XHJcblxyXG5Ab2JzZXJ2YWJsZURlY29yYXRvclxyXG5leHBvcnQgY2xhc3MgU2xpZGluZ0V4cGlyYXRpb25DYWNoZTxUPiBpbXBsZW1lbnRzIElTbGlkaW5nRXhwaXJlQ2FjaGU8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX2NhY2hlOiBhbnk7XHJcbiAgICBwcml2YXRlIF90aW1lSW50ZXJ2YWw6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWZhdWx0U2Vjb25kczogbnVtYmVyLFxyXG4gICAgICAgIHNjaGVkdWxlSW50ZXJ2YWw/OiBudW1iZXIsIG5nWm9uZT86IElOZ1pvbmVMaWtlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhY2tlbmQgPSBuZXcgTWVtb3J5QmFja2VuZDxUPigpO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlID0gbG9jYWNoZS5sb2NhY2hlLmNyZWF0ZUNhY2hlKHsgc3RvcmFnZTogYmFja2VuZCB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FjaGUucmVtb3ZlID0gbWVsZC5hcm91bmQob3JpZ2luYWxSZW1vdmUsIChpbnB1dDogSUpvaW5wb2ludCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gaW5wdXQuYXJnc1swXTtcclxuICAgICAgICAgICAgY29uc3Qgb25FeHBpcmVFdnROYW1lID0gdGhpcy5vbkV4cGlyZUV2ZW50TmFtZShrZXkpO1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHRoaXMuYXNPYnNlcnZhYmxlLmZpcmUob25FeHBpcmVFdnROYW1lLCB7fSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgZXZlbnQgaXMgc3RvcHBlZCwgdGhlbiBzdG9wIGRvaW5nIGl0XHJcbiAgICAgICAgICAgIC8vIG1vcmUgdGltZSBpcyByZXF1aXJlZCAuLi5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0RXhwaXJlS2V5KGtleSwgdGhpcy5fZGVmYXVsdFNlY29uZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNvbnRpbnVlIHRoZSBvcmlnaW5hbCBsb2dpY1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVyXHJcbiAgICAgICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9mZihvbkV4cGlyZUV2dE5hbWUsIG51bGwpO1xyXG4gICAgICAgICAgICBpbnB1dC5wcm9jZWVkKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBmaXJlIGV2ZW50XHJcbiAgICAgICAgICAgIGNvbnN0IGFmdGVyUmVtb3ZlRXZ0TmFtZSA9IHRoaXMuYWZ0ZXJSZW1vdmVFdmVudE5hbWUoa2V5KTtcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUuZmlyZShhZnRlclJlbW92ZUV2dE5hbWUsIHt9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBpbnRlcnZhbFxyXG4gICAgICAgIGlmIChzY2hlZHVsZUludGVydmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChuZ1pvbmUpIHtcclxuICAgICAgICAgICAgICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgc2NoZWR1bGVJbnRlcnZhbCAqIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUuY2xlYW51cCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgc2NoZWR1bGVJbnRlcnZhbCAqIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZUludGVydmFsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkV4cGlyZUV2ZW50TmFtZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdvbkV4cGlyZTonICsga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWZ0ZXJSZW1vdmVFdmVudE5hbWUoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnYWZ0ZXJSZW1vdmU6JyArIGtleTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc2V0RXhwaXJlS2V5KGtleTogc3RyaW5nLCBzZWNvbmRzOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBleHBpcmVrZXkgPSB0aGlzLl9jYWNoZS5leHBpcmVrZXkoa2V5KTtcclxuICAgICAgICBjb25zdCBtcyA9IHNlY29uZHMgKiAxMDAwO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlLnN0b3JhZ2Uuc2V0KGV4cGlyZWtleSwgY3VycmVudFRpbWUoKSArIG1zKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYXNPYnNlcnZhYmxlKCk6IElPYnNlcnZhYmxlIHtcclxuICAgICAgICBjb25zdCBzZWxmOiBhbnkgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmFibGU6IElPYnNlcnZhYmxlID0gc2VsZjtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHaXZlbiBhIGtleSwgYSB2YWx1ZSBhbmQgYW4gb3B0aW9uYWwgbnVtYmVyIG9mIHNlY29uZHMgc3RvcmUgdGhlIHZhbHVlXHJcbiAgICAvLyBpbiB0aGUgc3RvcmFnZSBiYWNrZW5kLlxyXG4gICAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogVCwgc2Vjb25kczogbnVtYmVyLCBhZnRlclJlbW92ZUNhbGxiYWNrPzogKGV2dDogSUV2ZW50QXJnczx7fT4pID0+IElFdmVudEFyZ3M8e30+KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cGlyZWtleSA9IHRoaXMuX2NhY2hlLmV4cGlyZWtleShrZXkpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlS2V5ID0gdGhpcy5fY2FjaGUua2V5KGtleSk7XHJcblxyXG4gICAgICAgIGlmIChzZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSB0aW1lIHN0b3JlZCBpcyBpbiBtaWxsaXNlY29uZHMsIGJ1dCB0aGlzIGZ1bmN0aW9uIGV4cGVjdHNcclxuICAgICAgICAgICAgLy8gc2Vjb25kcywgc28gbXVsdGlwbHkgYnkgMTAwMC5cclxuICAgICAgICAgICAgY29uc3QgbXMgPSBzZWNvbmRzICogMTAwMDtcclxuICAgICAgICAgICAgdGhpcy5fY2FjaGUuc3RvcmFnZS5zZXQoZXhwaXJla2V5LCBjdXJyZW50VGltZSgpICsgbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXhwaXJlIGtleSwgaWYgbm8gdGltZW91dCBpcyBzZXRcclxuICAgICAgICAgICAgdGhpcy5fY2FjaGUuc3RvcmFnZS5yZW1vdmUoZXhwaXJla2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhZnRlclJlbW92ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9uY2UodGhpcy5hZnRlclJlbW92ZUV2ZW50TmFtZShrZXkpLCBhZnRlclJlbW92ZUNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZS5zdG9yYWdlLnNldCh2YWx1ZUtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZldGNoIGEgdmFsdWUgZnJvbSB0aGUgY2FjaGUuIEVpdGhlciByZXR1cm5zIHRoZSB2YWx1ZSwgb3IgaWYgaXRcclxuICAgIC8vIGRvZXNuJ3QgZXhpc3QgKG9yIGhhcyBleHBpcmVkKSByZXR1cm4gbnVsbC5cclxuICAgIGdldChrZXk6IHN0cmluZywgc2Vjb25kcz86IG51bWJlcik6IFQgfCBudWxsIHtcclxuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaGFzIGV4cGlyZWQsIGJlZm9yZSByZXR1cm5pbmcgbnVsbCByZW1vdmUgdGhlIGtleVxyXG4gICAgICAgIC8vIGZyb20gdGhlIHN0b3JhZ2UgYmFja2VuZCB0byBmcmVlIHVwIHRoZSBzcGFjZS5cclxuICAgICAgICBpZiAodGhpcy5fY2FjaGUuaGFzRXhwaXJlZChrZXkpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZS5yZW1vdmUoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlS2V5ID0gdGhpcy5fY2FjaGUua2V5KGtleSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9jYWNoZS5zdG9yYWdlLmdldCh2YWx1ZUtleSk7XHJcblxyXG4gICAgICAgIC8vIFNsaWRlIHRoZSBleHBpcmUga2VcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEV4cGlyZUtleShrZXksIHNlY29uZHMgfHwgdGhpcy5fZGVmYXVsdFNlY29uZHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdmFsdWUgaXNuJ3QgdHJ1dGh5LCBpdCBtdXN0IGJlIGFuIGVtcHR5IHN0cmluZyBvciBzaW1pbGFyLCBzb1xyXG4gICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoYXQuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJtT25FeHBpcmVIYW5kbGVyKGtleTogc3RyaW5nLCBjYWxsYmFjazogKGV2dDogSUV2ZW50QXJnczx7fT4pID0+IElFdmVudEFyZ3M8e30+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hc09ic2VydmFibGUub2ZmKHRoaXMub25FeHBpcmVFdmVudE5hbWUoa2V5KSwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE9uRXhwaXJlSGFuZGxlcihrZXk6IHN0cmluZywgY2FsbGJhY2s6IChldnQ6IElFdmVudEFyZ3M8e30+KSA9PiBJRXZlbnRBcmdzPHt9Pik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9uKHRoaXMub25FeHBpcmVFdmVudE5hbWUoa2V5KSwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGUubGVuZ3RoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMuX2NhY2hlLmtleXMoKTtcclxuICAgICAgICBrZXlzLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUub2ZmKHRoaXMub25FeHBpcmVFdmVudE5hbWUoayksIG51bGwpO1xyXG4gICAgICAgICAgICBvcmlnaW5hbFJlbW92ZS5jYWxsKHRoaXMuX2NhY2hlLCBrKTtcclxuICAgICAgICAgICAgdGhpcy5hc09ic2VydmFibGUuZmlyZSh0aGlzLmFmdGVyUmVtb3ZlRXZlbnROYW1lKGspLCB7fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbXVzdCBkZXN0b3J5LCBvciBsZWFraW5nIC4uLlxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90aW1lSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lSW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=