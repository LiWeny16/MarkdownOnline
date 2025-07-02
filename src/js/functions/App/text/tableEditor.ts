import { 
    tableRegistry, 
    tableDataToMarkdown, 
    TableData, 
    TableMetadata,
    StandardTableData,
    standardTableDataManager,
    StandardTableAPI
} from '@Func/Parser/mdItPlugin/table';

// 全局标记，防止写入Monaco时触发循环更新
let isWritingToMonaco = false;

// 解析Monaco编辑器中的表格内容为TableData格式
export function parseMonacoTable(content: string, tableId: string): TableData | null {
    try {
        // 首先尝试从标准化数据中获取元数据
        const standardData = StandardTableAPI.getStandardData(tableId);
        if (!standardData) {
            // 回退到传统方式
            const metadata = tableRegistry.get(tableId);
            if (!metadata) {
                console.warn(`Table ${tableId} not found in registry`);
                return null;
            }
        }

        const metadata = standardData ? standardData.metadata : tableRegistry.get(tableId);
        if (!metadata) {
            console.warn(`Table ${tableId} metadata not found`);
            return null;
        }

        // 获取表格所在的行内容
        const lines = content.split('\n');
        const startLine = metadata.startLine;
        const endLine = Math.min(metadata.endLine, lines.length - 1);
        
        if (startLine >= lines.length || endLine < startLine) {
            console.warn(`Invalid line range for table ${tableId}: ${startLine}-${endLine}`);
            return null;
        }

        // 提取表格行
        const tableLines = lines.slice(startLine, endLine + 1);
        
        // 过滤出真正的表格行（包含 | 的行）
        const validTableLines = tableLines.filter(line => line.trim().includes('|') && !line.trim().match(/^\|[\s\-\|]*\|$/));
        
        if (validTableLines.length < 1) {
            return { headers: [], rows: [] };
        }

        // 解析表头（第一行）
        const headerLine = validTableLines[0];
        const headers = parseTableRow(headerLine);
        
        // 解析数据行（跳过分隔行）
        const rows: string[][] = [];
        for (let i = 1; i < validTableLines.length; i++) {
            const line = validTableLines[i];
            // 跳过分隔行（形如 |---|---|）
            if (line.trim().match(/^\|[\s\-\|]*\|$/)) {
                continue;
            }
            const row = parseTableRow(line);
            if (row.length > 0) {
                rows.push(row);
            }
        }

        // 确保所有行的列数一致
        const maxCols = Math.max(headers.length, ...rows.map(row => row.length));
        
        // 补全headers
        while (headers.length < maxCols) {
            headers.push('');
        }
        
        // 补全rows中的每一行
        rows.forEach(row => {
            while (row.length < maxCols) {
                row.push('');
            }
            // 只保留与表头相同数量的列
            row.splice(maxCols);
        });

        return { headers, rows };
    } catch (error) {
        console.error(`Failed to parse table ${tableId} from Monaco:`, error);
        return null;
    }
}

// 解析单行表格数据
function parseTableRow(line: string): string[] {
    // 移除首尾的 | 字符并分割
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
        return [];
    }
    
    // 移除首尾的 | 并按 | 分割
    const content = trimmed.slice(1, -1);
    const cells = content.split('|').map(cell => cell.trim());
    
    // 过滤掉空的单元格（但保留有内容的空格）
    return cells.map(cell => cell === ' ' ? '' : cell);
}

// ===== 🚀 新的基于标准化JSON数据的同步系统 =====
class StandardTableSyncManager {
    private static instance: StandardTableSyncManager;
    private isInternalUpdate = false;
    private syncCallbacks = new Map<string, Set<(standardData: StandardTableData) => void>>();

    static getInstance(): StandardTableSyncManager {
        if (!StandardTableSyncManager.instance) {
            StandardTableSyncManager.instance = new StandardTableSyncManager();
        }
        return StandardTableSyncManager.instance;
    }

