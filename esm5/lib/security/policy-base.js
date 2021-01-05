/**
 * @fileOverview
 * A base class for defining security plicies.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { lift } from '@polpware/fe-utilities';
var _ = dependencies.underscore;
var PolicyBase = /** @class */ (function () {
    function PolicyBase(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    PolicyBase.prototype.getTokenP = function () {
        var _this = this;
        if (!_.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }
        return this.getTokenInternal()
            .then(function (token) {
            return _this.token = token;
        });
    };
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    PolicyBase.prototype.reset = function () {
        this.token = '';
    };
    return PolicyBase;
}());
export { PolicyBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9wb2xpY3ktYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUk5QyxJQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRWxDO0lBS0ksb0JBQVksUUFBNEI7UUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFpQkQ7Ozs7T0FJRztJQUNILDhCQUFTLEdBQVQ7UUFBQSxpQkFTQztRQVJHLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7YUFDekIsSUFBSSxDQUFDLFVBQUMsS0FBSztZQUNSLE9BQU8sS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMEJBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUFoREQsSUFnREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIEEgYmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgc2VjdXJpdHkgcGxpY2llcy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IGxpZnQgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuaW1wb3J0IHsgSVBvbGljeUN0b3JPcHRpb25zLCBJUG9saWN5IH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUG9saWN5QmFzZSBpbXBsZW1lbnRzIElQb2xpY3kge1xuXG4gICAgcHJvdGVjdGVkIHVybDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCB0b2tlbjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IElQb2xpY3lDdG9yT3B0aW9ucykge1xuICAgICAgICB0aGlzLnVybCA9IHNldHRpbmdzLnVybDtcbiAgICAgICAgdGhpcy50b2tlbiA9ICcnO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGdldFRva2VuSW50ZXJuYWwoKTogUHJvbWlzZUxpa2U8c3RyaW5nPjtcblxuICAgIGFic3RyYWN0IGFwcGx5VG8ob3B0aW9uczogYW55KTogdm9pZDtcblxuICAgIGFic3RyYWN0IGlzRXhwaXJlZCgpOiBib29sZWFuO1xuXG4gICAgYWJzdHJhY3QgcmVhZEZyb20oc2V0dGluZ3M6IHt9KTtcblxuICAgIGFic3RyYWN0IHBlcnNpc3RlbnQoKTogYW55O1xuXG4gICAgYWJzdHJhY3QgYXBwbHlUb1YyKG9wdGlvbnM6IGFueSk6IHZvaWQ7XG5cbiAgICBhYnN0cmFjdCBhcHBseVRvVjMob3B0aW9uczogYW55KTogdm9pZDtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGludGVyZmFjZSBmb3IgcmV0cmlldmluZyB0aGUgdG9rZW4gZnJvbSBhIHJlbW90ZSBzZXJ2ZXIuXG4gICAgICogVGhpcyBtZXRob2QgaW50ZXJuYWxseSBkaXNwYXRjaGVzIHRoZSBjYWxsIHRvIGFub3RoZXIgbWV0aG9kXG4gICAgICogYW5kIGNhY2hlIHRoZSB0b2tlbi5cbiAgICAgKi9cbiAgICBnZXRUb2tlblAoKTogUHJvbWlzZUxpa2U8c3RyaW5nPiB7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KHRoaXMudG9rZW4pICYmICF0aGlzLmlzRXhwaXJlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlmdCh0aGlzLnRva2VuLCBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuSW50ZXJuYWwoKVxuICAgICAgICAgICAgLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBzZWN1cml0eSBwb2xpY3ksIGUuZy4sXG4gICAgICogcmVtb3ZpbmcgZXN0YWJsaXNoZWQgdG9rZW4uXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSAnJztcbiAgICB9XG59XG4iXX0=