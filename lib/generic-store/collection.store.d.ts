import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericState } from './reducers/index';
import { CollectionAbstractStore } from './collection-abstract.store';
import { ICollectionState, ICollectionItem } from './collection-action-def';
export declare class CollectionStore<T extends ICollectionItem> extends CollectionAbstractStore<T> {
    private _store;
    constructor();
    getStore(): Store<GenericState<T>>;
    getState(): Observable<ICollectionState<T>>;
}
