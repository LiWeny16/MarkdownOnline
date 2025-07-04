import React from 'react';
import { TableData } from '@Func/Parser/mdItPlugin/table';
interface ReactTableProps {
    tableId?: string;
    tableData?: TableData;
}
declare const ReactTable: React.FC<ReactTableProps>;
declare class TableManager {
    private static instance;
    private mountedRoots;
    private lastTableStates;
    static getInstance(): TableManager;
    mountTables(): void;
    private createTableRoot;
    private updateTable;
    private cleanupUnusedRoots;
    forceRemountAllTables(): void;
    unmountAllTables(): void;
    getDebugInfo(): {
        mountedRootsCount: number;
        tableStatesCount: number;
        mountedTableIds: string[];
        tableStates: {
            [k: string]: string;
        };
        syncListenersCount: any;
    };
}
export { ReactTable, TableManager };
export default ReactTable;
