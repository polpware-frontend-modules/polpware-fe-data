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
const when = dependencies.when;
const _ = dependencies.underscore;
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
export class AggregateCollection {
    constructor(_providerGenerator) {
        this._providerGenerator = _providerGenerator;
        this._workingProviders = [];
    }
    hasNextPage() {
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
    }
    getFirstPage() {
        // Generate providers
        return this._providerGenerator.getNext()
            .then((providers) => {
            providers = _.filter(providers, function (p) {
                return hasNextPage(p);
            });
            return providers;
        })
            .then((providers) => {
            this._workingProviders.length = 0;
            const promises = _.map(providers, function (p) {
                return getNextPage(p)
                    .then((resp) => {
                    this._workingProviders.push(p);
                    return resp;
                });
            });
            return when.settle(promises);
        });
    }
    getNextPage() {
        return this.getFirstPage();
    }
    reset() {
        this._providerGenerator.reset();
        this._workingProviders = [];
    }
    forEach(func) {
        this._workingProviders.forEach((p) => {
            p.forEach(func);
        });
    }
    get(id) {
        // TODO:
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvYmFja2VuZC9hZ2dyZWdhdGUtY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBSTFELE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFDL0IsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUVsQyxTQUFTLFdBQVcsQ0FBQyxVQUFtQztJQUNwRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtRQUNoRSxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsT0FBTyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLFVBQW1DO0lBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO1FBQ2hFLE9BQU8sVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQVFELE1BQU0sT0FBTyxtQkFBbUI7SUFJNUIsWUFBb0Isa0JBQXNDO1FBQXRDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsV0FBVztRQUNQLCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFTLElBQUk7WUFDL0MsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsWUFBWTtRQUNSLHFCQUFxQjtRQUNyQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7YUFDbkMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDaEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVMsQ0FBQztnQkFDdEMsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLENBQUM7Z0JBQ3hDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztxQkFDaEIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUF3QjtRQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDakMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBRTtRQUNGLFFBQVE7SUFDWixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIEFuIGVuZHBvaW50IHdoaWNoIGFnZ3JlZ2F0ZXMgYSBmZXcgb3RoZXIgZW5kcG9pbnRzLCB0byBmb3JtIGEgbmV3IGVuZHBvaW50LlxuICogTm90ZSB0aGF0IHRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIHJlc2V0dGluZyB1bmRlcmx5aW5nIGRhdGEgcHJvdmlkZXJzXG4gKiBhbmQgZXZlbiBjYWNoaW5nIHRoZW0uXG4gKiBNb3Jlb3ZlciwgdGhpcyBjbGFzcyBkb2VzIG5vdCBhc3N1bWUgYW55IGtub3dsZWRnZSBhYm91dCBwcm92aWRlckdlbmVyYXRvci5cbiAqIHByb3ZpZGVyR2VuZXJhdG9yIG1heSBnZW5lcmF0ZSB0aGUgc2FtZSB0aGluZyBhZ2FpbiBhcyBhZ2Fpbi5cbiAqIEFsc28gbm90ZSB0aGF0IGl0IGlzIHRoZSBwcm92aWRlciBnZW5lcmF0b3IncyByZXNwb25zaWJpbHR5IGZvclxuICogcHJldmVyc2luZyB0aGUgc3RhdGUgb2YgZWFjaCBkYXRhIHByb3ZpZGVyLlxuICovXG5cbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IHsgSUJhY2tib25lQ29sbGVjdGlvbkxpa2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2JhY2tib25lLmludGVyZmFjZSc7XG5cbmNvbnN0IHdoZW4gPSBkZXBlbmRlbmNpZXMud2hlbjtcbmNvbnN0IF8gPSBkZXBlbmRlbmNpZXMudW5kZXJzY29yZTtcblxuZnVuY3Rpb24gaGFzTmV4dFBhZ2UoY29sbGVjdGlvbjogSUJhY2tib25lQ29sbGVjdGlvbkxpa2UpOiBib29sZWFuIHtcbiAgICBpZiAoIWNvbGxlY3Rpb24uc3RhdGUudG90YWxQYWdlcyAmJiAhY29sbGVjdGlvbi5zdGF0ZS50b3RhbFJlY29yZHMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLmhhc05leHRQYWdlKCk7XG59XG5cbmZ1bmN0aW9uIGdldE5leHRQYWdlKGNvbGxlY3Rpb246IElCYWNrYm9uZUNvbGxlY3Rpb25MaWtlKTogUHJvbWlzZUxpa2U8YW55PiB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnN0YXRlLnRvdGFsUGFnZXMgJiYgIWNvbGxlY3Rpb24uc3RhdGUudG90YWxSZWNvcmRzKSB7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmdldEZpcnN0UGFnZSgpO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi5nZXROZXh0UGFnZSgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQcm92aWRlckdlbmVyYXRvciB7XG4gICAgaGFzTW9yZSgpOiBib29sZWFuO1xuICAgIGdldE5leHQoKTogUHJvbWlzZUxpa2U8QXJyYXk8SUJhY2tib25lQ29sbGVjdGlvbkxpa2U+PjtcbiAgICByZXNldCgpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQWdncmVnYXRlQ29sbGVjdGlvbiB7XG5cbiAgICBwcml2YXRlIF93b3JraW5nUHJvdmlkZXJzOiBBcnJheTxJQmFja2JvbmVDb2xsZWN0aW9uTGlrZT47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wcm92aWRlckdlbmVyYXRvcjogSVByb3ZpZGVyR2VuZXJhdG9yKSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmdQcm92aWRlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBoYXNOZXh0UGFnZSgpOiBib29sZWFuIHtcbiAgICAgICAgLy8gQ2FzZSAxOiBUaGUgZmlyc3QgdGltZSB3ZSByZXF1ZXN0LCB3ZSBhbHdheXMgaGF2ZSBzb21ldGhpbmcuXG4gICAgICAgIGlmICh0aGlzLl93b3JraW5nUHJvdmlkZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3Byb3ZpZGVyR2VuZXJhdG9yLmhhc01vcmUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uc29tZSh0aGlzLl93b3JraW5nUHJvdmlkZXJzLCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5oYXNOZXh0UGFnZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRGaXJzdFBhZ2UoKTogUHJvbWlzZUxpa2U8YW55PiB7XG4gICAgICAgIC8vIEdlbmVyYXRlIHByb3ZpZGVyc1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJHZW5lcmF0b3IuZ2V0TmV4dCgpXG4gICAgICAgICAgICAudGhlbigocHJvdmlkZXJzKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzID0gXy5maWx0ZXIocHJvdmlkZXJzLCBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNOZXh0UGFnZShwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdmlkZXJzO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChwcm92aWRlcnMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl93b3JraW5nUHJvdmlkZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBfLm1hcChwcm92aWRlcnMsIGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE5leHRQYWdlKHApXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtpbmdQcm92aWRlcnMucHVzaChwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB3aGVuLnNldHRsZShwcm9taXNlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXROZXh0UGFnZSgpOiBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rmlyc3RQYWdlKCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3Byb3ZpZGVyR2VuZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3dvcmtpbmdQcm92aWRlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmb3JFYWNoKGZ1bmM6IChlbGVtOiBhbnkpID0+IGFueSkge1xuICAgICAgICB0aGlzLl93b3JraW5nUHJvdmlkZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHAuZm9yRWFjaChmdW5jKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0KGlkKSB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgfVxufVxuXG4iXX0=