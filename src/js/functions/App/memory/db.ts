/**
 * 打开数据库
 * @param object dbName 数据库的名字
 * @param string storeName 仓库名称
 * @param number version 数据库的版本
 * @return object 该函数会返回一个数据库实例
 */
export function openDB(
  dbName: string,
  version = 1,
  onUpgradeNeeded?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    var indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB
    let db: IDBDatabase

    const request: IDBOpenDBRequest = indexedDB.open(dbName, version)

    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = function (event) {
      console.log("数据库打开报错")
      reject(event)
    }

    request.onupgradeneeded = function (event) {
      db = (event.target as IDBOpenDBRequest).result
      if (onUpgradeNeeded) {
        onUpgradeNeeded(db, event)
      }
    }
  })
}

/**
 * 打开缓存数据库的辅助函数，确保 "data" 对象存储存在
 * @returns 数据库实例
 */
export async function openCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB;

    // 先打开数据库获取当前版本
    const checkRequest = indexedDB.open("cache_DB");

    checkRequest.onsuccess = function (event) {
      const existingDb = (event.target as IDBOpenDBRequest).result;
      const currentVersion = existingDb.version;
      const hasDataStore = existingDb.objectStoreNames.contains("data");
      existingDb.close();

      if (hasDataStore) {
        // 对象存储已存在，直接打开
        const openRequest = indexedDB.open("cache_DB", currentVersion);
        openRequest.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
        openRequest.onerror = (e) => reject(e);
      } else {
        // 需要升级版本创建对象存储
        const upgradeRequest = indexedDB.open("cache_DB", currentVersion + 1);
        upgradeRequest.onupgradeneeded = function (e) {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains("data")) {
            db.createObjectStore("data", { keyPath: "id" });
          }
        };
        upgradeRequest.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
        upgradeRequest.onerror = (e) => reject(e);
      }
    };

    checkRequest.onerror = function (event) {
      reject(event);
    };

    checkRequest.onupgradeneeded = function (event) {
      // 数据库首次创建
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "id" });
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
export function addData(db: IDBDatabase, storeName: string, data: any): void {
  // 注意这里我们使用了 any 类型作为 data 的类型，因为这个函数理论上可以接受任何类型的数据。
  // 如果你的数据有具体的结构，你应该为它创建一个接口或者类型。
  const request = db
    .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(data)

  request.onsuccess = function (event: Event) {
    console.log("数据写入成功")
  }

  request.onerror = function (event: Event) {
    console.error("数据写入失败", event)
  }
}

/**
 * 更新数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object data 数据
 */
export function updateDB(
  db: IDBDatabase,
  storeName: string,
  data: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    var request = db
      .transaction([storeName], "readwrite") // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)
    request.onsuccess = function () {
      // console.log("数据更新成功")
      resolve()
    }

    request.onerror = function (event) {
      console.error("数据更新失败:", event)
      reject(event)
    }
  })
}
/**
 * 通过主键读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string key 主键值
 */
export function getDataByKey(
  db: IDBDatabase,
  storeName: string,
  key: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const store = db.transaction(storeName, "readonly").objectStore(storeName)
    const request = store.get(key)
    request.onerror = function (event) {
      // console.log("db failed")
      reject(event)
    }
    request.onsuccess = function (event) {
      // console.log("主键查询结果: ", request.result)
      resolve(request.result)
    }
  })
}
/**
 * 通过游标读取数据
 * @param db 数据库实例
 * @param storeName 仓库名称
 * @returns 读取的列表
 */
export function cursorGetData(
  db: IDBDatabase,
  storeName: string
): Promise<any[]> {
  return new Promise((resolve) => {
    let list: any[] = [] // 如果你知道列表中具体的数据类型，可以将 any 替换为具体的类型。
    const store = db
      .transaction(storeName, "readwrite") // 事务
      .objectStore(storeName) // 仓库对象
      .openCursor()

    store.onsuccess = function (e: Event) {
      const cursor = (e.target as IDBRequest).result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        resolve(list) // 当游标没有更多元素时，解析 Promise
      }
    }

    store.onerror = function (e: Event) {
      console.error("游标操作错误", e)
      // 这里也可以选择 reject Promise，根据实际需要添加
    }
  })
}

/**
 * 通过索引读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export function getDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string
): void {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName)
  var request = store.index(indexName).get(indexValue)
  request.onerror = function () {
    console.log("事务失败")
  }
  request.onsuccess = function (e: Event) {
    var result = (e.target as IDBRequest).result
    console.log("索引查询结果：", result)
  }
}

/**
 * 通过索引和游标查询记录
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名称
 * @param string indexValue 索引值
 */
