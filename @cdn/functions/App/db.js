/**
 * 打开数据库
 * @param object dbName 数据库的名字
 * @param string storeName 仓库名称
 * @param number version 数据库的版本
 * @return object 该函数会返回一个数据库实例
 */
export function openDB(dbName, version = 1, onUpgradeNeeded) {
    return new Promise((resolve, reject) => {
        var indexedDB = window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB;
        let db;
        const request = indexedDB.open(dbName, version);
        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = function (event) {
            console.log("数据库打开报错");
            reject(event);
        };
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (onUpgradeNeeded) {
                onUpgradeNeeded(db, event);
            }
        };
    });
}
/**
 * 新增数据
 * @param db 数据库实例
 * @param storeName 仓库名称
 * @param data 数据
 */
export function addData(db, storeName, data) {
    // 注意这里我们使用了 any 类型作为 data 的类型，因为这个函数理论上可以接受任何类型的数据。
    // 如果你的数据有具体的结构，你应该为它创建一个接口或者类型。
    const request = db
        .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data);
    request.onsuccess = function (event) {
        console.log("数据写入成功");
    };
    request.onerror = function (event) {
        console.error("数据写入失败", event);
    };
}
/**
 * 更新数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object data 数据
 */
export function updateDB(db, storeName, data) {
    return new Promise((resolve, reject) => {
        var request = db
            .transaction([storeName], "readwrite") // 事务对象
            .objectStore(storeName) // 仓库对象
            .put(data);
        request.onsuccess = function () {
            // console.log("数据更新成功")
            resolve();
        };
        request.onerror = function (event) {
            // console.log("数据更新失败")
        };
    });
}
/**
 * 通过主键读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string key 主键值
 */
export function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const store = db.transaction(storeName, "readonly").objectStore(storeName);
        const request = store.get(key);
        request.onerror = function (event) {
            // console.log("db failed")
            reject(event);
        };
        request.onsuccess = function (event) {
            // console.log("主键查询结果: ", request.result)
            resolve(request.result);
        };
    });
}
/**
 * 通过游标读取数据
 * @param db 数据库实例
 * @param storeName 仓库名称
 * @returns 读取的列表
 */
export function cursorGetData(db, storeName) {
    return new Promise((resolve) => {
        let list = []; // 如果你知道列表中具体的数据类型，可以将 any 替换为具体的类型。
        const store = db
            .transaction(storeName, "readwrite") // 事务
            .objectStore(storeName) // 仓库对象
            .openCursor();
        store.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容
            }
            else {
                resolve(list); // 当游标没有更多元素时，解析 Promise
            }
        };
        store.onerror = function (e) {
            console.error("游标操作错误", e);
            // 这里也可以选择 reject Promise，根据实际需要添加
        };
    });
}
/**
 * 通过索引读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export function getDataByIndex(db, storeName, indexName, indexValue) {
    var store = db.transaction(storeName, "readwrite").objectStore(storeName);
    var request = store.index(indexName).get(indexValue);
    request.onerror = function () {
        console.log("事务失败");
    };
    request.onsuccess = function (e) {
        var result = e.target.result;
        console.log("索引查询结果：", result);
    };
}
/**
 * 通过索引和游标查询记录
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve) => {
        let list = [];
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.openCursor(IDBKeyRange.only(indexValue));
        request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            }
            else {
                resolve(list);
            }
        };
        transaction.onerror = function () {
            // Handle errors here if necessary
        };
    });
}
/**
 * 通过索引和游标分页查询记录
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 * @param number page 页码
 * @param number pageSize 查询条数
 */
export function cursorGetDataByIndexAndPage(db, storeName, indexName, indexValue, page, pageSize) {
    let list = [];
    let counter = 0; // 计数器
    let advanced = true; // 是否跳过多少条查询
    const store = db.transaction(storeName, "readwrite").objectStore(storeName);
    const request = store
        .index(indexName)
        .openCursor(IDBKeyRange.only(indexValue));
    request.onsuccess = function (e) {
        let cursor = e.target.result;
        if (page > 1 && advanced) {
            advanced = false;
            cursor.advance((page - 1) * pageSize); // 跳过多少条
            return;
        }
        if (cursor) {
            list.push(cursor.value);
            counter++;
            if (counter < pageSize) {
                cursor.continue();
            }
            else {
                cursor = null;
                console.log("分页查询结果", list);
            }
        }
        else {
            console.log("分页查询结果", list);
        }
    };
    request.onerror = function () {
        console.error("Cursor operation failed.");
    };
}
/**
 * 通过主键删除数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object id 主键值
 */
export function deleteDB(db, storeName, id) {
    var request = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        .delete(id);
    request.onsuccess = function () {
        console.log("数据删除成功");
    };
    request.onerror = function () {
        console.log("数据删除失败");
    };
}
/**
 * 通过索引和游标删除指定的数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名
 * @param object indexValue 索引值
 */
export function cursorDelete(db, storeName, indexName, indexValue) {
    var store = db.transaction(storeName, "readwrite").objectStore(storeName);
    var request = store
        .index(indexName) // 索引对象
        .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
    request.onsuccess = function (e) {
        var cursor = e.target.result;
        var deleteRequest;
        if (cursor) {
            deleteRequest = cursor.delete(); // 请求删除当前项
            deleteRequest.onerror = function () {
                console.log("游标删除该记录失败");
            };
            deleteRequest.onsuccess = function () {
                console.log("游标删除该记录成功");
            };
            cursor.continue();
        }
    };
    request.onerror = function (e) { };
}
/**
 * 删除数据库
 * @param object dbName 数据库名称
 */
export function deleteDBAll(dbName) {
    // console.log(dbName)
    let deleteRequest = window.indexedDB.deleteDatabase(dbName);
    deleteRequest.onerror = function (event) {
        console.log("删除失败");
    };
    deleteRequest.onsuccess = function (event) {
        console.log("删除成功");
    };
}
