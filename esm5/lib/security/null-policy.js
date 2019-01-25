/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NullPolicy = /** @class */ (function () {
    function NullPolicy() {
    }
    /**
     * @return {?}
     */
    NullPolicy.prototype.getTokenInternal = /**
     * @return {?}
     */
    function () {
        throw new Error('NotImplemented');
    };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyTo = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.isExpired = /**
     * @return {?}
     */
    function () {
        return false;
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    NullPolicy.prototype.readFrom = /**
     * @param {?} settings
     * @return {?}
     */
    function (settings) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.persistent = /**
     * @return {?}
     */
    function () { };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyToV2 = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @param {?} options
     * @return {?}
     */
    NullPolicy.prototype.applyToV3 = /**
     * @param {?} options
     * @return {?}
     */
    function (options) { };
    /**
     * @return {?}
     */
    NullPolicy.prototype.getTokenP = /**
     * @return {?}
     */
    function () {
        throw new Error('NotImplemented');
    };
    /**
     * @return {?}
     */
    NullPolicy.prototype.reset = /**
     * @return {?}
     */
    function () { };
    return NullPolicy;
}());
export { NullPolicy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1wb2xpY3kuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9udWxsLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUE7SUFBQTtJQTBCQSxDQUFDOzs7O0lBeEJHLHFDQUFnQjs7O0lBQWhCO1FBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Ozs7O0lBRUQsNEJBQU87Ozs7SUFBUCxVQUFRLE9BQVksSUFBVSxDQUFDOzs7O0lBRS9CLDhCQUFTOzs7SUFBVDtRQUNJLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRUQsNkJBQVE7Ozs7SUFBUixVQUFTLFFBQVksSUFBSSxDQUFDOzs7O0lBRzFCLCtCQUFVOzs7SUFBVixjQUFvQixDQUFDOzs7OztJQUVyQiw4QkFBUzs7OztJQUFULFVBQVUsT0FBWSxJQUFVLENBQUM7Ozs7O0lBRWpDLDhCQUFTOzs7O0lBQVQsVUFBVSxPQUFZLElBQVUsQ0FBQzs7OztJQUVqQyw4QkFBUzs7O0lBQVQ7UUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVELDBCQUFLOzs7SUFBTCxjQUFVLENBQUM7SUFDZixpQkFBQztBQUFELENBQUMsQUExQkQsSUEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsaWZ0IH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XHJcblxyXG5pbXBvcnQgeyBJUG9saWN5IH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOdWxsUG9saWN5IGltcGxlbWVudHMgSVBvbGljeSB7XHJcblxyXG4gICAgZ2V0VG9rZW5JbnRlcm5hbCgpOiBQcm9taXNlTGlrZTxzdHJpbmc+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdEltcGxlbWVudGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlUbyhvcHRpb25zOiBhbnkpOiB2b2lkIHsgfVxyXG5cclxuICAgIGlzRXhwaXJlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZEZyb20oc2V0dGluZ3M6IHt9KSB7IH1cclxuXHJcblxyXG4gICAgcGVyc2lzdGVudCgpOiBhbnkgeyB9XHJcblxyXG4gICAgYXBwbHlUb1YyKG9wdGlvbnM6IGFueSk6IHZvaWQgeyB9XHJcblxyXG4gICAgYXBwbHlUb1YzKG9wdGlvbnM6IGFueSk6IHZvaWQgeyB9XHJcblxyXG4gICAgZ2V0VG9rZW5QKCk6IFByb21pc2VMaWtlPHN0cmluZz4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90SW1wbGVtZW50ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHsgfVxyXG59XHJcbiJdfQ==