import { TableData, TableMetadata, StandardTableData } from '@Func/Parser/mdItPlugin/table';
declare class StandardTableSyncManager {
    private static instance;
    private isInternalUpdate;
    private syncCallbacks;
    static getInstance(): StandardTableSyncManager;
    addStandardDataListener(tableId: string, callback: (standardData: StandardTableData) => void): void;
    removeStandardDataListener(tableId: string, callback: (standardData: StandardTableData) => void): void;
    notifyStandardDataChange(tableId: string, newData: TableData, source?: 'react' | 'monaco'): void;
    isUpdating(): boolean;
    clearTableListeners(tableId: string): void;
    clearAllListeners(): void;
}
export declare const standardTableSyncManager: StandardTableSyncManager;
declare class TableSyncManager {
    private static instance;
    private syncListeners;
    private isInternalUpdate;
    static getInstance(): TableSyncManager;
    addTableListener(tableId: string, callback: (data: TableData) => void): void;
    removeTableListener(tableId: string, callback: (data: TableData) => void): void;
    notifyTableDataChange(tableId: string, newData: TableData, source?: 'react' | 'monaco'): void;
    isUpdating(): boolean;
    clearTableListeners(tableId: string): void;
    clearAllListeners(): void;
}
export declare const tableSyncManager: TableSyncManager;
export declare function writeStandardTableToMonaco(tableId: string, newData: TableData): boolean;
export declare function writeTableToMonaco(tableId: string, newData: TableData): boolean;
export declare function isCurrentlyWritingToMonaco(): boolean;
export declare function getStandardTableData(tableId: string): StandardTableData | null;
export declare function getTableData(tableId: string): TableData | null;
export declare function getTableMetadata(tableId: string): TableMetadata | undefined;
export declare function getStandardTableRegistryDebugInfo(): any[];
export declare function getTableRegistryDebugInfo(): any[];
export declare function updateTableRegistryFromMarkdown(): void;
export declare function handleStandardMonacoContentChange(): void;
export declare function handleMonacoContentChange(): void;
export {};
