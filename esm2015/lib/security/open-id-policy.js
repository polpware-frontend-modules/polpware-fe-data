/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */
import { DummyOAuthTokenCtorParams } from './interfaces';
import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';
export function adaptToOpenIDToken(data) {
    data = data || {};
    const r = adaptToOAuthToken(data);
    return Object.assign(Object.assign({}, r), { openId: data.openId || '' });
}
export class OpenIDPolicy extends OAuthTokenPolicy {
    constructor() {
        super(DummyOAuthTokenCtorParams);
        this._openId = '';
    }
    /**
     * Returns the necessary information for peristence.
     */
    persistent() {
        const r = super.persistent();
        return Object.assign(Object.assign({}, r), { openId: this._openId });
    }
    /**
     * Reads credential from the given settings.
     */
    readFrom(settings) {
        super.readFrom(settings);
        this._openId = settings.openId;
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Blbi1pZC1wb2xpY3kuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZWN1cml0eS9vcGVuLWlkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBRUgseUJBQXlCLEVBQzVCLE1BQU0sY0FBYyxDQUFDO0FBRXRCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTNFLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxJQUFJO0lBQ25DLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRWxCLE1BQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLHVDQUFZLENBQUMsS0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUc7QUFDL0MsQ0FBQztBQUVELE1BQU0sT0FBTyxZQUFhLFNBQVEsZ0JBQWdCO0lBSTlDO1FBQ0ksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsVUFBVTtRQUNOLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3Qix1Q0FBWSxDQUFDLEtBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUc7SUFDMUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFDLFFBQXNCO1FBQzNCLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAZmlsZU92ZXJ2aWV3XHJcbiAqIE9wZW5JRCB0b2tlbiBwb2xpY3ksIGJ1aWx0IHVwb24gT0F1dGgyIHRva2VuIHBvbGljeVxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgICBJT3BlbklEVG9rZW4sXHJcbiAgICBEdW1teU9BdXRoVG9rZW5DdG9yUGFyYW1zXHJcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IE9BdXRoVG9rZW5Qb2xpY3ksIGFkYXB0VG9PQXV0aFRva2VuIH0gZnJvbSAnLi9vYXV0aC10b2tlbi1wb2xpY3knO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0VG9PcGVuSURUb2tlbihkYXRhKTogSU9wZW5JRFRva2VuIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG5cclxuICAgIGNvbnN0IHIgPSBhZGFwdFRvT0F1dGhUb2tlbihkYXRhKTtcclxuICAgIHJldHVybiB7IC4uLnIsIG9wZW5JZDogZGF0YS5vcGVuSWQgfHwgJycgfTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9wZW5JRFBvbGljeSBleHRlbmRzIE9BdXRoVG9rZW5Qb2xpY3kge1xyXG5cclxuICAgIHByaXZhdGUgX29wZW5JZDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKER1bW15T0F1dGhUb2tlbkN0b3JQYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX29wZW5JZCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbmVjZXNzYXJ5IGluZm9ybWF0aW9uIGZvciBwZXJpc3RlbmNlLlxyXG4gICAgICovXHJcbiAgICBwZXJzaXN0ZW50KCk6IElPcGVuSURUb2tlbiB7XHJcbiAgICAgICAgY29uc3QgciA9IHN1cGVyLnBlcnNpc3RlbnQoKTtcclxuICAgICAgICByZXR1cm4geyAuLi5yLCBvcGVuSWQ6IHRoaXMuX29wZW5JZCB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVhZHMgY3JlZGVudGlhbCBmcm9tIHRoZSBnaXZlbiBzZXR0aW5ncy5cclxuICAgICAqL1xyXG4gICAgcmVhZEZyb20oc2V0dGluZ3M6IElPcGVuSURUb2tlbikge1xyXG4gICAgICAgIHN1cGVyLnJlYWRGcm9tKHNldHRpbmdzKTtcclxuICAgICAgICB0aGlzLl9vcGVuSWQgPSBzZXR0aW5ncy5vcGVuSWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIl19