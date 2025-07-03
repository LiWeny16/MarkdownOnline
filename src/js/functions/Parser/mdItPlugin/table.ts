// src/js/functions/Parser/mdItPlugin/table.ts
import MarkdownIt from "markdown-it/lib";

// ===== 标准化JSON数据结构 =====
// 定义标准化的表格JSON数据结构
export interface StandardTableData {
    tableId: string;
    version: number; // 数据版本号，用于同步控制
    metadata: {
        startLine: number;
        endLine: number;
        tableHash: string;
        rawMarkdown: string;
        createdAt: number;
        updatedAt: number;
    };
    schema: {
        headers: Array<{
            id: string;
            title: string;
            type: 'text' | 'number' | 'date' | 'boolean';
            index: number;
        }>;
        columnCount: number;
        rowCount: number;
    };
    data: {
        headers: string[];
        rows: string[][];
    };
}

// ===== ID 管理器：基于位置的稳定ID生成 =====
let currentDocumentId = 0;  // 当前文档的唯一标识
let documentTableCount = 0; // 当前文档中的表格计数
const positionToId = new Map<string, string>(); // 位置key -> tableId的映射

// 生成基于位置的稳定key
function getPositionKey(startLine: number, endLine: number, tableIndex: number): string {
    return `${currentDocumentId}-${startLine}-${endLine}-${tableIndex}`;
}

// 获取或创建表格ID（基于位置而不是内容）
export function getTableIdByPosition(startLine: number, endLine: number, tableIndex: number): string {
    const positionKey = getPositionKey(startLine, endLine, tableIndex);

    if (!positionToId.has(positionKey)) {
        documentTableCount++;
        const tableId = `table-${documentTableCount}`;
        positionToId.set(positionKey, tableId);
    }

    return positionToId.get(positionKey)!;
}

// 重置文档解析状态（每次新的markdown解析开始时调用）
export function resetDocumentParsing() {
    currentDocumentId++;
    documentTableCount = 0;
    // 不清空positionToId映射，保持历史ID的稳定性
}

// 清理过期的位置映射（可选，用于内存管理）
export function cleanupOldPositions(maxDocuments: number = 10) {
    const currentDocId = currentDocumentId;
    const keysToDelete: string[] = [];

    positionToId.forEach((id, key) => {
        const docId = parseInt(key.split('-')[0]);
        if (currentDocId - docId > maxDocuments) {
            keysToDelete.push(key);
        }
    });

    keysToDelete.forEach(key => positionToId.delete(key));

    if (keysToDelete.length > 0) {
    }
}

// 简单的哈希函数，用于生成内容哈希（用于变更检测）
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36).slice(0, 12); // 转换为36进制，取前12位
}

// 表格数据接口（保持向后兼容）
export interface TableData {
    headers: string[];
    rows: string[][];
}

// 表格元数据接口（保持向后兼容）
export interface TableMetadata {
    tableId: string;
    tableHash: string;
    startLine: number;
    endLine: number;
    rawMarkdown: string;
    data: TableData;
}

// ===== 标准化JSON数据管理器 =====
class StandardTableDataManager {
    private static instance: StandardTableDataManager;
    private standardDataRegistry = new Map<string, StandardTableData>();
    private dataChangeListeners = new Map<string, Set<(data: StandardTableData) => void>>();

    static getInstance(): StandardTableDataManager {
        if (!StandardTableDataManager.instance) {
            StandardTableDataManager.instance = new StandardTableDataManager();
        }
        return StandardTableDataManager.instance;
    }

    // 将TableData转换为StandardTableData
    createStandardData(
        tableId: string,
        data: TableData,
        startLine: number,
        endLine: number,
        rawMarkdown: string
    ): StandardTableData {
        const now = Date.now();
        const existing = this.standardDataRegistry.get(tableId);
        const version = existing ? existing.version + 1 : 1;

        // 生成列schema
        const headers = data.headers.map((title, index) => ({
            id: `col_${index}`,
            title: title || `Column ${index + 1}`,
            type: 'text' as const,
            index
        }));

        const standardData: StandardTableData = {
            tableId,
            version,
            metadata: {
                startLine,
                endLine,
                tableHash: simpleHash(JSON.stringify({ headers: data.headers, rows: data.rows })),
                rawMarkdown,
                createdAt: existing?.metadata.createdAt || now,
                updatedAt: now
            },
            schema: {
                headers,
                columnCount: data.headers.length,
                rowCount: data.rows.length
            },
            data: {
                headers: [...data.headers],
                rows: data.rows.map(row => [...row])
            }
        };

        return standardData;
    }

    // 注册标准化数据
    registerStandardData(standardData: StandardTableData): void {
        this.standardDataRegistry.set(standardData.tableId, standardData);

        // 通知监听器
        this.notifyDataChange(standardData.tableId, standardData);
    }

