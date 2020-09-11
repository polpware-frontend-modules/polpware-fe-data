/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */
import * as dependencies from '@polpware/fe-dependencies';
const backbone = dependencies.backbone;
const meld = dependencies.meld;
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
 * @function mountSyncListener
 * @param {EventHubcallback} callback
 * @throws {Error}
 */
export function mountSyncListener(callback) {
    // Collection
    const remover1 = meld.before(backbone.Collection.prototype, 'trigger', callback);
    const remover2 = meld.before(backbone.Model.prototype, 'trigger', callback);
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
 * @function mountSyncBeforeAdvice
 * @param {EventHubsyncSignature} callback
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
 * @function mountSyncAroundAdvice
 * @param {EventHubaroundAdviceSignature} callback
 */
export function mountSyncAroundAdvice(callback) {
    return meld.around(backbone, 'sync', callback);
}
/**
 * Sets up a pre-ajax callback.
 * @function mountAjaxBeforeAdvice
 * @param {Function} callback
 */
export function mountAjaxBeforeAdvice(callback) {
    return meld.before(backbone, 'ajax', callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtaHViLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL2ZlLWRhdGEvIiwic291cmNlcyI6WyJsaWIvYmFja2VuZC9ldmVudC1odWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztBQUN2QyxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBRS9COzs7Ozs7O0dBT0c7QUFFSDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFRO0lBQ3RDLGFBQWE7SUFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RSxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFFSDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHFCQUFxQixDQUFDLFFBQVE7SUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVEOzs7O0dBSUc7QUFFSDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLHFCQUFxQixDQUFDLFFBQVE7SUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUdEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUscUJBQXFCLENBQUMsUUFBUTtJQUMxQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBBIGRlY29yYXRvciB0byBCYWNrYm9uZS4gSXQgdHJhY2tzIGFsbCBzeW5jIGV2ZW50cyBvZiB0aGUgQmFja2JvbmVcbiAqIGluIGEgbm9uaW50cnVzaXZlIG1hbm5lci5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmNvbnN0IGJhY2tib25lID0gZGVwZW5kZW5jaWVzLmJhY2tib25lO1xuY29uc3QgbWVsZCA9IGRlcGVuZGVuY2llcy5tZWxkO1xuXG4vKipcbiAqIFRoZSBjYWxsYmFjayBmb3IgdGhlIHN5bmMgZXZlbnQuXG4gKiBAY2FsbGJhY2sgRXZlbnRIdWJjYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZCBUaGUgbWV0aG9kIGFzc29pY2F0ZWQgd2l0aCB0aGUgc3luYyBldmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbCBUaGUgbW9kZWwgYXNzb2ljYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBhc3NvaWNhdGVkIHdpdGggdGhlIHN5bmMgZXZlbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBhc3NvY2lhdGVkIHdpdGggdGhlIHN5bmMgZXZlbnQuXG4gKi9cblxuLyoqXG4gKiBTZXRzIHVwIGEgY2FsbGJhY2sgZm9yIGxpc3RlbmluZyB0byB0aGUgc3luYyBldmVudHMgZnJvbSBCYWNrYm9uZS5cbiAqIEBmdW5jdGlvbiBtb3VudFN5bmNMaXN0ZW5lclxuICogQHBhcmFtIHtFdmVudEh1YmNhbGxiYWNrfSBjYWxsYmFja1xuICogQHRocm93cyB7RXJyb3J9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3VudFN5bmNMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIC8vIENvbGxlY3Rpb25cbiAgICBjb25zdCByZW1vdmVyMSA9IG1lbGQuYmVmb3JlKGJhY2tib25lLkNvbGxlY3Rpb24ucHJvdG90eXBlLCAndHJpZ2dlcicsIGNhbGxiYWNrKTtcbiAgICBjb25zdCByZW1vdmVyMiA9IG1lbGQuYmVmb3JlKGJhY2tib25lLk1vZGVsLnByb3RvdHlwZSwgJ3RyaWdnZXInLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIFtyZW1vdmVyMSwgcmVtb3ZlcjJdO1xufVxuXG4vKipcbiAqIFRoZSBjYWxsYmFjayBmb3IgdGhlIHN5bmMgZXZlbnQuXG4gKiBAY2FsbGJhY2sgRXZlbnRIdWJzeW5jU2lnbmF0dXJlXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIFRoZSBtZXRob2QgYXNzb2ljYXRlZCB3aXRoIHRoZSBzeW5jIGV2ZW50LlxuICogQHBhcmFtIHtPYmplY3R9IG1vZGVsIFRoZSBtb2RlbCBhc3NvaWNhdGVkIHdpdGggdGhlIHN5bmMgZXZlbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBhc3NvY2lhdGVkIHdpdGggdGhlIHN5bmMgZXZlbnQuXG4gKi9cblxuLyoqXG4gKiBTZXRzIHVwIGEgcHJlLXN5bmMgY2FsbGJhY2suXG4gKiBAZnVuY3Rpb24gbW91bnRTeW5jQmVmb3JlQWR2aWNlXG4gKiBAcGFyYW0ge0V2ZW50SHVic3luY1NpZ25hdHVyZX0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdW50U3luY0JlZm9yZUFkdmljZShjYWxsYmFjaykge1xuICAgIHJldHVybiBtZWxkLmJlZm9yZShiYWNrYm9uZSwgJ3N5bmMnLCBjYWxsYmFjayk7XG59XG5cbi8qKlxuICogVGhlIHNpZ25hdHVyZSBmb3IgdGhlIGFyb3VuZCBhZHZpY2UuXG4gKiBAY2FsbGJhY2sgRXZlbnRIdWJhcm91bmRBZHZpY2VTaWduYXR1cmVcbiAqIEBwYXJhbSB7U3RyaW5nfSBqb2ludHBvaW50IHRoZSBqb2ludHBvaW50IGZvciB0aGlzIGFkdmljZS5cbiAqL1xuXG4vKipcbiAqIFNldHMgdXAgYW4gYXJvdW5kIGFkdmljZS5cbiAqIEBmdW5jdGlvbiBtb3VudFN5bmNBcm91bmRBZHZpY2VcbiAqIEBwYXJhbSB7RXZlbnRIdWJhcm91bmRBZHZpY2VTaWduYXR1cmV9IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3VudFN5bmNBcm91bmRBZHZpY2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbWVsZC5hcm91bmQoYmFja2JvbmUsICdzeW5jJywgY2FsbGJhY2spO1xufVxuXG5cbi8qKlxuICogU2V0cyB1cCBhIHByZS1hamF4IGNhbGxiYWNrLlxuICogQGZ1bmN0aW9uIG1vdW50QWpheEJlZm9yZUFkdmljZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdW50QWpheEJlZm9yZUFkdmljZShjYWxsYmFjaykge1xuICAgIHJldHVybiBtZWxkLmJlZm9yZShiYWNrYm9uZSwgJ2FqYXgnLCBjYWxsYmFjayk7XG59XG5cbiJdfQ==