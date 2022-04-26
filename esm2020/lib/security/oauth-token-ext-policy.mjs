import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';
export class OAuthTokenExtPolicy extends OAuthTokenPolicy {
    constructor(settings, payload) {
        super(settings);
        this._payload = { ...payload };
    }
    get payload() {
        return this._payload;
    }
    // override
    getParams() {
        const p = super.getParams();
        return { ...p, ...this._payload };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtdG9rZW4tZXh0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BvbHB3YXJlL2ZlLWRhdGEvc3JjL2xpYi9zZWN1cml0eS9vYXV0aC10b2tlbi1leHQtcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUFJckQsWUFBWSxRQUFzQyxFQUFFLE9BQWU7UUFDL0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7SUFDWCxTQUFTO1FBQ0wsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgSU9BdXRoVG9rZW5Qb2xpY3lDdG9yT3B0aW9uc1xyXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBPQXV0aFRva2VuUG9saWN5IH0gZnJvbSAnLi9vYXV0aC10b2tlbi1wb2xpY3knO1xyXG5leHBvcnQgeyBhZGFwdFRvT0F1dGhUb2tlbiB9IGZyb20gJy4vb2F1dGgtdG9rZW4tcG9saWN5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBPQXV0aFRva2VuRXh0UG9saWN5IGV4dGVuZHMgT0F1dGhUb2tlblBvbGljeSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGF5bG9hZDogb2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJT0F1dGhUb2tlblBvbGljeUN0b3JPcHRpb25zLCBwYXlsb2FkOiBvYmplY3QpIHtcclxuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSB7IC4uLnBheWxvYWQgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBheWxvYWQoKTogb2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvdmVycmlkZVxyXG4gICAgZ2V0UGFyYW1zKCk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgcCA9IHN1cGVyLmdldFBhcmFtcygpO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnAsIC4uLiB0aGlzLl9wYXlsb2FkIH07XHJcbiAgICB9XHJcbn1cclxuIl19