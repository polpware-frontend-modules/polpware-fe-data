/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */
import { IRelationalTableOptions, IRelationalTable } from './table';
export interface IRelationalDatabase {
    getReference(): IRelationalDatabase;
    addTable(options: IRelationalTableOptions): IRelationalTable;
    getTable(name: string): IRelationalTable;
    addForeignkey(name: string, foreignKey: string, foreignName: string): void;
    destroy(): void;
}
export declare class RelationDatabase implements IRelationalDatabase {
    private _tableCollection;
    private _referenceCounter;
    private _dummyRecords;
    /**
     * Represents a relational database.
     */
    constructor();
    /**
     * Gets a reference of the file system database
     */
    getReference(): IRelationalDatabase;
    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    addTable(options: IRelationalTableOptions): IRelationalTable;
    /**
     * Retrieves a table by name.
     */
    getTable(name: string): IRelationalTable;
    /**
     * Defines a foreign relation between two tables.
     */
    addForeignkey(name: string, foreignKey: string, foreignName: string): void;
    /**
     * Destroys database
     */
    destroy(): void;
}
