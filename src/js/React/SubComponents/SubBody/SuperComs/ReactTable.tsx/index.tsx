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
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { getTableData, tableSyncManager } from '@App/text/tableEditor';
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

const ReactTable: React.FC<ReactTableProps> = React.memo(({ tableId, tableData: propTableData }) => {
  // 状态管理
  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // 默认示例数据（用于后备）
  const defaultTableData: TableData = useMemo(() => ({
    headers: ['Name', 'Age', 'City', 'Email'],
    rows: [
      ['John Doe', '25', 'New York', 'john@example.com'],
      ['Jane Smith', '30', 'London', 'jane@example.com'],
      ['Bob Johnson', '35', 'Tokyo', 'bob@example.com'],
      ['Alice Brown', '28', 'Paris', 'alice@example.com']
    ]
  }), []);

  // 🚀 新的同步机制：使用TableSyncManager进行双向数据绑定
  const updateDataAndSync = useCallback((newData: TableData) => {
    // 1. 更新本地状态
    setData(newData);
    
    // 2. 如果有tableId，通过同步管理器触发Monaco更新
    if (tableId) {
      tableSyncManager.notifyTableDataChange(tableId, newData, 'react');
    }
  }, [tableId]);

  // Monaco → React 数据同步监听器
  useEffect(() => {
    if (!tableId) return;

    const handleMonacoDataChange = (newData: TableData) => {
      console.log(`ReactTable收到Monaco数据更新 - tableId: ${tableId}`);
      const dataChanged = JSON.stringify(data) !== JSON.stringify(newData);
      if (dataChanged) {
        setData(newData);
      }
    };

    // 注册监听器
    tableSyncManager.addTableListener(tableId, handleMonacoDataChange);

    return () => {
      // 清理监听器
      tableSyncManager.removeTableListener(tableId, handleMonacoDataChange);
    };
  }, [tableId, data]);

  // 初始化数据
  useEffect(() => {
    let initialData: TableData;
    
    if (tableId) {
      // 尝试从registry获取真实表格数据
      const registeredData = getTableData(tableId);
      initialData = registeredData || defaultTableData;
      console.log(`ReactTable初始化 - tableId: ${tableId}, 找到数据:`, !!registeredData, 'headers:', registeredData?.headers?.length || 0, 'rows:', registeredData?.rows?.length || 0);
    } else {
      // 使用props传入的数据或默认数据
      initialData = propTableData || defaultTableData;
      console.log('ReactTable初始化 - 使用props或默认数据');
    }
    
    // 检查数据是否真的发生了变化，避免不必要的重新渲染
    const dataChanged = JSON.stringify(data) !== JSON.stringify(initialData);
    if (dataChanged) {
      console.log(`ReactTable数据变化 - tableId: ${tableId}`, {
        oldData: { headers: data.headers.length, rows: data.rows.length },
        newData: { headers: initialData.headers.length, rows: initialData.rows.length }
      });
      setData(initialData);
    }
  }, [tableId, propTableData, defaultTableData]); // 移除data依赖，避免循环更新

  // 开始编辑单元格
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
          tableSyncManager.notifyTableDataChange(tableId, newData, 'react');
        }, 0);
      }
      
      return newData;
    });

    setEditingCell(null);
  }, [editingCell, tableId]);

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

  // 渲染编辑器
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
        minWidth: '100px',
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem'
        }
      }}
    />
  ), [editingCell, commitEdit, cancelEdit]);

  // 渲染单元格内容，空字符串显示为不间断空格
  const renderCellContent = useCallback((
    value: string, 
    rowIndex: number, 
    colIndex: number, 
    isHeader: boolean = false
  ) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
    
    if (isEditing) {
      return renderEditor(value);
    }

    // 空字符串显示为不间断空格
    const displayValue = value === '' ? '\u00A0' : value;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '32px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isHeader ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.02)'
          }
        }}
        onDoubleClick={() => startEdit(rowIndex, colIndex)}
      >
        <span>{displayValue || (isHeader ? `Header ${colIndex + 1}` : '')}</span>
        {isEditMode && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(rowIndex, colIndex);
            }}
            sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    );
  }, [editingCell, renderEditor, startEdit, isEditMode]);

  if (!data || (!data.headers.length && !data.rows.length)) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        Empty table - {tableId ? `Table ID: ${tableId}` : 'No data'}
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }} className="academic-table">
      {/* 工具栏 */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, borderBottom: '1px solid #e0e0e0' }} className="react-table-toolbar">
        <Tooltip title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
          <IconButton 
            size="small" 
            onClick={() => setIsEditMode(!isEditMode)}
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
          </>
        )}
        
        {tableId && (
          <Box sx={{ ml: 'auto', fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
            Table ID: {tableId}
          </Box>
        )}
      </Box>

      {/* 表格 */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table size="small" stickyHeader>
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
              {data.headers.map((header, colIndex) => (
                <TableCell key={colIndex} sx={{ minWidth: 120 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {renderCellContent(header, -1, colIndex, true)}
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
                <TableCell sx={{ width: 50 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
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
                  <TableCell key={colIndex} sx={{ minWidth: 120 }}>
                    {renderCellContent(cell, rowIndex, colIndex)}
                  </TableCell>
                ))}
                
                {isEditMode && (
                  <TableCell>
                    <Tooltip title="Delete Row">
                      <IconButton
                        size="small"
                        onClick={() => deleteRow(rowIndex)}
                        color="error"
                        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
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
    console.log('=== TableManager.mountTables() 开始 ===');
    
    // 查找当前所有表格占位符
    const placeholders = document.querySelectorAll('[data-react-table]') as NodeListOf<HTMLElement>;
    const currentTableIds = new Set<string>();
    
    console.log(`发现 ${placeholders.length} 个表格占位符`);
    
    // 处理每个占位符
    placeholders.forEach((placeholder, index) => {
      const tableId = placeholder.getAttribute('data-table-id');
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
      
      console.log(`表格 ${tableId}:`, {
        domHash: domTableHash,
        registryHash: currentTableHash,
        lastHash: lastHash,
        hasExistingRoot: !!existingRoot,
        hasContent: hasContent,
        needsUpdate: currentTableHash !== lastHash || !hasContent
      });
      
      // 如果没有找到注册表数据，跳过此表格
      if (!currentTableHash) {
        console.warn(`表格 ${tableId} 在注册表中未找到，跳过处理`);
        return;
      }
      
      // 关键优化：使用注册表中的哈希进行比较
      if (existingRoot && currentTableHash === lastHash && hasContent) {
        console.log(`表格 ${tableId} 内容未变且DOM完整，跳过更新`);
        return;
      }
      
      // 如果有根节点但内容被清空了，或者哈希变化了，需要重新渲染
      if (existingRoot && (!hasContent || currentTableHash !== lastHash)) {
        console.log(`表格 ${tableId} 需要更新 - DOM清空: ${!hasContent}, 哈希变化: ${currentTableHash !== lastHash}`);
        this.updateTable(tableId, currentTableHash);
        return;
      }
      
      // 如果需要创建新的根节点
      if (!existingRoot) {
        console.log(`为表格 ${tableId} 创建新的 React 根节点`);
        this.createTableRoot(placeholder, tableId, currentTableHash);
      }
    });
    
    // 清理不再存在的表格
    this.cleanupUnusedRoots(currentTableIds);
    
    console.log('=== TableManager.mountTables() 完成 ===');
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
        
        console.log(`成功挂载表格 ${tableId}`);
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
        console.log(`成功更新表格 ${tableId}, 新hash: ${tableHash}`);
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
        console.log(`清理不再存在的表格 ${tableId}`);
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
      console.log(`清理了 ${toDelete.length} 个废弃表格`);
    }
  }

  // 强制重新挂载所有表格（用于特殊情况）
  forceRemountAllTables() {
    console.log('强制重新挂载所有表格');
    this.unmountAllTables();
    this.mountTables();
  }

  // 卸载所有表格
  unmountAllTables() {
    console.log('卸载所有表格根节点');
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

// 开发者调试工具（仅在开发环境中添加到全局）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).TableManagerDebug = {
    getInstance: () => TableManager.getInstance(),
    getDebugInfo: () => TableManager.getInstance().getDebugInfo(),
    forceRemount: () => TableManager.getInstance().forceRemountAllTables(),
    unmountAll: () => TableManager.getInstance().unmountAllTables(),
    syncManager: tableSyncManager
  };
}