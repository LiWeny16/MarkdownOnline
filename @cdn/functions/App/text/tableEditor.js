// src/js/functions/App/text/tableEditor.ts
import { tableRegistry, tableDataToMarkdown, StandardTableAPI } from '@Func/Parser/mdItPlugin/table';
// 全局标记，防止写入Monaco时触发循环更新
let isWritingToMonaco = false;
// ===== 🚀 新的基于标准化JSON数据的同步系统 =====
class StandardTableSyncManager {
    constructor() {
        Object.defineProperty(this, "isInternalUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "syncCallbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    static getInstance() {
        if (!StandardTableSyncManager.instance) {
            StandardTableSyncManager.instance = new StandardTableSyncManager();
        }
        return StandardTableSyncManager.instance;
    }
    // 注册表格标准化数据变化监听器
    addStandardDataListener(tableId, callback) {
        if (!this.syncCallbacks.has(tableId)) {
            this.syncCallbacks.set(tableId, new Set());
        }
        this.syncCallbacks.get(tableId).add(callback);
        // 同时在标准化数据管理器中注册监听器
        StandardTableAPI.onDataChange(tableId, callback);
    }
    // 移除表格标准化数据监听器
    removeStandardDataListener(tableId, callback) {
        const callbacks = this.syncCallbacks.get(tableId);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.syncCallbacks.delete(tableId);
            }
        }
        // 同时在标准化数据管理器中移除监听器
        StandardTableAPI.offDataChange(tableId, callback);
    }
    // 触发表格标准化数据同步（React → Monaco）
    notifyStandardDataChange(tableId, newData, source = 'react') {
        if (this.isInternalUpdate) {
            console.log(`跳过同步更新 ${tableId}，正在进行内部更新`);
            return;
        }
        this.isInternalUpdate = true;
        console.log(`🚀 标准化数据同步开始: ${tableId}, source: ${source}`);
        try {
            if (source === 'react') {
                // React → Monaco: 更新标准化数据后立即回写Monaco
                const success = StandardTableAPI.updateStandardData(tableId, newData, source);
                if (success) {
                    console.log(`✅ 标准化数据更新成功，准备写入Monaco: ${tableId}`);
                    // 🚀 直接同步执行，避免延迟导致的状态不一致
                    const writeSuccess = writeStandardTableToMonaco(tableId, newData);
                    if (!writeSuccess) {
                        console.error(`❌ Monaco写入失败: ${tableId}`);
                    }
                }
                else {
                    console.warn(`❌ 更新标准化数据失败: ${tableId}`);
                }
            }
            else {
                // Monaco → React: 通过标准化数据通知React组件更新
                StandardTableAPI.updateStandardData(tableId, newData, source);
            }
        }
        finally {
            // 🚀 快速重置状态，提高响应性
            setTimeout(() => {
                this.isInternalUpdate = false;
                console.log(`✅ 同步更新完成: ${tableId}`);
            }, 100); // 减少到100ms
        }
    }
    // 检查是否正在进行内部更新
    isUpdating() {
        return this.isInternalUpdate;
    }
    // 清理特定表格的所有监听器
    clearTableListeners(tableId) {
        const callbacks = this.syncCallbacks.get(tableId);
        if (callbacks) {
            callbacks.forEach(callback => {
                StandardTableAPI.offDataChange(tableId, callback);
            });
            this.syncCallbacks.delete(tableId);
        }
    }
    // 清理所有监听器
    clearAllListeners() {
        this.syncCallbacks.forEach((callbacks, tableId) => {
            callbacks.forEach(callback => {
                StandardTableAPI.offDataChange(tableId, callback);
            });
        });
        this.syncCallbacks.clear();
    }
}
// 导出新的标准化同步管理器实例
export const standardTableSyncManager = StandardTableSyncManager.getInstance();
// 事件驱动的表格数据同步系统（保持向后兼容）
class TableSyncManager {
    constructor() {
        Object.defineProperty(this, "syncListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "isInternalUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    static getInstance() {
        if (!TableSyncManager.instance) {
            TableSyncManager.instance = new TableSyncManager();
        }
        return TableSyncManager.instance;
    }
    // 注册表格数据变化监听器
    addTableListener(tableId, callback) {
        if (!this.syncListeners.has(tableId)) {
            this.syncListeners.set(tableId, new Set());
        }
        this.syncListeners.get(tableId).add(callback);
        // 🚀 新增：同时注册标准化数据监听器
        const standardCallback = (standardData) => {
            const tableData = StandardTableAPI.standardToTable(standardData);
            callback(tableData);
        };
        standardTableSyncManager.addStandardDataListener(tableId, standardCallback);
    }
    // 移除表格数据监听器
    removeTableListener(tableId, callback) {
        const listeners = this.syncListeners.get(tableId);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.syncListeners.delete(tableId);
            }
        }
    }
    // 触发表格数据同步（React → Monaco）
    notifyTableDataChange(tableId, newData, source = 'react') {
        // 🚀 委托给标准化同步管理器
        standardTableSyncManager.notifyStandardDataChange(tableId, newData, source);
    }
    // 检查是否正在进行内部更新
    isUpdating() {
        return this.isInternalUpdate || standardTableSyncManager.isUpdating();
    }
    // 清理特定表格的所有监听器
    clearTableListeners(tableId) {
        this.syncListeners.delete(tableId);
        standardTableSyncManager.clearTableListeners(tableId);
    }
    // 清理所有监听器
    clearAllListeners() {
        this.syncListeners.clear();
        standardTableSyncManager.clearAllListeners();
    }
}
// 导出同步管理器实例（保持向后兼容）
export const tableSyncManager = TableSyncManager.getInstance();
// ===== 🚀 基于标准化数据的Monaco编辑器回写函数 =====
export function writeStandardTableToMonaco(tableId, newData) {
    isWritingToMonaco = true;
    const standardData = StandardTableAPI.getStandardData(tableId);
    if (!standardData) {
        console.warn(`Standard table data ${tableId} not found in registry`);
        isWritingToMonaco = false;
        return false;
    }
    if (!window.monaco || !window.editor) {
        console.warn("Monaco editor not available");
        isWritingToMonaco = false;
        return false;
    }
    try {
        /* 1️⃣ 生成新的markdown */
        const newMarkdown = tableDataToMarkdown(newData);
        console.log(`生成新markdown，行数: ${newMarkdown.split('\n').length}`);
        /* 2️⃣ 获取editor和model */
        const editor = window.editor;
        const model = editor.getModel();
        if (!model) {
            console.warn("Monaco editor model not available");
            isWritingToMonaco = false;
            return false;
        }
        /* 3️⃣ 精确的范围计算：只替换表格本身的内容 */
        const startLine = standardData.metadata.startLine; // 0‑based
        const originalEndLine = standardData.metadata.endLine; // 0‑based，已经是表格后一行的行号
        const modelLineCount = model.getLineCount();
        // 🚀 修复：endLine已经是表格后一行，表格最后一行应该是endLine-1
        const tableLastLine = originalEndLine - 1; // 0‑based，表格实际最后一行
        const safeEndLine = Math.min(tableLastLine, modelLineCount - 1);
        const monacoStartLine = startLine + 1; // 转换为1‑based
        const monacoEndLine = safeEndLine + 1; // 转换为1‑based，表格实际最后一行
        // 🚀 修复：精确计算范围，只选择表格行，不影响下一行
        const range = new window.monaco.Range(monacoStartLine, // 开始行
        1, // 开始列（行首）
        monacoEndLine, // 结束行（表格最后一行）
        model.getLineMaxColumn(monacoEndLine) // 结束列（表格最后一行的行尾，不包含换行符）
        );
        console.log(`替换范围: [${monacoStartLine}:1] 到 [${monacoEndLine}:${model.getLineMaxColumn(monacoEndLine)}]`);
        /* 4️⃣ 准备替换文本 - 检查是否需要空行分隔 */
        let finalText = newMarkdown.trimEnd();
        // 🚀 修复：正确检查表格下一行内容
        const nextLineNumber = originalEndLine + 1; // 表格下一行（1-based）
        if (nextLineNumber <= modelLineCount) {
            const nextLineContent = model.getLineContent(nextLineNumber);
            console.log(`检查下一行 ${nextLineNumber}: "${nextLineContent}"`);
            // 如果下一行不是空行且有内容，则在表格后添加空行
            if (nextLineContent && nextLineContent.trim() !== '') {
                finalText += '\n'; // 添加空行分隔
                console.log(`添加空行分隔，因为下一行有内容: "${nextLineContent}"`);
            }
        }
        /* 执行替换 */
        editor.executeEdits(`table-edit-${tableId}`, [
            {
                range,
                text: finalText,
                forceMoveMarkers: true,
            },
        ]);
        /* 5️⃣ 重新计算和更新endLine */
        // 等待DOM更新后重新计算
        setTimeout(() => {
            const updatedModel = editor.getModel();
            if (updatedModel) {
                // 重新计算行数，考虑可能添加的空行
                const finalTextLines = finalText.split('\n');
                const newTableLastLine = startLine + finalTextLines.length - 1; // 0-based，表格实际最后一行
                const newEndLine = newTableLastLine + 1; // 0-based，表格后一行
                console.log(`更新endLine: ${originalEndLine} -> ${newEndLine} (表格行数: ${finalTextLines.length})`);
                updateStandardTableEndLine(tableId, newEndLine);
            }
            isWritingToMonaco = false;
            console.log(`Monaco写入完成: ${tableId}`);
        }, 10); // 减少到10ms，快速完成
        return true;
    }
    catch (e) {
        console.error("Failed to write standard table", e);
        isWritingToMonaco = false;
        return false;
    }
}
// 🚀 更新标准化表格数据中的endLine元数据
function updateStandardTableEndLine(tableId, newEndLine) {
    const standardData = StandardTableAPI.getStandardData(tableId);
    if (!standardData) {
        console.warn(`尝试更新不存在的表格元数据: ${tableId}`);
        return;
    }
    // 更新元数据
    const updatedStandardData = {
        ...standardData,
        metadata: {
            ...standardData.metadata,
            endLine: newEndLine,
            updatedAt: Date.now()
        }
    };
    // 重新注册更新后的数据
    StandardTableAPI.registerStandardData(updatedStandardData);
}
// Monaco编辑器回写函数（保持向后兼容）
export function writeTableToMonaco(tableId, newData) {
    return writeStandardTableToMonaco(tableId, newData);
}
// 检查是否正在写入Monaco的工具函数
export function isCurrentlyWritingToMonaco() {
    return isWritingToMonaco;
}
// ===== 🚀 基于标准化数据的获取函数 =====
export function getStandardTableData(tableId) {
    return StandardTableAPI.getStandardData(tableId);
}
// 获取表格数据（用于React组件，保持向后兼容）
export function getTableData(tableId) {
    const standardData = StandardTableAPI.getStandardData(tableId);
    if (standardData) {
        return StandardTableAPI.standardToTable(standardData);
    }
    // 回退到传统方式
    const metadata = tableRegistry.get(tableId);
    return metadata ? metadata.data : null;
}
// 获取表格元数据（保持向后兼容）
export function getTableMetadata(tableId) {
    return tableRegistry.get(tableId);
}
// ===== 🚀 基于标准化数据的调试函数 =====
export function getStandardTableRegistryDebugInfo() {
    const tables = [];
    const allStandardData = StandardTableAPI.getAllStandardData();
    allStandardData.forEach((standardData, tableId) => {
        tables.push({
            tableId,
            startLine: standardData.metadata.startLine,
            endLine: standardData.metadata.endLine,
            headers: standardData.data.headers,
            rowCount: standardData.data.rows.length,
            columnCount: standardData.schema.columnCount,
            hash: standardData.metadata.tableHash,
            createdAt: new Date(standardData.metadata.createdAt).toISOString(),
            updatedAt: new Date(standardData.metadata.updatedAt).toISOString()
        });
    });
    return tables;
}
// 调试函数：获取所有表格信息（保持向后兼容）
export function getTableRegistryDebugInfo() {
    const tables = [];
    tableRegistry.forEach((metadata, tableId) => {
        tables.push({
            tableId,
            startLine: metadata.startLine,
            endLine: metadata.endLine,
            headers: metadata.data.headers,
            rowCount: metadata.data.rows.length,
            hash: metadata.tableHash
        });
    });
    return tables;
}
// 强制更新表格注册表数据（当Monaco内容变化时调用）
export function updateTableRegistryFromMarkdown() {
    // 获取标准化数据数量
    const standardTableCount = StandardTableAPI.getAllStandardData().size;
    const traditionalTableCount = tableRegistry.size;
    // 打印所有标准化表格的信息用于调试
    const allStandardData = StandardTableAPI.getAllStandardData();
    allStandardData.forEach((standardData, tableId) => {
    });
}
// ===== 🚀 基于标准化数据的Monaco内容变化处理 =====
export function handleStandardMonacoContentChange() {
    if (isWritingToMonaco || standardTableSyncManager.isUpdating()) {
        return;
    }
    const editor = window.editor;
    if (!editor) {
        console.warn('Monaco编辑器不可用');
        return;
    }
    const content = editor.getModel()?.getValue();
    if (!content) {
        console.warn('Monaco编辑器内容为空');
        return;
    }
}
// Monaco内容变化时触发表格同步的函数（保持向后兼容）
export function handleMonacoContentChange() {
    // 委托给新的标准化处理函数
    handleStandardMonacoContentChange();
}
