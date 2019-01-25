/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as fromCollection from './collection.reducer';
/**
 * @record
 * @template T
 */
export function GenericState() { }
if (false) {
    /** @type {?} */
    GenericState.prototype.collection;
}
/**
 * @template T
 * @return {?}
 */
export function buildInitialState() {
    return {
        collection: {
            items: []
        }
    };
}
/**
 * @template T
 * @return {?}
 */
export function buildReducerMap() {
    return {
        collection: fromCollection.reducer
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9nZW5lcmljLXN0b3JlL3JlZHVjZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEtBQUssY0FBYyxNQUFNLHNCQUFzQixDQUFDOzs7OztBQUd2RCxrQ0FFQzs7O0lBREcsa0NBQWdDOzs7Ozs7QUFHcEMsTUFBTSxVQUFVLGlCQUFpQjtJQUM3QixPQUFPO1FBQ0gsVUFBVSxFQUFFO1lBQ1IsS0FBSyxFQUFFLEVBQUU7U0FDWjtLQUNKLENBQUM7QUFDTixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxlQUFlO0lBQzNCLE9BQU87UUFDSCxVQUFVLEVBQUUsY0FBYyxDQUFDLE9BQU87S0FDckMsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25SZWR1Y2VyTWFwIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgeyBJQ29sbGVjdGlvblN0YXRlLCBJQ29sbGVjdGlvbkl0ZW0gfSBmcm9tICcuLi9jb2xsZWN0aW9uLWFjdGlvbi1kZWYnO1xyXG5pbXBvcnQgKiBhcyBmcm9tQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24ucmVkdWNlcic7XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljU3RhdGU8VCBleHRlbmRzIElDb2xsZWN0aW9uSXRlbT4ge1xyXG4gICAgY29sbGVjdGlvbjogSUNvbGxlY3Rpb25TdGF0ZTxUPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSW5pdGlhbFN0YXRlPFQgZXh0ZW5kcyBJQ29sbGVjdGlvbkl0ZW0+KCk6IEdlbmVyaWNTdGF0ZTxUPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbGxlY3Rpb246IHtcclxuICAgICAgICAgICAgaXRlbXM6IFtdXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUmVkdWNlck1hcDxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPigpOiBBY3Rpb25SZWR1Y2VyTWFwPEdlbmVyaWNTdGF0ZTxUPj4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb2xsZWN0aW9uOiBmcm9tQ29sbGVjdGlvbi5yZWR1Y2VyXHJcbiAgICB9O1xyXG59XHJcblxyXG5cclxuIl19