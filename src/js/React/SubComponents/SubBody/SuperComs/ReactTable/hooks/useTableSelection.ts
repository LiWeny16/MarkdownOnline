import { useState, useCallback } from 'react';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { SelectedCell, ActiveCell } from '../types';

export function useTableSelection(data: TableData) {
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.rows.map((_, index) => index);
      setSelectedRows(newSelected);
      setLastSelectedIndex(newSelected.length > 0 ? newSelected[newSelected.length - 1] : null);
    } else {
      setSelectedRows([]);
      setLastSelectedIndex(null);
    }
  }, [data.rows]);

  const handleRowClick = useCallback((event: React.MouseEvent<unknown>, rowIndex: number) => {
    if (event.ctrlKey || event.metaKey) {
      const selectedIndex = selectedRows.indexOf(rowIndex);
      let newSelected: number[] = [];

      if (selectedIndex === -1) {
        newSelected = [...selectedRows, rowIndex];
      } else if (selectedIndex === 0) {
        newSelected = selectedRows.slice(1);
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = selectedRows.slice(0, -1);
      } else if (selectedIndex > 0) {
        newSelected = [
          ...selectedRows.slice(0, selectedIndex),
          ...selectedRows.slice(selectedIndex + 1)
        ];
      }
      newSelected = Array.from(new Set(newSelected));
      setSelectedRows(newSelected);
      setLastSelectedIndex(rowIndex);
    } else if (event.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, rowIndex);
      const end = Math.max(lastSelectedIndex, rowIndex);
      const rangeSelected = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      const newSelected = Array.from(new Set([...selectedRows, ...rangeSelected])).sort((a, b) => a - b);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([rowIndex]);
      setLastSelectedIndex(rowIndex);
    }
  }, [selectedRows, lastSelectedIndex]);

  const handleCellClick = useCallback((event: React.MouseEvent<unknown>, rowIndex: number, colIndex: number) => {
    event.stopPropagation();

    if (event.ctrlKey || event.metaKey) {
      const isCurrentlySelected = selectedCells.some(cell =>
        cell.rowIndex === rowIndex && cell.colIndex === colIndex
      );
      if (isCurrentlySelected) {
        setSelectedCells(prev => prev.filter(cell =>
          !(cell.rowIndex === rowIndex && cell.colIndex === colIndex)
        ));
      } else {
        setSelectedCells(prev => [...prev, { rowIndex, colIndex }]);
      }
    } else if (event.shiftKey && selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1];
      const minRow = Math.min(lastCell.rowIndex, rowIndex);
      const maxRow = Math.max(lastCell.rowIndex, rowIndex);
      const minCol = Math.min(lastCell.colIndex, colIndex);
      const maxCol = Math.max(lastCell.colIndex, colIndex);

      const rectangularSelection: SelectedCell[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          rectangularSelection.push({ rowIndex: r, colIndex: c });
        }
      }
      const allSelected = [...selectedCells, ...rectangularSelection];
      const uniqueSelected = allSelected.filter((cell, index, arr) =>
        arr.findIndex(c => c.rowIndex === cell.rowIndex && c.colIndex === cell.colIndex) === index
      );
      setSelectedCells(uniqueSelected);
    } else {
      setSelectedCells([{ rowIndex, colIndex }]);
    }
  }, [selectedCells]);

  const isCellSelected = useCallback((rowIndex: number, colIndex: number) => {
    return selectedCells.some(cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
  }, [selectedCells]);

  const isRowSelected = useCallback((rowIndex: number) => {
    return selectedRows.includes(rowIndex);
  }, [selectedRows]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
    setSelectedCells([]);
    setLastSelectedIndex(null);
    setActiveCell(null);
  }, []);

  return {
    selectedCells, setSelectedCells,
    selectedRows, setSelectedRows,
    lastSelectedIndex, setLastSelectedIndex,
    activeCell, setActiveCell,
    handleSelectAllClick,
    handleRowClick,
    handleCellClick,
    isCellSelected,
    isRowSelected,
    clearSelection,
  };
}
