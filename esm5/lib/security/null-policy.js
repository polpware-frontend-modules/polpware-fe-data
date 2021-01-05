var NullPolicy = /** @class */ (function () {
    function NullPolicy() {
    }
    NullPolicy.prototype.getTokenInternal = function () {
        throw new Error('NotImplemented');
    };
    NullPolicy.prototype.applyTo = function (options) { };
    NullPolicy.prototype.isExpired = function () {
        return false;
    };
    NullPolicy.prototype.readFrom = function (settings) { };
    NullPolicy.prototype.persistent = function () { };
    NullPolicy.prototype.applyToV2 = function (options) { };
    NullPolicy.prototype.applyToV3 = function (options) { };
    NullPolicy.prototype.getTokenP = function () {
        throw new Error('NotImplemented');
    };
    NullPolicy.prototype.reset = function () { };
    return NullPolicy;
}());
export { NullPolicy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1wb2xpY3kuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9udWxsLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQUFBO0lBMEJBLENBQUM7SUF4QkcscUNBQWdCLEdBQWhCO1FBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCw0QkFBTyxHQUFQLFVBQVEsT0FBWSxJQUFVLENBQUM7SUFFL0IsOEJBQVMsR0FBVDtRQUNJLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCw2QkFBUSxHQUFSLFVBQVMsUUFBWSxJQUFJLENBQUM7SUFHMUIsK0JBQVUsR0FBVixjQUFvQixDQUFDO0lBRXJCLDhCQUFTLEdBQVQsVUFBVSxPQUFZLElBQVUsQ0FBQztJQUVqQyw4QkFBUyxHQUFULFVBQVUsT0FBWSxJQUFVLENBQUM7SUFFakMsOEJBQVMsR0FBVDtRQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsMEJBQUssR0FBTCxjQUFVLENBQUM7SUFDZixpQkFBQztBQUFELENBQUMsQUExQkQsSUEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsaWZ0IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XHJcblxyXG5pbXBvcnQgeyBJUG9saWN5IH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOdWxsUG9saWN5IGltcGxlbWVudHMgSVBvbGljeSB7XHJcblxyXG4gICAgZ2V0VG9rZW5JbnRlcm5hbCgpOiBQcm9taXNlTGlrZTxzdHJpbmc+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdEltcGxlbWVudGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlUbyhvcHRpb25zOiBhbnkpOiB2b2lkIHsgfVxyXG5cclxuICAgIGlzRXhwaXJlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZEZyb20oc2V0dGluZ3M6IHt9KSB7IH1cclxuXHJcblxyXG4gICAgcGVyc2lzdGVudCgpOiBhbnkgeyB9XHJcblxyXG4gICAgYXBwbHlUb1YyKG9wdGlvbnM6IGFueSk6IHZvaWQgeyB9XHJcblxyXG4gICAgYXBwbHlUb1YzKG9wdGlvbnM6IGFueSk6IHZvaWQgeyB9XHJcblxyXG4gICAgZ2V0VG9rZW5QKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90SW1wbGVtZW50ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHsgfVxyXG59XHJcbiJdfQ==