/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
import * as dependencies from '@polpware/fe-dependencies';
import * as XHR from 'polpware-tinymce-tailor/src/util/XHR';
import { urlEncode } from '@polpware/fe-utilities';
/** @type {?} */
var _ = dependencies.underscore;
/**
 * @record
 */
export function IXHRCtorOption() { }
if (false) {
    /** @type {?} */
    IXHRCtorOption.prototype.url;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.async;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.type;
    /** @type {?} */
    IXHRCtorOption.prototype.content_type;
    /** @type {?} */
    IXHRCtorOption.prototype.response_type;
    /** @type {?} */
    IXHRCtorOption.prototype.requestheaders;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.scope;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.success_scope;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.error_scope;
    /** @type {?|undefined} */
    IXHRCtorOption.prototype.data;
}
/** @type {?} */
var defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};
/**
 * @param {?} options
 * @return {?}
 */
export function sendPromise(options) {
    /** @type {?} */
    var settings = _.extend({}, defaultOptions, options);
    /** @type {?} */
    var promise = new Promise(function (resolve, reject) {
        /** @type {?} */
        var xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: function (output, xhr, input) {
                resolve({
                    response: output,
                    xhr: xhr,
                    settings: input
                });
            },
            error: function (output, xhr, input) {
                reject({
                    error: output,
                    xhr: xhr,
                    settings: input
                });
            },
            success_scope: settings.success_scope,
            error_scope: settings.error_scope,
            scope: settings.scope,
            requestheaders: settings.requestheaders
        };
        // Process sent-out data
        if (settings.content_type === 'application/x-www-form-urlencoded') {
            xhrSettings.data = urlEncode(xhrSettings.data);
        }
        else if (settings.content_type === 'application/json') {
            xhrSettings.data = JSON.stringify(xhrSettings.data);
        }
        XHR.send(xhrSettings);
    });
    return promise;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLXByb21pc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9uZXQveGhyLXByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLQSxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sS0FBSyxHQUFHLE1BQU0sc0NBQXNDLENBQUM7QUFFNUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQUU3QyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVU7Ozs7QUFFakMsb0NBV0M7OztJQVZHLDZCQUFZOztJQUNaLCtCQUFnQjs7SUFDaEIsOEJBQXNCOztJQUN0QixzQ0FBNEU7O0lBQzVFLHVDQUEwRTs7SUFDMUUsd0NBQXNCOztJQUN0QiwrQkFBWTs7SUFDWix1Q0FBb0I7O0lBQ3BCLHFDQUFrQjs7SUFDbEIsOEJBQVc7OztJQUdULGNBQWMsR0FBRztJQUNuQixLQUFLLEVBQUUsSUFBSTtJQUNYLFlBQVksRUFBRSxFQUFFO0lBQ2hCLGFBQWEsRUFBRSxNQUFNO0lBQ3JCLGNBQWMsRUFBRSxFQUFFO0lBQ2xCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLEtBQUssRUFBRSxJQUFJO0NBQ2Q7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxPQUF1Qjs7UUFDekMsUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUM7O1FBRWhELE9BQU8sR0FBcUIsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTs7WUFDcEQsV0FBVyxHQUFHO1lBQ2hCLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztZQUNqQixZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO1lBQ3JDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNuQixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDbkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO1lBQ3JCLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSztnQkFDeEIsT0FBTyxDQUFDO29CQUNKLFFBQVEsRUFBRSxNQUFNO29CQUNoQixHQUFHLEVBQUUsR0FBRztvQkFDUixRQUFRLEVBQUUsS0FBSztpQkFDbEIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUNELEtBQUssRUFBRSxVQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSztnQkFDdEIsTUFBTSxDQUFDO29CQUNILEtBQUssRUFBRSxNQUFNO29CQUNiLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxLQUFLO2lCQUNsQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO1lBQ3JDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztZQUNqQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDckIsY0FBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjO1NBQzFDO1FBQ0Qsd0JBQXdCO1FBQ3hCLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxtQ0FBbUMsRUFBRTtZQUMvRCxXQUFXLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEQ7YUFBTSxJQUFJLFFBQVEsQ0FBQyxZQUFZLEtBQUssa0JBQWtCLEVBQUU7WUFDckQsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2RDtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0lBRUYsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGNsYXNzIGZvciBwZXJmb3JtaW5nIFhIUiBpbiBhbiBleGNlcHRpb24gd2F5IGFuZCBpbiBhIHByb21pc2Ugd2F5XG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgKiBhcyBYSFIgZnJvbSAncG9scHdhcmUtdGlueW1jZS10YWlsb3Ivc3JjL3V0aWwvWEhSJztcblxuaW1wb3J0IHsgdXJsRW5jb2RlIH0gZnJvbSAnQHBvbHB3YXJlL2ZlLXV0aWxpdGllcyc7XG5cbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuZXhwb3J0IGludGVyZmFjZSBJWEhSQ3Rvck9wdGlvbiB7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgYXN5bmM/OiBib29sZWFuO1xuICAgIHR5cGU/OiAnUE9TVCcgfCAnR0VUJztcbiAgICBjb250ZW50X3R5cGU6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIHwgJ2FwcGxpY2F0aW9uL2pzb24nIHwgJyc7XG4gICAgcmVzcG9uc2VfdHlwZTogJ2pzb24nIHwgJ2Jsb2InIHwgJ2RvY3VtZW50JyB8ICd0ZXh0JyB8ICdhcnJheWJ1ZmZlcicgfCAnJztcbiAgICByZXF1ZXN0aGVhZGVyczogYW55W107XG4gICAgc2NvcGU/OiBhbnk7XG4gICAgc3VjY2Vzc19zY29wZT86IGFueTtcbiAgICBlcnJvcl9zY29wZT86IGFueTtcbiAgICBkYXRhPzogYW55O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBhc3luYzogdHJ1ZSxcbiAgICBjb250ZW50X3R5cGU6ICcnLFxuICAgIHJlc3BvbnNlX3R5cGU6ICdqc29uJyxcbiAgICByZXF1ZXN0aGVhZGVyczogW10sXG4gICAgc3VjY2Vzc19zY29wZTogbnVsbCxcbiAgICBlcnJvcl9zY29wZTogbnVsbCxcbiAgICBzY29wZTogbnVsbFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRQcm9taXNlKG9wdGlvbnM6IElYSFJDdG9yT3B0aW9uKTogUHJvbWlzZUxpa2U8YW55PiB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcHJvbWlzZTogUHJvbWlzZUxpa2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgeGhyU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICB1cmw6IHNldHRpbmdzLnVybCxcbiAgICAgICAgICAgIGNvbnRlbnRfdHlwZTogc2V0dGluZ3MuY29udGVudF90eXBlLFxuICAgICAgICAgICAgcmVzcG9uc2VfdHlwZTogc2V0dGluZ3MucmVzcG9uc2VfdHlwZSxcbiAgICAgICAgICAgIHR5cGU6IHNldHRpbmdzLnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBzZXR0aW5ncy5kYXRhLFxuICAgICAgICAgICAgYXN5bmM6IHNldHRpbmdzLmFzeW5jLFxuICAgICAgICAgICAgc3VjY2VzczogKG91dHB1dCwgeGhyLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogb3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICB4aHI6IHhocixcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGlucHV0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IChvdXRwdXQsIHhociwgaW5wdXQpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogb3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICB4aHI6IHhocixcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGlucHV0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2Vzc19zY29wZTogc2V0dGluZ3Muc3VjY2Vzc19zY29wZSxcbiAgICAgICAgICAgIGVycm9yX3Njb3BlOiBzZXR0aW5ncy5lcnJvcl9zY29wZSxcbiAgICAgICAgICAgIHNjb3BlOiBzZXR0aW5ncy5zY29wZSxcbiAgICAgICAgICAgIHJlcXVlc3RoZWFkZXJzOiBzZXR0aW5ncy5yZXF1ZXN0aGVhZGVyc1xuICAgICAgICB9O1xuICAgICAgICAvLyBQcm9jZXNzIHNlbnQtb3V0IGRhdGFcbiAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRlbnRfdHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgICAgICAgIHhoclNldHRpbmdzLmRhdGEgPSB1cmxFbmNvZGUoeGhyU2V0dGluZ3MuZGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuY29udGVudF90eXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgICAgICAgIHhoclNldHRpbmdzLmRhdGEgPSBKU09OLnN0cmluZ2lmeSh4aHJTZXR0aW5ncy5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBYSFIuc2VuZCh4aHJTZXR0aW5ncyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbiJdfQ==