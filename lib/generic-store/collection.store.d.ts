import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenericState } from './reducers/index';
import { CollectionAbstractStore } from './collection-abstract.store';
import { ICollectionState, ICollectionItem } from './collection-action-def';
import * as i0 from "@angular/core";
export declare class CollectionStore<T extends ICollectionItem> extends CollectionAbstractStore<T> {
    private _store;
    constructor();
    getStore(): Store<GenericState<T>>;
    getState(): Observable<ICollectionState<T>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollectionStore<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CollectionStore<any>>;
}
