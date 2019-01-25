/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @fileOverview
 * Defines the user credential. This user credential supports event
 * listening. Note that the credential is assumed to be Uppercase:
 * Username and Password
 */
import * as dependencies from '@polpware/fe-dependencies';
import { isArray } from '@polpware/fe-utilities';
import { observableDecorator } from '../decorators/observable.decorator';
/** @type {?} */
const _ = dependencies.underscore;
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
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
        /** @type {?} */
        let k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    /** @type {?} */
    const checked = {};
    /** @type {?} */
    const objectB = (/** @type {?} */ (b));
    for (const k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
            checked[k] = true;
        }
    }
    /** @type {?} */
    const objectA = (/** @type {?} */ (a));
    for (const k in objectA) {
        if (objectA.hasOwnProperty(k)) {
            if (!checked[k] && !isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }
    return true;
}
/**
 * @record
 */
export function IUserProfile() { }
if (false) {
    /** @type {?|undefined} */
    IUserProfile.prototype.username;
    /** @type {?|undefined} */
    IUserProfile.prototype.email;
    /** @type {?|undefined} */
    IUserProfile.prototype.role;
    /** @type {?|undefined} */
    IUserProfile.prototype.displayName;
}
// immutable
/**
 * @template T
 */
let UserCredential = 
// immutable
/**
 * @template T
 */
class UserCredential {
    /**
     * @param {?} authPolicy
     */
    constructor(authPolicy) {
        this.authPolicy = authPolicy;
        this._user = {};
        this._security = authPolicy;
    }
    /**
     * @return {?}
     */
    get asObservable() {
        /** @type {?} */
        const self = this;
        return (/** @type {?} */ (self));
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    security(value) {
        if (value) {
            this._security = value;
        }
        return this._security;
    }
    // Does not trigger any event
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    readFrom(data) {
        this._user = _.extend(this._user, data);
    }
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    setUser(data) {
        if (isEquiva(this._user, data)) {
            return;
        }
        this._user = data;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    }
    /**
     * @template U
     * @param {?} data
     * @return {?}
     */
    extendUser(data) {
        /** @type {?} */
        const newData = _.extend({}, this._user, data);
        this.setUser(newData);
    }
    /**
     * @template U
     * @return {?}
     */
    getUser() {
        return _.extend({}, this._user);
    }
    /**
     * @template U
     * @param {?} handler
     * @param {?=} likeBehaviorSubject
     * @return {?}
     */
    subscribe(handler, likeBehaviorSubject = false) {
        this.asObservable.on('change:user', handler);
        if (likeBehaviorSubject) {
            /** @type {?} */
            const newEvt = { data: this._user };
            handler((/** @type {?} */ (newEvt)));
        }
    }
    /**
     * @param {?} handler
     * @return {?}
     */
    unSubscribe(handler) {
        this.asObservable.off('change:user', handler);
    }
    /**
     * @return {?}
     */
    isUserKnown() {
        return !!(this._user && this._user.username);
    }
    /**
     * @return {?}
     */
    isAuthenticated() {
        return this.authPolicy && !this.authPolicy.isExpired();
    }
};
// immutable
/**
 * @template T
 */
UserCredential = tslib_1.__decorate([
    observableDecorator,
    tslib_1.__metadata("design:paramtypes", [Object])
], UserCredential);
export { UserCredential };
if (false) {
    /**
     * @type {?}
     * @private
     */
    UserCredential.prototype._security;
    /**
     * @type {?}
     * @private
     */
    UserCredential.prototype._user;
    /** @type {?} */
    UserCredential.prototype.authPolicy;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jcmVkZW50aWFsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvc2VjdXJpdHkvdXNlci1jcmVkZW50aWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBTUEsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxPQUFPLEVBQ0gsT0FBTyxFQUNWLE1BQU0sd0JBQXdCLENBQUM7QUFFaEMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7O01BTW5FLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVTs7Ozs7O0FBRWpDLFNBQVMsUUFBUSxDQUFDLENBQU0sRUFBRSxDQUFNO0lBRTVCLGdCQUFnQjtJQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDVCxPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsZUFBZTtJQUNmLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsQjtJQUVELDZDQUE2QztJQUM3QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDaEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xCO0lBRUQsaUJBQWlCO0lBQ2pCLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNoQjs7WUFFRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU07UUFDaEIsT0FBTyxDQUFDLEVBQUUsRUFBRTtZQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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QUFtQixFQUFFOztrQkFDZixNQUFNLEdBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN4QyxPQUFPLENBQUMsbUJBQUEsTUFBTSxFQUFpQixDQUFDLENBQUM7U0FDcEM7SUFDTCxDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxPQUEwQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7O0lBRUQsZUFBZTtRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0QsQ0FBQztDQUNKLENBQUE7Ozs7O0FBckVZLGNBQWM7SUFEMUIsbUJBQW1COztHQUNQLGNBQWMsQ0FxRTFCO1NBckVZLGNBQWM7Ozs7OztJQUV2QixtQ0FBcUI7Ozs7O0lBQ3JCLCtCQUE0Qjs7SUFJaEIsb0NBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBEZWZpbmVzIHRoZSB1c2VyIGNyZWRlbnRpYWwuIFRoaXMgdXNlciBjcmVkZW50aWFsIHN1cHBvcnRzIGV2ZW50XG4gKiBsaXN0ZW5pbmcuIE5vdGUgdGhhdCB0aGUgY3JlZGVudGlhbCBpcyBhc3N1bWVkIHRvIGJlIFVwcGVyY2FzZTpcbiAqIFVzZXJuYW1lIGFuZCBQYXNzd29yZFxuICovXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7XG4gICAgaXNBcnJheVxufSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZURlY29yYXRvciB9IGZyb20gJy4uL2RlY29yYXRvcnMvb2JzZXJ2YWJsZS5kZWNvcmF0b3InO1xuaW1wb3J0IHsgSU9ic2VydmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL29ic2VydmFibGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IElFdmVudEFyZ3MgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2V2ZW50LWFyZ3MuaW50ZXJmYWNlJztcblxuaW1wb3J0IHsgSVBvbGljeSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuZnVuY3Rpb24gaXNFcXVpdmEoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcblxuICAgIC8vIFN0cmljdCBlcXVhbHNcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDb21wYXJlIG51bGxcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgIH1cblxuICAgIC8vIENvbXBhcmUgbnVtYmVyLCBib29sZWFuLCBzdHJpbmcsIHVuZGVmaW5lZFxuICAgIGlmICh0eXBlb2YgYSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgIH1cblxuICAgIC8vIENvbXBhcmUgYXJyYXlzXG4gICAgaWYgKGlzQXJyYXkoYikgJiYgaXNBcnJheShhKSkge1xuICAgICAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgayA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoay0tKSB7XG4gICAgICAgICAgICBpZiAoIWlzRXF1aXZhKGFba10sIGJba10pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tlZCA9IHt9O1xuICAgIGNvbnN0IG9iamVjdEIgPSBiIGFzIE9iamVjdDtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqZWN0Qikge1xuICAgICAgICBpZiAob2JqZWN0Qi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgaWYgKCFpc0VxdWl2YShhW2tdLCBiW2tdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hlY2tlZFtrXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RBID0gYSBhcyBPYmplY3Q7XG4gICAgZm9yIChjb25zdCBrIGluIG9iamVjdEEpIHtcbiAgICAgICAgaWYgKG9iamVjdEEuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGlmICghY2hlY2tlZFtrXSAmJiAhaXNFcXVpdmEoYVtrXSwgYltrXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclByb2ZpbGUge1xuICAgIHVzZXJuYW1lPzogc3RyaW5nO1xuICAgIGVtYWlsPzogc3RyaW5nO1xuICAgIHJvbGU/OiBzdHJpbmc7XG4gICAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG59XG5cbi8vIGltbXV0YWJsZVxuXG5Ab2JzZXJ2YWJsZURlY29yYXRvclxuZXhwb3J0IGNsYXNzIFVzZXJDcmVkZW50aWFsPFQgZXh0ZW5kcyBJUG9saWN5PiB7XG5cbiAgICBwcml2YXRlIF9zZWN1cml0eTogVDtcbiAgICBwcml2YXRlIF91c2VyOiBJVXNlclByb2ZpbGU7XG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yIENyZWRlbnRpYWxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXV0aFBvbGljeTogVCkge1xuICAgICAgICB0aGlzLl91c2VyID0ge307XG4gICAgICAgIHRoaXMuX3NlY3VyaXR5ID0gYXV0aFBvbGljeTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGFzT2JzZXJ2YWJsZSgpOiBJT2JzZXJ2YWJsZSB7XG4gICAgICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBzZWxmIGFzIElPYnNlcnZhYmxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWN1cml0eSh2YWx1ZT86IFQpOiBUIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWN1cml0eSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWN1cml0eTtcbiAgICB9XG5cbiAgICAvLyBEb2VzIG5vdCB0cmlnZ2VyIGFueSBldmVudFxuICAgIHJlYWRGcm9tPFUgZXh0ZW5kcyBJVXNlclByb2ZpbGU+KGRhdGE6IFUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fdXNlciA9IF8uZXh0ZW5kKHRoaXMuX3VzZXIsIGRhdGEpO1xuICAgIH1cblxuICAgIHNldFVzZXI8VSBleHRlbmRzIElVc2VyUHJvZmlsZT4oZGF0YTogVSk6IHZvaWQge1xuICAgICAgICBpZiAoaXNFcXVpdmEodGhpcy5fdXNlciwgZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VzZXIgPSBkYXRhO1xuICAgICAgICB0aGlzLmFzT2JzZXJ2YWJsZS5maXJlKCdjaGFuZ2U6dXNlcicsIHtcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuX3VzZXJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXh0ZW5kVXNlcjxVIGV4dGVuZHMgSVVzZXJQcm9maWxlPihkYXRhOiBVKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBfLmV4dGVuZCh7fSwgdGhpcy5fdXNlciwgZGF0YSk7XG4gICAgICAgIHRoaXMuc2V0VXNlcihuZXdEYXRhKTtcbiAgICB9XG5cbiAgICBnZXRVc2VyPFUgZXh0ZW5kcyBJVXNlclByb2ZpbGU+KCk6IFUge1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMuX3VzZXIpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZTxVIGV4dGVuZHMgSVVzZXJQcm9maWxlPihoYW5kbGVyOiAoZXZ0OiBJRXZlbnRBcmdzPFU+KSA9PiBJRXZlbnRBcmdzPFU+LCBsaWtlQmVoYXZpb3JTdWJqZWN0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5hc09ic2VydmFibGUub24oJ2NoYW5nZTp1c2VyJywgaGFuZGxlcik7XG5cbiAgICAgICAgaWYgKGxpa2VCZWhhdmlvclN1YmplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0V2dDogYW55ID0geyBkYXRhOiB0aGlzLl91c2VyIH07XG4gICAgICAgICAgICBoYW5kbGVyKG5ld0V2dCBhcyBJRXZlbnRBcmdzPFU+KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuU3Vic2NyaWJlKGhhbmRsZXI6IChldnQ6IGFueSkgPT4gYW55KSB7XG4gICAgICAgIHRoaXMuYXNPYnNlcnZhYmxlLm9mZignY2hhbmdlOnVzZXInLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpc1VzZXJLbm93bigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhKHRoaXMuX3VzZXIgJiYgdGhpcy5fdXNlci51c2VybmFtZSk7XG4gICAgfVxuXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoUG9saWN5ICYmICF0aGlzLmF1dGhQb2xpY3kuaXNFeHBpcmVkKCk7XG4gICAgfVxufVxuXG4iXX0=