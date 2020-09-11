import { Injectable } from '@angular/core';
import { factory } from './factory';
import { CollectionAbstractStore } from './collection-abstract.store';
import * as i0 from "@angular/core";
export class CollectionStore extends CollectionAbstractStore {
    constructor() {
        super();
        this._store = factory();
    }
    getStore() {
        return this._store;
    }
    getState() {
        return this._store.select('collection');
    }
}
CollectionStore.ɵfac = function CollectionStore_Factory(t) { return new (t || CollectionStore)(); };
CollectionStore.ɵprov = i0.ɵɵdefineInjectable({ token: CollectionStore, factory: CollectionStore.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CollectionStore, [{
        type: Injectable
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHcEMsT0FBTyxFQUNILHVCQUF1QixFQUMxQixNQUFNLDZCQUE2QixDQUFDOztBQVNyQyxNQUFNLE9BQU8sZUFDVCxTQUFRLHVCQUEwQjtJQUlsQztRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEVBQUssQ0FBQztJQUMvQixDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7OEVBaEJRLGVBQWU7dURBQWYsZUFBZSxXQUFmLGVBQWU7a0RBQWYsZUFBZTtjQUQzQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdG9yZSwgfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBmYWN0b3J5IH0gZnJvbSAnLi9mYWN0b3J5JztcclxuXHJcbmltcG9ydCB7IEdlbmVyaWNTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcnMvaW5kZXgnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29sbGVjdGlvbkFic3RyYWN0U3RvcmVcclxufSBmcm9tICcuL2NvbGxlY3Rpb24tYWJzdHJhY3Quc3RvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIElDb2xsZWN0aW9uU3RhdGUsXHJcbiAgICBJQ29sbGVjdGlvbkl0ZW1cclxufSBmcm9tICcuL2NvbGxlY3Rpb24tYWN0aW9uLWRlZic7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvblN0b3JlPFQgZXh0ZW5kcyBJQ29sbGVjdGlvbkl0ZW0+XHJcbiAgICBleHRlbmRzIENvbGxlY3Rpb25BYnN0cmFjdFN0b3JlPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdG9yZTogU3RvcmU8R2VuZXJpY1N0YXRlPFQ+PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3N0b3JlID0gZmFjdG9yeTxUPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdG9yZSgpOiBTdG9yZTxHZW5lcmljU3RhdGU8VD4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0YXRlKCk6IE9ic2VydmFibGU8SUNvbGxlY3Rpb25TdGF0ZTxUPj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yZS5zZWxlY3QoJ2NvbGxlY3Rpb24nKTtcclxuICAgIH1cclxufVxyXG4iXX0=