import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Checkbox,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  HelpOutline as HelpIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { StandardTableData } from '@Func/Parser/mdItPlugin/table';
import { SortConfig } from './types';
import { getTableThemeStyles } from './theme';

interface TableToolbarProps {
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  data: TableData;
  standardData: StandardTableData | null;
  tableId?: string;
  sortConfig: SortConfig;
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>;
  selectedRows: number[];
  themeStyles: ReturnType<typeof getTableThemeStyles>;
  addRow: () => void;
  addColumn: () => void;
  deleteColumn: (colIndex: number) => void;
  updateDataAndSync: (newData: TableData) => void;
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedCells: React.Dispatch<React.SetStateAction<any[]>>;
  setLastSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveCell: React.Dispatch<React.SetStateAction<any>>;
  setEditingCell: React.Dispatch<React.SetStateAction<any>>;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  isEditMode,
  setIsEditMode,
  data,
  standardData,
  tableId,
  sortConfig,
  setSortConfig,
  selectedRows,
  themeStyles,
  addRow,
  addColumn,
  deleteColumn,
  updateDataAndSync,
  handleSelectAllClick,
  setSelectedRows,
  setSelectedCells,
  setLastSelectedIndex,
  setActiveCell,
  setEditingCell,
}) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      borderBottom: `1px solid ${themeStyles.toolbarBorder}`,
      backgroundColor: themeStyles.toolbarBackground
    }} className="react-table-toolbar">

      {/* Main toolbar */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Tooltip title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
          <IconButton
            size="small"
            onClick={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) {
                setSelectedRows([]);
                setSelectedCells([]);
                setLastSelectedIndex(null);
                setActiveCell(null);
                setEditingCell(null);
              }
            }}
            color={isEditMode ? "primary" : "default"}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {isEditMode && (
          <>
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
              <Tooltip title="Add Row">
                <IconButton size="small" onClick={addRow}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Column">
                <IconButton size="small" onClick={addColumn}>
                  <AddIcon sx={{ transform: 'rotate(90deg)' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ width: '1px', height: '20px', backgroundColor: themeStyles.toolbarBorder, mx: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.7 }}>列:</span>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {data.headers.map((header, colIndex) => (
                  <Tooltip key={colIndex} title={`Delete "${header}" column`}>
                    <IconButton
                      size="small"
                      onClick={() => deleteColumn(colIndex)}
                      disabled={data.headers.length <= 1}
                      sx={{
                        p: 0.25,
                        fontSize: '0.75rem',
                        minWidth: 'auto',
                        color: data.headers.length <= 1 ? '#ccc' : '#d32f2f',
                        '&:hover': {
                          backgroundColor: data.headers.length <= 1 ? 'transparent' : alpha('#d32f2f', 0.08)
                        }
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>

            <Box sx={{ width: '1px', height: '20px', backgroundColor: themeStyles.toolbarBorder, mx: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.7 }}>排序:</span>
              {sortConfig.orderBy && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: themeStyles.cellText }}>
                    {sortConfig.orderBy}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#1976d2' }}>
                    {sortConfig.order === 'asc' ? '↑' : '↓'}
                  </span>
                  <Tooltip title="Clear Sort">
                    <IconButton
                      size="small"
                      onClick={() => setSortConfig({ order: 'asc', orderBy: '' })}
                      sx={{ p: 0.25 }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              {!sortConfig.orderBy && (
                <span style={{ fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.5, fontStyle: 'italic' }}>
                  点击表头排序
                </span>
              )}
            </Box>
          </>
        )}

        {/* Right info area */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditMode && (
            <Tooltip title={
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <div>快捷键:</div>
                <div>• Ctrl+A: 全选</div>
                <div>• Ctrl+D: 取消选择</div>
                <div>• Ctrl+B: 加粗选中单元格</div>
                <div>• Ctrl+I: 斜体选中单元格</div>
                <div>• Ctrl+C: 复制选中单元格</div>
                <div>• Ctrl+X: 剪切选中单元格</div>
                <div>• Ctrl+V: 粘贴到活动单元格</div>
                <div>• Delete: 删除选中行</div>
                <div>• Ctrl+点击: 多选</div>
                <div>• Shift+点击: 范围选择</div>
                <div>• 方向键: 移动选择</div>
                <div>• Shift+方向键: 扩展选择</div>
                <div>• 拖拽行首图标: 重新排序</div>
              </Box>
            }>
              <IconButton size="small">
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {tableId && (
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              Table ID: {tableId}
              {standardData && (
                <span style={{ marginLeft: '8px' }}>
                  {standardData.schema.columnCount}×{standardData.schema.rowCount}
                </span>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Selection action bar */}
      {isEditMode && selectedRows.length > 0 && (
        <Box sx={{
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: alpha('#1976d2', 0.04),
          borderTop: `1px solid ${themeStyles.toolbarBorder}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              size="small"
              indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
              checked={data.rows.length > 0 && selectedRows.length === data.rows.length}
              onChange={handleSelectAllClick}
            />
            <span style={{ fontWeight: 500, color: '#1976d2', fontSize: '0.875rem' }}>
              {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
            </span>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
            <Tooltip title="Delete Selected Rows">
              <IconButton
                size="small"
                onClick={() => {
                  const newData = {
                    headers: [...data.headers],
                    rows: data.rows.map(row => [...row])
                  };
                  const sortedIndices = [...selectedRows].sort((a, b) => b - a);
                  sortedIndices.forEach(index => newData.rows.splice(index, 1));
                  updateDataAndSync(newData);
                  setSelectedRows([]);
                  setLastSelectedIndex(null);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear Selection">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedRows([]);
                  setSelectedCells([]);
                  setLastSelectedIndex(null);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TableToolbar;
