import * as fromCollection from './collection.reducer';
export function buildInitialState() {
    return {
        collection: {
            items: []
        }
    };
}
export function buildReducerMap() {
    return {
        collection: fromCollection.reducer
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9nZW5lcmljLXN0b3JlL3JlZHVjZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sS0FBSyxjQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFPdkQsTUFBTSxVQUFVLGlCQUFpQjtJQUM3QixPQUFPO1FBQ0gsVUFBVSxFQUFFO1lBQ1IsS0FBSyxFQUFFLEVBQUU7U0FDWjtLQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWU7SUFDM0IsT0FBTztRQUNILFVBQVUsRUFBRSxjQUFjLENBQUMsT0FBTztLQUNyQyxDQUFDO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblJlZHVjZXJNYXAgfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbmltcG9ydCB7IElDb2xsZWN0aW9uU3RhdGUsIElDb2xsZWN0aW9uSXRlbSB9IGZyb20gJy4uL2NvbGxlY3Rpb24tYWN0aW9uLWRlZic7XHJcbmltcG9ydCAqIGFzIGZyb21Db2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbi5yZWR1Y2VyJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNTdGF0ZTxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPiB7XHJcbiAgICBjb2xsZWN0aW9uOiBJQ29sbGVjdGlvblN0YXRlPFQ+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRJbml0aWFsU3RhdGU8VCBleHRlbmRzIElDb2xsZWN0aW9uSXRlbT4oKTogR2VuZXJpY1N0YXRlPFQ+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29sbGVjdGlvbjoge1xyXG4gICAgICAgICAgICBpdGVtczogW11cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZWR1Y2VyTWFwPFQgZXh0ZW5kcyBJQ29sbGVjdGlvbkl0ZW0+KCk6IEFjdGlvblJlZHVjZXJNYXA8R2VuZXJpY1N0YXRlPFQ+PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbGxlY3Rpb246IGZyb21Db2xsZWN0aW9uLnJlZHVjZXJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG4iXX0=