/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
export interface IXHRCtorOption {
    url: string;
    async?: boolean;
    type?: 'POST' | 'GET';
    content_type: 'application/x-www-form-urlencoded' | 'application/json' | '';
    response_type: 'json' | 'blob' | 'document' | 'text' | 'arraybuffer' | '';
    requestheaders: any[];
    scope?: any;
    success_scope?: any;
    error_scope?: any;
    data?: any;
}
export declare function sendPromise(options: IXHRCtorOption): PromiseLike<any>;
