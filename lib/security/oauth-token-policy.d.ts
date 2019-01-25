/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */
import { IOAuthTokenPolicyCtorOptions, IOAuthToken } from './interfaces';
import { PolicyBase } from './policy-base';
export declare function adaptToOAuthToken(data: any): IOAuthToken;
export declare class OAuthTokenPolicy extends PolicyBase {
    protected clientId: string;
    protected clientSecret: string;
    protected scope: string;
    protected expiresIn: number;
    protected createdOn: number;
    protected refreshToken: string;
    grantType: 'authorization_code' | 'refresh_token' | 'password' | 'client_credentials';
    constructor(settings: IOAuthTokenPolicyCtorOptions);
    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    readFrom(settings: IOAuthToken): void;
    /**
     * Returns the data that are persistentable.
     */
    persistent(): IOAuthToken;
    getParams(): any;
    getTokenInternal(): PromiseLike<string>;
    /**
     * Returns if the token is expired or not.
     */
    isExpired(): boolean;
    /**
     * Applys the token to the given options.
     */
    applyTo(options: any): void;
    /**
     * Apply security policy to the given options.
     */
    applyToV2(options: any): void;
    /**
     * App security policy the given options, used for our customized XHR.
     */
    applyToV3(options: any): void;
    /**
     * Resets the token and its assoicated information.
     */
    reset(): void;
}
