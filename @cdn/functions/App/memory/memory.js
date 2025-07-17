import { openDB, cursorGetDataByIndex, cursorGetData, updateDB, } from "@App/memory/db";
import alertUseArco from "@App/message/alert";
import i18n from "i18next";
// import getMdText from "@App/text/getMdText"
// ----------------------------------------------------------------
// # 1. 浏览器支持检查
// ----------------------------------------------------------------
function isIndexedDBSupported() {
    try {
        if (!window.indexedDB) {
            return false;
        }
        // 在隐私模式下，open可能会抛出错误
        const request = window.indexedDB.open("test-support-check");
        request.onerror = () => false;
        return true;
    }
    catch (e) {
        return false;
    }
}
let indexedDBSupportChecked = false;
let indexedDBSupported = false;
function checkIndexedDBSupport() {
    if (!indexedDBSupportChecked) {
        indexedDBSupported = isIndexedDBSupported();
        indexedDBSupportChecked = true;
        if (!indexedDBSupported) {
            const t = i18n.t;
            const message = t ?
                t("indexeddb-not-supported", "您的浏览器不支持或禁用了IndexedDB，数据将无法本地保存") :
                "您的浏览器不支持或禁用了IndexedDB，数据将无法本地保存";
            alertUseArco(message, 5000, { kind: "error" });
            console.error("IndexedDB 不被支持，数据持久化功能将不可用");
        }
    }
    return indexedDBSupported;
}
const DB_CONFIG = {
    name: "md_content",
    version: 2,
    stores: {
        users_md: { keyPath: "uuid" },
        users_img: {
            keyPath: "uuid",
            index: { name: "uuid", unique: false }
        },
    }
};
// ----------------------------------------------------------------
// # 3. 统一且自愈的数据库初始化函数
// ----------------------------------------------------------------
/**
 * @description 统一的数据库初始化和自愈函数
 * 自动处理首次创建、版本升级和表意外丢失后的修复
 */
async function initMdContentDB() {
    try {
        // 尝试以正常版本打开数据库
        const db = await openDB(DB_CONFIG.name, DB_CONFIG.version, (dbInstance, event) => {
            createOrRepairStores(dbInstance, event);
        });
        // 检查表结构是否完整
        const existingStores = Array.from(db.objectStoreNames);
        const requiredStores = Object.keys(DB_CONFIG.stores);
        const missingStores = requiredStores.filter(store => !existingStores.includes(store));
        if (missingStores.length === 0) {
            // 结构完整，直接返回
            return db;
        }
        // 表结构不完整，需要修复
        console.warn(`数据库表结构不完整，缺失: ${missingStores.join(", ")}`);
        alertUseArco("检测到数据库表缺失，正在重建数据库...", 3000, { kind: "warning" });
        db.close(); // 修复前必须关闭
        // 采用删除重建策略，而不是版本升级
        await repairDatabaseByRecreating();
        // 重新打开修复后的数据库
        const repairedDb = await openDB(DB_CONFIG.name, DB_CONFIG.version, (dbInstance, event) => {
            createOrRepairStores(dbInstance, event);
        });
        alertUseArco("数据库重建成功", 2000, { kind: "success" });
        return repairedDb;
    }
    catch (error) {
        console.error("数据库初始化失败:", error);
        alertUseArco("数据库初始化失败，数据可能无法保存", 4000, { kind: "error" });
        throw error;
    }
}
/**
 * @description 通过删除重建的方式修复数据库
 * 这种方式不会导致版本号混乱，但会丢失现有数据
 */
async function repairDatabaseByRecreating() {
    // 尝试备份现有数据
    const backup = await tryBackupExistingData();
    return new Promise((resolve, reject) => {
        console.log("开始删除损坏的数据库...");
        // 提醒用户数据可能丢失
        if (backup.hasData) {
            alertUseArco("检测到现有数据，将尝试在重建后恢复", 3000, { kind: "info" });
        }
        else {
            alertUseArco("重建数据库可能会丢失现有数据", 3000, { kind: "warning" });
        }
        const deleteRequest = window.indexedDB.deleteDatabase(DB_CONFIG.name);
        deleteRequest.onsuccess = async () => {
            console.log("✓ 数据库删除成功，现在可以重新创建");
            // 如果有备份数据，尝试恢复
            if (backup.hasData) {
                try {
                    await restoreBackupData(backup);
                    console.log("✓ 数据恢复成功");
                }
                catch (restoreError) {
                    console.warn("数据恢复失败，但数据库重建成功:", restoreError);
                }
            }
            resolve();
        };
        deleteRequest.onerror = (event) => {
            console.error("✗ 数据库删除失败:", event);
            reject(new Error("数据库删除失败"));
        };
        deleteRequest.onblocked = () => {
            console.warn("数据库删除被阻塞，可能有其他连接未关闭");
            // 等待一段时间后重试
            setTimeout(() => {
                resolve();
            }, 1000);
        };
    });
}
/**
 * @description 尝试备份现有数据
 */
