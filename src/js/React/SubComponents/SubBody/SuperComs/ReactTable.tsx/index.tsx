// src/js/React/SubComponents/SubBody/SuperComs/ReactTable.tsx/index.tsx
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  HelpOutline as HelpIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import MarkdownIt from 'markdown-it';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { getTheme } from '@App/config/change';

// 🚀 主题样式函数
const getTableThemeStyles = () => {
  const isDark = getTheme() === 'dark';
  
  return {
    // 表格容器样式
    paperBackground: isDark ? '#2d2d30' : '#ffffff',
    paperBorder: isDark ? '1px solid #3c3c3c' : '1px solid #e0e0e0',
    
    // 表格单元格样式
    cellBackground: isDark ? '#2d2d30' : '#ffffff',
    cellHoverBackground: isDark ? '#3c3c3c' : '#f5f5f5',
    cellSelectedBackground: isDark ? alpha('#1976d2', 0.15) : alpha('#1976d2', 0.12),
    cellActiveBackground: isDark ? alpha('#1976d2', 0.12) : alpha('#1976d2', 0.08),
    cellBorder: isDark ? '#3c3c3c' : '#e0e0e0',
    cellText: isDark ? '#ffffff' : '#000000',
    
    // 表头样式
    headerBackground: isDark ? '#383838' : '#f5f5f5',
    headerText: isDark ? '#ffffff' : '#000000',
    headerHoverBackground: isDark ? '#4a4a4a' : '#eeeeee',
    
    // 工具栏样式
    toolbarBackground: isDark ? '#2d2d30' : 'transparent',
    toolbarBorder: isDark ? '#3c3c3c' : '#e0e0e0',
    
    // 按钮样式
    buttonColor: isDark ? '#ffffff' : '#1976d2',
    buttonHoverBackground: isDark ? '#3c3c3c' : alpha('#1976d2', 0.04),
    
    // 编辑器样式
    editorBackground: isDark ? '#2d2d30' : 'transparent',
    editorBorder: isDark ? '1px solid #1976d2' : '1px solid #1976d2',
    editorFocusBorder: isDark ? '2px solid #1976d2' : '2px solid #1976d2',
    
    // 选中行样式
    selectedRowBackground: isDark ? alpha('#1976d2', 0.15) : alpha('#1976d2', 0.08),
    selectedRowHoverBackground: isDark ? alpha('#1976d2', 0.2) : alpha('#1976d2', 0.12),
  };
};

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

// 活动单元格 (用于粘贴操作的起始点)
interface ActiveCell {
  rowIndex: number;
  colIndex: number;
}

// 🚀 Part 3: 可拖拽的表格行组件
interface DraggableTableRowProps {
  rowId: string;
  rowIndex: number;
  row: string[];
  isEditMode: boolean;
  isSelected: boolean;
  lastSelectedIndex: number | null;
  editingCell: EditingCell | null;
  onRowClick: (event: React.MouseEvent<unknown>, rowIndex: number) => void;
  renderCellContent: (value: string, rowIndex: number, colIndex: number) => React.ReactNode;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  setLastSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  totalColumns: number; // 新增：总列数
}

