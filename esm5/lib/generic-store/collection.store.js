import { __extends } from "tslib";
import { Injectable } from '@angular/core';
import { factory } from './factory';
import { CollectionAbstractStore } from './collection-abstract.store';
import * as i0 from "@angular/core";
var CollectionStore = /** @class */ (function (_super) {
    __extends(CollectionStore, _super);
    function CollectionStore() {
        var _this = _super.call(this) || this;
        _this._store = factory();
        return _this;
    }
    CollectionStore.prototype.getStore = function () {
        return this._store;
    };
    CollectionStore.prototype.getState = function () {
        return this._store.select('collection');
    };
    CollectionStore.ɵfac = function CollectionStore_Factory(t) { return new (t || CollectionStore)(); };
    CollectionStore.ɵprov = i0.ɵɵdefineInjectable({ token: CollectionStore, factory: CollectionStore.ɵfac });
    return CollectionStore;
}(CollectionAbstractStore));
export { CollectionStore };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CollectionStore, [{
        type: Injectable
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUszQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBR3BDLE9BQU8sRUFDSCx1QkFBdUIsRUFDMUIsTUFBTSw2QkFBNkIsQ0FBQzs7QUFRckM7SUFFWSxtQ0FBMEI7SUFJbEM7UUFBQSxZQUNJLGlCQUFPLFNBRVY7UUFERyxLQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBSyxDQUFDOztJQUMvQixDQUFDO0lBRU0sa0NBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sa0NBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQztrRkFoQlEsZUFBZTsyREFBZixlQUFlLFdBQWYsZUFBZTswQkFuQjVCO0NBb0NDLEFBbEJELENBRVksdUJBQXVCLEdBZ0JsQztTQWpCWSxlQUFlO2tEQUFmLGVBQWU7Y0FEM0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3RvcmUsIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgZmFjdG9yeSB9IGZyb20gJy4vZmFjdG9yeSc7XHJcblxyXG5pbXBvcnQgeyBHZW5lcmljU3RhdGUgfSBmcm9tICcuL3JlZHVjZXJzL2luZGV4JztcclxuaW1wb3J0IHtcclxuICAgIENvbGxlY3Rpb25BYnN0cmFjdFN0b3JlXHJcbn0gZnJvbSAnLi9jb2xsZWN0aW9uLWFic3RyYWN0LnN0b3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBJQ29sbGVjdGlvblN0YXRlLFxyXG4gICAgSUNvbGxlY3Rpb25JdGVtXHJcbn0gZnJvbSAnLi9jb2xsZWN0aW9uLWFjdGlvbi1kZWYnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb25TdG9yZTxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPlxyXG4gICAgZXh0ZW5kcyBDb2xsZWN0aW9uQWJzdHJhY3RTdG9yZTxUPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RvcmU6IFN0b3JlPEdlbmVyaWNTdGF0ZTxUPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9zdG9yZSA9IGZhY3Rvcnk8VD4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RvcmUoKTogU3RvcmU8R2VuZXJpY1N0YXRlPFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdGF0ZSgpOiBPYnNlcnZhYmxlPElDb2xsZWN0aW9uU3RhdGU8VD4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmUuc2VsZWN0KCdjb2xsZWN0aW9uJyk7XHJcbiAgICB9XHJcbn1cclxuIl19