async function tryBackupExistingData() {
    try {
        // 尝试用基础的 openDB 读取现有数据
        const db = await openDB(DB_CONFIG.name);
        const backup = { hasData: false };
        // 备份文本数据
        if (db.objectStoreNames.contains("users_md")) {
            try {
                const textData = await cursorGetData(db, "users_md");
                if (textData && textData.length > 0) {
                    backup.textData = textData;
                    backup.hasData = true;
                }
            }
            catch (e) {
                console.warn("文本数据备份失败:", e);
            }
        }
        // 备份图片数据
        if (db.objectStoreNames.contains("users_img")) {
            try {
                const imageData = await cursorGetData(db, "users_img");
                if (imageData && imageData.length > 0) {
                    backup.imageData = imageData;
                    backup.hasData = true;
                }
            }
            catch (e) {
                console.warn("图片数据备份失败:", e);
            }
        }
        db.close();
        return backup;
    }
    catch (error) {
        console.warn("数据备份过程失败:", error);
        return { hasData: false };
    }
}
/**
 * @description 恢复备份数据
 */
async function restoreBackupData(backup) {
    if (!backup.hasData)
        return;
    const db = await openDB(DB_CONFIG.name, DB_CONFIG.version, (dbInstance, event) => {
        createOrRepairStores(dbInstance, event);
    });
    try {
        // 恢复文本数据
        if (backup.textData) {
            for (const item of backup.textData) {
                await updateDB(db, "users_md", item);
            }
            console.log(`✓ 恢复了 ${backup.textData.length} 条文本数据`);
        }
        // 恢复图片数据
        if (backup.imageData) {
            for (const item of backup.imageData) {
                await updateDB(db, "users_img", item);
            }
            console.log(`✓ 恢复了 ${backup.imageData.length} 条图片数据`);
        }
        alertUseArco("数据恢复成功", 2000, { kind: "success" });
    }
    catch (error) {
        console.error("数据恢复失败:", error);
        alertUseArco("数据库重建成功，但数据恢复失败", 3000, { kind: "warning" });
    }
    finally {
        db.close();
    }
}
/**
 * @description 创建或修复数据库表
 */
function createOrRepairStores(db, event) {
    console.log(`数据库升级中... 从 v${event.oldVersion} -> v${event.newVersion}`);
    for (const [storeName, config] of Object.entries(DB_CONFIG.stores)) {
        if (!db.objectStoreNames.contains(storeName)) {
            try {
                const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
                if (config.index) {
                    store.createIndex(config.index.name, config.index.name, { unique: config.index.unique });
                }
                console.log(`✓ 成功创建/修复表: ${storeName}`);
            }
            catch (error) {
                console.error(`✗ 创建/修复表 ${storeName} 失败:`, error);
            }
        }
        else {
            console.log(`✓ 表 ${storeName} 已存在`);
        }
    }
}
// ----------------------------------------------------------------
// # 4. 安全的操作包装器
// ----------------------------------------------------------------
async function safeDBOperation(operation, fallbackValue, operationName = "数据库操作") {
    if (!checkIndexedDBSupport()) {
        return fallbackValue;
    }
    let db = null;
    try {
        // 每次操作都通过init函数获取健康的DB实例
        db = await initMdContentDB();
        const result = await operation(db);
        return result;
    }
    catch (error) {
        console.error(`[${operationName}] 失败:`, error);
        // 根据错误类型提供不同的用户提示
        const errorMessage = error.message || "";
        if (errorMessage.includes("quota") || errorMessage.includes("storage")) {
            alertUseArco("存储空间不足，请清理浏览器数据后重试", 4000, { kind: "error" });
        }
        else if (errorMessage.includes("表") || errorMessage.includes("store")) {
            alertUseArco(`数据库表异常：${operationName}失败`, 3500, { kind: "error" });
        }
        else {
            alertUseArco(`${operationName}失败，请刷新或稍后重试`, 3000, { kind: "warning" });
        }
        return fallbackValue;
    }
    finally {
        // 确保数据库连接被关闭
        if (db) {
            db.close();
        }
    }
}
// ----------------------------------------------------------------
// # 5. 数据读写接口
// ----------------------------------------------------------------
export async function fillInMemoryText(md) {
    await safeDBOperation(async (db) => {
        await updateDB(db, "users_md", { uuid: 1, contentText: md });
        console.log("文本数据保存成功");
    }, undefined, "保存文本");
}
export async function readMemoryText() {
    return safeDBOperation(async (db) => {
        const list = await cursorGetData(db, "users_md");
        return Array.isArray(list) ? list : [];
    }, [], "读取文本");
}
export async function fillInMemoryImg(base64, timeStamp) {
    await safeDBOperation(async (db) => {
        await updateDB(db, "users_img", { uuid: timeStamp, imgBase64: base64 });
        console.log("图片数据保存成功");
    }, undefined, "保存图片");
}
export async function fillInMemoryImgs(base64Arr, timeStamp) {
    await safeDBOperation(async (db) => {
        const promises = base64Arr.map((base64, i) => updateDB(db, "users_img", { uuid: timeStamp + i, imgBase64: base64 }));
        await Promise.all(promises);
        console.log("批量图片数据保存成功");
    }, undefined, "批量保存图片");
}
export async function readMemoryImg(indexName, indexValue) {
    return safeDBOperation(async (db) => {
        const list = await cursorGetDataByIndex(db, "users_img", indexName, indexValue);
        return Array.isArray(list) ? list : [];
    }, [], "读取图片");
}
export async function readAllMemoryImg() {
    return safeDBOperation(async (db) => {
        const list = await cursorGetData(db, "users_img");
        return Array.isArray(list) ? list : [];
    }, [], "读取所有图片");
}
// ----------------------------------------------------------------
// # 6. 应用启动时的初始化函数
// ----------------------------------------------------------------
/**
 * @description 数据库初始化函数 - 在应用启动时调用
 * 执行一次健康检查和自动修复
 */
