import { __assign, __extends } from "tslib";
import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';
var OAuthTokenExtPolicy = /** @class */ (function (_super) {
    __extends(OAuthTokenExtPolicy, _super);
    function OAuthTokenExtPolicy(settings, payload) {
        var _this = _super.call(this, settings) || this;
        _this._payload = __assign({}, payload);
        return _this;
    }
    Object.defineProperty(OAuthTokenExtPolicy.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        enumerable: true,
        configurable: true
    });
    // override
    OAuthTokenExtPolicy.prototype.getParams = function () {
        var p = _super.prototype.getParams.call(this);
        return __assign(__assign({}, p), this._payload);
    };
    return OAuthTokenExtPolicy;
}(OAuthTokenPolicy));
export { OAuthTokenExtPolicy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tZXh0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3NlY3VyaXR5L29hdXRoLXRva2VuLWV4dC1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpEO0lBQXlDLHVDQUFnQjtJQUlyRCw2QkFBWSxRQUFzQyxFQUFFLE9BQWU7UUFBbkUsWUFDSSxrQkFBTSxRQUFRLENBQUMsU0FHbEI7UUFERyxLQUFJLENBQUMsUUFBUSxnQkFBUSxPQUFPLENBQUUsQ0FBQzs7SUFDbkMsQ0FBQztJQUVELHNCQUFXLHdDQUFPO2FBQWxCO1lBQ0ksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsV0FBVztJQUNYLHVDQUFTLEdBQVQ7UUFDSSxJQUFNLENBQUMsR0FBRyxpQkFBTSxTQUFTLFdBQUUsQ0FBQztRQUM1Qiw2QkFBWSxDQUFDLEdBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRztJQUN2QyxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBbkJELENBQXlDLGdCQUFnQixHQW1CeEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgSU9BdXRoVG9rZW5Qb2xpY3lDdG9yT3B0aW9uc1xyXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBPQXV0aFRva2VuUG9saWN5IH0gZnJvbSAnLi9vYXV0aC10b2tlbi1wb2xpY3knO1xyXG5leHBvcnQgeyBhZGFwdFRvT0F1dGhUb2tlbiB9IGZyb20gJy4vb2F1dGgtdG9rZW4tcG9saWN5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBPQXV0aFRva2VuRXh0UG9saWN5IGV4dGVuZHMgT0F1dGhUb2tlblBvbGljeSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGF5bG9hZDogb2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zLCBwYXlsb2FkOiBvYmplY3QpIHtcclxuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSB7IC4uLnBheWxvYWQgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBheWxvYWQoKTogb2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvdmVycmlkZVxyXG4gICAgZ2V0UGFyYW1zKCk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgcCA9IHN1cGVyLmdldFBhcmFtcygpO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnAsIC4uLiB0aGlzLl9wYXlsb2FkIH07XHJcbiAgICB9XHJcbn1cclxuIl19