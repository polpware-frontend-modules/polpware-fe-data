/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 * @template T
 */
export class CollectionAbstractStore {
    /**
     * @param {?} payload
     * @return {?}
     */
    add(payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    remove(payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    modify(payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBLE1BQU0sT0FBZ0IsdUJBQXVCOzs7OztJQUtsQyxHQUFHLENBQUMsT0FBaUI7UUFDeEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBRU0sTUFBTSxDQUFDLE9BQWlCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDOzs7OztJQUVNLE1BQU0sQ0FBQyxPQUFpQjtRQUMzQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ3JCLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKOzs7Ozs7SUF2QkcsNkRBQTREOzs7OztJQUM1RCw2REFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgSUNvbGxlY3Rpb25TdGF0ZSwgSUNvbGxlY3Rpb25JdGVtIH0gZnJvbSAnLi9jb2xsZWN0aW9uLWFjdGlvbi1kZWYnO1xyXG5cclxuaW1wb3J0IHsgSUNvbGxlY3Rpb25TdG9yZSB9IGZyb20gJy4vY29sbGVjdGlvbi1zdG9yZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBHZW5lcmljU3RhdGUgfSBmcm9tICcuL3JlZHVjZXJzJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb2xsZWN0aW9uQWJzdHJhY3RTdG9yZTxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPiBpbXBsZW1lbnRzIElDb2xsZWN0aW9uU3RvcmU8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRTdGF0ZSgpOiBPYnNlcnZhYmxlPElDb2xsZWN0aW9uU3RhdGU8VD4+O1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldFN0b3JlKCk6IFN0b3JlPEdlbmVyaWNTdGF0ZTxUPj47XHJcblxyXG4gICAgcHVibGljIGFkZChwYXlsb2FkOiBBcnJheTxUPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2V0U3RvcmUoKS5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdBREQnLFxyXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShwYXlsb2FkOiBBcnJheTxUPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2V0U3RvcmUoKS5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdSRU1PVkUnLFxyXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1vZGlmeShwYXlsb2FkOiBBcnJheTxUPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2V0U3RvcmUoKS5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdNT0RJRlknLFxyXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19