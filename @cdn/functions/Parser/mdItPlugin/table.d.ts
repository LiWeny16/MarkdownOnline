import MarkdownIt from "markdown-it/lib";
export interface ImageInfo {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
}
export interface LinkInfo {
    href: string;
    text: string;
    title?: string;
}
export interface StyleInfo {
    type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';
    start: number;
    end: number;
}
export interface CellContent {
    raw: string;
    rendered: string;
    type: 'markdown' | 'html' | 'mixed' | 'text';
    tokens?: any[];
    metadata?: {
        images?: ImageInfo[];
        links?: LinkInfo[];
        styles?: StyleInfo[];
    };
}
export interface EnhancedTableData {
    headers: CellContent[];
    rows: CellContent[][];
    version: number;
}
export interface TableData {
    headers: string[];
    rows: string[][];
}
export interface StandardTableData {
    tableId: string;
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
            align?: 'left' | 'center' | 'right';
        }>;
        columnCount: number;
        rowCount: number;
    };
    data: {
        headers: string[];
        rows: string[][];
    };
}
export declare function getTableIdByPosition(startLine: number, endLine: number, tableIndex: number): string;
export declare function resetDocumentParsing(): void;
export declare function cleanupOldPositions(maxDocuments?: number): void;
export interface TableData {
    headers: string[];
    rows: string[][];
}
export interface TableMetadata {
    tableId: string;
    tableHash: string;
    startLine: number;
    endLine: number;
    rawMarkdown: string;
    data: TableData;
}
declare class StandardTableDataManager {
    private static instance;
    private standardDataRegistry;
    private dataChangeListeners;
    static getInstance(): StandardTableDataManager;
    createStandardData(tableId: string, data: TableData | TableDataWithAlign, startLine: number, endLine: number, rawMarkdown: string): StandardTableData;
    registerStandardData(standardData: StandardTableData): void;
    getStandardData(tableId: string): StandardTableData | null;
    updateStandardData(tableId: string, newData: TableData, source?: 'react' | 'monaco'): boolean;
    addDataChangeListener(tableId: string, callback: (data: StandardTableData) => void): void;
    removeDataChangeListener(tableId: string, callback: (data: StandardTableData) => void): void;
    private notifyDataChange;
    clearAll(): void;
    getAllStandardData(): Map<string, StandardTableData>;
}
export declare const standardTableDataManager: StandardTableDataManager;
export declare const tableRegistry: Map<string, TableMetadata>;
interface TableDataWithAlign extends TableData {
    alignments?: Array<'left' | 'center' | 'right'>;
}
export declare function tableDataToMarkdown(data: TableData | TableDataWithAlign): string;
export declare function standardDataToTableData(standardData: StandardTableData): TableData;
export declare function tableDataToStandardData(tableId: string, data: TableData, startLine: number, endLine: number, rawMarkdown: string): StandardTableData;
declare let tablePlugin: (md: MarkdownIt) => void;
export { tablePlugin };
export declare const StandardTableAPI: {
    getStandardData: (tableId: string) => StandardTableData | null;
    updateStandardData: (tableId: string, data: TableData, source?: "react" | "monaco") => boolean;
    registerStandardData: (standardData: StandardTableData) => void;
    onDataChange: (tableId: string, callback: (data: StandardTableData) => void) => void;
    offDataChange: (tableId: string, callback: (data: StandardTableData) => void) => void;
    getAllStandardData: () => Map<string, StandardTableData>;
    standardToTable: typeof standardDataToTableData;
    tableToStandard: typeof tableDataToStandardData;
};
