/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
import * as dependencies from '@polpware/fe-dependencies';
var XHR = dependencies.XHR;
import { urlEncode } from '@polpware/fe-utilities';
var _ = dependencies.underscore;
var defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};
export function sendPromise(options) {
    var settings = _.extend({}, defaultOptions, options);
    var promise = new Promise(function (resolve, reject) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLXByb21pc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9uZXQveGhyLXByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxLQUFLLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDO0FBRTdCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVuRCxJQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBZWxDLElBQU0sY0FBYyxHQUFHO0lBQ25CLEtBQUssRUFBRSxJQUFJO0lBQ1gsWUFBWSxFQUFFLEVBQUU7SUFDaEIsYUFBYSxFQUFFLE1BQU07SUFDckIsY0FBYyxFQUFFLEVBQUU7SUFDbEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsV0FBVyxFQUFFLElBQUk7SUFDakIsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsTUFBTSxVQUFVLFdBQVcsQ0FBQyxPQUF1QjtJQUMvQyxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFdkQsSUFBTSxPQUFPLEdBQXFCLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDMUQsSUFBTSxXQUFXLEdBQUc7WUFDaEIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHO1lBQ2pCLFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtZQUNuQyxhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWE7WUFDckMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNuQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDckIsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLO2dCQUN4QixPQUFPLENBQUM7b0JBQ0osUUFBUSxFQUFFLE1BQU07b0JBQ2hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxLQUFLO2lCQUNsQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsS0FBSyxFQUFFLFVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLO2dCQUN0QixNQUFNLENBQUM7b0JBQ0gsS0FBSyxFQUFFLE1BQU07b0JBQ2IsR0FBRyxFQUFFLEdBQUc7b0JBQ1IsUUFBUSxFQUFFLEtBQUs7aUJBQ2xCLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWE7WUFDckMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO1lBQ2pDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztZQUNyQixjQUFjLEVBQUUsUUFBUSxDQUFDLGNBQWM7U0FDMUMsQ0FBQztRQUNGLHdCQUF3QjtRQUN4QixJQUFJLFFBQVEsQ0FBQyxZQUFZLEtBQUssbUNBQW1DLEVBQUU7WUFDL0QsV0FBVyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxRQUFRLENBQUMsWUFBWSxLQUFLLGtCQUFrQixFQUFFO1lBQ3JELFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkQ7UUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGNsYXNzIGZvciBwZXJmb3JtaW5nIFhIUiBpbiBhbiBleGNlcHRpb24gd2F5IGFuZCBpbiBhIHByb21pc2Ugd2F5XG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5jb25zdCBYSFIgPSBkZXBlbmRlbmNpZXMuWEhSO1xuXG5pbXBvcnQgeyB1cmxFbmNvZGUgfSBmcm9tICdAcG9scHdhcmUvZmUtdXRpbGl0aWVzJztcblxuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG5leHBvcnQgaW50ZXJmYWNlIElYSFJDdG9yT3B0aW9uIHtcbiAgICB1cmw6IHN0cmluZztcbiAgICBhc3luYz86IGJvb2xlYW47XG4gICAgdHlwZT86ICdQT1NUJyB8ICdHRVQnO1xuICAgIGNvbnRlbnRfdHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfCAnYXBwbGljYXRpb24vanNvbicgfCAnJztcbiAgICByZXNwb25zZV90eXBlOiAnanNvbicgfCAnYmxvYicgfCAnZG9jdW1lbnQnIHwgJ3RleHQnIHwgJ2FycmF5YnVmZmVyJyB8ICcnO1xuICAgIHJlcXVlc3RoZWFkZXJzOiBhbnlbXTtcbiAgICBzY29wZT86IGFueTtcbiAgICBzdWNjZXNzX3Njb3BlPzogYW55O1xuICAgIGVycm9yX3Njb3BlPzogYW55O1xuICAgIGRhdGE/OiBhbnk7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGFzeW5jOiB0cnVlLFxuICAgIGNvbnRlbnRfdHlwZTogJycsXG4gICAgcmVzcG9uc2VfdHlwZTogJ2pzb24nLFxuICAgIHJlcXVlc3RoZWFkZXJzOiBbXSxcbiAgICBzdWNjZXNzX3Njb3BlOiBudWxsLFxuICAgIGVycm9yX3Njb3BlOiBudWxsLFxuICAgIHNjb3BlOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2VuZFByb21pc2Uob3B0aW9uczogSVhIUkN0b3JPcHRpb24pOiBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IF8uZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBwcm9taXNlOiBQcm9taXNlTGlrZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB4aHJTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHVybDogc2V0dGluZ3MudXJsLFxuICAgICAgICAgICAgY29udGVudF90eXBlOiBzZXR0aW5ncy5jb250ZW50X3R5cGUsXG4gICAgICAgICAgICByZXNwb25zZV90eXBlOiBzZXR0aW5ncy5yZXNwb25zZV90eXBlLFxuICAgICAgICAgICAgdHlwZTogc2V0dGluZ3MudHlwZSxcbiAgICAgICAgICAgIGRhdGE6IHNldHRpbmdzLmRhdGEsXG4gICAgICAgICAgICBhc3luYzogc2V0dGluZ3MuYXN5bmMsXG4gICAgICAgICAgICBzdWNjZXNzOiAob3V0cHV0LCB4aHIsIGlucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBvdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgIHhocjogeGhyLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogaW5wdXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKG91dHB1dCwgeGhyLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBvdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgIHhocjogeGhyLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogaW5wdXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzX3Njb3BlOiBzZXR0aW5ncy5zdWNjZXNzX3Njb3BlLFxuICAgICAgICAgICAgZXJyb3Jfc2NvcGU6IHNldHRpbmdzLmVycm9yX3Njb3BlLFxuICAgICAgICAgICAgc2NvcGU6IHNldHRpbmdzLnNjb3BlLFxuICAgICAgICAgICAgcmVxdWVzdGhlYWRlcnM6IHNldHRpbmdzLnJlcXVlc3RoZWFkZXJzXG4gICAgICAgIH07XG4gICAgICAgIC8vIFByb2Nlc3Mgc2VudC1vdXQgZGF0YVxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGVudF90eXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgICAgICAgeGhyU2V0dGluZ3MuZGF0YSA9IHVybEVuY29kZSh4aHJTZXR0aW5ncy5kYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5jb250ZW50X3R5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICAgICAgeGhyU2V0dGluZ3MuZGF0YSA9IEpTT04uc3RyaW5naWZ5KHhoclNldHRpbmdzLmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIFhIUi5zZW5kKHhoclNldHRpbmdzKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xufVxuIl19