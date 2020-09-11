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
const locache = dependencies.locache;
const meld = dependencies.meld;
const originalRemove = Object.getPrototypeOf(locache.locache).remove;
const currentTime = function () {
    return new Date().getTime();
};
let SlidingExpirationCache = class SlidingExpirationCache {
    constructor(_defaultSeconds, scheduleInterval, ngZone) {
        this._defaultSeconds = _defaultSeconds;
        const backend = new MemoryBackend();
        this._cache = locache.locache.createCache({ storage: backend });
        this._cache.remove = meld.around(originalRemove, (input) => {
            const key = input.args[0];
            const onExpireEvtName = this.onExpireEventName(key);
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
    onExpireEventName(key) {
        return 'onExpire:' + key;
    }
    afterRemoveEventName(key) {
        return 'afterRemove:' + key;
    }
    resetExpireKey(key, seconds) {
        const expirekey = this._cache.expirekey(key);
        const ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    }
    get asObservable() {
        const self = this;
        const observable = self;
        return observable;
    }
    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    set(key, value, seconds, afterRemoveCallback) {
        const expirekey = this._cache.expirekey(key);
        const valueKey = this._cache.key(key);
        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
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
    get(key, seconds) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
        }
        const valueKey = this._cache.key(key);
        const value = this._cache.storage.get(valueKey);
        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }
        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    }
    rmOnExpireHandler(key, callback) {
        this.asObservable.off(this.onExpireEventName(key), callback);
    }
    addOnExpireHandler(key, callback) {
        this.asObservable.on(this.onExpireEventName(key), callback);
    }
    get count() {
        return this._cache.length();
    }
    reset() {
        const keys = this._cache.keys();
        keys.forEach((k) => {
            this.asObservable.off(this.onExpireEventName(k), null);
            originalRemove.call(this._cache, k);
            this.asObservable.fire(this.afterRemoveEventName(k), {});
        });
    }
    // must destory, or leaking ...
    destroy() {
        this.reset();
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
};
SlidingExpirationCache.ctorParameters = () => [
    { type: Number },
    { type: Number },
    { type: undefined }
];
SlidingExpirationCache = __decorate([
    observableDecorator,
    __metadata("design:paramtypes", [Number, Number, Object])
], SlidingExpirationCache);
export { SlidingExpirationCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvY2FjaGUvc2xpZGluZy1leHBpcmF0aW9uLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUU7QUFDRix5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRix3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUscUVBQXFFO0FBQ3JFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLGtFQUFrRTtBQUNsRSxxRUFBcUU7QUFDckUsd0RBQXdEO0FBQ3hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLGtFQUFrRTtBQUNsRSxFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsaUJBQWlCOztBQUVqQixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQVN6RSxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO0FBQ3JDLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFFL0IsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBRXJFLE1BQU0sV0FBVyxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFHRixJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFz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Q3ZELGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0JBQStCO0lBQy9CLE9BQU87UUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyQztJQUNMLENBQUM7Q0FDSixDQUFBOzs7Ozs7QUF4Slksc0JBQXNCO0lBRGxDLG1CQUFtQjs7R0FDUCxzQkFBc0IsQ0F3SmxDO1NBeEpZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vXHJcbi8vIEF1dGhvcjo6IFRvbSBUYW5nIDxwb2xwd2FyZUBnbWFpbC5jb20+XHJcbi8vIENvcHlyaWdodDo6IENvcHlyaWdodCAoYykgMjAxNywgWGlhb2xvbmcgVGFuZ1xyXG4vL1xyXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcclxuLy8gYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXHJcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xyXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXHJcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xyXG4vLyBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cclxuLy8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4vL1xyXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxyXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuLy9cclxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXHJcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXHJcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcclxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxyXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cclxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbi8vXHJcbi8vIEV4Y2VwdCBhcyBjb250YWluZWQgaW4gdGhpcyBub3RpY2UsIHRoZSBuYW1lKHMpIG9mIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuLy8gaG9sZGVycyBzaGFsbCBub3QgYmUgdXNlZCBpbiBhZHZlcnRpc2luZyBvciBvdGhlcndpc2UgdG8gcHJvbW90ZSB0aGVcclxuLy8gc2FsZSwgdXNlIG9yIG90aGVyIGRlYWxpbmdzIGluIHRoaXMgU29mdHdhcmUgd2l0aG91dCBwcmlvciB3cml0dGVuXHJcbi8vIGF1dGhvcml6YXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XHJcblxyXG5pbXBvcnQgeyBNZW1vcnlCYWNrZW5kIH0gZnJvbSAnLi9tZW1vcnktYmFja2VuZCc7XHJcbmltcG9ydCB7IG9ic2VydmFibGVEZWNvcmF0b3IgfSBmcm9tICcuLi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yJztcclxuXHJcbmltcG9ydCB7IElFdmVudEFyZ3MgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2V2ZW50LWFyZ3MuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSU9ic2VydmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL29ic2VydmFibGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSUpvaW5wb2ludCB9IGZyb20gJy4uL2ludGVyZmFjZXMvam9pbnQtcG9pbnQuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSU5nWm9uZUxpa2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL25nLXpvbmUtbGlrZS5pbnRlcmZhY2UnO1xyXG5cclxuaW1wb3J0IHsgSVNsaWRpbmdFeHBpcmVDYWNoZSB9IGZyb20gJy4vc2xpZGluZy1leHBpcmUtY2FjaGUuaW50ZXJmYWNlJztcclxuXHJcbmNvbnN0IGxvY2FjaGUgPSBkZXBlbmRlbmNpZXMubG9jYWNoZTtcclxuY29uc3QgbWVsZCA9IGRlcGVuZGVuY2llcy5tZWxkO1xyXG5cclxuY29uc3Qgb3JpZ2luYWxSZW1vdmUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YobG9jYWNoZS5sb2NhY2hlKS5yZW1vdmU7XHJcblxyXG5jb25zdCBjdXJyZW50VGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG59O1xyXG5cclxuQG9ic2VydmFibGVEZWNvcmF0b3JcclxuZXhwb3J0IGNsYXNzIFNsaWRpbmdFeHBpcmF0aW9uQ2FjaGU8VD4gaW1wbGVtZW50cyBJU2xpZGluZ0V4cGlyZUNhY2hlPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9jYWNoZTogYW55O1xyXG4gICAgcHJpdmF0ZSBfdGltZUludGVydmFsOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGVmYXVsdFNlY29uZHM6IG51bWJlcixcclxuICAgICAgICBzY2hlZHVsZUludGVydmFsPzogbnVtYmVyLCBuZ1pvbmU/OiBJTmdab25lTGlrZSkge1xyXG5cclxuICAgICAgICBjb25zdCBiYWNrZW5kID0gbmV3IE1lbW9yeUJhY2tlbmQ8VD4oKTtcclxuICAgICAgICB0aGlzLl9jYWNoZSA9IGxvY2FjaGUubG9jYWNoZS5jcmVhdGVDYWNoZSh7IHN0b3JhZ2U6IGJhY2tlbmQgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhY2hlLnJlbW92ZSA9IG1lbGQuYXJvdW5kKG9yaWdpbmFsUmVtb3ZlLCAoaW5wdXQ6IElKb2lucG9pbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGlucHV0LmFyZ3NbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IG9uRXhwaXJlRXZ0TmFtZSA9IHRoaXMub25FeHBpcmVFdmVudE5hbWUoa2V5KTtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKG9uRXhwaXJlRXZ0TmFtZSwge30pO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIGV2ZW50IGlzIHN0b3BwZWQsIHRoZW4gc3RvcCBkb2luZyBpdFxyXG4gICAgICAgICAgICAvLyBtb3JlIHRpbWUgaXMgcmVxdWlyZWQgLi4uXHJcbiAgICAgICAgICAgIGlmIChldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEV4cGlyZUtleShrZXksIHRoaXMuX2RlZmF1bHRTZWNvbmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBjb250aW51ZSB0aGUgb3JpZ2luYWwgbG9naWNcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lclxyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vZmYob25FeHBpcmVFdnROYW1lLCBudWxsKTtcclxuICAgICAgICAgICAgaW5wdXQucHJvY2VlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gZmlyZSBldmVudFxyXG4gICAgICAgICAgICBjb25zdCBhZnRlclJlbW92ZUV2dE5hbWUgPSB0aGlzLmFmdGVyUmVtb3ZlRXZlbnROYW1lKGtleSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLmZpcmUoYWZ0ZXJSZW1vdmVFdnROYW1lLCB7fSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaW50ZXJ2YWxcclxuICAgICAgICBpZiAoc2NoZWR1bGVJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICBpZiAobmdab25lKSB7XHJcbiAgICAgICAgICAgICAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUuY2xlYW51cCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHNjaGVkdWxlSW50ZXJ2YWwgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLmNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgIH0sIHNjaGVkdWxlSW50ZXJ2YWwgKiAxMDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FeHBpcmVFdmVudE5hbWUoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnb25FeHBpcmU6JyArIGtleTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFmdGVyUmVtb3ZlRXZlbnROYW1lKGtleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2FmdGVyUmVtb3ZlOicgKyBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldEV4cGlyZUtleShrZXk6IHN0cmluZywgc2Vjb25kczogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZXhwaXJla2V5ID0gdGhpcy5fY2FjaGUuZXhwaXJla2V5KGtleSk7XHJcbiAgICAgICAgY29uc3QgbXMgPSBzZWNvbmRzICogMTAwMDtcclxuICAgICAgICB0aGlzLl9jYWNoZS5zdG9yYWdlLnNldChleHBpcmVrZXksIGN1cnJlbnRUaW1lKCkgKyBtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFzT2JzZXJ2YWJsZSgpOiBJT2JzZXJ2YWJsZSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZjogYW55ID0gdGhpcztcclxuICAgICAgICBjb25zdCBvYnNlcnZhYmxlOiBJT2JzZXJ2YWJsZSA9IHNlbGY7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2l2ZW4gYSBrZXksIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIG51bWJlciBvZiBzZWNvbmRzIHN0b3JlIHRoZSB2YWx1ZVxyXG4gICAgLy8gaW4gdGhlIHN0b3JhZ2UgYmFja2VuZC5cclxuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQsIHNlY29uZHM6IG51bWJlciwgYWZ0ZXJSZW1vdmVDYWxsYmFjaz86IChldnQ6IElFdmVudEFyZ3M8e30+KSA9PiBJRXZlbnRBcmdzPHt9Pikge1xyXG5cclxuICAgICAgICBjb25zdCBleHBpcmVrZXkgPSB0aGlzLl9jYWNoZS5leHBpcmVrZXkoa2V5KTtcclxuICAgICAgICBjb25zdCB2YWx1ZUtleSA9IHRoaXMuX2NhY2hlLmtleShrZXkpO1xyXG5cclxuICAgICAgICBpZiAoc2Vjb25kcykge1xyXG4gICAgICAgICAgICAvLyBUaGUgdGltZSBzdG9yZWQgaXMgaW4gbWlsbGlzZWNvbmRzLCBidXQgdGhpcyBmdW5jdGlvbiBleHBlY3RzXHJcbiAgICAgICAgICAgIC8vIHNlY29uZHMsIHNvIG11bHRpcGx5IGJ5IDEwMDAuXHJcbiAgICAgICAgICAgIGNvbnN0IG1zID0gc2Vjb25kcyAqIDEwMDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlLnN0b3JhZ2Uuc2V0KGV4cGlyZWtleSwgY3VycmVudFRpbWUoKSArIG1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGV4cGlyZSBrZXksIGlmIG5vIHRpbWVvdXQgaXMgc2V0XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlLnN0b3JhZ2UucmVtb3ZlKGV4cGlyZWtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWZ0ZXJSZW1vdmVDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vbmNlKHRoaXMuYWZ0ZXJSZW1vdmVFdmVudE5hbWUoa2V5KSwgYWZ0ZXJSZW1vdmVDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGUuc3RvcmFnZS5zZXQodmFsdWVLZXksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGZXRjaCBhIHZhbHVlIGZyb20gdGhlIGNhY2hlLiBFaXRoZXIgcmV0dXJucyB0aGUgdmFsdWUsIG9yIGlmIGl0XHJcbiAgICAvLyBkb2Vzbid0IGV4aXN0IChvciBoYXMgZXhwaXJlZCkgcmV0dXJuIG51bGwuXHJcbiAgICBnZXQoa2V5OiBzdHJpbmcsIHNlY29uZHM/OiBudW1iZXIpOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGhhcyBleHBpcmVkLCBiZWZvcmUgcmV0dXJuaW5nIG51bGwgcmVtb3ZlIHRoZSBrZXlcclxuICAgICAgICAvLyBmcm9tIHRoZSBzdG9yYWdlIGJhY2tlbmQgdG8gZnJlZSB1cCB0aGUgc3BhY2UuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlLmhhc0V4cGlyZWQoa2V5KSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUucmVtb3ZlKGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZUtleSA9IHRoaXMuX2NhY2hlLmtleShrZXkpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fY2FjaGUuc3RvcmFnZS5nZXQodmFsdWVLZXkpO1xyXG5cclxuICAgICAgICAvLyBTbGlkZSB0aGUgZXhwaXJlIGtlXHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRFeHBpcmVLZXkoa2V5LCBzZWNvbmRzIHx8IHRoaXMuX2RlZmF1bHRTZWNvbmRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHZhbHVlIGlzbid0IHRydXRoeSwgaXQgbXVzdCBiZSBhbiBlbXB0eSBzdHJpbmcgb3Igc2ltaWxhciwgc29cclxuICAgICAgICAvLyBqdXN0IHJldHVybiB0aGF0LlxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBybU9uRXhwaXJlSGFuZGxlcihrZXk6IHN0cmluZywgY2FsbGJhY2s6IChldnQ6IElFdmVudEFyZ3M8e30+KSA9PiBJRXZlbnRBcmdzPHt9Pik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9mZih0aGlzLm9uRXhwaXJlRXZlbnROYW1lKGtleSksIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRPbkV4cGlyZUhhbmRsZXIoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZ0OiBJRXZlbnRBcmdzPHt9PikgPT4gSUV2ZW50QXJnczx7fT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vbih0aGlzLm9uRXhwaXJlRXZlbnROYW1lKGtleSksIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmxlbmd0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLl9jYWNoZS5rZXlzKCk7XHJcbiAgICAgICAga2V5cy5mb3JFYWNoKChrKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9mZih0aGlzLm9uRXhwaXJlRXZlbnROYW1lKGspLCBudWxsKTtcclxuICAgICAgICAgICAgb3JpZ2luYWxSZW1vdmUuY2FsbCh0aGlzLl9jYWNoZSwgayk7XHJcbiAgICAgICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLmZpcmUodGhpcy5hZnRlclJlbW92ZUV2ZW50TmFtZShrKSwge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG11c3QgZGVzdG9yeSwgb3IgbGVha2luZyAuLi5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fdGltZUludGVydmFsKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fdGltZUludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19