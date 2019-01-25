import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICollectionState, ICollectionItem } from './collection-action-def';
import { ICollectionStore } from './collection-store.interface';
import { GenericState } from './reducers';
export declare abstract class CollectionAbstractStore<T extends ICollectionItem> implements ICollectionStore<T> {
    abstract getState(): Observable<ICollectionState<T>>;
    abstract getStore(): Store<GenericState<T>>;
    add(payload: Array<T>): void;
    remove(payload: Array<T>): void;
    modify(payload: Array<T>): void;
}
