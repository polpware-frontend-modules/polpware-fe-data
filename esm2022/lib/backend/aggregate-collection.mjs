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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wb2xwd2FyZS9mZS1kYXRhL3NyYy9saWIvYmFja2VuZC9hZ2dyZWdhdGUtY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7QUFFSCxPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBSTFELE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFDL0IsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUVsQyxTQUFTLFdBQVcsQ0FBQyxVQUFtQztJQUNwRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsVUFBbUM7SUFDcEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNqRSxPQUFPLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsT0FBTyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQVFELE1BQU0sT0FBTyxtQkFBbUI7SUFJNUIsWUFBb0Isa0JBQXNDO1FBQXRDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsV0FBVztRQUNQLCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBUyxJQUFJO1lBQy9DLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7UUFDUixxQkFBcUI7UUFDckIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO2FBQ25DLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2hCLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFTLENBQUM7Z0JBQ3RDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDbEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBUyxDQUFDO2dCQUN4QyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUM7cUJBQ2hCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBd0I7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2pDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQUU7UUFDRixRQUFRO0lBQ1osQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBBbiBlbmRwb2ludCB3aGljaCBhZ2dyZWdhdGVzIGEgZmV3IG90aGVyIGVuZHBvaW50cywgdG8gZm9ybSBhIG5ldyBlbmRwb2ludC5cbiAqIE5vdGUgdGhhdCB0aGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciByZXNldHRpbmcgdW5kZXJseWluZyBkYXRhIHByb3ZpZGVyc1xuICogYW5kIGV2ZW4gY2FjaGluZyB0aGVtLlxuICogTW9yZW92ZXIsIHRoaXMgY2xhc3MgZG9lcyBub3QgYXNzdW1lIGFueSBrbm93bGVkZ2UgYWJvdXQgcHJvdmlkZXJHZW5lcmF0b3IuXG4gKiBwcm92aWRlckdlbmVyYXRvciBtYXkgZ2VuZXJhdGUgdGhlIHNhbWUgdGhpbmcgYWdhaW4gYXMgYWdhaW4uXG4gKiBBbHNvIG5vdGUgdGhhdCBpdCBpcyB0aGUgcHJvdmlkZXIgZ2VuZXJhdG9yJ3MgcmVzcG9uc2liaWx0eSBmb3JcbiAqIHByZXZlcnNpbmcgdGhlIHN0YXRlIG9mIGVhY2ggZGF0YSBwcm92aWRlci5cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCB7IElCYWNrYm9uZUNvbGxlY3Rpb25MaWtlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9iYWNrYm9uZS5pbnRlcmZhY2UnO1xuXG5jb25zdCB3aGVuID0gZGVwZW5kZW5jaWVzLndoZW47XG5jb25zdCBfID0gZGVwZW5kZW5jaWVzLnVuZGVyc2NvcmU7XG5cbmZ1bmN0aW9uIGhhc05leHRQYWdlKGNvbGxlY3Rpb246IElCYWNrYm9uZUNvbGxlY3Rpb25MaWtlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnN0YXRlLnRvdGFsUGFnZXMgJiYgIWNvbGxlY3Rpb24uc3RhdGUudG90YWxSZWNvcmRzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi5oYXNOZXh0UGFnZSgpO1xufVxuXG5mdW5jdGlvbiBnZXROZXh0UGFnZShjb2xsZWN0aW9uOiBJQmFja2JvbmVDb2xsZWN0aW9uTGlrZSk6IFByb21pc2VMaWtlPGFueT4ge1xuICAgIGlmICghY29sbGVjdGlvbi5zdGF0ZS50b3RhbFBhZ2VzICYmICFjb2xsZWN0aW9uLnN0YXRlLnRvdGFsUmVjb3Jkcykge1xuICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5nZXRGaXJzdFBhZ2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZ2V0TmV4dFBhZ2UoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvdmlkZXJHZW5lcmF0b3Ige1xuICAgIGhhc01vcmUoKTogYm9vbGVhbjtcbiAgICBnZXROZXh0KCk6IFByb21pc2VMaWtlPEFycmF5PElCYWNrYm9uZUNvbGxlY3Rpb25MaWtlPj47XG4gICAgcmVzZXQoKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZUNvbGxlY3Rpb24ge1xuXG4gICAgcHJpdmF0ZSBfd29ya2luZ1Byb3ZpZGVyczogQXJyYXk8SUJhY2tib25lQ29sbGVjdGlvbkxpa2U+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcHJvdmlkZXJHZW5lcmF0b3I6IElQcm92aWRlckdlbmVyYXRvcikge1xuICAgICAgICB0aGlzLl93b3JraW5nUHJvdmlkZXJzID0gW107XG4gICAgfVxuXG4gICAgaGFzTmV4dFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENhc2UgMTogVGhlIGZpcnN0IHRpbWUgd2UgcmVxdWVzdCwgd2UgYWx3YXlzIGhhdmUgc29tZXRoaW5nLlxuICAgICAgICBpZiAodGhpcy5fd29ya2luZ1Byb3ZpZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wcm92aWRlckdlbmVyYXRvci5oYXNNb3JlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLnNvbWUodGhpcy5fd29ya2luZ1Byb3ZpZGVycywgZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0uaGFzTmV4dFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RQYWdlKCk6IFByb21pc2VMaWtlPGFueT4ge1xuICAgICAgICAvLyBHZW5lcmF0ZSBwcm92aWRlcnNcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3ZpZGVyR2VuZXJhdG9yLmdldE5leHQoKVxuICAgICAgICAgICAgLnRoZW4oKHByb3ZpZGVycykgPT4ge1xuICAgICAgICAgICAgICAgIHByb3ZpZGVycyA9IF8uZmlsdGVyKHByb3ZpZGVycywgZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFzTmV4dFBhZ2UocCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVycztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocHJvdmlkZXJzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd29ya2luZ1Byb3ZpZGVycy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gXy5tYXAocHJvdmlkZXJzLCBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXROZXh0UGFnZShwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3JraW5nUHJvdmlkZXJzLnB1c2gocCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2hlbi5zZXR0bGUocHJvbWlzZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0TmV4dFBhZ2UoKTogUHJvbWlzZUxpa2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpcnN0UGFnZSgpO1xuICAgIH1cblxuICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wcm92aWRlckdlbmVyYXRvci5yZXNldCgpO1xuICAgICAgICB0aGlzLl93b3JraW5nUHJvdmlkZXJzID0gW107XG4gICAgfVxuXG4gICAgZm9yRWFjaChmdW5jOiAoZWxlbTogYW55KSA9PiBhbnkpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZ1Byb3ZpZGVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBwLmZvckVhY2goZnVuYyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldChpZCkge1xuICAgICAgICAvLyBUT0RPOlxuICAgIH1cbn1cblxuIl19