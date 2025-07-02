import { tableRegistry, tableDataToMarkdown, TableData, TableMetadata } from '@Func/Parser/mdItPlugin/table';

// 全局标记，防止写入Monaco时触发循环更新
let isWritingToMonaco = false;

// 解析Monaco编辑器中的表格内容为TableData格式
export function parseMonacoTable(content: string, tableId: string): TableData | null {
    try {
        const metadata = tableRegistry.get(tableId);
        if (!metadata) {
            console.warn(`Table ${tableId} not found in registry`);
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

// 事件驱动的表格数据同步系统
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
        if (this.isInternalUpdate) return;
        
        this.isInternalUpdate = true;
        
        console.log(`TableSyncManager: 通知表格 ${tableId} 数据变化，来源: ${source}`);
        
        try {
            if (source === 'react') {
                // React → Monaco: 写入Monaco编辑器
                writeTableToMonaco(tableId, newData);
            } else {
                // Monaco → React: 通知React组件更新
                const listeners = this.syncListeners.get(tableId);
                if (listeners) {
                    listeners.forEach(callback => {
                        try {
                            callback(newData);
                        } catch (error) {
                            console.error(`表格 ${tableId} 监听器回调出错:`, error);
                        }
                    });
                }
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
        this.syncListeners.delete(tableId);
    }

    // 清理所有监听器
    clearAllListeners() {
        this.syncListeners.clear();
    }
}

// 导出同步管理器实例
export const tableSyncManager = TableSyncManager.getInstance();

// Monaco编辑器回写函数
export function writeTableToMonaco(tableId: string, newData: TableData): boolean {
    console.log(`writeTableToMonaco: 表格 ${tableId}`);

    // 设置写入标记，防止循环触发
    isWritingToMonaco = true;

    // 获取表格元数据
    const metadata = tableRegistry.get(tableId);
    if (!metadata) {
        console.warn(`Table ${tableId} not found in registry`);
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
        // 直接使用传入的数据
        const dataToWrite = newData;

        // 生成新的Markdown表格
        const newMarkdown = tableDataToMarkdown(dataToWrite);

        // 获取编辑器实例
        const editor = window.editor;
        const model = editor.getModel();
        if (!model) {
            console.warn('Monaco editor model not available');
            isWritingToMonaco = false;
            return false;
        }
        // 1️⃣ 重新计算新的末行号（包含 header + 分隔 + rows）
        const newLineCount = newMarkdown.trim().split('\n').length;
        const newEndLine = metadata.startLine + newLineCount - 1;
        const range = new window.monaco.Range(
            metadata.startLine + 1,
            1,
            newEndLine + 1,
            model.getLineMaxColumn(newEndLine + 1)
        );

        // 使用 executeEdits 而不是 applyEdits，以保持撤销栈
        editor.executeEdits(`table-edit-${tableId}`, [{
            range: range,
            text: newMarkdown.trim(),
            forceMoveMarkers: true
        }]);

        // 更新注册表中的数据
        metadata.data = dataToWrite;
        metadata.rawMarkdown = newMarkdown;
        metadata.endLine = newEndLine;
        // 重新计算哈希（基于新的表格内容，与table.ts保持一致）
        const tableDataString = JSON.stringify({
            headers: dataToWrite.headers,
            rows: dataToWrite.rows
        });
        // 使用简单哈希函数（需要导入或定义）
        const simpleHash = (str: string): string => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }
            return Math.abs(hash).toString(36).slice(0, 12); // 转换为36进制，取前12位
        };
        metadata.tableHash = simpleHash(tableDataString);

        console.log(`writeTableToMonaco: 表格 ${tableId} 更新完成`);

        // 延长标记重置时间，确保所有相关事件都已处理完毕
        setTimeout(() => {
            isWritingToMonaco = false;
        }, 300); // 增加到300ms

        return true;
    } catch (error) {
        console.error(`Failed to write table ${tableId} to Monaco:`, error);
        isWritingToMonaco = false;
        return false;
    }
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

    // 只有在明显缺失数据时才进行补全
    // 不强制所有行都有相同的列数，保持用户的原始意图

    return normalized;
}

// 获取表格数据（用于React组件）
export function getTableData(tableId: string): TableData | null {
    const metadata = tableRegistry.get(tableId);
    return metadata ? metadata.data : null;
}

// 获取表格元数据
export function getTableMetadata(tableId: string): TableMetadata | undefined {
    return tableRegistry.get(tableId);
}

// 调试函数：获取所有表格信息
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
    // 这个函数会在markdown重新解析后被调用
    // 由于表格插件会重新解析所有表格并更新注册表，
    // 我们只需要记录这个事件
    const tableCount = tableRegistry.size;
    console.log(`表格注册表已更新，包含 ${tableCount} 个表格`);

    // 打印所有表格的信息用于调试
    tableRegistry.forEach((metadata, tableId) => {
        console.log(`表格 ${tableId}:`, {
            headers: metadata.data.headers,
            rowCount: metadata.data.rows.length,
            hash: metadata.tableHash
        });
    });
}

// Monaco内容变化时触发表格同步的函数
export function handleMonacoContentChange(): void {
    if (isWritingToMonaco || tableSyncManager.isUpdating()) {
        console.log('跳过Monaco内容变化同步 - 正在进行其他更新');
        return;
    }

    console.log('处理Monaco内容变化，同步表格数据');
    
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

    // 遍历所有注册的表格，检查是否有变化
    tableRegistry.forEach((metadata, tableId) => {
        try {
            const currentData = parseMonacoTable(content, tableId);
            if (currentData) {
                // 比较数据是否发生变化
                const oldDataString = JSON.stringify(metadata.data);
                const newDataString = JSON.stringify(currentData);
                
                if (oldDataString !== newDataString) {
                    console.log(`表格 ${tableId} 数据发生变化，通知React组件更新`);
                    // 更新注册表中的数据
                    metadata.data = currentData;
                    // 通知React组件数据变化
                    tableSyncManager.notifyTableDataChange(tableId, currentData, 'monaco');
                }
            }
        } catch (error) {
            console.error(`处理表格 ${tableId} 的Monaco内容变化时出错:`, error);
        }
    });
}

// 全局调试工具（开发环境）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).TableEditorDebug = {
        getTableData,
        getTableMetadata,
        getRegistryInfo: getTableRegistryDebugInfo,
        writeTable: writeTableToMonaco,
        normalizeData: normalizeTableData,
        parseMonacoTable,
        syncManager: tableSyncManager,
        handleMonacoContentChange
    };
} 