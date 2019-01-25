import { IOAuthTokenPolicyCtorOptions } from './interfaces';
import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';
export declare class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    private _payload;
    constructor(settings: IOAuthTokenPolicyCtorOptions, payload: object);
    readonly payload: object;
    getParams(): any;
}