    // 注册表格标准化数据变化监听器
    addStandardDataListener(tableId: string, callback: (standardData: StandardTableData) => void) {
        if (!this.syncCallbacks.has(tableId)) {
            this.syncCallbacks.set(tableId, new Set());
        }
        this.syncCallbacks.get(tableId)!.add(callback);
        
        // 同时在标准化数据管理器中注册监听器
        StandardTableAPI.onDataChange(tableId, callback);
    }

    // 移除表格标准化数据监听器
    removeStandardDataListener(tableId: string, callback: (standardData: StandardTableData) => void) {
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
    notifyStandardDataChange(tableId: string, newData: TableData, source: 'react' | 'monaco' = 'react') {
        if (this.isInternalUpdate) return;
        
        this.isInternalUpdate = true;
        
        console.log(`StandardTableSyncManager: 通知表格 ${tableId} 标准化数据变化，来源: ${source}`);
        
        try {
            if (source === 'react') {
                // React → Monaco: 通过标准化数据更新Monaco编辑器
                const success = StandardTableAPI.updateStandardData(tableId, newData, source);
                if (success) {
                    writeStandardTableToMonaco(tableId, newData);
                }
            } else {
                // Monaco → React: 通过标准化数据通知React组件更新
                StandardTableAPI.updateStandardData(tableId, newData, source);
            }
        } finally {
            // 延迟重置标记，确保所有相关事件处理完毕
            setTimeout(() => {
                this.isInternalUpdate = false;
            }, 100);
        }
    }

    // 检查是否正在进行内部更新
    isUpdating(): boolean {
        return this.isInternalUpdate;
    }

    // 清理特定表格的所有监听器
    clearTableListeners(tableId: string) {
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
    private static instance: TableSyncManager;
    private syncListeners = new Map<string, Set<(data: TableData) => void>>();
    private isInternalUpdate = false;

    static getInstance(): TableSyncManager {
        if (!TableSyncManager.instance) {
            TableSyncManager.instance = new TableSyncManager();
        }
        return TableSyncManager.instance;
    }

    // 注册表格数据变化监听器
    addTableListener(tableId: string, callback: (data: TableData) => void) {
        if (!this.syncListeners.has(tableId)) {
            this.syncListeners.set(tableId, new Set());
        }
        this.syncListeners.get(tableId)!.add(callback);
        
        // 🚀 新增：同时注册标准化数据监听器
        const standardCallback = (standardData: StandardTableData) => {
            const tableData = StandardTableAPI.standardToTable(standardData);
            callback(tableData);
        };
        standardTableSyncManager.addStandardDataListener(tableId, standardCallback);
    }

    // 移除表格数据监听器
    removeTableListener(tableId: string, callback: (data: TableData) => void) {
        const listeners = this.syncListeners.get(tableId);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.syncListeners.delete(tableId);
            }
        }
    }

    // 触发表格数据同步（React → Monaco）
    notifyTableDataChange(tableId: string, newData: TableData, source: 'react' | 'monaco' = 'react') {
        // 🚀 委托给标准化同步管理器
        standardTableSyncManager.notifyStandardDataChange(tableId, newData, source);
    }

    // 检查是否正在进行内部更新
    isUpdating(): boolean {
        return this.isInternalUpdate || standardTableSyncManager.isUpdating();
    }

