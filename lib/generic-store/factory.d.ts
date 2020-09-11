import * as ngrxStore from '@ngrx/store';
import { ICollectionItem } from './collection-action-def';
import * as reducerIndex from './reducers/index';
export declare function factory<T extends ICollectionItem>(): ngrxStore.Store<reducerIndex.GenericState<T>>;
