import { ActionReducerMap } from '@ngrx/store';
import { ICollectionState, ICollectionItem } from '../collection-action-def';
export interface GenericState<T extends ICollectionItem> {
    collection: ICollectionState<T>;
}
export declare function buildInitialState<T extends ICollectionItem>(): GenericState<T>;
export declare function buildReducerMap<T extends ICollectionItem>(): ActionReducerMap<GenericState<T>>;