export function cursorGetDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string
): Promise<any[]> {
  return new Promise((resolve) => {
    let list: any[] = []
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.openCursor(IDBKeyRange.only(indexValue))

    request.onsuccess = function (e: Event) {
      const cursor = (e.target as IDBRequest).result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        resolve(list)
      }
    }

    transaction.onerror = function () {
      // Handle errors here if necessary
    }
  })
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
export function cursorGetDataByIndexAndPage(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
  page: number,
  pageSize: number
): void {
  let list: any[] = []
  let counter = 0 // 计数器
  let advanced = true // 是否跳过多少条查询
  const store = db.transaction(storeName, "readwrite").objectStore(storeName)

  const request = store
    .index(indexName)
    .openCursor(IDBKeyRange.only(indexValue))
  request.onsuccess = function (e: Event) {
    let cursor = (e.target as IDBRequest).result
    if (page > 1 && advanced) {
      advanced = false
      cursor.advance((page - 1) * pageSize) // 跳过多少条
      return
    }
    if (cursor) {
      list.push(cursor.value)
      counter++
      if (counter < pageSize) {
        cursor.continue()
      } else {
        cursor = null
        console.log("分页查询结果", list)
      }
    } else {
      console.log("分页查询结果", list)
    }
  }
  request.onerror = function () {
    console.error("Cursor operation failed.")
  }
}

/**
 * 通过主键删除数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param object id 主键值
 */
export function deleteDB(db: IDBDatabase, storeName: string, id: IDBValidKey) {
  var request = db
    .transaction([storeName], "readwrite")
    .objectStore(storeName)
    .delete(id)

  request.onsuccess = function () {
    console.log("数据删除成功")
  }

  request.onerror = function () {
    console.log("数据删除失败")
  }
}

/**
 * 通过索引和游标删除指定的数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string indexName 索引名
 * @param object indexValue 索引值
 */
export function cursorDelete(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string
) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName)
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
  request.onsuccess = function (e) {
    var cursor = (e.target as IDBRequest).result
    var deleteRequest
    if (cursor) {
      deleteRequest = cursor.delete() // 请求删除当前项
      deleteRequest.onerror = function () {
        console.log("游标删除该记录失败")
      }
      deleteRequest.onsuccess = function () {
        console.log("游标删除该记录成功")
      }
      cursor.continue()
    }
  }
  request.onerror = function (e) { }
}

/**
 * 删除数据库
 * @param object dbName 数据库名称
 */
export function deleteDBAll(dbName: string) {
  // console.log(dbName)
  let deleteRequest = window.indexedDB.deleteDatabase(dbName)
  deleteRequest.onerror = function (event) {
    console.log("删除失败")
  }
  deleteRequest.onsuccess = function (event) {
    console.log("删除成功")
  }
}

/**
 * 从URL下载JSON并存入indexedDB的cache_db数据库下的data表
 * @param url JSON文件的URL
 */
export async function fetchAndStoreJSON(
  url: string,
  name: string,
  onProgress?: (progress: number) => void // 进度回调函数
): Promise<void> {
  try {
    // 1. 发起网络请求
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`网络请求失败: ${response.status}`);
    }

    // 2. 获取内容长度 (用于计算进度)
    const contentLength = response.headers.get("Content-Length");
    if (!contentLength) {
      console.warn("无法获取 Content-Length，无法计算下载进度");
    }

    // 3. 逐步读取流数据
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("读取流失败");
    }

    let receivedLength = 0;
    const chunks: Uint8Array[] = [];
    const totalLength = contentLength ? parseInt(contentLength, 10) : 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;

      // 计算并回调进度
      if (totalLength && onProgress) {
        const progress = Math.round((receivedLength / totalLength) * 100);
        onProgress(progress);
      }
    }

    // 4. 合并数据并解析 JSON
    const concatenatedChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      concatenatedChunks.set(chunk, position);
      position += chunk.length;
    }

    const jsonData = JSON.parse(new TextDecoder("utf-8").decode(concatenatedChunks));

    // 5. 存入 IndexedDB
    const db = await openCacheDB();

    // 使用 put 而不是 add，以便更新已存在的数据
    await updateDB(db, "data", { id: name, data: jsonData });

    // 确保进度为100%（防止 UI 误差）
    if (onProgress) onProgress(100);

    console.log("JSON数据已成功存入 IndexedDB");
  } catch (error) {
    console.error("获取或存储 JSON 数据时出错:", error);
    if (onProgress) onProgress(-1); // 下载失败时传递-1
  }
}


/**
 * 根据 ID 读取 IndexedDB 的 data 表中存储的 JSON 数据
 * @param id 存储时的 ID (比如 "spelling_check" 或 "check_spell")
 */
export async function fetchStoredJSON(id: string): Promise<any | null> {
  try {
    const db = await openCacheDB();
    const data = await getDataByKey(db, "data", id);
    if (data) {
      // console.log(`读取 ID:${id} 的数据:`, data);
      return data.data; // 只返回存储的 JSON 数据
    } else {
      // console.log(`未找到 ID:${id} 的数据`);
      return null;
    }
  } catch (error) {
    // console.error(`读取 ID:${id} 的 JSON 数据时出错:`, error);
    return null;
  }
}
