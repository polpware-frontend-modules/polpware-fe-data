/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
import * as dependencies from '@polpware/fe-dependencies';
var backbone = dependencies.backbone;
var DummyRecords = /** @class */ (function () {
    function DummyRecords() {
        this._data = {};
    }
    DummyRecords.prototype.getDummyRecord = function (key) {
        if (!this._data[key]) {
            this._data[key] = new backbone.Model({});
        }
        return this._data[key];
    };
    return DummyRecords;
}());
export { DummyRecords };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktcmVjb3Jkcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9mZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL3JlbGF0aW9uYWwvZHVtbXktcmVjb3Jkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBSTFELElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7QUFFdkM7SUFJSTtRQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsR0FBVztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogRGVmaW5lcyBhIGdsb2JhbCBkdW1teSByZWNvcmRzIGZvciB0YWJsZXMuIEVhY2ggdGFibGUgaXMgY29uZmlndXJlZCB3aXRoIGEgZHVtbXkgcmVjb3JkLlxuICovXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IElNb2RlbExpa2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2JhY2tib25lLmludGVyZmFjZSc7XG5cbmNvbnN0IGJhY2tib25lID0gZGVwZW5kZW5jaWVzLmJhY2tib25lO1xuXG5leHBvcnQgY2xhc3MgRHVtbXlSZWNvcmRzIHtcblxuICAgIHByaXZhdGUgX2RhdGE6IHsgW2tleTogc3RyaW5nXTogSU1vZGVsTGlrZSB9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREdW1teVJlY29yZChrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0gbmV3IGJhY2tib25lLk1vZGVsKHt9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICAgIH1cbn1cbiJdfQ==