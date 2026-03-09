import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Box,
  alpha
} from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import MarkdownIt from 'markdown-it';
import { StandardTableData } from '@Func/Parser/mdItPlugin/table';
import { getTheme } from '@App/config/change';
import markdownItLatex from '@Func/Parser/mdItPlugin/latex';

import { ReactTableProps, SortConfig } from './types';
import { getTableThemeStyles, restrictToVerticalAxis } from './theme';
import DraggableTableRow from './DraggableTableRow';
import TableToolbar from './TableToolbar';
import TableHeadSection from './TableHead';
import { useTableData } from './hooks/useTableData';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableEdit } from './hooks/useTableEdit';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const ReactTable: React.FC<ReactTableProps> = React.memo(({ tableId, tableData: propTableData }) => {
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const themeStyles = useMemo(() => getTableThemeStyles(), [currentTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTheme = getTheme();
      if (newTheme !== currentTheme) setCurrentTheme(newTheme);
    }, 100);
    return () => clearInterval(interval);
  }, [currentTheme]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ order: 'asc', orderBy: '' });

  const { data, standardData, updateDataAndSync } = useTableData({ tableId, propTableData });

  const {
    selectedCells, setSelectedCells,
    selectedRows, setSelectedRows,
    lastSelectedIndex, setLastSelectedIndex,
    activeCell, setActiveCell,
    handleSelectAllClick,
    handleRowClick,
    handleCellClick,
    isCellSelected,
    isRowSelected,
  } = useTableSelection(data);

  const {
    editingCell, setEditingCell,
    cellRefs,
    startEdit,
    commitEdit,
    cancelEdit,
    addRow,
    addColumn,
    deleteColumn,
    toggleMarkdownFormat,
  } = useTableEdit({ data, tableId, updateDataAndSync, setSelectedCells, setActiveCell });

  const { handleKeyDown } = useKeyboardShortcuts({
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
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const md = useMemo(() => {
    const mdInstance = new MarkdownIt({ html: false, linkify: true, typographer: false, breaks: true });
    mdInstance.use(markdownItLatex, { throwOnError: false, strict: false });
    mdInstance.renderer.rules.text = function (tokens: any, idx: any) {
      let content = tokens[idx].content;
      content = content.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      return content;
    };
    return mdInstance;
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const descendingComparator = useCallback((a: string[], b: string[], orderBy: string) => {
    const colIndex = data.headers.indexOf(orderBy);
    if (colIndex === -1) return 0;
    const aVal = a[colIndex] || '';
    const bVal = b[colIndex] || '';
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  }, [data.headers]);

  const getComparator = useCallback((order: 'asc' | 'desc', orderBy: string) => {
    return order === 'desc'
      ? (a: string[], b: string[]) => descendingComparator(a, b, orderBy)
      : (a: string[], b: string[]) => -descendingComparator(a, b, orderBy);
  }, [descendingComparator]);

  const sortedRows = useMemo(() => data.rows, [data.rows]);

  const handleRequestSort = useCallback((property: string) => {
    const isAsc = sortConfig.orderBy === property && sortConfig.order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    const sorted = [...data.rows].sort(getComparator(newOrder, property));
    const newData = { headers: [...data.headers], rows: sorted };
    setSortConfig({ order: newOrder, orderBy: property });
    setSelectedRows([]);
    setSelectedCells([]);
    setLastSelectedIndex(null);
    updateDataAndSync(newData);
  }, [sortConfig, data, getComparator, updateDataAndSync, setSelectedRows, setSelectedCells, setLastSelectedIndex]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeIndex = parseInt(String(active.id).replace('row-', ''));
    const overIndex = parseInt(String(over.id).replace('row-', ''));
    if (isNaN(activeIndex) || isNaN(overIndex)) return;
    const newRows = arrayMove(data.rows, activeIndex, overIndex);
    const newData = { headers: [...data.headers], rows: newRows };
    setSelectedRows([]);
    setSelectedCells([]);
    setLastSelectedIndex(null);
    updateDataAndSync(newData);
  }, [data, updateDataAndSync, setSelectedRows, setSelectedCells, setLastSelectedIndex]);

  const renderMarkdownContent = useCallback((value: string) => {
    if (value === '' || value === '\u00A0') return <span>{'\u00A0'}</span>;
    try {
      const htmlContent = md.renderInline(value);
      return (
        <span
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ wordBreak: 'break-word', whiteSpace: 'normal', display: 'inline-block', width: '100%' }}
        />
      );
    } catch (error) {
      const displayValue = value === '' ? '\u00A0' : value;
      return (
        <span style={{ wordBreak: 'break-word', whiteSpace: 'normal', display: 'inline-block', width: '100%' }}>
          {displayValue}
        </span>
      );
    }
  }, [md]);

  const renderEditor = useCallback((_currentValue: string, _rowIndex: number, _colIndex: number) => {
    return (
      <TextField
        value={editingCell?.value || ''}
        onChange={(e) => setEditingCell(prev => prev ? { ...prev, value: e.target.value } : null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
          else if (e.key === 'Escape') { cancelEdit(); }
        }}
        onBlur={commitEdit}
        autoFocus
        multiline
        size="small"
        variant="standard"
        sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%', margin: 0,
          '& .MuiInputBase-root': {
            fontSize: '0.875rem', height: '100%', width: '100%',
            padding: '6px 8px', margin: 0,
            backgroundColor: themeStyles.cellBackground,
            color: themeStyles.cellText,
            border: themeStyles.editorFocusBorder,
            borderRadius: 0, boxSizing: 'border-box',
            '&:before, &:after': { display: 'none' },
            '&:hover': { backgroundColor: themeStyles.cellBackground }
          },
          '& .MuiInputBase-input': {
            padding: 0, height: '100%', boxSizing: 'border-box',
            overflow: 'auto', wordBreak: 'break-word', whiteSpace: 'pre-wrap',
            color: themeStyles.cellText
          }
        }}
      />
    );
  }, [editingCell, commitEdit, cancelEdit, themeStyles]);

  const getColumnAlign = useCallback((colIndex: number): 'left' | 'center' | 'right' => {
    return (standardData as StandardTableData | null)?.schema.headers[colIndex]?.align || 'left';
  }, [standardData]);

  const renderCellContent = useCallback((
    value: string,
    rowIndex: number,
    colIndex: number,
    isHeader: boolean = false
  ) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
    const isCellSelectedState = isCellSelected(rowIndex, colIndex);
    const isActive = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;
    const textAlign = getColumnAlign(colIndex);
    const displayValue = value === '' ? '\u00A0' : value;
    const cellKey = `${rowIndex}-${colIndex}`;

    return (
      <Box
        ref={(el) => {
          if (el && el instanceof HTMLDivElement) {
            cellRefs.current.set(cellKey, el);
          } else {
            cellRefs.current.delete(cellKey);
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
          minHeight: isEditing && editingCell?.height ? `${editingCell.height}px` : '32px',
          height: isEditing && editingCell?.height ? `${editingCell.height}px` : 'auto',
          width: isEditing && editingCell?.width ? `${editingCell.width}px` : '100%',
          cursor: isEditMode ? 'text' : 'default',
          padding: isEditing ? 0 : '6px 8px',
          position: 'relative',
          backgroundColor: isCellSelectedState
            ? alpha('#1976d2', 0.12)
            : isActive ? alpha('#1976d2', 0.08) : 'transparent',
          border: isActive && !isEditing ? '1px solid #1976d2' : '1px solid transparent',
          boxSizing: 'border-box',
          wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word',
          overflow: isEditing ? 'hidden' : 'visible',
          '&:hover': {
            backgroundColor: isEditMode && !isHeader
              ? (isCellSelectedState ? alpha('#1976d2', 0.16) : alpha('#1976d2', 0.08))
              : 'transparent'
          }
        }}
        onClick={(event) => {
          if (isEditMode && !isHeader) {
            handleCellClick(event, rowIndex, colIndex);
            setActiveCell({ rowIndex, colIndex });
            startEdit(rowIndex, colIndex);
          }
        }}
      >
        {isEditing ? (
          renderEditor(value, rowIndex, colIndex)
        ) : isHeader ? (
          <span style={{
            fontWeight: 'bold', wordBreak: 'break-word', whiteSpace: 'normal',
            display: 'block', width: '100%', textAlign, color: themeStyles.headerText
          }}>
            {displayValue || `Header ${colIndex + 1}`}
          </span>
        ) : (
          <div style={{
            wordBreak: 'break-word', whiteSpace: 'normal',
            width: '100%', textAlign, color: themeStyles.cellText
          }}>
            {renderMarkdownContent(value)}
          </div>
        )}
      </Box>
    );
  }, [editingCell, renderEditor, startEdit, isEditMode, isCellSelected, activeCell, renderMarkdownContent, handleCellClick, getColumnAlign, cellRefs, themeStyles, setActiveCell]);

  if (!data || (!data.headers.length && !data.rows.length)) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        Empty table - {tableId ? `Table ID: ${tableId}` : 'No data'}
        {standardData && (
          <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#666' }}>
            Columns: {(standardData as StandardTableData).schema.columnCount} |
            Rows: {(standardData as StandardTableData).schema.rowCount}
          </div>
        )}
      </Paper>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%', overflow: 'hidden',
          backgroundColor: themeStyles.paperBackground,
          border: themeStyles.paperBorder
        }}
        className="academic-table"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={tableContainerRef}
      >
        <TableToolbar
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          data={data}
          standardData={standardData}
          tableId={tableId}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          selectedRows={selectedRows}
          themeStyles={themeStyles}
          addRow={addRow}
          addColumn={addColumn}
          deleteColumn={deleteColumn}
          updateDataAndSync={updateDataAndSync}
          handleSelectAllClick={handleSelectAllClick}
          setSelectedRows={setSelectedRows}
          setSelectedCells={setSelectedCells}
          setLastSelectedIndex={setLastSelectedIndex}
          setActiveCell={setActiveCell}
          setEditingCell={setEditingCell}
        />

        <TableContainer
          sx={{
            width: '100%', overflowX: 'hidden', overflowY: 'visible',
            maxWidth: '100%', display: 'block'
          }}
          className="uniform-scroller"
        >
          <Table
            size="small"
            stickyHeader
            sx={{
              width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse',
              '& .MuiTableCell-root': {
                wordWrap: 'break-word', wordBreak: 'break-word',
                overflowWrap: 'break-word', whiteSpace: 'normal',
                verticalAlign: 'top', borderLeft: 'none', borderRight: 'none',
                borderBottom: `1px solid ${themeStyles.cellBorder}`,
                color: themeStyles.cellText
              }
            }}
          >
            <TableHeadSection
              data={data}
              isEditMode={isEditMode}
              selectedRows={selectedRows}
              sortConfig={sortConfig}
              editingCell={editingCell}
              themeStyles={themeStyles}
              handleSelectAllClick={handleSelectAllClick}
              handleRequestSort={handleRequestSort}
              startEdit={startEdit}
              renderEditor={renderEditor}
            />

            <TableBody>
              <SortableContext
                items={sortedRows.map((_, index) => `row-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                {sortedRows.map((row, rowIndex) => {
                  const isRowSelectedValue = isRowSelected(rowIndex);
                  const rowId = `row-${rowIndex}`;

                  if (isEditMode) {
                    return (
                      <DraggableTableRow
                        key={rowId}
                        rowId={rowId}
                        rowIndex={rowIndex}
                        row={row}
                        isEditMode={isEditMode}
                        isSelected={isRowSelectedValue}
                        lastSelectedIndex={lastSelectedIndex}
                        editingCell={editingCell}
                        onRowClick={handleRowClick}
                        renderCellContent={renderCellContent}
                        setSelectedRows={setSelectedRows}
                        setLastSelectedIndex={setLastSelectedIndex}
                        totalColumns={data.headers.length}
                        themeStyles={themeStyles}
                      />
                    );
                  } else {
                    return (
                      <TableRow
                        key={rowId}
                        hover
                        sx={{
                          '&:nth-of-type(even)': { backgroundColor: themeStyles.cellBackground },
                          '&:hover': { backgroundColor: themeStyles.cellHoverBackground }
                        }}
                      >
                        {row.map((cell, colIndex) => (
                          <TableCell
                            key={colIndex}
                            sx={{
                              width: `${100 / data.headers.length}%`,
                              minWidth: 0,
                              maxWidth: `${100 / data.headers.length}%`,
                              padding: 0,
                              '& > *': { width: '100%', maxWidth: '100%' }
                            }}
                          >
                            {renderCellContent(cell, rowIndex, colIndex)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  }
                })}
              </SortableContext>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </DndContext>
  );
}, (prevProps, nextProps) => {
  if (prevProps.tableId !== nextProps.tableId) return false;
  return JSON.stringify(prevProps.tableData) === JSON.stringify(nextProps.tableData);
});

export { ReactTable };
export default ReactTable;
