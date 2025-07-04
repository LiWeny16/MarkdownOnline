import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/js/React/SubComponents/SubBody/SuperComs/ReactTable.tsx/index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Tooltip, Box, TableSortLabel, Checkbox, alpha } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon, HelpOutline as HelpIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { StandardTableAPI } from '@Func/Parser/mdItPlugin/table';
import { getTableData, tableSyncManager, getStandardTableData, standardTableSyncManager } from '@App/text/tableEditor';
import { getTableMetadata } from '@App/text/tableEditor';
const ReactTable = React.memo(({ tableId, tableData: propTableData }) => {
    // 状态管理
    const [data, setData] = useState({ headers: [], rows: [] });
    const [editingCell, setEditingCell] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    // 🚀 新增：标准化数据状态
    const [standardData, setStandardData] = useState(null);
    // 🚀 新增：排序状态
    const [sortConfig, setSortConfig] = useState({ order: 'asc', orderBy: '' });
    // 🚀 新增：多选状态
    const [selectedCells, setSelectedCells] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // 🚀 排序比较函数
    const descendingComparator = useCallback((a, b, orderBy) => {
        const colIndex = data.headers.indexOf(orderBy);
        if (colIndex === -1)
            return 0;
        const aVal = a[colIndex] || '';
        const bVal = b[colIndex] || '';
        // 尝试数字比较
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum;
        }
        // 字符串比较
        if (bVal < aVal)
            return -1;
        if (bVal > aVal)
            return 1;
        return 0;
    }, [data.headers]);
    const getComparator = useCallback((order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }, [descendingComparator]);
    // 🚀 获取排序后的数据 - 现在直接使用data.rows，因为排序已经影响了底层数据
    const sortedRows = useMemo(() => {
        return data.rows; // 直接使用data.rows，因为排序已经真正改变了数据
    }, [data.rows]);
    // 🚀 多选处理
    const handleSelectAllClick = useCallback((event) => {
        if (event.target.checked) {
            const newSelected = data.rows.map((_, index) => index);
            setSelectedRows(newSelected);
            setLastSelectedIndex(newSelected.length > 0 ? newSelected[newSelected.length - 1] : null);
        }
        else {
            setSelectedRows([]);
            setLastSelectedIndex(null);
        }
    }, [data.rows]);
    // 🚀 增强多选处理：支持 Ctrl、Shift 键
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    const handleRowClick = useCallback((event, rowIndex) => {
        if (event.ctrlKey || event.metaKey) {
            // Ctrl/Cmd点击：切换选择
            const selectedIndex = selectedRows.indexOf(rowIndex);
            let newSelected = [];
            if (selectedIndex === -1) {
                // 🚀 修复：避免重复添加
                newSelected = [...selectedRows, rowIndex];
            }
            else if (selectedIndex === 0) {
                newSelected = selectedRows.slice(1);
            }
            else if (selectedIndex === selectedRows.length - 1) {
                newSelected = selectedRows.slice(0, -1);
            }
            else if (selectedIndex > 0) {
                newSelected = [
                    ...selectedRows.slice(0, selectedIndex),
                    ...selectedRows.slice(selectedIndex + 1)
                ];
            }
            // 🚀 确保没有重复项
            newSelected = Array.from(new Set(newSelected));
            setSelectedRows(newSelected);
            setLastSelectedIndex(rowIndex);
        }
        else if (event.shiftKey && lastSelectedIndex !== null) {
            // Shift点击：范围选择
            const start = Math.min(lastSelectedIndex, rowIndex);
            const end = Math.max(lastSelectedIndex, rowIndex);
            const rangeSelected = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            // 🚀 修复：合并现有选择和范围选择，确保没有重复
            const newSelected = Array.from(new Set([...selectedRows, ...rangeSelected])).sort((a, b) => a - b);
            setSelectedRows(newSelected);
        }
        else {
            // 普通点击：单选
            setSelectedRows([rowIndex]);
            setLastSelectedIndex(rowIndex);
        }
    }, [selectedRows, lastSelectedIndex]);
    const isCellSelected = useCallback((rowIndex, colIndex) => {
        return selectedCells.some(cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
    }, [selectedCells]);
    const isRowSelected = useCallback((rowIndex) => {
        return selectedRows.includes(rowIndex);
    }, [selectedRows]);
    // 默认示例数据（用于后备）
    const defaultTableData = useMemo(() => ({
        headers: ['Name', 'Age', 'City', 'Email'],
        rows: [
            ['John Doe', '25', 'New York', 'john@example.com'],
            ['Alice Brown', '28', 'Paris', 'alice@example.com']
        ]
    }), []);
    // 🚀 新的基于标准化数据的同步机制
    const updateStandardDataAndSync = useCallback((newData) => {
        // 1. 更新本地状态
        setData(newData);
        // 2. 如果有tableId，通过标准化同步管理器触发Monaco更新
        if (tableId) {
            standardTableSyncManager.notifyStandardDataChange(tableId, newData, 'react');
        }
    }, [tableId]);
    // 保持向后兼容的同步机制
    const updateDataAndSync = useCallback((newData) => {
        // 优先使用标准化数据同步
        if (tableId && StandardTableAPI.getStandardData(tableId)) {
            updateStandardDataAndSync(newData);
        }
        else {
            // 回退到传统同步机制
            setData(newData);
            if (tableId) {
                tableSyncManager.notifyTableDataChange(tableId, newData, 'react');
            }
        }
    }, [tableId, updateStandardDataAndSync]);
    // 🚀 标准化数据监听器（Monaco → React）
    useEffect(() => {
        if (!tableId)
            return;
        const handleStandardDataChange = (newStandardData) => {
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
        if (!tableId)
            return;
        const handleMonacoDataChange = (newData) => {
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
        let initialData;
        let initialStandardData = null;
        if (tableId) {
            // 🚀 优先尝试获取标准化数据
            initialStandardData = getStandardTableData(tableId);
            if (initialStandardData) {
                initialData = StandardTableAPI.standardToTable(initialStandardData);
            }
            else {
                // 回退到传统方式
                const registeredData = getTableData(tableId);
                initialData = registeredData || defaultTableData;
            }
        }
        else {
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
    const startEdit = useCallback((rowIndex, colIndex) => {
        const isHeader = rowIndex === -1;
        const value = isHeader
            ? data.headers[colIndex] || ''
            : data.rows[rowIndex]?.[colIndex] || '';
        setEditingCell({ rowIndex, colIndex, value });
    }, [data]);
    // 提交编辑
    const commitEdit = useCallback(() => {
        if (!editingCell)
            return;
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
            }
            else {
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
    const deleteRow = useCallback((rowIndex) => {
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
    const deleteColumn = useCallback((colIndex) => {
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
    const handleKeyDown = useCallback((event) => {
        if (!isEditMode || editingCell)
            return;
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
            let targetIndex;
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
            }
            else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            if (event.shiftKey) {
                // Shift+方向键：扩展选择
                const start = Math.min(lastSelectedIndex || currentIndex, targetIndex);
                const end = Math.max(lastSelectedIndex || currentIndex, targetIndex);
                const rangeSelected = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                setSelectedRows(rangeSelected);
            }
            else {
                // 普通方向键：移动选择
                setSelectedRows([targetIndex]);
                setLastSelectedIndex(targetIndex);
            }
            return;
        }
    }, [isEditMode, editingCell, data, selectedRows, lastSelectedIndex, updateDataAndSync]);
    // 🚀 排序处理 - 修改为真正影响底层数据，并清空选中状态
    const handleRequestSort = useCallback((property) => {
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
    const renderEditor = useCallback((currentValue) => (_jsx(TextField, { value: editingCell?.value || '', onChange: (e) => setEditingCell(prev => prev ? { ...prev, value: e.target.value } : null), onKeyDown: (e) => {
            if (e.key === 'Enter') {
                commitEdit();
            }
            else if (e.key === 'Escape') {
                cancelEdit();
            }
        }, onBlur: commitEdit, autoFocus: true, size: "small", variant: "outlined", sx: {
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
        } })), [editingCell, commitEdit, cancelEdit]);
    // 渲染单元格内容，空字符串显示为不间断空格，单击编辑
    const renderCellContent = useCallback((value, rowIndex, colIndex, isHeader = false) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
        // 空字符串显示为不间断空格
        const displayValue = value === '' ? '\u00A0' : value;
        return (_jsx(Box, { sx: {
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
            }, onClick: () => {
                if (isEditMode && !isHeader) {
                    startEdit(rowIndex, colIndex);
                }
            }, children: isEditing ? (renderEditor(value)) : (_jsx("span", { children: displayValue || (isHeader ? `Header ${colIndex + 1}` : '') })) }));
    }, [editingCell, renderEditor, startEdit, isEditMode]);
    if (!data || (!data.headers.length && !data.rows.length)) {
        return (_jsxs(Paper, { sx: { p: 2, textAlign: 'center', color: 'text.secondary' }, children: ["Empty table - ", tableId ? `Table ID: ${tableId}` : 'No data', standardData && (_jsxs("div", { style: { fontSize: '0.75rem', marginTop: '4px', color: '#666' }, children: ["Columns: ", standardData.schema.columnCount, " | Rows: ", standardData.schema.rowCount] }))] }));
    }
    return (_jsxs(Paper, { elevation: 0, sx: { width: '100%', overflow: 'hidden' }, className: "academic-table", tabIndex: 0, onKeyDown: handleKeyDown, children: [_jsxs(Box, { sx: {
                    p: 1,
                    display: 'flex',
                    gap: 1,
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: 'transparent'
                }, className: "react-table-toolbar", children: [_jsx(Tooltip, { title: isEditMode ? "Exit Edit Mode (多选：Ctrl+点击, Shift+点击范围选择)" : "Enter Edit Mode", children: _jsx(IconButton, { size: "small", onClick: () => {
                                setIsEditMode(!isEditMode);
                                // 🚀 退出编辑模式时清除选择
                                if (isEditMode) {
                                    setSelectedRows([]);
                                    setSelectedCells([]);
                                    setLastSelectedIndex(null);
                                }
                            }, color: isEditMode ? "primary" : "default", children: _jsx(EditIcon, {}) }) }), isEditMode && (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Add Row", children: _jsx(IconButton, { size: "small", onClick: addRow, children: _jsx(AddIcon, {}) }) }), _jsx(Tooltip, { title: "Add Column", children: _jsx(IconButton, { size: "small", onClick: addColumn, children: _jsx(AddIcon, { sx: { transform: 'rotate(90deg)' } }) }) }), selectedRows.length > 0 && (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { display: 'flex', alignItems: 'center', ml: 1, mr: 1 }, children: _jsxs("span", { style: { fontWeight: 500, color: '#1976d2', fontSize: '0.875rem' }, children: [selectedRows.length, " row", selectedRows.length > 1 ? 's' : '', " selected"] }) }), _jsx(Tooltip, { title: "Delete Selected Rows", children: _jsx(IconButton, { size: "small", onClick: () => {
                                                // 从大到小删除，避免索引变化问题
                                                const sortedIndices = [...selectedRows].sort((a, b) => b - a);
                                                sortedIndices.forEach(index => deleteRow(index));
                                                setSelectedRows([]);
                                                setLastSelectedIndex(null);
                                            }, color: "error", children: _jsx(DeleteIcon, {}) }) })] })), _jsx(Tooltip, { title: _jsxs(Box, { sx: { fontSize: '0.75rem', lineHeight: 1.2 }, children: [_jsx("div", { children: "\u5FEB\u6377\u952E:" }), _jsx("div", { children: "\u2022 Ctrl+A: \u5168\u9009" }), _jsx("div", { children: "\u2022 Ctrl+D: \u53D6\u6D88\u9009\u62E9" }), _jsx("div", { children: "\u2022 Delete: \u5220\u9664\u9009\u4E2D\u884C" }), _jsx("div", { children: "\u2022 Ctrl+\u70B9\u51FB: \u591A\u9009" }), _jsx("div", { children: "\u2022 Shift+\u70B9\u51FB: \u8303\u56F4\u9009\u62E9" }), _jsx("div", { children: "\u2022 \u65B9\u5411\u952E: \u79FB\u52A8\u9009\u62E9" }), _jsx("div", { children: "\u2022 Shift+\u65B9\u5411\u952E: \u6269\u5C55\u9009\u62E9" })] }), children: _jsx(IconButton, { size: "small", sx: { ml: 'auto' }, children: _jsx(HelpIcon, { fontSize: "small" }) }) })] })), tableId && (_jsxs(Box, { sx: { ml: isEditMode ? 1 : 'auto', fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center' }, children: ["Table ID: ", tableId, standardData && (_jsxs("span", { style: { marginLeft: '8px' }, children: [standardData.schema.columnCount, "\u00D7", standardData.schema.rowCount] }))] }))] }), _jsx(TableContainer, { sx: {
                    width: '100%',
                    overflowX: 'auto', // 横向滚动
                    overflowY: 'visible', // 纵向不限制
                    maxWidth: '100%' // 确保容器不会超出父元素
                }, className: "uniform-scroller", children: _jsxs(Table, { size: "small", stickyHeader: true, sx: {
                        minWidth: 'max-content',
                        width: 'auto', // 让表格宽度自适应内容
                        tableLayout: 'fix' // 自动表格布局
                    }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: {
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
                                }, children: [isEditMode && (_jsx(TableCell, { padding: "checkbox", sx: { width: 48 }, children: _jsx(Checkbox, { color: "primary", indeterminate: selectedRows.length > 0 && selectedRows.length < data.rows.length, checked: data.rows.length > 0 && selectedRows.length === data.rows.length, onChange: handleSelectAllClick, inputProps: {
                                                'aria-label': 'select all rows',
                                            } }) })), data.headers.map((header, colIndex) => (_jsx(TableCell, { sx: {
                                            minWidth: 120,
                                            whiteSpace: 'nowrap' // 防止表头换行
                                        }, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(TableSortLabel, { active: isEditMode && sortConfig.orderBy === header, direction: sortConfig.orderBy === header ? sortConfig.order : 'asc', onClick: () => {
                                                        if (isEditMode) {
                                                            handleRequestSort(header);
                                                        }
                                                    }, disabled: !isEditMode, sx: {
                                                        flex: 1,
                                                        '& .MuiTableSortLabel-root': {
                                                            flexDirection: 'row'
                                                        },
                                                        '&.Mui-disabled': {
                                                            opacity: 1,
                                                            color: 'inherit'
                                                        }
                                                    }, children: [_jsx(Box, { sx: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                minHeight: '32px',
                                                                cursor: isEditMode ? 'text' : 'default',
                                                                padding: '6px 8px',
                                                                width: '100%',
                                                                '&:hover': {
                                                                    backgroundColor: isEditMode ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                                                                }
                                                            }, onClick: (e) => {
                                                                if (isEditMode) {
                                                                    e.stopPropagation(); // 阻止排序
                                                                    startEdit(-1, colIndex);
                                                                }
                                                            }, children: editingCell?.rowIndex === -1 && editingCell?.colIndex === colIndex ? (renderEditor(header)) : (_jsx("span", { children: header || `Header ${colIndex + 1}` })) }), isEditMode && sortConfig.orderBy === header ? (_jsx(Box, { component: "span", sx: visuallyHidden, children: sortConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending' })) : null] }), isEditMode && data.headers.length > 1 && (_jsx(Tooltip, { title: "Delete Column", children: _jsx(IconButton, { size: "small", onClick: () => deleteColumn(colIndex), color: "error", sx: { opacity: 0.6, '&:hover': { opacity: 1 }, ml: 1 }, children: _jsx(DeleteIcon, { fontSize: "inherit" }) }) }))] }) }, colIndex))), isEditMode && (_jsx(TableCell, { sx: { width: 80 }, children: "Actions" }))] }) }), _jsx(TableBody, { children: sortedRows.map((row, rowIndex) => {
                                // 🚀 修复：排序后直接使用rowIndex，因为数据已经真正排序
                                const isRowSelectedValue = isRowSelected(rowIndex);
                                return (_jsxs(TableRow, { hover: true, role: isEditMode ? "checkbox" : undefined, "aria-checked": isEditMode ? isRowSelectedValue : undefined, tabIndex: -1, selected: isEditMode ? isRowSelectedValue : false, sx: {
                                        '&:nth-of-type(even)': {
                                            backgroundColor: '#fafafa'
                                        },
                                        '&:hover': {
                                            backgroundColor: isEditMode ? alpha('#1976d2', 0.08) : '#f0f0f0'
                                        },
                                        cursor: isEditMode ? 'pointer' : 'default'
                                    }, onClick: (event) => {
                                        if (isEditMode) {
                                            // 🚀 确保传递完整的事件对象，包含键盘修饰键信息
                                            handleRowClick(event, rowIndex);
                                        }
                                    }, children: [isEditMode && (_jsx(TableCell, { padding: "checkbox", children: _jsx(Checkbox, { color: "primary", checked: isRowSelectedValue, onChange: (event) => {
                                                    event.stopPropagation();
                                                    // 🚀 修复：复选框点击应该支持多选逻辑
                                                    if (isRowSelectedValue) {
                                                        // 取消选择：从选中列表中移除
                                                        setSelectedRows(prev => prev.filter(index => index !== rowIndex));
                                                        // 如果取消选择的是最后选择的行，重置lastSelectedIndex
                                                        if (lastSelectedIndex === rowIndex) {
                                                            setLastSelectedIndex(null);
                                                        }
                                                    }
                                                    else {
                                                        // 添加选择：添加到选中列表，避免重复
                                                        setSelectedRows(prev => {
                                                            if (prev.includes(rowIndex)) {
                                                                return prev; // 如果已经存在，不重复添加
                                                            }
                                                            return [...prev, rowIndex];
                                                        });
                                                        setLastSelectedIndex(rowIndex);
                                                    }
                                                }, inputProps: {
                                                    'aria-labelledby': `enhanced-table-checkbox-${rowIndex}`,
                                                } }) })), row.map((cell, colIndex) => (_jsx(TableCell, { sx: {
                                                minWidth: 120,
                                                padding: 0,
                                                whiteSpace: 'nowrap', // 防止单元格内容换行
                                                '&:hover': {
                                                    backgroundColor: isEditMode ? alpha('#1976d2', 0.04) : 'transparent'
                                                }
                                            }, onClick: (event) => {
                                                if (isEditMode) {
                                                    event.stopPropagation(); // 阻止行选择
                                                }
                                            }, children: renderCellContent(cell, rowIndex, colIndex) }, colIndex))), isEditMode && (_jsx(TableCell, { children: _jsx(Tooltip, { title: "Delete Row", children: _jsx(IconButton, { size: "small", onClick: (event) => {
                                                        event.stopPropagation();
                                                        deleteRow(rowIndex);
                                                    }, color: "error", sx: { opacity: 0.6, '&:hover': { opacity: 1 } }, children: _jsx(DeleteIcon, { fontSize: "inherit" }) }) }) }))] }, `row-${rowIndex}-${JSON.stringify(row).slice(0, 20)}`));
                            }) })] }) })] }));
}, (prevProps, nextProps) => {
    // 自定义比较函数，优化性能
    if (prevProps.tableId !== nextProps.tableId)
        return false;
    return JSON.stringify(prevProps.tableData) === JSON.stringify(nextProps.tableData);
});
// 表格管理器 - 智能避免闪烁版本
class TableManager {
    constructor() {
        Object.defineProperty(this, "mountedRoots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // 使用tableId作为key
        Object.defineProperty(this, "lastTableStates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // 保存每个表格的最后状态hash
    }
    static getInstance() {
        if (!TableManager.instance) {
            TableManager.instance = new TableManager();
        }
        return TableManager.instance;
    }
    // 智能挂载：避免不必要的DOM重建
    mountTables() {
        // 查找当前所有表格占位符
        const placeholders = document.querySelectorAll('[data-react-table]');
        const currentTableIds = new Set();
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
    createTableRoot(placeholder, tableId, tableHash) {
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
        }
        catch (e) {
            console.error(`为表格 ${tableId} 创建根节点时发生错误:`, e);
        }
    }
    // 更新现有表格（不重建根节点）
    updateTable(tableId, tableHash) {
        const root = this.mountedRoots.get(tableId);
        if (root && tableHash) {
            try {
                // 使用tableHash作为key，确保React能检测到变化
                root.render(React.createElement(ReactTable, {
                    tableId,
                    key: `${tableId}-${tableHash}` // 使用hash确保props变化时重新渲染
                }));
                this.lastTableStates.set(tableId, tableHash);
            }
            catch (e) {
                console.error(`更新表格 ${tableId} 失败:`, e);
            }
        }
    }
    // 清理不再存在的表格根节点
    cleanupUnusedRoots(currentTableIds) {
        const toDelete = [];
        this.mountedRoots.forEach((root, tableId) => {
            if (!currentTableIds.has(tableId)) {
                try {
                    root.unmount();
                    toDelete.push(tableId);
                }
                catch (e) {
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
            }
            catch (e) {
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
            syncListenersCount: tableSyncManager.syncListeners?.size || 0
        };
    }
}
export { ReactTable, TableManager };
export default ReactTable;
