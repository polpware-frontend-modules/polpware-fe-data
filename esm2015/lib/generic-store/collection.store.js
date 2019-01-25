/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { factory } from './factory';
import { CollectionAbstractStore } from './collection-abstract.store';
/**
 * @template T
 */
export class CollectionStore extends CollectionAbstractStore {
    constructor() {
        super();
        this._store = factory();
    }
    /**
     * @return {?}
     */
    getStore() {
        return this._store;
    }
    /**
     * @return {?}
     */
    getState() {
        return this._store.select('collection');
    }
}
CollectionStore.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CollectionStore.ctorParameters = () => [];
if (false) {
    /**
     * @type {?}
     * @private
     */
    CollectionStore.prototype._store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUszQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBR3BDLE9BQU8sRUFDSCx1QkFBdUIsRUFDMUIsTUFBTSw2QkFBNkIsQ0FBQzs7OztBQVNyQyxNQUFNLE9BQU8sZUFDVCxTQUFRLHVCQUEwQjtJQUlsQztRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEVBQUssQ0FBQztJQUMvQixDQUFDOzs7O0lBRU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDOzs7O0lBRU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7O1lBakJKLFVBQVU7Ozs7Ozs7OztJQUlQLGlDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3RvcmUsIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgZmFjdG9yeSB9IGZyb20gJy4vZmFjdG9yeSc7XHJcblxyXG5pbXBvcnQgeyBHZW5lcmljU3RhdGUgfSBmcm9tICcuL3JlZHVjZXJzL2luZGV4JztcclxuaW1wb3J0IHtcclxuICAgIENvbGxlY3Rpb25BYnN0cmFjdFN0b3JlXHJcbn0gZnJvbSAnLi9jb2xsZWN0aW9uLWFic3RyYWN0LnN0b3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBJQ29sbGVjdGlvblN0YXRlLFxyXG4gICAgSUNvbGxlY3Rpb25JdGVtXHJcbn0gZnJvbSAnLi9jb2xsZWN0aW9uLWFjdGlvbi1kZWYnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb25TdG9yZTxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPlxyXG4gICAgZXh0ZW5kcyBDb2xsZWN0aW9uQWJzdHJhY3RTdG9yZTxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RvcmU6IFN0b3JlPEdlbmVyaWNTdGF0ZTxUPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9zdG9yZSA9IGZhY3Rvcnk8VD4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RvcmUoKTogU3RvcmU8R2VuZXJpY1N0YXRlPFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdGF0ZSgpOiBPYnNlcnZhYmxlPElDb2xsZWN0aW9uU3RhdGU8VD4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmUuc2VsZWN0KCdjb2xsZWN0aW9uJyk7XHJcbiAgICB9XHJcbn1cclxuIl19