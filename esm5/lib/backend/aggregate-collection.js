/**
 * @fileOverview
 * An endpoint which aggregates a few other endpoints, to form a new endpoint.
 * Note that the caller is responsible for resetting underlying data providers
 * and even caching them.
 * Moreover, this class does not assume any knowledge about providerGenerator.
 * providerGenerator may generate the same thing again as again.
 * Also note that it is the provider generator's responsibilty for
 * preversing the state of each data provider.
 */
import * as dependencies from '@polpware/fe-dependencies';
var when = dependencies.when;
var _ = dependencies.underscore;
function hasNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return true;
    }
    return collection.hasNextPage();
}
function getNextPage(collection) {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return collection.getFirstPage();
    }
    return collection.getNextPage();
}
var AggregateCollection = /** @class */ (function () {
    function AggregateCollection(_providerGenerator) {
        this._providerGenerator = _providerGenerator;
        this._workingProviders = [];
    }
    AggregateCollection.prototype.hasNextPage = function () {
        // Case 1: The first time we request, we always have something.
        if (this._workingProviders.length === 0) {
            return true;
        }
        if (this._providerGenerator.hasMore()) {
            return true;
        }
        return _.some(this._workingProviders, function (elem) {
            return elem.hasNextPage();
        });
    };
    AggregateCollection.prototype.getFirstPage = function () {
        var _this = this;
        // Generate providers
        return this._providerGenerator.getNext()
            .then(function (providers) {
            providers = _.filter(providers, function (p) {
                return hasNextPage(p);
            });
            return providers;
        })
            .then(function (providers) {
            _this._workingProviders.length = 0;
            var promises = _.map(providers, function (p) {
                var _this = this;
                return getNextPage(p)
                    .then(function (resp) {
                    _this._workingProviders.push(p);
                    return resp;
                });
            });
            return when.settle(promises);
        });
    };
    AggregateCollection.prototype.getNextPage = function () {
        return this.getFirstPage();
    };
    AggregateCollection.prototype.reset = function () {
        this._providerGenerator.reset();
        this._workingProviders = [];
    };
    AggregateCollection.prototype.forEach = function (func) {
        this._workingProviders.forEach(function (p) {
            p.forEach(func);
        });
    };
    AggregateCollection.prototype.get = function (id) {
        // TODO:
    };
    return AggregateCollection;
}());
export { AggregateCollection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9iYWNrZW5kL2FnZ3JlZ2F0ZS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRztBQUVILE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFJMUQsSUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztBQUMvQixJQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRWxDLFNBQVMsV0FBVyxDQUFDLFVBQW1DO0lBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO1FBQ2hFLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsVUFBbUM7SUFDcEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7UUFDaEUsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDcEM7SUFDRCxPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBUUQ7SUFJSSw2QkFBb0Isa0JBQXNDO1FBQXRDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQseUNBQVcsR0FBWDtRQUNJLCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFTLElBQUk7WUFDL0MsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsMENBQVksR0FBWjtRQUFBLGlCQW9CQztRQW5CRyxxQkFBcUI7UUFDckIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO2FBQ25DLElBQUksQ0FBQyxVQUFDLFNBQVM7WUFDWixTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBUyxDQUFDO2dCQUN0QyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxVQUFDLFNBQVM7WUFDWixLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLENBQUM7Z0JBQVYsaUJBTWpDO2dCQUxHLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztxQkFDaEIsSUFBSSxDQUFDLFVBQUMsSUFBSTtvQkFDUCxLQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixPQUFPLElBQUksQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCx5Q0FBVyxHQUFYO1FBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELG1DQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQscUNBQU8sR0FBUCxVQUFRLElBQXdCO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsaUNBQUcsR0FBSCxVQUFJLEVBQUU7UUFDRixRQUFRO0lBQ1osQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQTdERCxJQTZEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogQW4gZW5kcG9pbnQgd2hpY2ggYWdncmVnYXRlcyBhIGZldyBvdGhlciBlbmRwb2ludHMsIHRvIGZvcm0gYSBuZXcgZW5kcG9pbnQuXG4gKiBOb3RlIHRoYXQgdGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgcmVzZXR0aW5nIHVuZGVybHlpbmcgZGF0YSBwcm92aWRlcnNcbiAqIGFuZCBldmVuIGNhY2hpbmcgdGhlbS5cbiAqIE1vcmVvdmVyLCB0aGlzIGNsYXNzIGRvZXMgbm90IGFzc3VtZSBhbnkga25vd2xlZGdlIGFib3V0IHByb3ZpZGVyR2VuZXJhdG9yLlxuICogcHJvdmlkZXJHZW5lcmF0b3IgbWF5IGdlbmVyYXRlIHRoZSBzYW1lIHRoaW5nIGFnYWluIGFzIGFnYWluLlxuICogQWxzbyBub3RlIHRoYXQgaXQgaXMgdGhlIHByb3ZpZGVyIGdlbmVyYXRvcidzIHJlc3BvbnNpYmlsdHkgZm9yXG4gKiBwcmV2ZXJzaW5nIHRoZSBzdGF0ZSBvZiBlYWNoIGRhdGEgcHJvdmlkZXIuXG4gKi9cblxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgeyBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvYmFja2JvbmUuaW50ZXJmYWNlJztcblxuY29uc3Qgd2hlbiA9IGRlcGVuZGVuY2llcy53aGVuO1xuY29uc3QgXyA9IGRlcGVuZGVuY2llcy51bmRlcnNjb3JlO1xuXG5mdW5jdGlvbiBoYXNOZXh0UGFnZShjb2xsZWN0aW9uOiBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSk6IGJvb2xlYW4ge1xuICAgIGlmICghY29sbGVjdGlvbi5zdGF0ZS50b3RhbFBhZ2VzICYmICFjb2xsZWN0aW9uLnN0YXRlLnRvdGFsUmVjb3Jkcykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uaGFzTmV4dFBhZ2UoKTtcbn1cblxuZnVuY3Rpb24gZ2V0TmV4dFBhZ2UoY29sbGVjdGlvbjogSUJhY2tib25lQ29sbGVjdGlvbkxpa2UpOiBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICBpZiAoIWNvbGxlY3Rpb24uc3RhdGUudG90YWxQYWdlcyAmJiAhY29sbGVjdGlvbi5zdGF0ZS50b3RhbFJlY29yZHMpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZ2V0Rmlyc3RQYWdlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLmdldE5leHRQYWdlKCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb3ZpZGVyR2VuZXJhdG9yIHtcbiAgICBoYXNNb3JlKCk6IGJvb2xlYW47XG4gICAgZ2V0TmV4dCgpOiBQcm9taXNlTGlrZTxBcnJheTxJQmFja2JvbmVDb2xsZWN0aW9uTGlrZT4+O1xuICAgIHJlc2V0KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBBZ2dyZWdhdGVDb2xsZWN0aW9uIHtcblxuICAgIHByaXZhdGUgX3dvcmtpbmdQcm92aWRlcnM6IEFycmF5PElCYWNrYm9uZUNvbGxlY3Rpb25MaWtlPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Byb3ZpZGVyR2VuZXJhdG9yOiBJUHJvdmlkZXJHZW5lcmF0b3IpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZ1Byb3ZpZGVycyA9IFtdO1xuICAgIH1cblxuICAgIGhhc05leHRQYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDYXNlIDE6IFRoZSBmaXJzdCB0aW1lIHdlIHJlcXVlc3QsIHdlIGFsd2F5cyBoYXZlIHNvbWV0aGluZy5cbiAgICAgICAgaWYgKHRoaXMuX3dvcmtpbmdQcm92aWRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcHJvdmlkZXJHZW5lcmF0b3IuaGFzTW9yZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5zb21lKHRoaXMuX3dvcmtpbmdQcm92aWRlcnMsIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtLmhhc05leHRQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEZpcnN0UGFnZSgpOiBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICAgICAgLy8gR2VuZXJhdGUgcHJvdmlkZXJzXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm92aWRlckdlbmVyYXRvci5nZXROZXh0KClcbiAgICAgICAgICAgIC50aGVuKChwcm92aWRlcnMpID0+IHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcnMgPSBfLmZpbHRlcihwcm92aWRlcnMsIGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc05leHRQYWdlKHApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm92aWRlcnM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHByb3ZpZGVycykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtpbmdQcm92aWRlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlcyA9IF8ubWFwKHByb3ZpZGVycywgZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TmV4dFBhZ2UocClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29ya2luZ1Byb3ZpZGVycy5wdXNoKHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdoZW4uc2V0dGxlKHByb21pc2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldE5leHRQYWdlKCk6IFByb21pc2VMaWtlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaXJzdFBhZ2UoKTtcbiAgICB9XG5cbiAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcHJvdmlkZXJHZW5lcmF0b3IucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fd29ya2luZ1Byb3ZpZGVycyA9IFtdO1xuICAgIH1cblxuICAgIGZvckVhY2goZnVuYzogKGVsZW06IGFueSkgPT4gYW55KSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmdQcm92aWRlcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcC5mb3JFYWNoKGZ1bmMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQoaWQpIHtcbiAgICAgICAgLy8gVE9ETzpcbiAgICB9XG59XG5cbiJdfQ==