    // 清理特定表格的所有监听器
    clearTableListeners(tableId: string) {
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
export function writeStandardTableToMonaco(tableId: string, newData: TableData): boolean {
    console.log(`writeStandardTableToMonaco: 表格 ${tableId}`);

    // 设置写入标记，防止循环触发
    isWritingToMonaco = true;

    // 获取标准化数据
    const standardData = StandardTableAPI.getStandardData(tableId);
    if (!standardData) {
        console.warn(`Standard table data ${tableId} not found in registry`);
        isWritingToMonaco = false;
        return false;
    }

    // 检查Monaco编辑器是否可用
    if (!window.monaco || !window.editor) {
        console.warn('Monaco editor not available');
        isWritingToMonaco = false;
        return false;
    }

    try {
        // 生成新的Markdown表格
        const newMarkdown = tableDataToMarkdown(newData);

        // 获取编辑器实例
        const editor = window.editor;
        const model = editor.getModel();
        if (!model) {
            console.warn('Monaco editor model not available');
            isWritingToMonaco = false;
            return false;
        }

        // 🚀 修复范围计算逻辑
        const startLine = standardData.metadata.startLine;
        const originalEndLine = standardData.metadata.endLine;
        
        // 确保原始结束行号不超过当前模型的行数
        const modelLineCount = model.getLineCount();
        const actualEndLine = Math.min(originalEndLine, modelLineCount - 1);
        
        console.log(`writeStandardTableToMonaco: 表格 ${tableId} 范围信息`, {
            startLine,
            originalEndLine,
            actualEndLine,
            modelLineCount,
            newMarkdownLines: newMarkdown.trim().split('\n').length
        });

        // 创建替换范围：从表格开始行到原始结束行（或模型最大行）
        const range = new window.monaco.Range(
            startLine + 1,  // Monaco行号从1开始
            1,
            actualEndLine + 1,
            model.getLineMaxColumn(actualEndLine + 1)
        );

        // 使用 executeEdits 而不是 applyEdits，以保持撤销栈
        editor.executeEdits(`table-edit-${tableId}`, [{
            range: range,
            text: newMarkdown.trim(),
            forceMoveMarkers: true
        }]);

        // 🚀 更新标准化数据中的endLine元数据
        const newMarkdownLines = newMarkdown.trim().split('\n');
        const newEndLine = startLine + newMarkdownLines.length - 1;
        updateStandardTableEndLine(tableId, newEndLine);

        console.log(`writeStandardTableToMonaco: 表格 ${tableId} 更新完成，新的endLine: ${newEndLine}`);

        // 延长标记重置时间，确保所有相关事件都已处理完毕
        setTimeout(() => {
            isWritingToMonaco = false;
        }, 300); // 增加到300ms

        return true;
    } catch (error) {
        console.error(`Failed to write standard table ${tableId} to Monaco:`, error);
        isWritingToMonaco = false;
        return false;
    }
}

// 🚀 更新标准化表格数据中的endLine元数据
function updateStandardTableEndLine(tableId: string, newEndLine: number): void {
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
        },
        version: standardData.version + 1
    };

    // 重新注册更新后的数据
    StandardTableAPI.registerStandardData(updatedStandardData);
    
    console.log(`更新表格 ${tableId} 的endLine: ${standardData.metadata.endLine} → ${newEndLine}`);
}

// Monaco编辑器回写函数（保持向后兼容）
export function writeTableToMonaco(tableId: string, newData: TableData): boolean {
    console.log(`writeTableToMonaco: 表格 ${tableId} (向后兼容)`);
    return writeStandardTableToMonaco(tableId, newData);
}

// 检查是否正在写入Monaco的工具函数
export function isCurrentlyWritingToMonaco(): boolean {
    return isWritingToMonaco;
}

// 数据结构标准化函数：确保行列一致性，但避免过度补全
function normalizeTableData(data: TableData): TableData {
    if (!data || (!data.headers?.length && !data.rows?.length)) {
        return { headers: [], rows: [] };
    }

    // 深拷贝避免修改原数据
    const normalized: TableData = {
        headers: [...(data.headers || [])],
        rows: (data.rows || []).map(row => [...row])
    };

    // 如果没有表头但有数据行，创建默认表头
    if (normalized.headers.length === 0 && normalized.rows.length > 0) {
        const maxCols = Math.max(...normalized.rows.map(row => row.length));
        normalized.headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
    }

    return normalized;
}

// ===== 🚀 基于标准化数据的获取函数 =====
export function getStandardTableData(tableId: string): StandardTableData | null {
    return StandardTableAPI.getStandardData(tableId);
}

