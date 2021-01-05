/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */
import { IFullBackboneCollectionLike, IFullModelLike } from '../interfaces/backbone.interface';
import { DummyRecords } from './dummy-records';
export interface IRelationalTableOptions {
    name: string;
    cascade?: boolean;
    dataProviderCtor?: any;
    dataProviderCtorOption?: any;
}
export interface IRelationalTable {
    name: string;
    cascade: boolean;
    dataProvider(): IFullBackboneCollectionLike;
    get(id: any): IFullModelLike;
    add(model: object): IFullModelLike;
    addMany(models: any[]): IFullModelLike[];
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void;
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void;
    hasForeignRelation(foreignKey: string): boolean;
    hasReverseForeignRelation(reverseForeignKey: string): boolean;
    destroy(): void;
}
export declare class RelationalTable implements IRelationalTable {
    dummyRecords: DummyRecords;
    private _name;
    private _cascade;
    private _addConstraint;
    private _deleteConstraint;
    private _foreignRelation;
    private _reverseForeignRelation;
    private _dataProvider;
    private _onDeletedHandler;
    constructor(options: IRelationalTableOptions, dummyRecords: DummyRecords);
    get name(): string;
    get cascade(): boolean;
    dataProvider(): IFullBackboneCollectionLike;
    onDeleted(): void;
    /**
     * Check if the given items are still in use.
     */
    private hasAnyReference;
    /**
     * Removing any items in other tables which depend on the deleted item.
     */
    private removeReverseForeign;
    /**
     * Gets the model in the table by id.
     */
    get(id: any): IFullModelLike;
    private destroyFromTable;
    private getForeignModel;
    /**
     * Adds an item in the Table and recursively add foreign items.
     */
    add(model: object): IFullModelLike;
    /**
     * Add many items into a table.
     */
    addMany(models: any[]): IFullModelLike[];
    /**
     * Adds a foreign relation.
     */
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void;
    /**
     * Add a reverse foreign relation.
     */
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void;
    /**
     * Check if a given foreign relation is present.
     */
    hasForeignRelation(foreignKey: string): boolean;
    /**
     * Checks if a given reverse foreign relation is present.
     */
    hasReverseForeignRelation(reverseForeignKey: string): boolean;
    /**
     * Destroys table
     */
    destroy(): void;
}
