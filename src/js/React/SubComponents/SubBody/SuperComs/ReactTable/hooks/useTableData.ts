import { useState, useCallback, useMemo, useEffect } from 'react';
import { TableData, StandardTableData, StandardTableAPI } from '@Func/Parser/mdItPlugin/table';
import {
  getTableData,
  tableSyncManager,
  getStandardTableData,
  standardTableSyncManager
} from '@App/text/tableEditor';

interface UseTableDataOptions {
  tableId?: string;
  propTableData?: TableData;
}

export function useTableData({ tableId, propTableData }: UseTableDataOptions) {
  const defaultTableData: TableData = useMemo(() => ({
    headers: ['Name', 'Age', 'City', 'Email'],
    rows: [
      ['John Doe', '25', 'New York', 'john@example.com'],
      ['Alice Brown', '28', 'Paris', 'alice@example.com']
    ]
  }), []);

  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [standardData, setStandardData] = useState<StandardTableData | null>(null);

  const updateStandardDataAndSync = useCallback((newData: TableData) => {
    setData(newData);
    if (tableId) {
      standardTableSyncManager.notifyStandardDataChange(tableId, newData, 'react');
    }
  }, [tableId]);

  const updateDataAndSync = useCallback((newData: TableData) => {
    if (tableId && StandardTableAPI.getStandardData(tableId)) {
      updateStandardDataAndSync(newData);
    } else {
      setData(newData);
      if (tableId) {
        tableSyncManager.notifyTableDataChange(tableId, newData, 'react');
      }
    }
  }, [tableId, updateStandardDataAndSync]);

  // Standard data listener (Monaco → React)
  useEffect(() => {
    if (!tableId) return;

    const handleStandardDataChange = (newStandardData: StandardTableData) => {
      const newTableData = StandardTableAPI.standardToTable(newStandardData);
      const dataChanged = JSON.stringify(data) !== JSON.stringify(newTableData);
      const standardDataChanged = JSON.stringify(standardData) !== JSON.stringify(newStandardData);
      if (dataChanged || standardDataChanged) {
        setStandardData(newStandardData);
        setData(newTableData);
      }
    };

    standardTableSyncManager.addStandardDataListener(tableId, handleStandardDataChange);
    return () => {
      standardTableSyncManager.removeStandardDataListener(tableId, handleStandardDataChange);
    };
  }, [tableId]);

  // Traditional data listener (backward compat)
  useEffect(() => {
    if (!tableId) return;

    const handleMonacoDataChange = (newData: TableData) => {
      if (StandardTableAPI.getStandardData(tableId)) return;
      const dataChanged = JSON.stringify(data) !== JSON.stringify(newData);
      if (dataChanged) setData(newData);
    };

    tableSyncManager.addTableListener(tableId, handleMonacoDataChange);
    return () => {
      tableSyncManager.removeTableListener(tableId, handleMonacoDataChange);
    };
  }, [tableId, data]);

  // Init data
  useEffect(() => {
    let initialData: TableData;
    let initialStandardData: StandardTableData | null = null;

    if (tableId) {
      initialStandardData = getStandardTableData(tableId);
      if (initialStandardData) {
        initialData = StandardTableAPI.standardToTable(initialStandardData);
      } else {
        const registeredData = getTableData(tableId);
        initialData = registeredData || defaultTableData;
      }
    } else {
      initialData = propTableData || defaultTableData;
    }

    const dataChanged = JSON.stringify(data) !== JSON.stringify(initialData);
    const standardDataChanged = JSON.stringify(standardData) !== JSON.stringify(initialStandardData);

    if (dataChanged || standardDataChanged) {
      setData(initialData);
      setStandardData(initialStandardData);
    }
  }, [tableId, propTableData, defaultTableData]);

  return { data, setData, standardData, setStandardData, updateDataAndSync };
}