    // 获取标准化数据
    getStandardData(tableId: string): StandardTableData | null {
        return this.standardDataRegistry.get(tableId) || null;
    }

    // 更新标准化数据
    updateStandardData(tableId: string, newData: TableData, source: 'react' | 'monaco' = 'react'): boolean {
        const existing = this.standardDataRegistry.get(tableId);
        if (!existing) {
            console.warn(`尝试更新不存在的表格: ${tableId}`);
            return false;
        }

        const updatedStandardData = this.createStandardData(
            tableId,
            newData,
            existing.metadata.startLine,
            existing.metadata.endLine,
            existing.metadata.rawMarkdown
        );

        // 更新原始markdown
        updatedStandardData.metadata.rawMarkdown = tableDataToMarkdown(newData);

        this.registerStandardData(updatedStandardData);
        return true;
    }

    // 添加数据变化监听器
    addDataChangeListener(tableId: string, callback: (data: StandardTableData) => void): void {
        if (!this.dataChangeListeners.has(tableId)) {
            this.dataChangeListeners.set(tableId, new Set());
        }
        this.dataChangeListeners.get(tableId)!.add(callback);
    }

    // 移除数据变化监听器
    removeDataChangeListener(tableId: string, callback: (data: StandardTableData) => void): void {
        const listeners = this.dataChangeListeners.get(tableId);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.dataChangeListeners.delete(tableId);
            }
        }
    }

    // 通知数据变化
    private notifyDataChange(tableId: string, data: StandardTableData): void {
        const listeners = this.dataChangeListeners.get(tableId);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`标准化数据监听器回调出错 (${tableId}):`, error);
                }
            });
        }
    }

    // 清理所有数据
    clearAll(): void {
        this.standardDataRegistry.clear();
        this.dataChangeListeners.clear();
    }

    // 获取所有标准化数据（调试用）
    getAllStandardData(): Map<string, StandardTableData> {
        return new Map(this.standardDataRegistry);
    }
}

// 导出标准化数据管理器实例
export const standardTableDataManager = StandardTableDataManager.getInstance();

// 全局表格索引表（保持向后兼容）
export const tableRegistry = new Map<string, TableMetadata>();

// 解析表格token为数据结构，增强空行空列兼容性
function parseTableTokens(tableTokens: any[]): TableData {
    const headers: string[] = [];
    const rows: string[][] = [];

    let currentRow: string[] = [];
    let inHeader = false;
    let inBody = false;

    for (const token of tableTokens) {
        switch (token.type) {
            case 'thead_open':
                inHeader = true;
                break;
            case 'thead_close':
                inHeader = false;
                break;
            case 'tbody_open':
                inBody = true;
                break;
            case 'tbody_close':
                inBody = false;
                break;
            case 'tr_open':
                currentRow = [];
                break;
            case 'tr_close':
                if (inHeader && currentRow.length > 0) {
                    headers.push(...currentRow);
                } else if (inBody && currentRow.length > 0) {
                    rows.push([...currentRow]);
                }
                break;
            case 'th_open':
            case 'td_open':
                // 准备收集单元格内容
                break;
            case 'th_close':
            case 'td_close':
                // 单元格结束
                break;
            case 'inline':
                // 单元格内容
                if (token.content !== undefined) {
                    currentRow.push(token.content.trim());
                }
                break;
        }
    }

    // 确保所有行的列数一致，补全空字符串
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
    });

    return { headers, rows };
}

// 将表格数据转换为Markdown格式，空字符串用空格表示
export function tableDataToMarkdown(data: TableData): string {
    console.log("tableDataToMarkdown: \n", data);
    if (!data.headers.length && !data.rows.length) return '';

    let markdown = '';

    // 生成表头
    if (data.headers.length > 0) {
        const headerRow = data.headers.map(h => h === '' ? ' ' : h);
        markdown += '| ' + headerRow.join(' | ') + ' |\n';
        // 生成分隔行
        markdown += '| ' + data.headers.map(() => '---').join(' | ') + ' |\n';
    }

    // 生成数据行
    const headerCount = data.headers.length;
    for (const row of data.rows) {
        // 确保每行都有足够的列，如果不够则补充空单元格
        const normalizedRow = [...row];
        while (normalizedRow.length < headerCount) {
            normalizedRow.push('');
        }
        // 只保留与表头相同数量的列
        const dataRow = normalizedRow.slice(0, headerCount).map(cell => cell === '' ? ' ' : cell);
        markdown += '| ' + dataRow.join(' | ') + ' |\n';
    }

    return markdown;
}

// ===== 标准化数据转换工具函数 =====
export function standardDataToTableData(standardData: StandardTableData): TableData {
    return {
        headers: [...standardData.data.headers],
        rows: standardData.data.rows.map(row => [...row])
    };
}

