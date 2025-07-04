import { CollectionActionWithPayload, ICollectionState, ICollectionItem } from '../collection-action-def';
export declare function reducer<T extends ICollectionItem>(state: ICollectionState<T>, action: CollectionActionWithPayload<T>): ICollectionState<T>;
