/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */
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
export declare function mountSyncListener(callback: any): any[];
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
export declare function mountSyncBeforeAdvice(callback: any): any;
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
export declare function mountSyncAroundAdvice(callback: any): any;
/**
 * Sets up a pre-ajax callback.
 * @function mountAjaxBeforeAdvice
 * @param {Function} callback
 */
export declare function mountAjaxBeforeAdvice(callback: any): any;