export function tableDataToStandardData(
    tableId: string,
    data: TableData,
    startLine: number,
    endLine: number,
    rawMarkdown: string
): StandardTableData {
    return standardTableDataManager.createStandardData(tableId, data, startLine, endLine, rawMarkdown);
}

let tablePlugin = function (md: MarkdownIt) {
    // 核心拦截器：移除所有表格相关的 token，防止 Markdown-it 解析表格
    md.core.ruler.after('block', 'table_to_div', (state) => {
        // 重置文档解析状态（每次解析开始时）
        resetDocumentParsing();

        // 重置注册表（每次解析开始时）
        tableRegistry.clear();
        standardTableDataManager.clearAll();

        const tokens = state.tokens;
        let tableIndex = 0; // 当前文档中的表格索引

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            // 1. Intercept Markdown table tokens.
            if (token.type === 'table_open') {
                // 提取表格数据
                let tableTokens = [];
                let tableCloseIndex = -1;

                // 收集所有表格相关的token
                for (let j = i; j < tokens.length; j++) {
                    tableTokens.push(tokens[j]);
                    if (tokens[j].type === 'table_close') {
                        tableCloseIndex = j;
                        break;
                    }
                }

                if (tableCloseIndex !== -1) {
                    // 获取表格行号范围
                    let startLine = 0;
                    let endLine = 0;

                    // 安全地获取开始行号
                    const startToken = tokens[i];
                    if (startToken && startToken.map && startToken.map.length > 0) {
                        startLine = startToken.map[0];
                    }

                    // 安全地获取结束行号
                    const endToken = tokens[tableCloseIndex];
                    if (endToken && endToken.map && endToken.map.length > 1) {
                        endLine = endToken.map[1] - 1;
                    } else {
                        endLine = startLine + 3; // 默认估算
                    }

                    // 使用基于位置的ID生成机制
                    const tableId = getTableIdByPosition(startLine, endLine, tableIndex);
                    tableIndex++; // 递增表格索引

                    // 解析表格数据
                    const tableData = parseTableTokens(tableTokens);
                    console.log("正确tableData: \n", tableData);
                    // 计算原始Markdown（用于回写）
                    const rawMarkdown = tableDataToMarkdown(tableData);

                    // 重新计算结束行（基于实际数据）
                    if (endLine <= startLine) {
                        endLine = startLine + Math.max(1, tableData.headers.length > 0 ? 1 : 0) + tableData.rows.length;
                    }

                    // ===== 🚀 新增：生成标准化JSON数据 =====
                    const standardData = standardTableDataManager.createStandardData(
                        tableId,
                        tableData,
                        startLine,
                        endLine,
                        rawMarkdown
                    );

                    // 注册标准化数据
                    standardTableDataManager.registerStandardData(standardData);

                    // ===== 保持向后兼容：注册传统表格元数据 =====
                    const metadata: TableMetadata = {
                        tableId,
                        tableHash: standardData.metadata.tableHash,
                        startLine,
                        endLine,
                        rawMarkdown,
                        data: tableData
                    };
                    tableRegistry.set(tableId, metadata);

                    // 创建占位符token，包含标准化数据信息
                    const placeholderToken = new state.Token('html_block', '', 0);
                    placeholderToken.content = `<div data-react-table data-table-id="${tableId}" data-table-hash="${standardData.metadata.tableHash}" data-table-version="${standardData.version}" data-start-line="${startLine}" data-end-line="${endLine}" class="react-table-placeholder" style="min-height: 100px; margin: 16px 0;"></div>`;

                    // 替换整个表格token序列
                    tokens.splice(i, tableCloseIndex - i + 1, placeholderToken);
                }
            }
        }
    });

    // 备份默认的html_block渲染规则
    const fallbackHtmlBlock = md.renderer.rules.html_block;

    // ⭐️ 核心修复：覆写html_block规则，返回IncrementalDOM指令函数而不是字符串
    // @ts-ignore - 在IncrementalDOM模式下，渲染规则可以返回函数
    md.renderer.rules.html_block = function (tokens, idx, options, env, renderer) {
        const html = tokens[idx].content;

        // 如果不是React表格占位符，使用默认规则
        if (!/data-react-table/.test(html)) {
            return fallbackHtmlBlock ? fallbackHtmlBlock(tokens, idx, options, env, renderer) : html;
        }

        // 解析表格属性
        const id = html.match(/data-table-id="([^"]+)"/)?.[1] ?? '';
        const hash = html.match(/data-table-hash="([^"]+)"/)?.[1] ?? '';
        const version = html.match(/data-table-version="([^"]+)"/)?.[1] ?? '';
        const startLine = html.match(/data-start-line="([^"]+)"/)?.[1] ?? '';
        const endLine = html.match(/data-end-line="([^"]+)"/)?.[1] ?? '';

        // ⭐️ 关键：返回IncrementalDOM指令函数，而不是字符串！
        return function () {
            // 使用tableId作为key，IncrementalDOM会复用现有节点
            window.IncrementalDOM.elementOpen('div', id, [
                'class', 'react-table-placeholder',
                'data-react-table', 'true',
                'data-table-id', id,
                'data-table-hash', hash,
                'data-table-version', version,
                'data-start-line', startLine,
                'data-end-line', endLine,
                'style', 'min-height: 100px; margin: 16px 0;'
            ]);
            // 直接跳过子树diff，React DOM内容不会被清空
            window.IncrementalDOM.skip();
            window.IncrementalDOM.elementClose('div');
        };
    };
};

