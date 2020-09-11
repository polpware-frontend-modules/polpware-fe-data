/**
 * @fileOverview
 * A base class for defining security plicies.
 */
import * as dependencies from '@polpware/fe-dependencies';
import { lift } from '@polpware/fe-utilities';
const _ = dependencies.underscore;
export class PolicyBase {
    constructor(settings) {
        this.url = settings.url;
        this.token = '';
    }
    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP() {
        if (!_.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }
        return this.getTokenInternal()
            .then((token) => {
            return this.token = token;
        });
    }
    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    reset() {
        this.token = '';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9wb2xpY3ktYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUk5QyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRWxDLE1BQU0sT0FBZ0IsVUFBVTtJQUs1QixZQUFZLFFBQTRCO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBaUJEOzs7O09BSUc7SUFDSCxTQUFTO1FBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQzdDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakM7UUFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTthQUN6QixJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogQSBiYXNlIGNsYXNzIGZvciBkZWZpbmluZyBzZWN1cml0eSBwbGljaWVzLlxuICovXG5cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IHsgbGlmdCB9IGZyb20gJ0Bwb2xwd2FyZS9mZS11dGlsaXRpZXMnO1xuXG5pbXBvcnQgeyBJUG9saWN5Q3Rvck9wdGlvbnMsIElQb2xpY3kgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb2xpY3lCYXNlIGltcGxlbWVudHMgSVBvbGljeSB7XG5cbiAgICBwcm90ZWN0ZWQgdXJsOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHRva2VuOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSVBvbGljeUN0b3JPcHRpb25zKSB7XG4gICAgICAgIHRoaXMudXJsID0gc2V0dGluZ3MudXJsO1xuICAgICAgICB0aGlzLnRva2VuID0gJyc7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0VG9rZW5JbnRlcm5hbCgpOiBQcm9taXNlTGlrZTxzdHJpbmc+O1xuXG4gICAgYWJzdHJhY3QgYXBwbHlUbyhvcHRpb25zOiBhbnkpOiB2b2lkO1xuXG4gICAgYWJzdHJhY3QgaXNFeHBpcmVkKCk6IGJvb2xlYW47XG5cbiAgICBhYnN0cmFjdCByZWFkRnJvbShzZXR0aW5nczoge30pO1xuXG4gICAgYWJzdHJhY3QgcGVyc2lzdGVudCgpOiBhbnk7XG5cbiAgICBhYnN0cmFjdCBhcHBseVRvVjIob3B0aW9uczogYW55KTogdm9pZDtcblxuICAgIGFic3RyYWN0IGFwcGx5VG9WMyhvcHRpb25zOiBhbnkpOiB2b2lkO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJmYWNlIGZvciByZXRyaWV2aW5nIHRoZSB0b2tlbiBmcm9tIGEgcmVtb3RlIHNlcnZlci5cbiAgICAgKiBUaGlzIG1ldGhvZCBpbnRlcm5hbGx5IGRpc3BhdGNoZXMgdGhlIGNhbGwgdG8gYW5vdGhlciBtZXRob2RcbiAgICAgKiBhbmQgY2FjaGUgdGhlIHRva2VuLlxuICAgICAqL1xuICAgIGdldFRva2VuUCgpOiBQcm9taXNlTGlrZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkodGhpcy50b2tlbikgJiYgIXRoaXMuaXNFeHBpcmVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBsaWZ0KHRoaXMudG9rZW4sIG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5JbnRlcm5hbCgpXG4gICAgICAgICAgICAudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlY3VyaXR5IHBvbGljeSwgZS5nLixcbiAgICAgKiByZW1vdmluZyBlc3RhYmxpc2hlZCB0b2tlbi5cbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy50b2tlbiA9ICcnO1xuICAgIH1cbn1cbiJdfQ==