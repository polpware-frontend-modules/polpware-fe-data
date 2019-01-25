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
import { IBackboneCollectionLike } from '../interfaces/backbone.interface';
export interface IProviderGenerator {
    hasMore(): boolean;
    getNext(): PromiseLike<Array<IBackboneCollectionLike>>;
    reset(): void;
}
export declare class AggregateCollection {
    private _providerGenerator;
    private _workingProviders;
    constructor(_providerGenerator: IProviderGenerator);
    hasNextPage(): boolean;
    getFirstPage(): PromiseLike<any>;
    getNextPage(): PromiseLike<any>;
    reset(): void;
    forEach(func: (elem: any) => any): void;
    get(id: any): void;
}