const DraggableTableRow: React.FC<DraggableTableRowProps> = ({
  rowId,
  rowIndex,
  row,
  isEditMode,
  isSelected,
  lastSelectedIndex,
  editingCell,
  onRowClick,
  renderCellContent,
  setSelectedRows,
  setLastSelectedIndex,
  totalColumns
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rowId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={rowId}
      hover
      role={isEditMode ? "checkbox" : undefined}
      aria-checked={isEditMode ? isSelected : undefined}
      tabIndex={-1}
      selected={isEditMode ? isSelected : false}
      sx={{
        '&:nth-of-type(even)': {
          backgroundColor: isDragging ? '#f5f5f5' : '#fafafa'
        },
        '&:hover': {
          backgroundColor: isEditMode ? alpha('#1976d2', 0.08) : '#f0f0f0'
        },
        cursor: isEditMode ? 'pointer' : 'default'
      }}
      onClick={(event) => {
        if (isEditMode) {
          onRowClick(event, rowIndex);
        }
      }}
    >
      {/* 🚀 拖拽手柄列 */}
      {isEditMode && (
        <TableCell padding="checkbox">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              color="primary"
              checked={isSelected}
              onChange={(event) => {
                event.stopPropagation();
                if (isSelected) {
                  setSelectedRows(prev => prev.filter(index => index !== rowIndex));
                  if (lastSelectedIndex === rowIndex) {
                    setLastSelectedIndex(null);
                  }
                } else {
                  setSelectedRows(prev => {
                    if (prev.includes(rowIndex)) {
                      return prev;
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
            <IconButton
              size="small"
              {...attributes}
              {...listeners}
              sx={{ 
                cursor: 'grab',
                opacity: 0.6,
                '&:hover': { opacity: 1 },
                '&:active': { cursor: 'grabbing' }
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      )}

      {row.map((cell, colIndex) => (
        <TableCell
          key={colIndex}
          sx={{
            width: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`, // 只考虑拖拽列，没有Actions列
            minWidth: 0, // 允许缩小
            maxWidth: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`, // 限制最大宽度
            padding: 0,
            '& > *': {
              width: '100%',
              maxWidth: '100%'
            }
          }}
          onClick={(event) => {
            if (isEditMode) {
              event.stopPropagation();
            }
          }}
        >
          {renderCellContent(cell, rowIndex, colIndex)}
        </TableCell>
      ))}
    </TableRow>
  );
};

const ReactTable: React.FC<ReactTableProps> = React.memo(({ tableId, tableData: propTableData }) => {
  // 🚀 主题样式
  const themeStyles = useMemo(() => getTableThemeStyles(), []);
  
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
  
  // 🚀 新增：活动单元格状态
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  // 🚀 新增：表格容器引用
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 🚀 Part 1: 创建 markdown-it 实例
  const md = useMemo(() => {
    return new MarkdownIt({
      html: false,
      linkify: true,
      typographer: false
    });
  }, []);

  // 🚀 Part 3: 配置拖拽传感器
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

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

  // 🚀 Part 2: 单元格点击处理（支持多选）
  const handleCellClick = useCallback((event: React.MouseEvent<unknown>, rowIndex: number, colIndex: number) => {
    event.stopPropagation(); // 防止触发行选择

    const cellKey = `${rowIndex}-${colIndex}`;
    
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd点击：切换单元格选择
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
      // Shift点击：矩形区域选择
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
      
      // 合并现有选择和矩形选择，去重
      const allSelected = [...selectedCells, ...rectangularSelection];
      const uniqueSelected = allSelected.filter((cell, index, arr) => 
        arr.findIndex(c => c.rowIndex === cell.rowIndex && c.colIndex === cell.colIndex) === index
      );
      setSelectedCells(uniqueSelected);
    } else {
      // 普通点击：单选
      setSelectedCells([{ rowIndex, colIndex }]);
    }
  }, [selectedCells]);

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

  // 🚀 Part 2: 格式化助手函数
  const toggleMarkdownFormat = useCallback((text: string, format: 'bold' | 'italic' | 'strikethrough' | 'code') => {
    const formatMap = {
      bold: { start: '**', end: '**' },
      italic: { start: '*', end: '*' },
      strikethrough: { start: '~~', end: '~~' },
      code: { start: '`', end: '`' }
    };

    const { start, end } = formatMap[format];
    
    // 检查是否已经有格式
    if (text.startsWith(start) && text.endsWith(end)) {
      // 移除格式
      return text.slice(start.length, -end.length);
    } else {
      // 添加格式
      return `${start}${text}${end}`;
    }
  }, []);

  // 🚀 增强键盘快捷键处理
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isEditMode || editingCell) return;

    // 🚀 Part 2: Ctrl+B - 切换加粗格式
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      
      if (selectedCells.length === 0) return;

      // 创建数据副本
      const newData = JSON.parse(JSON.stringify(data)) as TableData;
      
      // 对所有选中的单元格应用/移除加粗格式
      selectedCells.forEach(({ rowIndex, colIndex }) => {
        if (rowIndex === -1) {
          // 表头
          if (colIndex < newData.headers.length) {
            newData.headers[colIndex] = toggleMarkdownFormat(
              newData.headers[colIndex] || '', 
              'bold'
            );
          }
        } else {
          // 数据行
          if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
            newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(
              newData.rows[rowIndex][colIndex] || '', 
              'bold'
            );
          }
        }
      });

      updateDataAndSync(newData);
      return;
    }

    // 🚀 Part 2: Ctrl+I - 切换斜体格式
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      
      if (selectedCells.length === 0) return;

      const newData = JSON.parse(JSON.stringify(data)) as TableData;
      
      selectedCells.forEach(({ rowIndex, colIndex }) => {
        if (rowIndex === -1) {
          if (colIndex < newData.headers.length) {
            newData.headers[colIndex] = toggleMarkdownFormat(
              newData.headers[colIndex] || '', 
              'italic'
            );
          }
        } else {
          if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
            newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(
              newData.rows[rowIndex][colIndex] || '', 
              'italic'
            );
          }
        }
      });

      updateDataAndSync(newData);
      return;
    }

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

    // 🚀 Part 4: Ctrl+C - 复制选中的单元格
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      if (selectedCells.length === 0) return;

      // 找出选中区域的边界
      const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
      const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
      const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
      const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));

      // 构建 TSV 字符串
      const tsvRows: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        const tsvCols: string[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const isSelected = selectedCells.some(cell => 
            cell.rowIndex === r && cell.colIndex === c
          );
          
          let cellValue = '';
          if (isSelected) {
            if (r === -1) {
              // 表头
              cellValue = data.headers[c] || '';
            } else {
              // 数据行
              cellValue = data.rows[r]?.[c] || '';
            }
          }
          tsvCols.push(cellValue);
        }
        tsvRows.push(tsvCols.join('\t'));
      }

      const tsvString = tsvRows.join('\n');
      navigator.clipboard.writeText(tsvString).catch(err => {
        console.warn('复制到剪贴板失败:', err);
      });
      return;
    }

    // 🚀 Part 4: Ctrl+X - 剪切选中的单元格
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'x') {
      event.preventDefault();
      if (selectedCells.length === 0) return;

      // 先执行复制逻辑
      const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
      const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
      const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
      const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));

      const tsvRows: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        const tsvCols: string[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const isSelected = selectedCells.some(cell => 
            cell.rowIndex === r && cell.colIndex === c
          );
          
          let cellValue = '';
          if (isSelected) {
            if (r === -1) {
              cellValue = data.headers[c] || '';
            } else {
              cellValue = data.rows[r]?.[c] || '';
            }
          }
          tsvCols.push(cellValue);
        }
        tsvRows.push(tsvCols.join('\t'));
      }

      const tsvString = tsvRows.join('\n');
      navigator.clipboard.writeText(tsvString).then(() => {
        // 复制成功后，清空选中的单元格
        const newData = JSON.parse(JSON.stringify(data)) as TableData;
        
        selectedCells.forEach(({ rowIndex, colIndex }) => {
          if (rowIndex === -1) {
            // 表头
            if (colIndex < newData.headers.length) {
              newData.headers[colIndex] = '';
            }
          } else {
            // 数据行
            if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
              newData.rows[rowIndex][colIndex] = '';
            }
          }
        });

        updateDataAndSync(newData);
      }).catch(err => {
        console.warn('剪切失败:', err);
      });
      return;
    }

    // 🚀 Part 4: Ctrl+V - 粘贴到活动单元格
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      if (!activeCell) return;

      navigator.clipboard.readText().then(clipboardText => {
        if (!clipboardText.trim()) return;

        // 解析 TSV 数据
        const rows = clipboardText.split('\n').map(row => row.split('\t'));
        const pasteRowCount = rows.length;
        const pasteColCount = Math.max(...rows.map(row => row.length));

        // 计算需要的总行数和列数
        const needRowCount = Math.max(data.rows.length, activeCell.rowIndex + pasteRowCount);
        const needColCount = Math.max(data.headers.length, activeCell.colIndex + pasteColCount);

        // 创建扩展后的数据副本
        const newData: TableData = {
          headers: [...data.headers],
          rows: data.rows.map(row => [...row])
        };

        // 扩展表头
        while (newData.headers.length < needColCount) {
          newData.headers.push(`Col ${newData.headers.length + 1}`);
        }

        // 扩展行
        while (newData.rows.length < needRowCount) {
          const newRow = new Array(needColCount).fill('');
          newData.rows.push(newRow);
        }

        // 确保所有现有行都有足够的列
        newData.rows.forEach(row => {
          while (row.length < needColCount) {
            row.push('');
          }
        });

        // 粘贴数据
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
        
        // 更新选择区域到粘贴的范围
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
      }).catch(err => {
        console.warn('从剪贴板读取失败:', err);
      });
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

  // 🚀 Part 3: 拖拽结束处理函数
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // 解析拖拽的行索引
    const activeIndex = parseInt(String(active.id).replace('row-', ''));
    const overIndex = parseInt(String(over.id).replace('row-', ''));

    if (isNaN(activeIndex) || isNaN(overIndex)) {
      console.warn('无法解析拖拽索引');
      return;
    }

    // 使用 arrayMove 重新排列数据
    const newRows = arrayMove(data.rows, activeIndex, overIndex);
    const newData = {
      headers: [...data.headers],
      rows: newRows
    };

    // 清空选择状态，因为行索引已经改变
    setSelectedRows([]);
    setSelectedCells([]);
    setLastSelectedIndex(null);

    // 更新数据并同步
    updateDataAndSync(newData);
  }, [data, updateDataAndSync]);

  // 🚀 Part 1: Markdown 渲染助手函数（移到组件顶层）
  const renderMarkdownContent = useCallback((value: string) => {
    if (value === '' || value === '\u00A0') {
      return <span>{'\u00A0'}</span>;
    }
    
    try {
      // 使用 renderInline 只渲染行内元素，避免包裹 <p> 标签
      const htmlContent = md.renderInline(value);
      return (
        <span 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ 
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            display: 'inline-block',
            width: '100%'
          }}
        />
      );
    } catch (error) {
      console.warn('Markdown 渲染失败:', error);
      // 降级到纯文本显示
      const displayValue = value === '' ? '\u00A0' : value;
      return (
        <span style={{ 
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          display: 'inline-block',
          width: '100%'
        }}>
          {displayValue}
        </span>
      );
    }
  }, [md]);

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

  // 🚀 Part 1: 渲染单元格内容，支持 Markdown 渲染
  const renderCellContent = useCallback((
    value: string,
    rowIndex: number,
    colIndex: number,
    isHeader: boolean = false
  ) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
    const isCellSelectedState = isCellSelected(rowIndex, colIndex);
    const isActive = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;

    // 空字符串显示为不间断空格
    const displayValue = value === '' ? '\u00A0' : value;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start', // 改为顶部对齐
          minHeight: '32px',
          width: '100%',
          cursor: isEditMode ? 'text' : 'default',
          padding: isEditing ? 0 : '6px 8px',
          position: 'relative',
          backgroundColor: isCellSelectedState 
            ? alpha('#1976d2', 0.12) 
            : isActive 
              ? alpha('#1976d2', 0.08)
              : 'transparent',
          border: isActive ? '1px solid #1976d2' : 'none',
          wordBreak: 'break-word', // 允许换行
          whiteSpace: 'normal', // 允许正常换行
          overflowWrap: 'break-word', // 确保长单词能够换行
          '&:hover': {
            backgroundColor: isEditMode && !isHeader 
              ? (isCellSelectedState ? alpha('#1976d2', 0.16) : alpha('#1976d2', 0.08))
              : 'transparent'
          }
        }}
        onClick={(event) => {
          if (isEditMode && !isHeader) {
            // 🚀 Part 2: 处理单元格点击选择
            handleCellClick(event, rowIndex, colIndex);
            setActiveCell({ rowIndex, colIndex });
            startEdit(rowIndex, colIndex);
          }
        }}
      >
        {isEditing ? (
          renderEditor(value)
        ) : (
          // 🚀 Part 1: 根据是否为表头选择渲染方式
          isHeader ? (
            <span style={{ 
              fontWeight: 'bold',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              display: 'block',
              width: '100%'
            }}>
              {displayValue || `Header ${colIndex + 1}`}
            </span>
          ) : (
            <div style={{ 
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              width: '100%'
            }}>
              {renderMarkdownContent(value)}
            </div>
          )
        )}
      </Box>
    );
  }, [editingCell, renderEditor, startEdit, isEditMode, isCellSelected, activeCell, renderMarkdownContent, handleCellClick]);

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Paper
        elevation={0}
        sx={{ width: '100%', overflow: 'hidden' }}
        className="academic-table"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={tableContainerRef}
      >
      {/* 工具栏 */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'transparent'
      }} className="react-table-toolbar">
        
        {/* 主要工具栏 */}
        <Box sx={{
          p: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}>
          <Tooltip title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
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
              {/* 添加操作组 */}
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

              {/* 分隔线 */}
              <Box sx={{ width: '1px', height: '20px', backgroundColor: '#e0e0e0', mx: 1 }} />

              {/* 列管理组 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>列:</span>
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

              {/* 分隔线 */}
              <Box sx={{ width: '1px', height: '20px', backgroundColor: '#e0e0e0', mx: 1 }} />

              {/* 排序控制组 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>排序:</span>
                {sortConfig.orderBy && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {sortConfig.orderBy}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#1976d2' }}>
                      {sortConfig.order === 'asc' ? '↑' : '↓'}
                    </span>
                    <Tooltip title="Clear Sort">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSortConfig({ order: 'asc', orderBy: '' });
                        }}
                        sx={{ p: 0.25 }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {!sortConfig.orderBy && (
                  <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                    点击表头排序
                  </span>
                )}
              </Box>
            </>
          )}

          {/* 右侧信息区 */}
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

        {/* 选择操作栏 - 仅在有选中内容时显示 */}
        {isEditMode && selectedRows.length > 0 && (
          <Box sx={{
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: alpha('#1976d2', 0.04),
            borderTop: '1px solid #e0e0e0'
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
                    // 🚀 修复：一次性构建最终数据，避免多次状态更新
                    const newData = {
                      headers: [...data.headers],
                      rows: data.rows.map(row => [...row])
                    };
                    
                    // 从大到小删除，避免索引变化问题
                    const sortedIndices = [...selectedRows].sort((a, b) => b - a);
                    sortedIndices.forEach(index => {
                      newData.rows.splice(index, 1);
                    });
                    
                    // 用最终结果进行唯一一次的状态更新和同步
                    updateDataAndSync(newData);
                    
                    // 清空选择状态
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

      {/* 表格 */}
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'hidden', // 不允许横向溢出
          overflowY: 'visible', // 纵向不限制
          maxWidth: '100%', // 确保容器不会超出父元素
          display: 'block' // 确保是块级元素
        }}
        className="uniform-scroller"
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            width: '100%', // 表格占满容器宽度
            tableLayout: 'fixed', // 固定表格布局，允许单元格换行
            '& .MuiTableCell-root': {
              wordWrap: 'break-word', // 允许单词断行
              wordBreak: 'break-word', // 在必要时断开单词
              overflowWrap: 'break-word', // 确保长单词能够换行
              whiteSpace: 'normal', // 允许正常换行
              verticalAlign: 'top' // 垂直对齐到顶部
            }
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
              {/* 🚀 新增：拖拽手柄和复选框列 */}
              {isEditMode && (
                <TableCell padding="checkbox" sx={{ width: 80 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox
                      color="primary"
                      indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
                      checked={data.rows.length > 0 && selectedRows.length === data.rows.length}
                      onChange={handleSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all rows',
                      }}
                    />
                    <DragIndicatorIcon 
                      fontSize="small" 
                      sx={{ opacity: 0.5, cursor: 'default' }}
                    />
                  </Box>
                </TableCell>
              )}

              {data.headers.map((header, colIndex) => (
                <TableCell key={colIndex} sx={{
                  width: `${100 / data.headers.length}%`, // 平均分配列宽
                  minWidth: 0, // 允许缩小到内容大小
                  maxWidth: `${100 / data.headers.length}%`, // 限制最大宽度
                  padding: '4px 8px',
                  '& > *': {
                    width: '100%',
                    maxWidth: '100%'
                  }
                }}>
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
                      width: '100%',
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
                        alignItems: 'flex-start', // 顶部对齐
                        minHeight: '32px',
                        cursor: isEditMode ? 'text' : 'default',
                        padding: '6px 8px',
                        width: '100%',
                        wordBreak: 'break-word', // 允许换行
                        whiteSpace: 'normal', // 允许正常换行
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
                        <span style={{ 
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          display: 'block',
                          width: '100%'
                        }}>
                          {header || `Header ${colIndex + 1}`}
                        </span>
                      )}
                    </Box>
                    {isEditMode && sortConfig.orderBy === header ? (
                      <Box component="span" sx={visuallyHidden}>
                        {sortConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <SortableContext
              items={sortedRows.map((_, index) => `row-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              {sortedRows.map((row, rowIndex) => {
                // 🚀 修复：排序后直接使用rowIndex，因为数据已经真正排序
                const isRowSelectedValue = isRowSelected(rowIndex);
                const rowId = `row-${rowIndex}`;

                // 🚀 Part 3: 在编辑模式下使用可拖拽行，否则使用普通行
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
                    />
                  );
                } else {
                  // 普通模式下的静态行
                  return (
                    <TableRow
                      key={rowId}
                      hover
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: '#fafafa'
                        },
                        '&:hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                    >
                      {row.map((cell, colIndex) => (
                        <TableCell
                          key={colIndex}
                          sx={{
                            width: `${100 / data.headers.length}%`, // 平均分配列宽
                            minWidth: 0, // 允许缩小
                            maxWidth: `${100 / data.headers.length}%`, // 限制最大宽度
                            padding: 0,
                            '& > *': {
                              width: '100%',
                              maxWidth: '100%'
                            }
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