// 获取表格数据（用于React组件，保持向后兼容）
export function getTableData(tableId: string): TableData | null {
    const standardData = StandardTableAPI.getStandardData(tableId);
    if (standardData) {
        return StandardTableAPI.standardToTable(standardData);
    }
    
    // 回退到传统方式
    const metadata = tableRegistry.get(tableId);
    return metadata ? metadata.data : null;
}

// 获取表格元数据（保持向后兼容）
export function getTableMetadata(tableId: string): TableMetadata | undefined {
    return tableRegistry.get(tableId);
}

// ===== 🚀 基于标准化数据的调试函数 =====
export function getStandardTableRegistryDebugInfo() {
    const tables: any[] = [];
    const allStandardData = StandardTableAPI.getAllStandardData();
    
    allStandardData.forEach((standardData, tableId) => {
        tables.push({
            tableId,
            version: standardData.version,
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
    const tables: any[] = [];
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
export function updateTableRegistryFromMarkdown(): void {
    console.log('强制更新表格注册表数据');
    
    // 获取标准化数据数量
    const standardTableCount = StandardTableAPI.getAllStandardData().size;
    const traditionalTableCount = tableRegistry.size;
    
    console.log(`标准化表格注册表已更新，包含 ${standardTableCount} 个表格`);
    console.log(`传统表格注册表已更新，包含 ${traditionalTableCount} 个表格`);

    // 打印所有标准化表格的信息用于调试
    const allStandardData = StandardTableAPI.getAllStandardData();
    allStandardData.forEach((standardData, tableId) => {
        console.log(`标准化表格 ${tableId}:`, {
            version: standardData.version,
            headers: standardData.data.headers,
            rowCount: standardData.data.rows.length,
            columnCount: standardData.schema.columnCount,
            hash: standardData.metadata.tableHash
        });
    });
}

// ===== 🚀 基于标准化数据的Monaco内容变化处理 =====
export function handleStandardMonacoContentChange(): void {
    if (isWritingToMonaco || standardTableSyncManager.isUpdating()) {
        console.log('跳过Monaco内容变化同步 - 正在进行其他更新');
        return;
    }

    console.log('处理Monaco内容变化，同步标准化表格数据');
    
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

    // 遍历所有注册的标准化表格，检查是否有变化
    const allStandardData = StandardTableAPI.getAllStandardData();
    allStandardData.forEach((standardData, tableId) => {
        try {
            const currentData = parseMonacoTable(content, tableId);
            if (currentData) {
                // 比较数据是否发生变化
                const oldDataString = JSON.stringify(standardData.data);
                const newDataString = JSON.stringify(currentData);
                
                if (oldDataString !== newDataString) {
                    console.log(`标准化表格 ${tableId} 数据发生变化，通知React组件更新`);
                    // 通过标准化API更新数据
                    StandardTableAPI.updateStandardData(tableId, currentData, 'monaco');
                }
            }
        } catch (error) {
            console.error(`处理标准化表格 ${tableId} 的Monaco内容变化时出错:`, error);
        }
    });
}

// Monaco内容变化时触发表格同步的函数（保持向后兼容）
export function handleMonacoContentChange(): void {
    // 委托给新的标准化处理函数
    handleStandardMonacoContentChange();
}

// 全局调试工具（开发环境）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).TableEditorDebug = {
        // 传统API（向后兼容）
        getTableData,
        getTableMetadata,
        getRegistryInfo: getTableRegistryDebugInfo,
        writeTable: writeTableToMonaco,
        normalizeData: normalizeTableData,
        parseMonacoTable,
        syncManager: tableSyncManager,
        handleMonacoContentChange,
        
        // 🚀 新的标准化API
        getStandardTableData,
        getStandardRegistryInfo: getStandardTableRegistryDebugInfo,
        writeStandardTable: writeStandardTableToMonaco,
        standardSyncManager: standardTableSyncManager,
        handleStandardMonacoContentChange,
        StandardTableAPI
    };
} 