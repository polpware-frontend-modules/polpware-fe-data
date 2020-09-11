import { __decorate, __metadata } from "tslib";
/**
 * @fileOverview
 * Defines the user credential. This user credential supports event
 * listening. Note that the credential is assumed to be Uppercase:
 * Username and Password
 */
import * as dependencies from '@polpware/fe-dependencies';
import { isArray } from '@polpware/fe-utilities';
import { observableDecorator } from '../decorators/observable.decorator';
var _ = dependencies.underscore;
function isEquiva(a, b) {
    // Strict equals
    if (a === b) {
        return true;
    }
    // Compare null
    if (a === null || b === null) {
        return a === b;
    }
    // Compare number, boolean, string, undefined
    if (typeof a !== 'object' || typeof b !== 'object') {
        return a === b;
    }
    // Compare arrays
    if (isArray(b) && isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        var k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    var checked = {};
    var objectB = b;
    for (var k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
            checked[k] = true;
        }
    }
    var objectA = a;
    for (var k in objectA) {
        if (objectA.hasOwnProperty(k)) {
            if (!checked[k] && !isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    return true;
}
// immutable
var UserCredential = /** @class */ (function () {
    /**
     * @constructor Credential
     */
    function UserCredential(authPolicy) {
        this.authPolicy = authPolicy;
        this._user = {};
        this._security = authPolicy;
    }
    Object.defineProperty(UserCredential.prototype, "asObservable", {
        get: function () {
            var self = this;
            return self;
        },
        enumerable: true,
        configurable: true
    });
    UserCredential.prototype.security = function (value) {
        if (value) {
            this._security = value;
        }
        return this._security;
    };
    // Does not trigger any event
    UserCredential.prototype.readFrom = function (data) {
        this._user = _.extend(this._user, data);
    };
    UserCredential.prototype.setUser = function (data) {
        if (isEquiva(this._user, data)) {
            return;
        }
        this._user = data;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    };
    UserCredential.prototype.extendUser = function (data) {
        var newData = _.extend({}, this._user, data);
        this.setUser(newData);
    };
    UserCredential.prototype.getUser = function () {
        return _.extend({}, this._user);
    };
    UserCredential.prototype.subscribe = function (handler, likeBehaviorSubject) {
        if (likeBehaviorSubject === void 0) { likeBehaviorSubject = false; }
        this.asObservable.on('change:user', handler);
        if (likeBehaviorSubject) {
            var newEvt = { data: this._user };
            handler(newEvt);
        }
    };
    UserCredential.prototype.unSubscribe = function (handler) {
        this.asObservable.off('change:user', handler);
    };
    UserCredential.prototype.isUserKnown = function () {
        return !!(this._user && this._user.username);
    };
    UserCredential.prototype.isAuthenticated = function () {
        return this.authPolicy && !this.authPolicy.isExpired();
    };
    UserCredential.ctorParameters = function () { return [
        { type: undefined }
    ]; };
    UserCredential = __decorate([
        observableDecorator,
        __metadata("design:paramtypes", [Object])
    ], UserCredential);
    return UserCredential;
}());
export { UserCredential };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jcmVkZW50aWFsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvdXNlci1jcmVkZW50aWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRztBQUNILE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsT0FBTyxFQUNILE9BQU8sRUFDVixNQUFNLHdCQUF3QixDQUFDO0FBRWhDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBTXpFLElBQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFFbEMsU0FBUyxRQUFRLENBQUMsQ0FBTSxFQUFFLENBQU07SUFFNUIsZ0JBQWdCO0lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxlQUFlO0lBQ2YsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xCO0lBRUQsNkNBQTZDO0lBQzdDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUNoRCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEI7SUFFRCxpQkFBaUI7SUFDakIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzFCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNqQixPQUFPLENBQUMsRUFBRSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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N0MsSUFBSSxtQkFBbUIsRUFBRTtZQUNyQixJQUFNLE1BQU0sR0FBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekMsT0FBTyxDQUFDLE1BQXVCLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFRCxvQ0FBVyxHQUFYLFVBQVksT0FBMEI7UUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxvQ0FBVyxHQUFYO1FBQ0ksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELHdDQUFlLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNELENBQUM7Ozs7SUFwRVEsY0FBYztRQUQxQixtQkFBbUI7O09BQ1AsY0FBYyxDQXFFMUI7SUFBRCxxQkFBQztDQUFBLEFBckVELElBcUVDO1NBckVZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERlZmluZXMgdGhlIHVzZXIgY3JlZGVudGlhbC4gVGhpcyB1c2VyIGNyZWRlbnRpYWwgc3VwcG9ydHMgZXZlbnRcbiAqIGxpc3RlbmluZy4gTm90ZSB0aGF0IHRoZSBjcmVkZW50aWFsIGlzIGFzc3VtZWQgdG8gYmUgVXBwZXJjYXNlOlxuICogVXNlcm5hbWUgYW5kIFBhc3N3b3JkXG4gKi9cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IHtcbiAgICBpc0FycmF5XG59IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5pbXBvcnQgeyBvYnNlcnZhYmxlRGVjb3JhdG9yIH0gZnJvbSAnLi4vZGVjb3JhdG9ycy9vYnNlcnZhYmxlLmRlY29yYXRvcic7XG5pbXBvcnQgeyBJT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvb2JzZXJ2YWJsZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUV2ZW50QXJncyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZXZlbnQtYXJncy5pbnRlcmZhY2UnO1xuXG5pbXBvcnQgeyBJUG9saWN5IH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG5mdW5jdGlvbiBpc0VxdWl2YShhOiBhbnksIGI6IGFueSk6IGJvb2xlYW4ge1xuXG4gICAgLy8gU3RyaWN0IGVxdWFsc1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENvbXBhcmUgbnVsbFxuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQ29tcGFyZSBudW1iZXIsIGJvb2xlYW4sIHN0cmluZywgdW5kZWZpbmVkXG4gICAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQ29tcGFyZSBhcnJheXNcbiAgICBpZiAoaXNBcnJheShiKSAmJiBpc0FycmF5KGEpKSB7XG4gICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChrLS0pIHtcbiAgICAgICAgICAgIGlmICghaXNFcXVpdmEoYVtrXSwgYltrXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjaGVja2VkID0ge307XG4gICAgY29uc3Qgb2JqZWN0QiA9IGIgYXMgT2JqZWN0O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmplY3RCKSB7XG4gICAgICAgIGlmIChvYmplY3RCLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBpZiAoIWlzRXF1aXZhKGFba10sIGJba10pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGVja2VkW2tdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdEEgPSBhIGFzIE9iamVjdDtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqZWN0QSkge1xuICAgICAgICBpZiAob2JqZWN0QS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgaWYgKCFjaGVja2VkW2tdICYmICFpc0VxdWl2YShhW2tdLCBiW2tdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUHJvZmlsZSB7XG4gICAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gICAgZW1haWw/OiBzdHJpbmc7XG4gICAgcm9sZT86IHN0cmluZztcbiAgICBkaXNwbGF5TmFtZT86IHN0cmluZztcbn1cblxuLy8gaW1tdXRhYmxlXG5cbkBvYnNlcnZhYmxlRGVjb3JhdG9yXG5leHBvcnQgY2xhc3MgVXNlckNyZWRlbnRpYWw8VCBleHRlbmRzIElQb2xpY3k+IHtcblxuICAgIHByaXZhdGUgX3NlY3VyaXR5OiBUO1xuICAgIHByaXZhdGUgX3VzZXI6IElVc2VyUHJvZmlsZTtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3IgQ3JlZGVudGlhbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhdXRoUG9saWN5OiBUKSB7XG4gICAgICAgIHRoaXMuX3VzZXIgPSB7fTtcbiAgICAgICAgdGhpcy5fc2VjdXJpdHkgPSBhdXRoUG9saWN5O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYXNPYnNlcnZhYmxlKCk6IElPYnNlcnZhYmxlIHtcbiAgICAgICAgY29uc3Qgc2VsZjogYW55ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHNlbGYgYXMgSU9ic2VydmFibGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNlY3VyaXR5KHZhbHVlPzogVCk6IFQge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlY3VyaXR5ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlY3VyaXR5O1xuICAgIH1cblxuICAgIC8vIERvZXMgbm90IHRyaWdnZXIgYW55IGV2ZW50XG4gICAgcmVhZEZyb208VSBleHRlbmRzIElVc2VyUHJvZmlsZT4oZGF0YTogVSk6IHZvaWQge1xuICAgICAgICB0aGlzLl91c2VyID0gXy5leHRlbmQodGhpcy5fdXNlciwgZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0VXNlcjxVIGV4dGVuZHMgSVVzZXJQcm9maWxlPihkYXRhOiBVKTogdm9pZCB7XG4gICAgICAgIGlmIChpc0VxdWl2YSh0aGlzLl91c2VyLCBkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXNlciA9IGRhdGE7XG4gICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLmZpcmUoJ2NoYW5nZTp1c2VyJywge1xuICAgICAgICAgICAgZGF0YTogdGhpcy5fdXNlclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHRlbmRVc2VyPFUgZXh0ZW5kcyBJVXNlclByb2ZpbGU+KGRhdGE6IFUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IF8uZXh0ZW5kKHt9LCB0aGlzLl91c2VyLCBkYXRhKTtcbiAgICAgICAgdGhpcy5zZXRVc2VyKG5ld0RhdGEpO1xuICAgIH1cblxuICAgIGdldFVzZXI8VSBleHRlbmRzIElVc2VyUHJvZmlsZT4oKTogVSB7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5fdXNlcik7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlPFUgZXh0ZW5kcyBJVXNlclByb2ZpbGU+KGhhbmRsZXI6IChldnQ6IElFdmVudEFyZ3M8VT4pID0+IElFdmVudEFyZ3M8VT4sIGxpa2VCZWhhdmlvclN1YmplY3Q6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5vbignY2hhbmdlOnVzZXInLCBoYW5kbGVyKTtcblxuICAgICAgICBpZiAobGlrZUJlaGF2aW9yU3ViamVjdCkge1xuICAgICAgICAgICAgY29uc3QgbmV3RXZ0OiBhbnkgPSB7IGRhdGE6IHRoaXMuX3VzZXIgfTtcbiAgICAgICAgICAgIGhhbmRsZXIobmV3RXZ0IGFzIElFdmVudEFyZ3M8VT4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5TdWJzY3JpYmUoaGFuZGxlcjogKGV2dDogYW55KSA9PiBhbnkpIHtcbiAgICAgICAgdGhpcy5hc09ic2VydmFibGUub2ZmKCdjaGFuZ2U6dXNlcicsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGlzVXNlcktub3duKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5fdXNlciAmJiB0aGlzLl91c2VyLnVzZXJuYW1lKTtcbiAgICB9XG5cbiAgICBpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhQb2xpY3kgJiYgIXRoaXMuYXV0aFBvbGljeS5pc0V4cGlyZWQoKTtcbiAgICB9XG59XG5cbiJdfQ==