export async function initMemoryDB() {
    console.log("正在初始化和检查 Memory 数据库...");
    if (!checkIndexedDBSupport()) {
        console.warn("⚠ IndexedDB 不支持，应用将在无数据库模式下运行");
        return;
    }
    let db = null;
    try {
        // 调用强大的初始化函数，它本身就是一次健康检查和修复
        db = await initMdContentDB();
        console.log(`✓ Memory 数据库已就绪 (版本: ${db.version})`);
        // 静默初始化，不显示成功提示避免过多弹窗
        // alertUseArco("数据库已就绪", 2000, { kind: "success" })
    }
    catch (error) {
        console.error("✗ Memory 数据库初始化最终失败:", error);
        alertUseArco("数据库初始化失败，数据将无法保存", 5000, { kind: "error" });
    }
    finally {
        if (db) {
            db.close();
        }
    }
}
// ----------------------------------------------------------------
// # 7. 导出辅助函数
// ----------------------------------------------------------------
/**
 * @description 手动触发数据库健康检查和修复
 */
export async function checkAndRepairDatabase() {
    const issues = [];
    let repaired = false;
    if (!checkIndexedDBSupport()) {
        issues.push("IndexedDB 不被支持");
        return { isHealthy: false, issues, repaired: false };
    }
    let db = null;
    try {
        // 尝试打开数据库并检查结构
        db = await openDB(DB_CONFIG.name, DB_CONFIG.version, (dbInstance, event) => {
            createOrRepairStores(dbInstance, event);
        });
        // 检查表结构完整性
        const existingStores = Array.from(db.objectStoreNames);
        const requiredStores = Object.keys(DB_CONFIG.stores);
        const missingStores = requiredStores.filter(store => !existingStores.includes(store));
        if (missingStores.length > 0) {
            issues.push(`发现缺失的表: ${missingStores.join(", ")}`);
            // 执行修复
            db.close();
            db = null;
            try {
                await repairDatabaseByRecreating();
                db = await initMdContentDB();
                repaired = true;
                issues.push("数据库结构已通过重建修复");
            }
            catch (repairError) {
                issues.push("数据库修复失败");
                console.error("修复失败:", repairError);
            }
        }
        // 测试基本读写功能
        if (db) {
            try {
                await readMemoryText();
                await readAllMemoryImg();
            }
            catch (rwError) {
                issues.push("数据库读写功能异常");
                console.error("数据库读写测试失败:", rwError);
            }
        }
        return {
            isHealthy: issues.length === 0 || (repaired && issues.length === 1),
            issues,
            repaired
        };
    }
    catch (error) {
        issues.push(`数据库检查失败: ${error.message}`);
        return { isHealthy: false, issues, repaired: false };
    }
    finally {
        if (db) {
            db.close();
        }
    }
}
/**
 * @description 获取当前数据库版本（不触发升级）
 * 主要用于调试和日志记录
 */
async function getCurrentDBVersion() {
    return new Promise((resolve) => {
        const request = window.indexedDB.open(DB_CONFIG.name);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const version = db.version;
            db.close();
            resolve(version);
        };
        request.onerror = () => resolve(0); // 数据库不存在时返回0
    });
}
export { checkIndexedDBSupport };
