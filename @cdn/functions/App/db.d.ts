/**
 * 打开数据库
 * @param object dbName 数据库的名字
 * @param string storeName 仓库名称
 * @param number version 数据库的版本
 * @return object 该函数会返回一个数据库实例
 */
export declare function openDB(dbName: string, version?: number, onUpgradeNeeded?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void): Promise<IDBDatabase>;
/**
 * 新增数据
 * @param db 数据库实例
 * @param storeName 仓库名称
 * @param data 数据
 */
export declare function addData(db: IDBDatabase, storeName: string, data: any): void;
/**
 * 更新数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object data 数据
 */
export declare function updateDB(db: IDBDatabase, storeName: string, data: any): Promise<void>;
/**
 * 通过主键读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string key 主键值
 */
export declare function getDataByKey(db: IDBDatabase, storeName: string, key: string): Promise<any>;
/**
 * 通过游标读取数据
 * @param db 数据库实例
 * @param storeName 仓库名称
 * @returns 读取的列表
 */
export declare function cursorGetData(db: IDBDatabase, storeName: string): Promise<any[]>;
/**
 * 通过索引读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export declare function getDataByIndex(db: IDBDatabase, storeName: string, indexName: string, indexValue: string): void;
/**
 * 通过索引和游标查询记录
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export declare function cursorGetDataByIndex(db: IDBDatabase, storeName: string, indexName: string, indexValue: string): Promise<any[]>;
/**
 * 通过索引和游标分页查询记录
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 * @param number page 页码
 * @param number pageSize 查询条数
 */
export declare function cursorGetDataByIndexAndPage(db: IDBDatabase, storeName: string, indexName: string, indexValue: string, page: number, pageSize: number): void;
/**
 * 通过主键删除数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object id 主键值
 */
export declare function deleteDB(db: IDBDatabase, storeName: string, id: IDBValidKey): void;
/**
 * 通过索引和游标删除指定的数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名
 * @param object indexValue 索引值
 */
export declare function cursorDelete(db: IDBDatabase, storeName: string, indexName: string, indexValue: string): void;
/**
 * 删除数据库
 * @param object dbName 数据库名称
 */
export declare function deleteDBAll(dbName: string): void;