export { tablePlugin };

// 在markdown-it-incremental-dom插件注册后添加的后置处理钩子
// 这个函数需要在allInit.ts中tablePlugin注册后调用
export function addIncrementalDOMTableSupport(md: MarkdownIt) {
    // 检查是否有IncrementalDOM和相关方法
    if (typeof window === 'undefined' || !window.IncrementalDOM) {
        return;
    }

    // 扩展类型定义
    interface ExtendedMarkdownIt extends MarkdownIt {
        renderToIncrementalDOM?: (src: string, env?: any) => () => void;
    }

    const extendedMd = md as ExtendedMarkdownIt;
    if (!extendedMd.renderToIncrementalDOM) {
        return;
    }

    // 保存原始的renderToIncrementalDOM方法
    const originalRenderToIncrementalDOM = extendedMd.renderToIncrementalDOM;

    // 覆盖renderToIncrementalDOM方法
    extendedMd.renderToIncrementalDOM = function (src: string, env?: any) {
        const originalRenderFunc = originalRenderToIncrementalDOM.call(this, src, env);

        return function () {
            // 保存原始的IncrementalDOM.raw方法
            const originalRaw = window.IncrementalDOM.raw;

            // 临时覆盖raw方法来拦截React表格占位符
            window.IncrementalDOM.raw = function (html: string) {
                // 检查是否是React表格占位符
                if (/data-react-table/.test(html)) {
                    // 解析表格属性
                    const idMatch = html.match(/data-table-id="([^"]+)"/);
                    const hashMatch = html.match(/data-table-hash="([^"]+)"/);
                    const versionMatch = html.match(/data-table-version="([^"]+)"/);

                    if (idMatch && hashMatch) {
                        const tableId = idMatch[1];
                        const tableHash = hashMatch[1];
                        const tableVersion = versionMatch?.[1] || '1';

                        // ⭐️ 核心：使用IncrementalDOM.skip()避免子树diff
                        window.IncrementalDOM.elementOpen('div', tableId, [
                            'data-react-table', 'true',
                            'data-table-id', tableId,
                            'data-table-hash', tableHash,
                            'data-table-version', tableVersion,
                            'data-skip-dom', 'true',
                            'class', 'react-table-placeholder',
                            'style', 'min-height: 100px; margin: 16px 0;'
                        ]);
                        // 跳过子树diff，让React完全控制内部内容
                        window.IncrementalDOM.skip();
                        window.IncrementalDOM.elementClose('div');
                        return;
                    }
                }

                // 对于非React表格的HTML，使用原始的raw方法
                originalRaw.call(this, html);
            };

            try {
                // 执行原始的渲染函数
                originalRenderFunc();
            } finally {
                // 恢复原始的raw方法
                window.IncrementalDOM.raw = originalRaw;
            }
        };
    };
}

// ===== 标准化数据API（供外部使用） =====
export const StandardTableAPI = {
    // 获取标准化数据
    getStandardData: (tableId: string) => standardTableDataManager.getStandardData(tableId),

    // 更新标准化数据
    updateStandardData: (tableId: string, data: TableData, source: 'react' | 'monaco' = 'react') =>
        standardTableDataManager.updateStandardData(tableId, data, source),

    // 🚀 直接注册标准化数据（用于元数据更新）
    registerStandardData: (standardData: StandardTableData) =>
        standardTableDataManager.registerStandardData(standardData),

    // 监听数据变化
    onDataChange: (tableId: string, callback: (data: StandardTableData) => void) =>
        standardTableDataManager.addDataChangeListener(tableId, callback),

    // 取消监听
    offDataChange: (tableId: string, callback: (data: StandardTableData) => void) =>
        standardTableDataManager.removeDataChangeListener(tableId, callback),

    // 获取所有标准化数据
    getAllStandardData: () => standardTableDataManager.getAllStandardData(),

    // 数据转换工具
    standardToTable: standardDataToTableData,
    tableToStandard: tableDataToStandardData
};

