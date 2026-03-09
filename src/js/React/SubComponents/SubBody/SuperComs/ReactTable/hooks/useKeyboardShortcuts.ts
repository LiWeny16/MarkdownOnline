import { useCallback } from 'react';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { EditingCell, SelectedCell, ActiveCell } from '../types';

interface UseKeyboardShortcutsOptions {
  isEditMode: boolean;
  editingCell: EditingCell | null;
  data: TableData;
  selectedRows: number[];
  selectedCells: SelectedCell[];
  activeCell: ActiveCell | null;
  lastSelectedIndex: number | null;
  updateDataAndSync: (newData: TableData) => void;
  toggleMarkdownFormat: (text: string, format: 'bold' | 'italic' | 'strikethrough' | 'code') => string;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedCells: React.Dispatch<React.SetStateAction<SelectedCell[]>>;
  setLastSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useKeyboardShortcuts({
  isEditMode,
  editingCell,
  data,
  selectedRows,
  selectedCells,
  activeCell,
  lastSelectedIndex,
  updateDataAndSync,
  toggleMarkdownFormat,
  setSelectedRows,
  setSelectedCells,
  setLastSelectedIndex,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isEditMode || editingCell) return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      if (selectedCells.length === 0) return;
      const newData = JSON.parse(JSON.stringify(data)) as TableData;
      selectedCells.forEach(({ rowIndex, colIndex }) => {
        if (rowIndex === -1) {
          if (colIndex < newData.headers.length) {
            newData.headers[colIndex] = toggleMarkdownFormat(newData.headers[colIndex] || '', 'bold');
          }
        } else {
          if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
            newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(newData.rows[rowIndex][colIndex] || '', 'bold');
          }
        }
      });
      updateDataAndSync(newData);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      if (selectedCells.length === 0) return;
      const newData = JSON.parse(JSON.stringify(data)) as TableData;
      selectedCells.forEach(({ rowIndex, colIndex }) => {
        if (rowIndex === -1) {
          if (colIndex < newData.headers.length) {
            newData.headers[colIndex] = toggleMarkdownFormat(newData.headers[colIndex] || '', 'italic');
          }
        } else {
          if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
            newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(newData.rows[rowIndex][colIndex] || '', 'italic');
          }
        }
      });
      updateDataAndSync(newData);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      setSelectedRows(data.rows.map((_, index) => index));
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      setSelectedRows([]);
      setSelectedCells([]);
      setLastSelectedIndex(null);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      if (selectedCells.length === 0) return;
      const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
      const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
      const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
      const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));
      const tsvRows: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        const tsvCols: string[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const isSelected = selectedCells.some(cell => cell.rowIndex === r && cell.colIndex === c);
          let cellValue = '';
          if (isSelected) {
            cellValue = r === -1 ? (data.headers[c] || '') : (data.rows[r]?.[c] || '');
          }
          tsvCols.push(cellValue);
        }
        tsvRows.push(tsvCols.join('\t'));
      }
      navigator.clipboard.writeText(tsvRows.join('\n')).catch(err => {
        console.warn('复制到剪贴板失败:', err);
      });
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'x') {
      event.preventDefault();
      if (selectedCells.length === 0) return;
      const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
      const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
      const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
      const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));
      const tsvRows: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        const tsvCols: string[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const isSelected = selectedCells.some(cell => cell.rowIndex === r && cell.colIndex === c);
          let cellValue = '';
          if (isSelected) {
            cellValue = r === -1 ? (data.headers[c] || '') : (data.rows[r]?.[c] || '');
          }
          tsvCols.push(cellValue);
        }
        tsvRows.push(tsvCols.join('\t'));
      }
      navigator.clipboard.writeText(tsvRows.join('\n')).then(() => {
        const newData = JSON.parse(JSON.stringify(data)) as TableData;
        selectedCells.forEach(({ rowIndex, colIndex }) => {
          if (rowIndex === -1) {
            if (colIndex < newData.headers.length) newData.headers[colIndex] = '';
          } else {
            if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
              newData.rows[rowIndex][colIndex] = '';
            }
          }
        });
        updateDataAndSync(newData);
      }).catch(err => console.warn('剪切失败:', err));
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      if (!activeCell) return;
      navigator.clipboard.readText().then(clipboardText => {
        if (!clipboardText.trim()) return;
        const rows = clipboardText.split('\n').map(row => row.split('\t'));
        const pasteRowCount = rows.length;
        const pasteColCount = Math.max(...rows.map(row => row.length));
        const needRowCount = Math.max(data.rows.length, activeCell.rowIndex + pasteRowCount);
        const needColCount = Math.max(data.headers.length, activeCell.colIndex + pasteColCount);
        const newData: TableData = {
          headers: [...data.headers],
          rows: data.rows.map(row => [...row])
        };
        while (newData.headers.length < needColCount) {
          newData.headers.push(`Col ${newData.headers.length + 1}`);
        }
        while (newData.rows.length < needRowCount) {
          newData.rows.push(new Array(needColCount).fill(''));
        }
        newData.rows.forEach(row => {
          while (row.length < needColCount) row.push('');
        });
        for (let r = 0; r < pasteRowCount; r++) {
          const targetRowIndex = activeCell.rowIndex + r;
          if (targetRowIndex >= 0 && targetRowIndex < newData.rows.length) {
            for (let c = 0; c < rows[r].length; c++) {
              const targetColIndex = activeCell.colIndex + c;
              if (targetColIndex >= 0 && targetColIndex < newData.rows[targetRowIndex].length) {
                newData.rows[targetRowIndex][targetColIndex] = rows[r][c] || '';
              }
            }
          }
        }
        updateDataAndSync(newData);
        const newSelectedCells: SelectedCell[] = [];
        for (let r = 0; r < pasteRowCount; r++) {
          for (let c = 0; c < pasteColCount; c++) {
            const rowIndex = activeCell.rowIndex + r;
            const colIndex = activeCell.colIndex + c;
            if (rowIndex >= 0 && rowIndex < needRowCount && colIndex >= 0 && colIndex < needColCount) {
              newSelectedCells.push({ rowIndex, colIndex });
            }
          }
        }
        setSelectedCells(newSelectedCells);
      }).catch(err => console.warn('从剪贴板读取失败:', err));
      return;
    }

    if (event.key === 'Delete' && selectedRows.length > 0) {
      event.preventDefault();
      const sortedIndices = [...selectedRows].sort((a, b) => b - a);
      const newData = {
        headers: [...data.headers],
        rows: data.rows.map(row => [...row])
      };
      sortedIndices.forEach(index => newData.rows.splice(index, 1));
      updateDataAndSync(newData);
      setSelectedRows([]);
      setLastSelectedIndex(null);
      return;
    }

    if (event.key === 'Escape') {
      setSelectedRows([]);
      setSelectedCells([]);
      setLastSelectedIndex(null);
      return;
    }

    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      let targetIndex: number;
      if (selectedRows.length === 0) {
        targetIndex = event.key === 'ArrowDown' ? 0 : data.rows.length - 1;
        setSelectedRows([targetIndex]);
        setLastSelectedIndex(targetIndex);
        return;
      }
      const currentIndex = lastSelectedIndex !== null ? lastSelectedIndex : selectedRows[selectedRows.length - 1];
      if (event.key === 'ArrowDown') {
        targetIndex = Math.min(currentIndex + 1, data.rows.length - 1);
      } else {
        targetIndex = Math.max(currentIndex - 1, 0);
      }
      if (event.shiftKey) {
        const start = Math.min(lastSelectedIndex || currentIndex, targetIndex);
        const end = Math.max(lastSelectedIndex || currentIndex, targetIndex);
        setSelectedRows(Array.from({ length: end - start + 1 }, (_, i) => start + i));
      } else {
        setSelectedRows([targetIndex]);
        setLastSelectedIndex(targetIndex);
      }
      return;
    }
  }, [isEditMode, editingCell, data, selectedRows, selectedCells, activeCell, lastSelectedIndex, updateDataAndSync, toggleMarkdownFormat, setSelectedRows, setSelectedCells, setLastSelectedIndex]);

  return { handleKeyDown };
}
