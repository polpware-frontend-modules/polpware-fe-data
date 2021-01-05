/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */
import { IOpenIDToken } from './interfaces';
import { OAuthTokenPolicy } from './oauth-token-policy';
export declare function adaptToOpenIDToken(data: any): IOpenIDToken;
export declare class OpenIDPolicy extends OAuthTokenPolicy {
    private _openId;
    constructor();
    /**
     * Returns the necessary information for peristence.
     */
    persistent(): IOpenIDToken;
    /**
     * Reads credential from the given settings.
     */
    readFrom(settings: IOpenIDToken): this;
}
