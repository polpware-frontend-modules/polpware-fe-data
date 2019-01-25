/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
            var payload = action.payload.filter(function (x) {
                // Look for it in the current list
                /** @type {?} */
                var index = state.items.findIndex(function (y) {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return tslib_1.__assign({}, state, { items: tslib_1.__spread(state.items, payload) });
        }
        case 'REMOVE': {
            /** @type {?} */
            var newItems = state.items.filter(function (x) {
                /** @type {?} */
                var index = action.payload.findIndex(function (y) {
                    return x.id === y.id;
                });
                return index === -1;
            });
            return tslib_1.__assign({}, state, { items: newItems });
        }
        case 'MODIFY': {
            // Nothing to do
            return state;
        }
        default:
            return state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5yZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvZ2VuZXJpYy1zdG9yZS9yZWR1Y2Vycy9jb2xsZWN0aW9uLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFNQSxNQUFNLFVBQVUsT0FBTyxDQUNuQixLQUEwQixFQUMxQixNQUFzQztJQUV0QyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFFakIsS0FBSyxLQUFLLENBQUMsQ0FBQzs7Z0JBRUYsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzs7O29CQUU3QixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDO29CQUNsQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFDO2dCQUNGLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQztZQUVGLDRCQUNPLEtBQUssSUFDUixLQUFLLG1CQUNFLEtBQUssQ0FBQyxLQUFLLEVBQ1gsT0FBTyxLQUVoQjtTQUNMO1FBRUQsS0FBSyxRQUFRLENBQUMsQ0FBQzs7Z0JBRUwsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzs7b0JBQzNCLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUM7b0JBQ3JDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN6QixDQUFDLENBQUM7Z0JBQ0YsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBRUYsNEJBQ08sS0FBSyxJQUNSLEtBQUssRUFBRSxRQUFRLElBQ2pCO1NBQ0w7UUFFRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRVgsZ0JBQWdCO1lBQ2hCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQ7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUVwQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgQ29sbGVjdGlvbkFjdGlvbldpdGhQYXlsb2FkLFxyXG4gICAgSUNvbGxlY3Rpb25TdGF0ZSxcclxuICAgIElDb2xsZWN0aW9uSXRlbVxyXG59IGZyb20gJy4uL2NvbGxlY3Rpb24tYWN0aW9uLWRlZic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcjxUIGV4dGVuZHMgSUNvbGxlY3Rpb25JdGVtPihcclxuICAgIHN0YXRlOiBJQ29sbGVjdGlvblN0YXRlPFQ+LFxyXG4gICAgYWN0aW9uOiBDb2xsZWN0aW9uQWN0aW9uV2l0aFBheWxvYWQ8VD5cclxuKTogSUNvbGxlY3Rpb25TdGF0ZTxUPiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgIGNhc2UgJ0FERCc6IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ucGF5bG9hZC5maWx0ZXIoeCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb29rIGZvciBpdCBpbiB0aGUgY3VycmVudCBsaXN0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN0YXRlLml0ZW1zLmZpbmRJbmRleCgoeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmlkID09PSB5LmlkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPT09IC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGUuaXRlbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgLi4ucGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FzZSAnUkVNT1ZFJzoge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3SXRlbXMgPSBzdGF0ZS5pdGVtcy5maWx0ZXIoeCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjdGlvbi5wYXlsb2FkLmZpbmRJbmRleCgoeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmlkID09PSB5LmlkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPT09IC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBuZXdJdGVtc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FzZSAnTU9ESUZZJzoge1xyXG5cclxuICAgICAgICAgICAgLy8gTm90aGluZyB0byBkb1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gICAgfVxyXG59XHJcbiJdfQ==