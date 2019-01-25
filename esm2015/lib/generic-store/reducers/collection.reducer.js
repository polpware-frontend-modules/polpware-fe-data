/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
export function reducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            /** @type {?} */
            const payload = action.payload.filter(x => {
                // Look for it in the current list
                /** @type {?} */
                const index = state.items.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return Object.assign({}, state, { items: [
                    ...state.items,
                    ...payload
                ] });
        }
        case 'REMOVE': {
            /** @type {?} */
            const newItems = state.items.filter(x => {
                /** @type {?} */
                const index = action.payload.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return Object.assign({}, state, { items: newItems });
        }
        case 'MODIFY': {
            // Nothing to do
            return state;
        }
        default:
            return state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvZ2VuZXJpYy1zdG9yZS9yZWR1Y2Vycy9jb2xsZWN0aW9uLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLE1BQU0sVUFBVSxPQUFPLENBQ25CLEtBQTBCLEVBQzFCLE1BQXNDO0lBRXRDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRTtRQUVqQixLQUFLLEtBQUssQ0FBQyxDQUFDOztrQkFFRixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7OztzQkFFaEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3RDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN6QixDQUFDLENBQUM7Z0JBQ0YsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBRUYseUJBQ08sS0FBSyxJQUNSLEtBQUssRUFBRTtvQkFDSCxHQUFHLEtBQUssQ0FBQyxLQUFLO29CQUNkLEdBQUcsT0FBTztpQkFDYixJQUNIO1NBQ0w7UUFFRCxLQUFLLFFBQVEsQ0FBQyxDQUFDOztrQkFFTCxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7O3NCQUM5QixLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDekMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQztnQkFDRixPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUM7WUFFRix5QkFDTyxLQUFLLElBQ1IsS0FBSyxFQUFFLFFBQVEsSUFDakI7U0FDTDtRQUVELEtBQUssUUFBUSxDQUFDLENBQUM7WUFFWCxnQkFBZ0I7WUFDaEIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRDtZQUNJLE9BQU8sS0FBSyxDQUFDO0tBRXBCO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBDb2xsZWN0aW9uQWN0aW9uV2l0aFBheWxvYWQsXHJcbiAgICBJQ29sbGVjdGlvblN0YXRlLFxyXG4gICAgSUNvbGxlY3Rpb25JdGVtXHJcbn0gZnJvbSAnLi4vY29sbGVjdGlvbi1hY3Rpb24tZGVmJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyPFQgZXh0ZW5kcyBJQ29sbGVjdGlvbkl0ZW0+KFxyXG4gICAgc3RhdGU6IElDb2xsZWN0aW9uU3RhdGU8VD4sXHJcbiAgICBhY3Rpb246IENvbGxlY3Rpb25BY3Rpb25XaXRoUGF5bG9hZDxUPlxyXG4pOiBJQ29sbGVjdGlvblN0YXRlPFQ+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSAnQUREJzoge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkLmZpbHRlcih4ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIExvb2sgZm9yIGl0IGluIHRoZSBjdXJyZW50IGxpc3RcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3RhdGUuaXRlbXMuZmluZEluZGV4KCh5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHguaWQgPT09IHkuaWQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZS5pdGVtcyxcclxuICAgICAgICAgICAgICAgICAgICAuLi5wYXlsb2FkXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlICdSRU1PVkUnOiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdJdGVtcyA9IHN0YXRlLml0ZW1zLmZpbHRlcih4ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWN0aW9uLnBheWxvYWQuZmluZEluZGV4KCh5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHguaWQgPT09IHkuaWQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IG5ld0l0ZW1zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlICdNT0RJRlknOiB7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3RoaW5nIHRvIGRvXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICB9XHJcbn1cclxuIl19