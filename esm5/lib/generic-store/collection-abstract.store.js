var CollectionAbstractStore = /** @class */ (function () {
    function CollectionAbstractStore() {
    }
    CollectionAbstractStore.prototype.add = function (payload) {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    };
    CollectionAbstractStore.prototype.remove = function (payload) {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    };
    CollectionAbstractStore.prototype.modify = function (payload) {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    };
    return CollectionAbstractStore;
}());
export { CollectionAbstractStore };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL2dlbmVyaWMtc3RvcmUvY29sbGVjdGlvbi1hYnN0cmFjdC5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQTtJQUFBO0lBeUJBLENBQUM7SUFwQlUscUNBQUcsR0FBVixVQUFXLE9BQWlCO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0NBQU0sR0FBYixVQUFjLE9BQWlCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0NBQU0sR0FBYixVQUFjLE9BQWlCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IElDb2xsZWN0aW9uU3RhdGUsIElDb2xsZWN0aW9uSXRlbSB9IGZyb20gJy4vY29sbGVjdGlvbi1hY3Rpb24tZGVmJztcclxuXHJcbmltcG9ydCB7IElDb2xsZWN0aW9uU3RvcmUgfSBmcm9tICcuL2NvbGxlY3Rpb24tc3RvcmUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgR2VuZXJpY1N0YXRlIH0gZnJvbSAnLi9yZWR1Y2Vycyc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29sbGVjdGlvbkFic3RyYWN0U3RvcmU8VCBleHRlbmRzIElDb2xsZWN0aW9uSXRlbT4gaW1wbGVtZW50cyBJQ29sbGVjdGlvblN0b3JlPFQ+IHtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0U3RhdGUoKTogT2JzZXJ2YWJsZTxJQ29sbGVjdGlvblN0YXRlPFQ+PjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRTdG9yZSgpOiBTdG9yZTxHZW5lcmljU3RhdGU8VD4+O1xyXG5cclxuICAgIHB1YmxpYyBhZGQocGF5bG9hZDogQXJyYXk8VD4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFN0b3JlKCkuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICB0eXBlOiAnQUREJyxcclxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUocGF5bG9hZDogQXJyYXk8VD4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFN0b3JlKCkuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICB0eXBlOiAnUkVNT1ZFJyxcclxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb2RpZnkocGF5bG9hZDogQXJyYXk8VD4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFN0b3JlKCkuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICB0eXBlOiAnTU9ESUZZJyxcclxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==