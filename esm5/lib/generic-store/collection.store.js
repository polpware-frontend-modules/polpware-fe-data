/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { factory } from './factory';
import { CollectionAbstractStore } from './collection-abstract.store';
/**
 * @template T
 */
var CollectionStore = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionStore, _super);
    function CollectionStore() {
        var _this = _super.call(this) || this;
        _this._store = factory();
        return _this;
    }
    /**
     * @return {?}
     */
    CollectionStore.prototype.getStore = /**
     * @return {?}
     */
    function () {
        return this._store;
    };
    /**
     * @return {?}
     */
    CollectionStore.prototype.getState = /**
     * @return {?}
     */
    function () {
        return this._store.select('collection');
    };
    CollectionStore.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CollectionStore.ctorParameters = function () { return []; };
    return CollectionStore;
}(CollectionAbstractStore));
export { CollectionStore };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CollectionStore.prototype._store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUdwQyxPQUFPLEVBQ0gsdUJBQXVCLEVBQzFCLE1BQU0sNkJBQTZCLENBQUM7Ozs7QUFRckM7SUFFWSwyQ0FBMEI7SUFJbEM7UUFBQSxZQUNJLGlCQUFPLFNBRVY7UUFERyxLQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBSyxDQUFDOztJQUMvQixDQUFDOzs7O0lBRU0sa0NBQVE7OztJQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFTSxrQ0FBUTs7O0lBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7O2dCQWpCSixVQUFVOzs7O0lBa0JYLHNCQUFDO0NBQUEsQUFsQkQsQ0FFWSx1QkFBdUIsR0FnQmxDO1NBakJZLGVBQWU7Ozs7OztJQUd4QixpQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN0b3JlLCB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IGZhY3RvcnkgfSBmcm9tICcuL2ZhY3RvcnknO1xyXG5cclxuaW1wb3J0IHsgR2VuZXJpY1N0YXRlIH0gZnJvbSAnLi9yZWR1Y2Vycy9pbmRleCc7XHJcbmltcG9ydCB7XHJcbiAgICBDb2xsZWN0aW9uQWJzdHJhY3RTdG9yZVxyXG59IGZyb20gJy4vY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgSUNvbGxlY3Rpb25TdGF0ZSxcclxuICAgIElDb2xsZWN0aW9uSXRlbVxyXG59IGZyb20gJy4vY29sbGVjdGlvbi1hY3Rpb24tZGVmJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uU3RvcmU8VCBleHRlbmRzIElDb2xsZWN0aW9uSXRlbT5cclxuICAgIGV4dGVuZHMgQ29sbGVjdGlvbkFic3RyYWN0U3RvcmU8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0b3JlOiBTdG9yZTxHZW5lcmljU3RhdGU8VD4+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fc3RvcmUgPSBmYWN0b3J5PFQ+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0b3JlKCk6IFN0b3JlPEdlbmVyaWNTdGF0ZTxUPj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RhdGUoKTogT2JzZXJ2YWJsZTxJQ29sbGVjdGlvblN0YXRlPFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlLnNlbGVjdCgnY29sbGVjdGlvbicpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==