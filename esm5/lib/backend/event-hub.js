/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
var backbone = dependencies.backbone;
/** @type {?} */
var meld = dependencies.meld;
/**
 * The callback for the sync event.
 * @callback EventHubcallback
 * @param {Object} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} response The response assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */
/**
 * Sets up a callback for listening to the sync events from Backbone.
 * @throws {Error}
 * @param {?} callback
 * @return {?}
 */
export function mountSyncListener(callback) {
    // Collection
    /** @type {?} */
    var remover1 = meld.before(backbone.Collection.prototype, 'trigger', callback);
    /** @type {?} */
    var remover2 = meld.before(backbone.Model.prototype, 'trigger', callback);
    return [remover1, remover2];
}
/**
 * The callback for the sync event.
 * @callback EventHubsyncSignature
 * @param {String} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */
/**
 * Sets up a pre-sync callback.
 * @param {?} callback
 * @return {?}
 */
export function mountSyncBeforeAdvice(callback) {
    return meld.before(backbone, 'sync', callback);
}
/**
 * The signature for the around advice.
 * @callback EventHubaroundAdviceSignature
 * @param {String} jointpoint the jointpoint for this advice.
 */
/**
 * Sets up an around advice.
 * @param {?} callback
 * @return {?}
 */
export function mountSyncAroundAdvice(callback) {
    return meld.around(backbone, 'sync', callback);
}
/**
 * Sets up a pre-ajax callback.
 * @param {?} callback
 * @return {?}
 */
export function mountAjaxBeforeAdvice(callback) {
    return meld.before(backbone, 'ajax', callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtaHViLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvYmFja2VuZC9ldmVudC1odWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQzs7SUFFcEQsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFROztJQUNoQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUk7Ozs7Ozs7Ozs7Ozs7OztBQWlCOUIsTUFBTSxVQUFVLGlCQUFpQixDQUFDLFFBQVE7OztRQUVoQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDOztRQUMxRSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDO0lBQzNFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWVELE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxRQUFRO0lBQzFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELENBQUM7Ozs7Ozs7Ozs7O0FBYUQsTUFBTSxVQUFVLHFCQUFxQixDQUFDLFFBQVE7SUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQzs7Ozs7O0FBUUQsTUFBTSxVQUFVLHFCQUFxQixDQUFDLFFBQVE7SUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogQSBkZWNvcmF0b3IgdG8gQmFja2JvbmUuIEl0IHRyYWNrcyBhbGwgc3luYyBldmVudHMgb2YgdGhlIEJhY2tib25lXG4gKiBpbiBhIG5vbmludHJ1c2l2ZSBtYW5uZXIuXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5jb25zdCBiYWNrYm9uZSA9IGRlcGVuZGVuY2llcy5iYWNrYm9uZTtcbmNvbnN0IG1lbGQgPSBkZXBlbmRlbmNpZXMubWVsZDtcblxuLyoqXG4gKiBUaGUgY2FsbGJhY2sgZm9yIHRoZSBzeW5jIGV2ZW50LlxuICogQGNhbGxiYWNrIEV2ZW50SHViY2FsbGJhY2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBtZXRob2QgVGhlIG1ldGhvZCBhc3NvaWNhdGVkIHdpdGggdGhlIHN5bmMgZXZlbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gbW9kZWwgVGhlIG1vZGVsIGFzc29pY2F0ZWQgd2l0aCB0aGUgc3luYyBldmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UgYXNzb2ljYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICovXG5cbi8qKlxuICogU2V0cyB1cCBhIGNhbGxiYWNrIGZvciBsaXN0ZW5pbmcgdG8gdGhlIHN5bmMgZXZlbnRzIGZyb20gQmFja2JvbmUuXG4gKiBAZnVuY3Rpb24gbW91bnRTeW5jTGlzdGVuZXJcbiAqIEBwYXJhbSB7RXZlbnRIdWJjYWxsYmFja30gY2FsbGJhY2tcbiAqIEB0aHJvd3Mge0Vycm9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbW91bnRTeW5jTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAvLyBDb2xsZWN0aW9uXG4gICAgY29uc3QgcmVtb3ZlcjEgPSBtZWxkLmJlZm9yZShiYWNrYm9uZS5Db2xsZWN0aW9uLnByb3RvdHlwZSwgJ3RyaWdnZXInLCBjYWxsYmFjayk7XG4gICAgY29uc3QgcmVtb3ZlcjIgPSBtZWxkLmJlZm9yZShiYWNrYm9uZS5Nb2RlbC5wcm90b3R5cGUsICd0cmlnZ2VyJywgY2FsbGJhY2spO1xuICAgIHJldHVybiBbcmVtb3ZlcjEsIHJlbW92ZXIyXTtcbn1cblxuLyoqXG4gKiBUaGUgY2FsbGJhY2sgZm9yIHRoZSBzeW5jIGV2ZW50LlxuICogQGNhbGxiYWNrIEV2ZW50SHVic3luY1NpZ25hdHVyZVxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCBUaGUgbWV0aG9kIGFzc29pY2F0ZWQgd2l0aCB0aGUgc3luYyBldmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbCBUaGUgbW9kZWwgYXNzb2ljYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICovXG5cbi8qKlxuICogU2V0cyB1cCBhIHByZS1zeW5jIGNhbGxiYWNrLlxuICogQGZ1bmN0aW9uIG1vdW50U3luY0JlZm9yZUFkdmljZVxuICogQHBhcmFtIHtFdmVudEh1YnN5bmNTaWduYXR1cmV9IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3VudFN5bmNCZWZvcmVBZHZpY2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbWVsZC5iZWZvcmUoYmFja2JvbmUsICdzeW5jJywgY2FsbGJhY2spO1xufVxuXG4vKipcbiAqIFRoZSBzaWduYXR1cmUgZm9yIHRoZSBhcm91bmQgYWR2aWNlLlxuICogQGNhbGxiYWNrIEV2ZW50SHViYXJvdW5kQWR2aWNlU2lnbmF0dXJlXG4gKiBAcGFyYW0ge1N0cmluZ30gam9pbnRwb2ludCB0aGUgam9pbnRwb2ludCBmb3IgdGhpcyBhZHZpY2UuXG4gKi9cblxuLyoqXG4gKiBTZXRzIHVwIGFuIGFyb3VuZCBhZHZpY2UuXG4gKiBAZnVuY3Rpb24gbW91bnRTeW5jQXJvdW5kQWR2aWNlXG4gKiBAcGFyYW0ge0V2ZW50SHViYXJvdW5kQWR2aWNlU2lnbmF0dXJlfSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbW91bnRTeW5jQXJvdW5kQWR2aWNlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG1lbGQuYXJvdW5kKGJhY2tib25lLCAnc3luYycsIGNhbGxiYWNrKTtcbn1cblxuXG4vKipcbiAqIFNldHMgdXAgYSBwcmUtYWpheCBjYWxsYmFjay5cbiAqIEBmdW5jdGlvbiBtb3VudEFqYXhCZWZvcmVBZHZpY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3VudEFqYXhCZWZvcmVBZHZpY2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbWVsZC5iZWZvcmUoYmFja2JvbmUsICdhamF4JywgY2FsbGJhY2spO1xufVxuXG4iXX0=