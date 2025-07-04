// src/js/React/SubComponents/SubBody/SuperComs/ReactTable.tsx/index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Box,
  TableSortLabel,
  Checkbox,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import {
  TableData,
  StandardTableData,
  StandardTableAPI
} from '@Func/Parser/mdItPlugin/table';
import {
  getTableData,
  tableSyncManager,
  getStandardTableData,
  standardTableSyncManager
} from '@App/text/tableEditor';
import { getTableMetadata } from '@App/text/tableEditor';

interface ReactTableProps {
  tableId?: string;
  tableData?: TableData;
}

interface EditingCell {
  rowIndex: number;
  colIndex: number;
  value: string;
}

// 排序相关类型
type Order = 'asc' | 'desc';

interface SortConfig {
  order: Order;
  orderBy: string;
}

// 选中的单元格
interface SelectedCell {
  rowIndex: number;
  colIndex: number;
}

const ReactTable: React.FC<ReactTableProps> = React.memo(({ tableId, tableData: propTableData }) => {
  // 状态管理
  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // 🚀 新增：标准化数据状态
  const [standardData, setStandardData] = useState<StandardTableData | null>(null);

  // 🚀 新增：排序状态
  const [sortConfig, setSortConfig] = useState<SortConfig>({ order: 'asc', orderBy: '' });

  // 🚀 新增：多选状态
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // 🚀 排序比较函数
  const descendingComparator = useCallback((a: string[], b: string[], orderBy: string) => {
    const colIndex = data.headers.indexOf(orderBy);
    if (colIndex === -1) return 0;

    const aVal = a[colIndex] || '';
    const bVal = b[colIndex] || '';

    // 尝试数字比较
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return bNum - aNum;
    }

    // 字符串比较
    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  }, [data.headers]);

  const getComparator = useCallback((order: Order, orderBy: string) => {
    return order === 'desc'
      ? (a: string[], b: string[]) => descendingComparator(a, b, orderBy)
      : (a: string[], b: string[]) => -descendingComparator(a, b, orderBy);
  }, [descendingComparator]);

  // 🚀 获取排序后的数据 - 现在直接使用data.rows，因为排序已经影响了底层数据
  const sortedRows = useMemo(() => {
    return data.rows; // 直接使用data.rows，因为排序已经真正改变了数据
  }, [data.rows]);

  // 🚀 多选处理
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

  // 🚀 增强多选处理：支持 Ctrl、Shift 键
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const handleRowClick = useCallback((event: React.MouseEvent<unknown>, rowIndex: number) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd点击：切换选择
      const selectedIndex = selectedRows.indexOf(rowIndex);
      let newSelected: number[] = [];

      if (selectedIndex === -1) {
        // 🚀 修复：避免重复添加
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
      // 🚀 确保没有重复项
      newSelected = Array.from(new Set(newSelected));
      setSelectedRows(newSelected);
      setLastSelectedIndex(rowIndex);
    } else if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift点击：范围选择
      const start = Math.min(lastSelectedIndex, rowIndex);
      const end = Math.max(lastSelectedIndex, rowIndex);
      const rangeSelected = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      // 🚀 修复：合并现有选择和范围选择，确保没有重复
      const newSelected = Array.from(new Set([...selectedRows, ...rangeSelected])).sort((a, b) => a - b);
      setSelectedRows(newSelected);
    } else {
      // 普通点击：单选
      setSelectedRows([rowIndex]);
      setLastSelectedIndex(rowIndex);
    }
  }, [selectedRows, lastSelectedIndex]);

  const isCellSelected = useCallback((rowIndex: number, colIndex: number) => {
    return selectedCells.some(cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
  }, [selectedCells]);

  const isRowSelected = useCallback((rowIndex: number) => {
    return selectedRows.includes(rowIndex);
  }, [selectedRows]);

  // 默认示例数据（用于后备）
  const defaultTableData: TableData = useMemo(() => ({
    headers: ['Name', 'Age', 'City', 'Email'],
    rows: [
      ['John Doe', '25', 'New York', 'john@example.com'],
      ['Alice Brown', '28', 'Paris', 'alice@example.com']
    ]
  }), []);

  // 🚀 新的基于标准化数据的同步机制
  const updateStandardDataAndSync = useCallback((newData: TableData) => {
    // 1. 更新本地状态
    setData(newData);

    // 2. 如果有tableId，通过标准化同步管理器触发Monaco更新
    if (tableId) {
      standardTableSyncManager.notifyStandardDataChange(tableId, newData, 'react');
    }
  }, [tableId]);

  // 保持向后兼容的同步机制
  const updateDataAndSync = useCallback((newData: TableData) => {
    // 优先使用标准化数据同步
    if (tableId && StandardTableAPI.getStandardData(tableId)) {
      updateStandardDataAndSync(newData);
    } else {
      // 回退到传统同步机制
      setData(newData);
      if (tableId) {
        tableSyncManager.notifyTableDataChange(tableId, newData, 'react');
      }
    }
  }, [tableId, updateStandardDataAndSync]);


  
  // 🚀 标准化数据监听器（Monaco → React）
  useEffect(() => {
    if (!tableId) return;

    const handleStandardDataChange = (newStandardData: StandardTableData) => {


      const newTableData = StandardTableAPI.standardToTable(newStandardData);
      const dataChanged = JSON.stringify(data) !== JSON.stringify(newTableData);

      if (dataChanged) {
        setStandardData(newStandardData);
        setData(newTableData);
      }
    };

    // 注册标准化数据监听器
    standardTableSyncManager.addStandardDataListener(tableId, handleStandardDataChange);

    return () => {
      // 清理监听器
      standardTableSyncManager.removeStandardDataListener(tableId, handleStandardDataChange);
    };
  }, [tableId, data]);

  // 传统数据监听器（保持向后兼容）
  useEffect(() => {
    if (!tableId) return;

    const handleMonacoDataChange = (newData: TableData) => {
      // 如果已经有标准化数据监听器在处理，跳过传统监听器
      if (StandardTableAPI.getStandardData(tableId)) {
        return;
      }


      const dataChanged = JSON.stringify(data) !== JSON.stringify(newData);
      if (dataChanged) {
        setData(newData);
      }
    };

    // 注册传统监听器
    tableSyncManager.addTableListener(tableId, handleMonacoDataChange);

    return () => {
      // 清理监听器
      tableSyncManager.removeTableListener(tableId, handleMonacoDataChange);
    };
  }, [tableId, data]);

  // 初始化数据
  useEffect(() => {
    let initialData: TableData;
    let initialStandardData: StandardTableData | null = null;

    if (tableId) {
      // 🚀 优先尝试获取标准化数据
      initialStandardData = getStandardTableData(tableId);

      if (initialStandardData) {
        initialData = StandardTableAPI.standardToTable(initialStandardData);

      } else {
        // 回退到传统方式
        const registeredData = getTableData(tableId);
        initialData = registeredData || defaultTableData;

      }
    } else {
      // 使用props传入的数据或默认数据
      initialData = propTableData || defaultTableData;

    }

    // 检查数据是否真的发生了变化，避免不必要的重新渲染
    const dataChanged = JSON.stringify(data) !== JSON.stringify(initialData);
    const standardDataChanged = JSON.stringify(standardData) !== JSON.stringify(initialStandardData);

    if (dataChanged || standardDataChanged) {

      setData(initialData);
      setStandardData(initialStandardData);
    }
  }, [tableId, propTableData, defaultTableData]); // 移除data和standardData依赖，避免循环更新

  // 开始编辑单元格 - 改为单击编辑
  const startEdit = useCallback((rowIndex: number, colIndex: number) => {
    const isHeader = rowIndex === -1;
    const value = isHeader
      ? data.headers[colIndex] || ''
      : data.rows[rowIndex]?.[colIndex] || '';

    setEditingCell({ rowIndex, colIndex, value });
  }, [data]);

  // 提交编辑
  const commitEdit = useCallback(() => {
    if (!editingCell) return;

    const { rowIndex, colIndex, value } = editingCell;

    setData(prevData => {
      // 深拷贝数据，避免直接修改
      const newData = {
        headers: [...prevData.headers],
        rows: prevData.rows.map(row => [...row])
      };

      if (rowIndex === -1) {
        // 编辑表头
        newData.headers[colIndex] = value;
      } else {
        // 编辑数据行
        if (!newData.rows[rowIndex]) {
          newData.rows[rowIndex] = new Array(newData.headers.length).fill('');
        }
        newData.rows[rowIndex][colIndex] = value;
      }

      // 🚀 使用新的同步机制
      if (tableId) {
        setTimeout(() => {
          updateDataAndSync(newData);
        }, 0);
      }

      return newData;
    });

    setEditingCell(null);
  }, [editingCell, tableId, updateDataAndSync]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  // 添加行
  const addRow = useCallback(() => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };

    // 确保新行的列数与现有表头数量完全一致
    const colCount = newData.headers.length;
    const newRow = new Array(colCount).fill('');
    newData.rows.push(newRow);

    // 🚀 使用新的同步更新机制
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  // 删除行
  const deleteRow = useCallback((rowIndex: number) => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };
    newData.rows.splice(rowIndex, 1);
    // 🚀 使用新的同步更新机制
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  // 添加列
  const addColumn = useCallback(() => {
    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };

    // 添加新的表头
    newData.headers.push(`Col ${newData.headers.length + 1}`);

    // 为每一行都添加一个空单元格，确保所有行都有相同的列数
    newData.rows.forEach(row => {
      row.push('');
    });
    // 🚀 使用新的同步更新机制
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  // 删除列
  const deleteColumn = useCallback((colIndex: number) => {
    if (data.headers.length <= 1) {
      // 不允许删除最后一列
      return;
    }

    const newData = {
      headers: [...data.headers],
      rows: data.rows.map(row => [...row])
    };

    // 删除表头中的列
    newData.headers.splice(colIndex, 1);
    // 删除每行中对应的列
    newData.rows.forEach(row => {
      if (row.length > colIndex) {
        row.splice(colIndex, 1);
      }
    });

    // 🚀 使用新的同步更新机制
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  // 🚀 增强键盘快捷键处理
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isEditMode || editingCell) return;

    // Ctrl+A: 全选
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      const allRowIndices = data.rows.map((_, index) => index);
      setSelectedRows(allRowIndices);
      return;
    }

    // Ctrl+D: 取消选择（反选）
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      setSelectedRows([]);
      setSelectedCells([]);
      setLastSelectedIndex(null);
      return;
    }

    // Delete: 删除选中的行
    if (event.key === 'Delete' && selectedRows.length > 0) {
      event.preventDefault();
      // 从大到小删除，避免索引变化问题
      const sortedIndices = [...selectedRows].sort((a, b) => b - a);
      let newData = {
        headers: [...data.headers],
        rows: data.rows.map(row => [...row])
      };
      sortedIndices.forEach(index => {
        newData.rows.splice(index, 1);
      });
      updateDataAndSync(newData);
      setSelectedRows([]);
      setLastSelectedIndex(null);
      return;
    }

    // Escape: 取消选择
    if (event.key === 'Escape') {
      setSelectedRows([]);
      setSelectedCells([]);
      setLastSelectedIndex(null);
      return;
    }

    // 🚀 新增：方向键选择（支持Shift扩展选择）
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();

      let targetIndex: number;

      if (selectedRows.length === 0) {
        // 没有选择时，选择第一行或最后一行
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
        // Shift+方向键：扩展选择
        const start = Math.min(lastSelectedIndex || currentIndex, targetIndex);
        const end = Math.max(lastSelectedIndex || currentIndex, targetIndex);
        const rangeSelected = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        setSelectedRows(rangeSelected);
      } else {
        // 普通方向键：移动选择
        setSelectedRows([targetIndex]);
        setLastSelectedIndex(targetIndex);
      }
      return;
    }
  }, [isEditMode, editingCell, data, selectedRows, lastSelectedIndex, updateDataAndSync]);

  // 🚀 排序处理 - 修改为真正影响底层数据，并清空选中状态
  const handleRequestSort = useCallback((property: string) => {
    const isAsc = sortConfig.orderBy === property && sortConfig.order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';

    console.log(`排序请求: ${property}, 方向: ${newOrder}`);

    // 🚀 立即对数据进行排序并更新
    const sortedRows = [...data.rows].sort(getComparator(newOrder, property));
    const newData = {
      headers: [...data.headers],
      rows: sortedRows
    };

    console.log('排序前数据:', data.rows);
    console.log('排序后数据:', sortedRows);

    // 🚀 更新排序状态
    setSortConfig({
      order: newOrder,
      orderBy: property
    });

    // 🚀 关键修复：排序后清空选中状态，因为行索引已经改变
    setSelectedRows([]);
    setSelectedCells([]);
    setLastSelectedIndex(null);

    // 🚀 更新底层数据并同步到Monaco
    updateDataAndSync(newData);

  }, [sortConfig, data, getComparator, updateDataAndSync]);

  // 渲染编辑器 - 完全匹配单元格大小，不改变任何尺寸
  const renderEditor = useCallback((currentValue: string) => (
    <TextField
      value={editingCell?.value || ''}
      onChange={(e) => setEditingCell(prev =>
        prev ? { ...prev, value: e.target.value } : null
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          commitEdit();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
      }}
      onBlur={commitEdit}
      autoFocus
      size="small"
      variant="outlined"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem',
          height: '100%',
          padding: 0,
          border: 'none',
          borderRadius: 0,
          backgroundColor: 'transparent',
          '& fieldset': {
            border: '1px solid #1976d2',
            borderRadius: 0,
            margin: 0,
            padding: 0
          },
          '&:hover fieldset': {
            border: '1px solid #1976d2'
          },
          '&.Mui-focused fieldset': {
            border: '2px solid #1976d2',
            borderRadius: 0
          }
        },
        '& .MuiOutlinedInput-input': {
          padding: '6px 8px',
          height: 'calc(100% - 12px)',
          boxSizing: 'border-box'
        }
      }}
    />
  ), [editingCell, commitEdit, cancelEdit]);

  // 渲染单元格内容，空字符串显示为不间断空格，单击编辑
  const renderCellContent = useCallback((
    value: string,
    rowIndex: number,
    colIndex: number,
    isHeader: boolean = false
  ) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;

    // 空字符串显示为不间断空格
    const displayValue = value === '' ? '\u00A0' : value;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '32px',
          height: '32px', // 🚀 固定高度，避免编辑时高度变化
          cursor: isEditMode ? 'text' : 'default',
          padding: isEditing ? 0 : '6px 8px', // 🚀 编辑时取消padding，让编辑器填满整个单元格
          position: 'relative',
          '&:hover': {
            backgroundColor: isEditMode && !isHeader ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
          }
        }}
        onClick={() => {
          if (isEditMode && !isHeader) {
            startEdit(rowIndex, colIndex);
          }
        }}
      >
        {isEditing ? (
          renderEditor(value)
        ) : (
          <span>{displayValue || (isHeader ? `Header ${colIndex + 1}` : '')}</span>
        )}
      </Box>
    );
  }, [editingCell, renderEditor, startEdit, isEditMode]);

  if (!data || (!data.headers.length && !data.rows.length)) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        Empty table - {tableId ? `Table ID: ${tableId}` : 'No data'}
        {standardData && (
          <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#666' }}>
            Columns: {standardData.schema.columnCount} |
            Rows: {standardData.schema.rowCount}
          </div>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ width: '100%', overflow: 'hidden' }}
      className="academic-table"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* 工具栏 */}
      <Box sx={{
        p: 1,
        display: 'flex',
        gap: 1,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'transparent'
      }} className="react-table-toolbar">
        <Tooltip title={isEditMode ? "Exit Edit Mode (多选：Ctrl+点击, Shift+点击范围选择)" : "Enter Edit Mode"}>
          <IconButton
            size="small"
            onClick={() => {
              setIsEditMode(!isEditMode);
              // 🚀 退出编辑模式时清除选择
              if (isEditMode) {
                setSelectedRows([]);
                setSelectedCells([]);
                setLastSelectedIndex(null);
              }
            }}
            color={isEditMode ? "primary" : "default"}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {isEditMode && (
          <>
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

            {/* 🚀 简化：选中行时直接显示删除按钮和选中数量 */}
            {selectedRows.length > 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: 1 }}>
                  <span style={{ fontWeight: 500, color: '#1976d2', fontSize: '0.875rem' }}>
                    {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
                  </span>
                </Box>
                <Tooltip title="Delete Selected Rows">
                  <IconButton
                    size="small"
                    onClick={() => {
                      // 从大到小删除，避免索引变化问题
                      const sortedIndices = [...selectedRows].sort((a, b) => b - a);
                      sortedIndices.forEach(index => deleteRow(index));
                      setSelectedRows([]);
                      setLastSelectedIndex(null);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {/* 🚀 快捷键提示图标 */}
            <Tooltip title={
              <Box sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <div>快捷键:</div>
                <div>• Ctrl+A: 全选</div>
                <div>• Ctrl+D: 取消选择</div>
                <div>• Delete: 删除选中行</div>
                <div>• Ctrl+点击: 多选</div>
                <div>• Shift+点击: 范围选择</div>
                <div>• 方向键: 移动选择</div>
                <div>• Shift+方向键: 扩展选择</div>
              </Box>
            }>
              <IconButton size="small" sx={{ ml: 'auto' }}>
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {tableId && (
          <Box sx={{ ml: isEditMode ? 1 : 'auto', fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
            Table ID: {tableId}
            {standardData && (
              <span style={{ marginLeft: '8px' }}>
                {standardData.schema.columnCount}×{standardData.schema.rowCount}
              </span>
            )}
          </Box>
        )}
      </Box>

      {/* 表格 */}
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto', // 横向滚动
          overflowY: 'visible', // 纵向不限制
          maxWidth: '100%' // 确保容器不会超出父元素
        }}
        className="uniform-scroller"
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: 'max-content',
            width: 'auto', // 让表格宽度自适应内容
            tableLayout: 'fix' // 自动表格布局
          }}
        >
          <TableHead>
            <TableRow sx={{
              backgroundColor: '#f5f5f5',
              '& .MuiTableCell-head': {
                fontWeight: 600,
                borderBottom: '2px solid #e0e0e0',
                color: '#333',
                position: 'sticky',
                top: 0,
                backgroundColor: '#f5f5f5',
                zIndex: 10
              }
            }}>
              {/* 🚀 新增：多选复选框列 */}
              {isEditMode && (
                <TableCell padding="checkbox" sx={{ width: 48 }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
                    checked={data.rows.length > 0 && selectedRows.length === data.rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all rows',
                    }}
                  />
                </TableCell>
              )}

              {data.headers.map((header, colIndex) => (
                <TableCell key={colIndex} sx={{
                  minWidth: 120,
                  whiteSpace: 'nowrap' // 防止表头换行
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* 🚀 表头排序功能 - 只在编辑模式下启用 */}
                    <TableSortLabel
                      active={isEditMode && sortConfig.orderBy === header}
                      direction={sortConfig.orderBy === header ? sortConfig.order : 'asc'}
                      onClick={() => {
                        if (isEditMode) {
                          handleRequestSort(header);
                        }
                      }}
                      disabled={!isEditMode}
                      sx={{
                        flex: 1,
                        '& .MuiTableSortLabel-root': {
                          flexDirection: 'row'
                        },
                        '&.Mui-disabled': {
                          opacity: 1,
                          color: 'inherit'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '32px',
                          cursor: isEditMode ? 'text' : 'default',
                          padding: '6px 8px',
                          width: '100%',
                          '&:hover': {
                            backgroundColor: isEditMode ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                          }
                        }}
                        onClick={(e) => {
                          if (isEditMode) {
                            e.stopPropagation(); // 阻止排序
                            startEdit(-1, colIndex);
                          }
                        }}
                      >
                        {editingCell?.rowIndex === -1 && editingCell?.colIndex === colIndex ? (
                          renderEditor(header)
                        ) : (
                          <span>{header || `Header ${colIndex + 1}`}</span>
                        )}
                      </Box>
                      {isEditMode && sortConfig.orderBy === header ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>

                    {isEditMode && data.headers.length > 1 && (
                      <Tooltip title="Delete Column">
                        <IconButton
                          size="small"
                          onClick={() => deleteColumn(colIndex)}
                          color="error"
                          sx={{ opacity: 0.6, '&:hover': { opacity: 1 }, ml: 1 }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              ))}
              {isEditMode && (
                <TableCell sx={{ width: 80 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row, rowIndex) => {
              // 🚀 修复：排序后直接使用rowIndex，因为数据已经真正排序
              const isRowSelectedValue = isRowSelected(rowIndex);

              return (
                <TableRow
                  key={`row-${rowIndex}-${JSON.stringify(row).slice(0, 20)}`} // 使用行内容作为key的一部分
                  hover
                  role={isEditMode ? "checkbox" : undefined}
                  aria-checked={isEditMode ? isRowSelectedValue : undefined}
                  tabIndex={-1}
                  selected={isEditMode ? isRowSelectedValue : false}
                  sx={{
                    '&:nth-of-type(even)': {
                      backgroundColor: '#fafafa'
                    },
                    '&:hover': {
                      backgroundColor: isEditMode ? alpha('#1976d2', 0.08) : '#f0f0f0'
                    },
                    cursor: isEditMode ? 'pointer' : 'default'
                  }}
                  onClick={(event) => {
                    if (isEditMode) {
                      // 🚀 确保传递完整的事件对象，包含键盘修饰键信息
                      handleRowClick(event, rowIndex);
                    }
                  }}
                >
                  {/* 🚀 新增：多选复选框列 */}
                  {isEditMode && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isRowSelectedValue}
                        onChange={(event) => {
                          event.stopPropagation();
                          // 🚀 修复：复选框点击应该支持多选逻辑
                          if (isRowSelectedValue) {
                            // 取消选择：从选中列表中移除
                            setSelectedRows(prev => prev.filter(index => index !== rowIndex));
                            // 如果取消选择的是最后选择的行，重置lastSelectedIndex
                            if (lastSelectedIndex === rowIndex) {
                              setLastSelectedIndex(null);
                            }
                          } else {
                            // 添加选择：添加到选中列表，避免重复
                            setSelectedRows(prev => {
                              if (prev.includes(rowIndex)) {
                                return prev; // 如果已经存在，不重复添加
                              }
                              return [...prev, rowIndex];
                            });
                            setLastSelectedIndex(rowIndex);
                          }
                        }}
                        inputProps={{
                          'aria-labelledby': `enhanced-table-checkbox-${rowIndex}`,
                        }}
                      />
                    </TableCell>
                  )}

                  {row.map((cell, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        minWidth: 120,
                        padding: 0,
                        whiteSpace: 'nowrap', // 防止单元格内容换行
                        '&:hover': {
                          backgroundColor: isEditMode ? alpha('#1976d2', 0.04) : 'transparent'
                        }
                      }}
                      onClick={(event) => {
                        if (isEditMode) {
                          event.stopPropagation(); // 阻止行选择
                        }
                      }}
                    >
                      {renderCellContent(cell, rowIndex, colIndex)}
                    </TableCell>
                  ))}

                  {isEditMode && (
                    <TableCell>
                      <Tooltip title="Delete Row">
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteRow(rowIndex);
                          }}
                          color="error"
                          sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，优化性能
  if (prevProps.tableId !== nextProps.tableId) return false;
  return JSON.stringify(prevProps.tableData) === JSON.stringify(nextProps.tableData);
});

// 表格管理器 - 智能避免闪烁版本
class TableManager {
  private static instance: TableManager;
  private mountedRoots = new Map<string, any>(); // 使用tableId作为key
  private lastTableStates = new Map<string, string>(); // 保存每个表格的最后状态hash

  static getInstance(): TableManager {
    if (!TableManager.instance) {
      TableManager.instance = new TableManager();
    }
    return TableManager.instance;
  }

  // 智能挂载：避免不必要的DOM重建
  mountTables() {

    // 查找当前所有表格占位符
    const placeholders = document.querySelectorAll('[data-react-table]') as NodeListOf<HTMLElement>;
    const currentTableIds = new Set<string>();



    // 处理每个占位符
    placeholders.forEach((placeholder, index) => {
      const tableId = placeholder.getAttribute('data-table-id');
      const align = placeholder.getAttribute('data-align');
      const domTableHash = placeholder.getAttribute('data-table-hash'); // DOM中的哈希

      if (!tableId) {
        console.warn(`表格占位符 ${index} 缺少 data-table-id`);
        return;
      }

      currentTableIds.add(tableId);

      // 从表格注册表获取当前的真实哈希
      const registryMetadata = getTableMetadata(tableId);
      const currentTableHash = registryMetadata?.tableHash || null;

      const lastHash = this.lastTableStates.get(tableId);
      const existingRoot = this.mountedRoots.get(tableId);
      const hasContent = placeholder.children.length > 0;

      // 
      //   domHash: domTableHash,
      //   registryHash: currentTableHash,
      //   lastHash: lastHash,
      //   hasExistingRoot: !!existingRoot,
      //   hasContent: hasContent,
      //   needsUpdate: currentTableHash !== lastHash || !hasContent
      // });

      // 如果没有找到注册表数据，跳过此表格
      if (!currentTableHash) {
        console.warn(`表格 ${tableId} 在注册表中未找到，跳过处理`);
        return;
      }

      // 关键优化：使用注册表中的哈希进行比较
      if (existingRoot && currentTableHash === lastHash && hasContent) {

        return;
      }

      // 如果有根节点但内容被清空了，或者哈希变化了，需要重新渲染
      if (existingRoot && (!hasContent || currentTableHash !== lastHash)) {

        this.updateTable(tableId, currentTableHash);
        return;
      }

      // 如果需要创建新的根节点
      if (!existingRoot) {

        this.createTableRoot(placeholder, tableId, currentTableHash);
      }
    });

    // 清理不再存在的表格
    this.cleanupUnusedRoots(currentTableIds);


  }

  // 创建新的表格根节点
  private createTableRoot(placeholder: HTMLElement, tableId: string, tableHash: string | null) {
    try {
      // 重置占位符样式
      placeholder.style.border = 'none';
      placeholder.style.background = 'transparent';
      placeholder.style.minHeight = 'auto';
      placeholder.style.padding = '0';
      placeholder.style.margin = '16px 0';

      // 动态导入 react-dom/client
      import('react-dom/client').then(({ createRoot }) => {
        // 再次检查占位符是否仍然存在
        if (!document.contains(placeholder)) {
          console.warn(`表格 ${tableId} 的占位符已被移除`);
          return;
        }

        const root = createRoot(placeholder);
        root.render(React.createElement(ReactTable, { tableId }));

        // 保存根节点和状态
        this.mountedRoots.set(tableId, root);
        if (tableHash) {
          this.lastTableStates.set(tableId, tableHash);
        }


      }).catch(e => {
        console.error(`创建表格 ${tableId} 根节点失败:`, e);
      });
    } catch (e) {
      console.error(`为表格 ${tableId} 创建根节点时发生错误:`, e);
    }
  }

  // 更新现有表格（不重建根节点）
  private updateTable(tableId: string, tableHash: string | null) {
    const root = this.mountedRoots.get(tableId);
    if (root && tableHash) {
      try {
        // 使用tableHash作为key，确保React能检测到变化
        root.render(React.createElement(ReactTable, {
          tableId,
          key: `${tableId}-${tableHash}` // 使用hash确保props变化时重新渲染
        }));
        this.lastTableStates.set(tableId, tableHash);

      } catch (e) {
        console.error(`更新表格 ${tableId} 失败:`, e);
      }
    }
  }

  // 清理不再存在的表格根节点
  private cleanupUnusedRoots(currentTableIds: Set<string>) {
    const toDelete: string[] = [];

    this.mountedRoots.forEach((root, tableId) => {
      if (!currentTableIds.has(tableId)) {

        try {
          root.unmount();
          toDelete.push(tableId);
        } catch (e) {
          console.warn(`卸载表格 ${tableId} 失败:`, e);
        }
      }
    });

    // 从映射中删除
    toDelete.forEach(tableId => {
      this.mountedRoots.delete(tableId);
      this.lastTableStates.delete(tableId);
      // 🚀 清理同步监听器
      tableSyncManager.clearTableListeners(tableId);
    });

    if (toDelete.length > 0) {

    }
  }

  // 强制重新挂载所有表格（用于特殊情况）
  forceRemountAllTables() {

    this.unmountAllTables();
    this.mountTables();
  }

  // 卸载所有表格
  unmountAllTables() {

    this.mountedRoots.forEach((root, tableId) => {
      try {
        root.unmount();
        // 🚀 清理同步监听器
        tableSyncManager.clearTableListeners(tableId);
      } catch (e) {
        console.warn(`卸载表格 ${tableId} 失败:`, e);
      }
    });
    this.mountedRoots.clear();
    this.lastTableStates.clear();
    // 🚀 清理所有同步监听器
    tableSyncManager.clearAllListeners();
  }

  // 获取调试信息
  getDebugInfo() {
    return {
      mountedRootsCount: this.mountedRoots.size,
      tableStatesCount: this.lastTableStates.size,
      mountedTableIds: Array.from(this.mountedRoots.keys()),
      tableStates: Object.fromEntries(this.lastTableStates),
      syncListenersCount: (tableSyncManager as any).syncListeners?.size || 0
    };
  }
}

export { ReactTable, TableManager };
export default ReactTable;

