/**
 * 打开数据库
 * @param object dbName 数据库的名字
 * @param string storeName 仓库名称
 * @param number version 数据库的版本
 * @return object 该函数会返回一个数据库实例
 */
export function openDB(dbName: string, version = 1) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB
    let db: IDBDatabase
    // 打开数据库，若没有则会创建
    const request: IDBOpenDBRequest = indexedDB.open(dbName, version)
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result // 数据库对象
      resolve(db)
    }
    // 数据库打开失败的回调
    request.onerror = function (event) {
      console.log("数据库打开报错")
    }
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发,比success先执行
      console.log("onupgradeneeded")
      db = (event.target as IDBOpenDBRequest).result // 数据库对象
      // 创建存储库
      let objectStore_md = db.createObjectStore("users_md", {
        keyPath: "uuid", // 这是主键
        // autoIncrement: true // 实现自增
      })
      let objectStore_img = db.createObjectStore("users_img", {
        keyPath: "uuid", // 这是主键
        // autoIncrement: true // 实现自增
      })
      // 创建索引，在后面查询数据的时候可以根据索引查
      objectStore_md.createIndex("uuid", "uuid", { unique: true })
      objectStore_md.createIndex("contentText", "contentText", {
        unique: false,
      })
      // objectStore.createIndex("age", "age", { unique: false })
      objectStore_img.createIndex("uuid", "uuid", { unique: true })
      objectStore_img.createIndex("imgBase64", "imgBase64", { unique: false })
    }
  })
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
export function updateDB(db: IDBDatabase, storeName: string, data: any) {
  var request = db
    .transaction([storeName], "readwrite") // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(data)

  request.onsuccess = function () {
    console.log("数据更新成功")
  }

  request.onerror = function () {
    console.log("数据更新失败")
  }
}
/**
 * 通过主键读取数据
 * @param object db 数据库实例
 * @param string storeName 仓库名称
 * @param string key 主键值
 */
export function getDataByKey(db: IDBDatabase, storeName: string, key: string) {
  var store = db
    .transaction(storeName, "readwrite") // 事务
    .objectStore(storeName) // 仓库对象
  var request = store.get(key) // 通过主键获取数据
  // getAll 也可以获取全部
  request.onerror = function (event) {
    console.log("事务失败")
  }

  request.onsuccess = function (event) {
    console.log("主键查询结果: ", request.result)
  }
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
  request.onerror = function (e) {}
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
