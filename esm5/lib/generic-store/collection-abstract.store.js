/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 * @template T
 */
var /**
 * @abstract
 * @template T
 */
CollectionAbstractStore = /** @class */ (function () {
    function CollectionAbstractStore() {
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.add = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    };
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.remove = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    };
    /**
     * @param {?} payload
     * @return {?}
     */
    CollectionAbstractStore.prototype.modify = /**
     * @param {?} payload
     * @return {?}
     */
    function (payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    };
    return CollectionAbstractStore;
}());
/**
 * @abstract
 * @template T
 */
export { CollectionAbstractStore };
if (false) {
    /**
     * @abstract
     * @return {?}
     */
    CollectionAbstractStore.prototype.getState = function () { };
    /**
     * @abstract
     * @return {?}
     */
    CollectionAbstractStore.prototype.getStore = function () { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBOzs7OztJQUFBO0lBeUJBLENBQUM7Ozs7O0lBcEJVLHFDQUFHOzs7O0lBQVYsVUFBVyxPQUFpQjtRQUN4QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ3JCLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7SUFFTSx3Q0FBTTs7OztJQUFiLFVBQWMsT0FBaUI7UUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBRU0sd0NBQU07Ozs7SUFBYixVQUFjLE9BQWlCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDOzs7Ozs7Ozs7OztJQXZCRyw2REFBNEQ7Ozs7O0lBQzVELDZEQUFtRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBJQ29sbGVjdGlvblN0YXRlLCBJQ29sbGVjdGlvbkl0ZW0gfSBmcm9tICcuL2NvbGxlY3Rpb24tYWN0aW9uLWRlZic7XHJcblxyXG5pbXBvcnQgeyBJQ29sbGVjdGlvblN0b3JlIH0gZnJvbSAnLi9jb2xsZWN0aW9uLXN0b3JlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IEdlbmVyaWNTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcnMnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbGxlY3Rpb25BYnN0cmFjdFN0b3JlPFQgZXh0ZW5kcyBJQ29sbGVjdGlvbkl0ZW0+IGltcGxlbWVudHMgSUNvbGxlY3Rpb25TdG9yZTxUPiB7XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGdldFN0YXRlKCk6IE9ic2VydmFibGU8SUNvbGxlY3Rpb25TdGF0ZTxUPj47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0U3RvcmUoKTogU3RvcmU8R2VuZXJpY1N0YXRlPFQ+PjtcclxuXHJcbiAgICBwdWJsaWMgYWRkKHBheWxvYWQ6IEFycmF5PFQ+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZXRTdG9yZSgpLmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogJ0FERCcsXHJcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKHBheWxvYWQ6IEFycmF5PFQ+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZXRTdG9yZSgpLmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogJ1JFTU9WRScsXHJcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbW9kaWZ5KHBheWxvYWQ6IEFycmF5PFQ+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZXRTdG9yZSgpLmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogJ01PRElGWScsXHJcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=