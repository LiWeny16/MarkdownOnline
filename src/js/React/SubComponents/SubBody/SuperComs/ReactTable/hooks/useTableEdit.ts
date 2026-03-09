import { useState, useCallback, useRef } from 'react';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { EditingCell } from '../types';

interface UseTableEditOptions {
  data: TableData;
  tableId?: string;
  updateDataAndSync: (newData: TableData) => void;
  setSelectedCells: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveCell: React.Dispatch<React.SetStateAction<any>>;
}

export function useTableEdit({
  data,
  tableId,
  updateDataAndSync,
  setSelectedCells,
  setActiveCell,
}: UseTableEditOptions) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const startEdit = useCallback((rowIndex: number, colIndex: number) => {
    const isHeader = rowIndex === -1;
    const value = isHeader
      ? data.headers[colIndex] || ''
      : data.rows[rowIndex]?.[colIndex] || '';

    const cellKey = `${rowIndex}-${colIndex}`;
    const cellElement = cellRefs.current.get(cellKey);
    const rect = cellElement?.getBoundingClientRect();

    setEditingCell({ rowIndex, colIndex, value, width: rect?.width, height: rect?.height });
  }, [data]);

  const commitEdit = useCallback(() => {
    if (!editingCell) return;
    const { rowIndex, colIndex, value } = editingCell;

    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };

    if (rowIndex === -1) {
      newData.headers[colIndex] = value;
    } else {
      if (!newData.rows[rowIndex]) {
        newData.rows[rowIndex] = new Array(newData.headers.length).fill('');
      }
      newData.rows[rowIndex][colIndex] = value;
    }

    if (tableId) {
      setTimeout(() => updateDataAndSync(newData), 0);
    }

    setEditingCell(null);
    setSelectedCells([]);
    setActiveCell(null);
  }, [editingCell, tableId, updateDataAndSync, data, setSelectedCells, setActiveCell]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setSelectedCells([]);
    setActiveCell(null);
  }, [setSelectedCells, setActiveCell]);

  const addRow = useCallback(() => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };
    newData.rows.push(new Array(newData.headers.length).fill(''));
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  const deleteRow = useCallback((rowIndex: number) => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };
    newData.rows.splice(rowIndex, 1);
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  const addColumn = useCallback(() => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };
    newData.headers.push(`Col ${newData.headers.length + 1}`);
    newData.rows.forEach(row => row.push(''));
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  const deleteColumn = useCallback((colIndex: number) => {
    if (data.headers.length <= 1) return;
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };
    newData.headers.splice(colIndex, 1);
    newData.rows.forEach(row => {
      if (row.length > colIndex) row.splice(colIndex, 1);
    });
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  const toggleMarkdownFormat = useCallback((text: string, format: 'bold' | 'italic' | 'strikethrough' | 'code') => {
    const formatMap = {
      bold: { start: '**', end: '**' },
      italic: { start: '*', end: '*' },
      strikethrough: { start: '~~', end: '~~' },
      code: { start: '`', end: '`' }
    };
    const { start, end } = formatMap[format];
    if (text.startsWith(start) && text.endsWith(end)) {
      return text.slice(start.length, -end.length);
    }
    return `${start}${text}${end}`;
  }, []);

  return {
    editingCell, setEditingCell,
    cellRefs,
    startEdit,
    commitEdit,
    cancelEdit,
    addRow,
    deleteRow,
    addColumn,
    deleteColumn,
    toggleMarkdownFormat,
  };
}
