import MarkdownIt from "markdown-it/lib";

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
        console.log(`为位置 ${positionKey} 分配新ID: ${tableId}`);
    }
    
    return positionToId.get(positionKey)!;
}

// 重置文档解析状态（每次新的markdown解析开始时调用）
export function resetDocumentParsing() {
    currentDocumentId++;
    documentTableCount = 0;
    // 不清空positionToId映射，保持历史ID的稳定性
    console.log(`开始解析新文档，文档ID: ${currentDocumentId}`);
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
        console.log(`清理了 ${keysToDelete.length} 个过期位置映射`);
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

// 表格数据接口
export interface TableData {
    headers: string[];
    rows: string[][];
}

// 表格元数据接口
export interface TableMetadata {
    tableId: string;
    tableHash: string;
    startLine: number;
    endLine: number;
    rawMarkdown: string;
    data: TableData;
}

// 全局表格索引表
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

let tablePlugin = function (md: MarkdownIt) {
    // 核心拦截器：移除所有表格相关的 token，防止 Markdown-it 解析表格
    md.core.ruler.after('block', 'table_to_div', (state) => {
        // 重置文档解析状态（每次解析开始时）
        resetDocumentParsing();
        
        // 重置注册表（每次解析开始时）
        tableRegistry.clear();
        
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
                    
                    // 生成内容哈希用于变更检测 - 基于实际表格数据而非token
                    const tableDataString = JSON.stringify({
                        headers: tableData.headers,
                        rows: tableData.rows
                    });
                    const contentHash = simpleHash(tableDataString);
                    
                    // 计算原始Markdown（用于回写）
                    const rawMarkdown = tableDataToMarkdown(tableData);
                    
                    // 重新计算结束行（基于实际数据）
                    if (endLine <= startLine) {
                        endLine = startLine + Math.max(1, tableData.headers.length > 0 ? 1 : 0) + tableData.rows.length;
                    }
                    
                    // 注册表格元数据
                    const metadata: TableMetadata = {
                        tableId,
                        tableHash: contentHash,
                        startLine,
                        endLine,
                        rawMarkdown,
                        data: tableData
                    };
                    tableRegistry.set(tableId, metadata);
                    
                    console.log(`注册表格: ${tableId}, 行号: ${startLine}-${endLine}, 哈希: ${contentHash}`);
                    
                    // 创建占位符token
                    const placeholderToken = new state.Token('html_block', '', 0);
                    placeholderToken.content = `<div data-react-table data-table-id="${tableId}" data-table-hash="${contentHash}" data-start-line="${startLine}" data-end-line="${endLine}" class="react-table-placeholder" style="min-height: 100px; margin: 16px 0;"></div>`;
                    
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
    md.renderer.rules.html_block = function(tokens, idx, options, env, renderer) {
        const html = tokens[idx].content;
        
        // 如果不是React表格占位符，使用默认规则
        if (!/data-react-table/.test(html)) {
            return fallbackHtmlBlock ? fallbackHtmlBlock(tokens, idx, options, env, renderer) : html;
        }

        // 解析表格属性，移除data-line逻辑
        const id = html.match(/data-table-id="([^"]+)"/)?.[1] ?? '';
        const hash = html.match(/data-table-hash="([^"]+)"/)?.[1] ?? '';
        const startLine = html.match(/data-start-line="([^"]+)"/)?.[1] ?? '';
        const endLine = html.match(/data-end-line="([^"]+)"/)?.[1] ?? '';

        // ⭐️ 关键：返回IncrementalDOM指令函数，而不是字符串！
        return function() {
            // 使用tableId作为key，IncrementalDOM会复用现有节点
            window.IncrementalDOM.elementOpen('div', id, [
                'class', 'react-table-placeholder',
                'data-react-table', 'true',
                'data-table-id', id,
                'data-table-hash', hash,
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
    extendedMd.renderToIncrementalDOM = function(src: string, env?: any) {
        const originalRenderFunc = originalRenderToIncrementalDOM.call(this, src, env);
        
        return function() {
            // 保存原始的IncrementalDOM.raw方法
            const originalRaw = window.IncrementalDOM.raw;
            
            // 临时覆盖raw方法来拦截React表格占位符
            window.IncrementalDOM.raw = function(html: string) {
                // 检查是否是React表格占位符
                if (/data-react-table/.test(html)) {
                    // 解析表格属性，移除data-line逻辑
                    const idMatch = html.match(/data-table-id="([^"]+)"/);
                    const hashMatch = html.match(/data-table-hash="([^"]+)"/);
                    
                    if (idMatch && hashMatch) {
                        const tableId = idMatch[1];
                        const tableHash = hashMatch[1];
                        
                        // ⭐️ 核心：使用IncrementalDOM.skip()避免子树diff
                        window.IncrementalDOM.elementOpen('div', tableId, [
                            'data-react-table', 'true',
                            'data-table-id', tableId,
                            'data-table-hash', tableHash,
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

// 开发者调试工具（仅在开发环境中添加到全局）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).TablePluginDebug = {
        getTableIdByPosition,
        resetDocumentParsing,
        cleanupOldPositions,
        getCurrentDocumentId: () => currentDocumentId,
        getDocumentTableCount: () => documentTableCount,
        getPositionToIdMap: () => new Map(positionToId),
        getTableRegistry: () => new Map(tableRegistry),
        getTableRegistrySize: () => tableRegistry.size,
        simpleHash
    };
}

// // 2. Intercept raw HTML tables in the content.
// if ((token.type === 'html_block' || token.type === 'html_inline') && /<table\b/i.test(token.content)) {
//     // If a raw HTML <table> is detected, replace its content with the placeholder.
//     // (This covers cases where an HTML table might appear in the markdown source.)
//     const placeholderToken = new state.Token('html_block', '', 0);
//     placeholderToken.content = `<div class="react-table">test</div>`;
//     tokens.splice(i, 1, placeholderToken);
//     // Note: We replaced the current token with the placeholder. If the HTML table spanned
//     // multiple tokens, this simple approach covers the common case where the entire table
//     // is in one token. For multi-token HTML tables (split by blank lines), you could extend
//     // this to remove tokens until a closing </table> is found.
// }