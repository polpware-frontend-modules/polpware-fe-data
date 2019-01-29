/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
const XHR = dependencies.XHR;
import { urlEncode } from '@polpware/fe-utilities';
/** @type {?} */
const _ = dependencies.underscore;
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
const defaultOptions = {
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
    const settings = _.extend({}, defaultOptions, options);
    /** @type {?} */
    const promise = new Promise((resolve, reject) => {
        /** @type {?} */
        const xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: (output, xhr, input) => {
                resolve({
                    response: output,
                    xhr: xhr,
                    settings: input
                });
            },
            error: (output, xhr, input) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLXByb21pc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9uZXQveGhyLXByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFLQSxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDOztNQUVwRCxHQUFHLEdBQUcsWUFBWSxDQUFDLEdBQUc7QUFFNUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztNQUU3QyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVU7Ozs7QUFFakMsb0NBV0M7OztJQVZHLDZCQUFZOztJQUNaLCtCQUFnQjs7SUFDaEIsOEJBQXNCOztJQUN0QixzQ0FBNEU7O0lBQzVFLHVDQUEwRTs7SUFDMUUsd0NBQXNCOztJQUN0QiwrQkFBWTs7SUFDWix1Q0FBb0I7O0lBQ3BCLHFDQUFrQjs7SUFDbEIsOEJBQVc7OztNQUdULGNBQWMsR0FBRztJQUNuQixLQUFLLEVBQUUsSUFBSTtJQUNYLFlBQVksRUFBRSxFQUFFO0lBQ2hCLGFBQWEsRUFBRSxNQUFNO0lBQ3JCLGNBQWMsRUFBRSxFQUFFO0lBQ2xCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLEtBQUssRUFBRSxJQUFJO0NBQ2Q7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxPQUF1Qjs7VUFDekMsUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUM7O1VBRWhELE9BQU8sR0FBcUIsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7O2NBQ3hELFdBQVcsR0FBRztZQUNoQixHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUc7WUFDakIsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLGFBQWEsRUFBRSxRQUFRLENBQUMsYUFBYTtZQUNyQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDbkIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztZQUNyQixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM1QixPQUFPLENBQUM7b0JBQ0osUUFBUSxFQUFFLE1BQU07b0JBQ2hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxLQUFLO2lCQUNsQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxDQUFDO29CQUNILEtBQUssRUFBRSxNQUFNO29CQUNiLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxLQUFLO2lCQUNsQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO1lBQ3JDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztZQUNqQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDckIsY0FBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjO1NBQzFDO1FBQ0Qsd0JBQXdCO1FBQ3hCLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxtQ0FBbUMsRUFBRTtZQUMvRCxXQUFXLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEQ7YUFBTSxJQUFJLFFBQVEsQ0FBQyxZQUFZLEtBQUssa0JBQWtCLEVBQUU7WUFDckQsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2RDtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0lBRUYsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGNsYXNzIGZvciBwZXJmb3JtaW5nIFhIUiBpbiBhbiBleGNlcHRpb24gd2F5IGFuZCBpbiBhIHByb21pc2Ugd2F5XG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5jb25zdCBYSFIgPSBkZXBlbmRlbmNpZXMuWEhSO1xuXG5pbXBvcnQgeyB1cmxFbmNvZGUgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG5leHBvcnQgaW50ZXJmYWNlIElYSFJDdG9yT3B0aW9uIHtcbiAgICB1cmw6IHN0cmluZztcbiAgICBhc3luYz86IGJvb2xlYW47XG4gICAgdHlwZT86ICdQT1NUJyB8ICdHRVQnO1xuICAgIGNvbnRlbnRfdHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfCAnYXBwbGljYXRpb24vanNvbicgfCAnJztcbiAgICByZXNwb25zZV90eXBlOiAnanNvbicgfCAnYmxvYicgfCAnZG9jdW1lbnQnIHwgJ3RleHQnIHwgJ2FycmF5YnVmZmVyJyB8ICcnO1xuICAgIHJlcXVlc3RoZWFkZXJzOiBhbnlbXTtcbiAgICBzY29wZT86IGFueTtcbiAgICBzdWNjZXNzX3Njb3BlPzogYW55O1xuICAgIGVycm9yX3Njb3BlPzogYW55O1xuICAgIGRhdGE/OiBhbnk7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGFzeW5jOiB0cnVlLFxuICAgIGNvbnRlbnRfdHlwZTogJycsXG4gICAgcmVzcG9uc2VfdHlwZTogJ2pzb24nLFxuICAgIHJlcXVlc3RoZWFkZXJzOiBbXSxcbiAgICBzdWNjZXNzX3Njb3BlOiBudWxsLFxuICAgIGVycm9yX3Njb3BlOiBudWxsLFxuICAgIHNjb3BlOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2VuZFByb21pc2Uob3B0aW9uczogSVhIUkN0b3JPcHRpb24pOiBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IF8uZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBwcm9taXNlOiBQcm9taXNlTGlrZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB4aHJTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHVybDogc2V0dGluZ3MudXJsLFxuICAgICAgICAgICAgY29udGVudF90eXBlOiBzZXR0aW5ncy5jb250ZW50X3R5cGUsXG4gICAgICAgICAgICByZXNwb25zZV90eXBlOiBzZXR0aW5ncy5yZXNwb25zZV90eXBlLFxuICAgICAgICAgICAgdHlwZTogc2V0dGluZ3MudHlwZSxcbiAgICAgICAgICAgIGRhdGE6IHNldHRpbmdzLmRhdGEsXG4gICAgICAgICAgICBhc3luYzogc2V0dGluZ3MuYXN5bmMsXG4gICAgICAgICAgICBzdWNjZXNzOiAob3V0cHV0LCB4aHIsIGlucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBvdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgIHhocjogeGhyLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogaW5wdXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKG91dHB1dCwgeGhyLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBvdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgIHhocjogeGhyLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogaW5wdXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzX3Njb3BlOiBzZXR0aW5ncy5zdWNjZXNzX3Njb3BlLFxuICAgICAgICAgICAgZXJyb3Jfc2NvcGU6IHNldHRpbmdzLmVycm9yX3Njb3BlLFxuICAgICAgICAgICAgc2NvcGU6IHNldHRpbmdzLnNjb3BlLFxuICAgICAgICAgICAgcmVxdWVzdGhlYWRlcnM6IHNldHRpbmdzLnJlcXVlc3RoZWFkZXJzXG4gICAgICAgIH07XG4gICAgICAgIC8vIFByb2Nlc3Mgc2VudC1vdXQgZGF0YVxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGVudF90eXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgICAgICAgeGhyU2V0dGluZ3MuZGF0YSA9IHVybEVuY29kZSh4aHJTZXR0aW5ncy5kYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5jb250ZW50X3R5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICAgICAgeGhyU2V0dGluZ3MuZGF0YSA9IEpTT04uc3RyaW5naWZ5KHhoclNldHRpbmdzLmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIFhIUi5zZW5kKHhoclNldHRpbmdzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xufVxuIl19