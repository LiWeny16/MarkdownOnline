import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/js/React/SubComponents/SubBody/SuperComs/ReactTable.tsx/index.tsx
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Tooltip, Box, TableSortLabel, Checkbox, alpha } from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon, HelpOutline as HelpIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import MarkdownIt from 'markdown-it';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { visuallyHidden } from '@mui/utils';
// 🚀 自定义拖拽修饰器：限制垂直拖拽
const restrictToVerticalAxis = ({ transform }) => {
    return {
        ...transform,
        x: 0, // 禁止水平移动
    };
};
import { StandardTableAPI } from '@Func/Parser/mdItPlugin/table';
import { getTableData, tableSyncManager, getStandardTableData, standardTableSyncManager } from '@App/text/tableEditor';
import { getTableMetadata } from '@App/text/tableEditor';
import { getTheme } from '@App/config/change';
import markdownItLatex from '@Func/Parser/mdItPlugin/latex';
// 🚀 主题样式函数
const getTableThemeStyles = () => {
    const isDark = getTheme() === 'dark';
    return {
        // 表格容器样式
        paperBackground: isDark ? '#1e1e1e' : '#ffffff',
        paperBorder: isDark ? '1px solid #808080' : 'none',
        // 表格单元格样式
        cellBackground: isDark ? '#1e1e1e' : '#ffffff',
        cellHoverBackground: isDark ? '#2d2d30' : '#f5f5f5',
        cellSelectedBackground: isDark ? alpha('#569cd6', 0.2) : alpha('#1976d2', 0.12),
        cellActiveBackground: isDark ? alpha('#569cd6', 0.15) : alpha('#1976d2', 0.08),
        cellBorder: isDark ? '#3e3e42' : '#e0e0e0',
        cellText: isDark ? '#d8d8d8ff' : '#000000',
        // 表头样式
        headerBackground: isDark ? '#1e1e1e' : '#f5f5f5',
        headerText: isDark ? '#cdcdcdff' : '#000000',
        headerHoverBackground: isDark ? '#2d2d30' : '#eeeeee',
        // 工具栏样式
        toolbarBackground: isDark ? '#1e1e1e' : 'transparent',
        toolbarBorder: isDark ? '#808080' : '#e0e0e0',
        // 按钮样式
        buttonColor: isDark ? '#cccccc' : '#1976d2',
        buttonHoverBackground: isDark ? '#2d2d30' : alpha('#1976d2', 0.04),
        // 编辑器样式
        editorBackground: isDark ? '#1e1e1e' : '#ffffff',
        editorBorder: isDark ? '1px solid #569cd6' : '1px solid #1976d2',
        editorFocusBorder: isDark ? '2px solid #569cd6' : '2px solid #1976d2',
        // 选中行样式
        selectedRowBackground: isDark ? alpha('#569cd6', 0.2) : alpha('#1976d2', 0.08),
        selectedRowHoverBackground: isDark ? alpha('#569cd6', 0.25) : alpha('#1976d2', 0.12),
    };
};
const DraggableTableRow = ({ rowId, rowIndex, row, isEditMode, isSelected, lastSelectedIndex, editingCell, onRowClick, renderCellContent, setSelectedRows, setLastSelectedIndex, totalColumns, themeStyles }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: rowId });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };
    return (_jsxs(TableRow, { ref: setNodeRef, style: style, hover: true, role: isEditMode ? "checkbox" : undefined, "aria-checked": isEditMode ? isSelected : undefined, tabIndex: -1, selected: isEditMode ? isSelected : false, sx: {
            '&:nth-of-type(even)': {
                backgroundColor: isDragging ? themeStyles.cellHoverBackground : themeStyles.cellBackground
            },
            '&:hover': {
                backgroundColor: isEditMode ? alpha('#1976d2', 0.08) : themeStyles.cellHoverBackground
            },
            cursor: isEditMode ? 'pointer' : 'default'
        }, onClick: (event) => {
            if (isEditMode) {
                onRowClick(event, rowIndex);
            }
        }, children: [isEditMode && (_jsx(TableCell, { padding: "checkbox", children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Checkbox, { color: "primary", checked: isSelected, onChange: (event) => {
                                event.stopPropagation();
                                if (isSelected) {
                                    setSelectedRows(prev => prev.filter(index => index !== rowIndex));
                                    if (lastSelectedIndex === rowIndex) {
                                        setLastSelectedIndex(null);
                                    }
                                }
                                else {
                                    setSelectedRows(prev => {
                                        if (prev.includes(rowIndex)) {
                                            return prev;
                                        }
                                        return [...prev, rowIndex];
                                    });
                                    setLastSelectedIndex(rowIndex);
                                }
                            }, inputProps: {
                                'aria-labelledby': `enhanced-table-checkbox-${rowIndex}`,
                            } }), _jsx(IconButton, { size: "small", ...attributes, ...listeners, sx: {
                                cursor: 'grab',
                                opacity: 0.6,
                                '&:hover': { opacity: 1 },
                                '&:active': { cursor: 'grabbing' },
                                touchAction: 'none' // 🚀 确保触摸设备也能拖拽
                            }, children: _jsx(DragIndicatorIcon, { fontSize: "small" }) })] }) })), row.map((cell, colIndex) => (_jsx(TableCell, { sx: {
                    width: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`, // 只考虑拖拽列，没有Actions列
                    minWidth: 0, // 允许缩小
                    maxWidth: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`, // 限制最大宽度
                    padding: 0,
                    '& > *': {
                        width: '100%',
                        maxWidth: '100%'
                    }
                }, onClick: (event) => {
                    if (isEditMode) {
                        event.stopPropagation();
                    }
                }, children: renderCellContent(cell, rowIndex, colIndex) }, colIndex)))] }, rowId));
};
const ReactTable = React.memo(({ tableId, tableData: propTableData }) => {
    // 🚀 主题样式 - 使用 state 来跟踪主题变化
    const [currentTheme, setCurrentTheme] = useState(getTheme());
    const themeStyles = useMemo(() => getTableThemeStyles(), [currentTheme]);
    // 🚀 监听主题变化
    useEffect(() => {
        const checkTheme = () => {
            const newTheme = getTheme();
            if (newTheme !== currentTheme) {
                setCurrentTheme(newTheme);
            }
        };
        // 定期检查主题变化（可以优化为事件监听）
        const interval = setInterval(checkTheme, 100);
        return () => clearInterval(interval);
    }, [currentTheme]);
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
    // 🚀 新增：活动单元格状态
    const [activeCell, setActiveCell] = useState(null);
    // 🚀 新增：表格容器引用
    const tableContainerRef = useRef(null);
    // 🚀 Part 1: 创建 markdown-it 实例，支持行内markdown语法和LaTeX公式
    const md = useMemo(() => {
        const mdInstance = new MarkdownIt({
            html: false,
            linkify: true,
            typographer: false,
            breaks: true // 启用换行转换
        });
        // 🚀 注册 LaTeX 插件，支持 $inline$ 和 $$block$$ 公式
        mdInstance.use(markdownItLatex, {
            throwOnError: false,
            strict: false
        });
        // 🚀 添加自定义渲染规则以支持strikethrough
        // markdown-it默认支持 **bold**, *italic*, `code`
        // 这里添加简单的~~strikethrough~~支持
        const defaultRender = mdInstance.renderer.rules.text || function (tokens, idx, options, env, self) {
            return tokens[idx].content;
        };
        mdInstance.renderer.rules.text = function (tokens, idx, options, env, self) {
            let content = tokens[idx].content;
            // 手动处理 ~~删除线~~ 语法
            content = content.replace(/~~([^~]+)~~/g, '<del>$1</del>');
            return content;
        };
        return mdInstance;
    }, []);
    // 🚀 Part 3: 配置拖拽传感器
    const sensors = useSensors(useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8,
        },
    }), useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 5,
        },
    }));
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
    // 🚀 Part 2: 单元格点击处理（支持多选）
    const handleCellClick = useCallback((event, rowIndex, colIndex) => {
        event.stopPropagation(); // 防止触发行选择
        const cellKey = `${rowIndex}-${colIndex}`;
        if (event.ctrlKey || event.metaKey) {
            // Ctrl/Cmd点击：切换单元格选择
            const isCurrentlySelected = selectedCells.some(cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
            if (isCurrentlySelected) {
                setSelectedCells(prev => prev.filter(cell => !(cell.rowIndex === rowIndex && cell.colIndex === colIndex)));
            }
            else {
                setSelectedCells(prev => [...prev, { rowIndex, colIndex }]);
            }
        }
        else if (event.shiftKey && selectedCells.length > 0) {
            // Shift点击：矩形区域选择
            const lastCell = selectedCells[selectedCells.length - 1];
            const minRow = Math.min(lastCell.rowIndex, rowIndex);
            const maxRow = Math.max(lastCell.rowIndex, rowIndex);
            const minCol = Math.min(lastCell.colIndex, colIndex);
            const maxCol = Math.max(lastCell.colIndex, colIndex);
            const rectangularSelection = [];
            for (let r = minRow; r <= maxRow; r++) {
                for (let c = minCol; c <= maxCol; c++) {
                    rectangularSelection.push({ rowIndex: r, colIndex: c });
                }
            }
            // 合并现有选择和矩形选择，去重
            const allSelected = [...selectedCells, ...rectangularSelection];
            const uniqueSelected = allSelected.filter((cell, index, arr) => arr.findIndex(c => c.rowIndex === cell.rowIndex && c.colIndex === cell.colIndex) === index);
            setSelectedCells(uniqueSelected);
        }
        else {
            // 普通点击：单选
            setSelectedCells([{ rowIndex, colIndex }]);
        }
    }, [selectedCells]);
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
            const standardDataChanged = JSON.stringify(standardData) !== JSON.stringify(newStandardData);
            // 🚀 修复：即使数据内容相同，对齐信息可能也会改变，所以要检查standardData
            if (dataChanged || standardDataChanged) {
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
    }, [tableId]); // 🚀 修复：只依赖tableId，避免循环依赖
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
        const cellKey = `${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current.get(cellKey);
        const rect = cellElement?.getBoundingClientRect();
        setEditingCell({
            rowIndex,
            colIndex,
            value,
            width: rect?.width,
            height: rect?.height
        });
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
        // 🚀 清除选中状态，避免高亮残留
        setSelectedCells([]);
        setActiveCell(null);
    }, [editingCell, tableId, updateDataAndSync]);
    // 取消编辑
    const cancelEdit = useCallback(() => {
        setEditingCell(null);
        // 🚀 清除选中状态，避免高亮残留
        setSelectedCells([]);
        setActiveCell(null);
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
    // 🚀 Part 2: 格式化助手函数
    const toggleMarkdownFormat = useCallback((text, format) => {
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
        }
        else {
            // 添加格式
            return `${start}${text}${end}`;
        }
    }, []);
    // 🚀 增强键盘快捷键处理
    const handleKeyDown = useCallback((event) => {
        if (!isEditMode || editingCell)
            return;
        // 🚀 Part 2: Ctrl+B - 切换加粗格式
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            if (selectedCells.length === 0)
                return;
            // 创建数据副本
            const newData = JSON.parse(JSON.stringify(data));
            // 对所有选中的单元格应用/移除加粗格式
            selectedCells.forEach(({ rowIndex, colIndex }) => {
                if (rowIndex === -1) {
                    // 表头
                    if (colIndex < newData.headers.length) {
                        newData.headers[colIndex] = toggleMarkdownFormat(newData.headers[colIndex] || '', 'bold');
                    }
                }
                else {
                    // 数据行
                    if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
                        newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(newData.rows[rowIndex][colIndex] || '', 'bold');
                    }
                }
            });
            updateDataAndSync(newData);
            return;
        }
        // 🚀 Part 2: Ctrl+I - 切换斜体格式
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'i') {
            event.preventDefault();
            if (selectedCells.length === 0)
                return;
            const newData = JSON.parse(JSON.stringify(data));
            selectedCells.forEach(({ rowIndex, colIndex }) => {
                if (rowIndex === -1) {
                    if (colIndex < newData.headers.length) {
                        newData.headers[colIndex] = toggleMarkdownFormat(newData.headers[colIndex] || '', 'italic');
                    }
                }
                else {
                    if (rowIndex < newData.rows.length && colIndex < newData.rows[rowIndex].length) {
                        newData.rows[rowIndex][colIndex] = toggleMarkdownFormat(newData.rows[rowIndex][colIndex] || '', 'italic');
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
            if (selectedCells.length === 0)
                return;
            // 找出选中区域的边界
            const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
            const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
            const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
            const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));
            // 构建 TSV 字符串
            const tsvRows = [];
            for (let r = minRow; r <= maxRow; r++) {
                const tsvCols = [];
                for (let c = minCol; c <= maxCol; c++) {
                    const isSelected = selectedCells.some(cell => cell.rowIndex === r && cell.colIndex === c);
                    let cellValue = '';
                    if (isSelected) {
                        if (r === -1) {
                            // 表头
                            cellValue = data.headers[c] || '';
                        }
                        else {
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
            if (selectedCells.length === 0)
                return;
            // 先执行复制逻辑
            const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
            const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
            const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
            const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));
            const tsvRows = [];
            for (let r = minRow; r <= maxRow; r++) {
                const tsvCols = [];
                for (let c = minCol; c <= maxCol; c++) {
                    const isSelected = selectedCells.some(cell => cell.rowIndex === r && cell.colIndex === c);
                    let cellValue = '';
                    if (isSelected) {
                        if (r === -1) {
                            cellValue = data.headers[c] || '';
                        }
                        else {
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
                const newData = JSON.parse(JSON.stringify(data));
                selectedCells.forEach(({ rowIndex, colIndex }) => {
                    if (rowIndex === -1) {
                        // 表头
                        if (colIndex < newData.headers.length) {
                            newData.headers[colIndex] = '';
                        }
                    }
                    else {
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
            if (!activeCell)
                return;
            navigator.clipboard.readText().then(clipboardText => {
                if (!clipboardText.trim())
                    return;
                // 解析 TSV 数据
                const rows = clipboardText.split('\n').map(row => row.split('\t'));
                const pasteRowCount = rows.length;
                const pasteColCount = Math.max(...rows.map(row => row.length));
                // 计算需要的总行数和列数
                const needRowCount = Math.max(data.rows.length, activeCell.rowIndex + pasteRowCount);
                const needColCount = Math.max(data.headers.length, activeCell.colIndex + pasteColCount);
                // 创建扩展后的数据副本
                const newData = {
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
                const newSelectedCells = [];
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
    // 🚀 Part 3: 拖拽结束处理函数
    const handleDragEnd = useCallback((event) => {
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
    const renderMarkdownContent = useCallback((value) => {
        if (value === '' || value === '\u00A0') {
            return _jsx("span", { children: '\u00A0' });
        }
        try {
            // 使用 renderInline 只渲染行内元素，避免包裹 <p> 标签
            const htmlContent = md.renderInline(value);
            return (_jsx("span", { dangerouslySetInnerHTML: { __html: htmlContent }, style: {
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    display: 'inline-block',
                    width: '100%'
                } }));
        }
        catch (error) {
            console.warn('Markdown 渲染失败:', error);
            // 降级到纯文本显示
            const displayValue = value === '' ? '\u00A0' : value;
            return (_jsx("span", { style: {
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    display: 'inline-block',
                    width: '100%'
                }, children: displayValue }));
        }
    }, [md]);
    // 🚀 排序处理 - 修改为真正影响底层数据，并清空选中状态
    const handleRequestSort = useCallback((property) => {
        const isAsc = sortConfig.orderBy === property && sortConfig.order === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';
        // 🚀 立即对数据进行排序并更新
        const sortedRows = [...data.rows].sort(getComparator(newOrder, property));
        const newData = {
            headers: [...data.headers],
            rows: sortedRows
        };
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
    // 🚀 新增：单元格尺寸引用
    const cellRefs = useRef(new Map());
    // 🚀 渲染编辑器 - 精确匹配单元格尺寸
    const renderEditor = useCallback((currentValue, rowIndex, colIndex) => {
        // 获取当前单元格的实际尺寸
        const cellKey = `${rowIndex}-${colIndex}`;
        const cellElement = cellRefs.current.get(cellKey);
        return (_jsx(TextField, { value: editingCell?.value || '', onChange: (e) => setEditingCell(prev => prev ? { ...prev, value: e.target.value } : null), onKeyDown: (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    commitEdit();
                }
                else if (e.key === 'Escape') {
                    cancelEdit();
                }
            }, onBlur: commitEdit, autoFocus: true, multiline: true, size: "small", variant: "standard", sx: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                '& .MuiInputBase-root': {
                    fontSize: '0.875rem',
                    height: '100%',
                    width: '100%',
                    padding: '6px 8px',
                    margin: 0,
                    backgroundColor: themeStyles.cellBackground,
                    color: themeStyles.cellText,
                    border: themeStyles.editorFocusBorder,
                    borderRadius: 0,
                    boxSizing: 'border-box',
                    '&:before, &:after': {
                        display: 'none'
                    },
                    '&:hover': {
                        backgroundColor: themeStyles.cellBackground
                    }
                },
                '& .MuiInputBase-input': {
                    padding: 0,
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    color: themeStyles.cellText
                }
            } }));
    }, [editingCell, commitEdit, cancelEdit, themeStyles]);
    // 🚀 获取列对齐方式
    const getColumnAlign = useCallback((colIndex) => {
        return standardData?.schema.headers[colIndex]?.align || 'left';
    }, [standardData]);
    // 🚀 Part 1: 渲染单元格内容，支持 Markdown 渲染和列对齐
    const renderCellContent = useCallback((value, rowIndex, colIndex, isHeader = false) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
        const isCellSelectedState = isCellSelected(rowIndex, colIndex);
        const isActive = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;
        // 🚀 获取列对齐方式
        const textAlign = getColumnAlign(colIndex);
        // 空字符串显示为不间断空格
        const displayValue = value === '' ? '\u00A0' : value;
        // 🚀 单元格ref key
        const cellKey = `${rowIndex}-${colIndex}`;
        return (_jsx(Box, { ref: (el) => {
                if (el && el instanceof HTMLDivElement) {
                    cellRefs.current.set(cellKey, el);
                }
                else {
                    cellRefs.current.delete(cellKey);
                }
            }, sx: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
                minHeight: isEditing && editingCell.height ? `${editingCell.height}px` : '32px',
                height: isEditing && editingCell.height ? `${editingCell.height}px` : 'auto',
                width: isEditing && editingCell.width ? `${editingCell.width}px` : '100%',
                cursor: isEditMode ? 'text' : 'default',
                padding: isEditing ? 0 : '6px 8px', // 🚀 编辑时去除padding，让编辑框填满
                position: 'relative',
                backgroundColor: isCellSelectedState
                    ? alpha('#1976d2', 0.12)
                    : isActive
                        ? alpha('#1976d2', 0.08)
                        : 'transparent',
                border: isActive && !isEditing ? '1px solid #1976d2' : '1px solid transparent', // 🚀 非编辑状态显示选中边框
                boxSizing: 'border-box',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                overflow: isEditing ? 'hidden' : 'visible', // 🚀 编辑时隐藏溢出
                '&:hover': {
                    backgroundColor: isEditMode && !isHeader
                        ? (isCellSelectedState ? alpha('#1976d2', 0.16) : alpha('#1976d2', 0.08))
                        : 'transparent'
                }
            }, onClick: (event) => {
                if (isEditMode && !isHeader) {
                    handleCellClick(event, rowIndex, colIndex);
                    setActiveCell({ rowIndex, colIndex });
                    startEdit(rowIndex, colIndex);
                }
            }, children: isEditing ? (renderEditor(value, rowIndex, colIndex)) : (
            // 🚀 Part 1: 根据是否为表头选择渲染方式
            isHeader ? (_jsx("span", { style: {
                    fontWeight: 'bold',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    display: 'block',
                    width: '100%',
                    textAlign, // 🚀 应用对齐
                    color: themeStyles.headerText // 🚀 使用主题表头文字颜色
                }, children: displayValue || `Header ${colIndex + 1}` })) : (_jsx("div", { style: {
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    width: '100%',
                    textAlign, // 🚀 应用对齐
                    color: themeStyles.cellText // 🚀 使用主题单元格文字颜色
                }, children: renderMarkdownContent(value) }))) }));
    }, [editingCell, renderEditor, startEdit, isEditMode, isCellSelected, activeCell, renderMarkdownContent, handleCellClick, getColumnAlign]);
    if (!data || (!data.headers.length && !data.rows.length)) {
        return (_jsxs(Paper, { sx: { p: 2, textAlign: 'center', color: 'text.secondary' }, children: ["Empty table - ", tableId ? `Table ID: ${tableId}` : 'No data', standardData && (_jsxs("div", { style: { fontSize: '0.75rem', marginTop: '4px', color: '#666' }, children: ["Columns: ", standardData.schema.columnCount, " | Rows: ", standardData.schema.rowCount] }))] }));
    }
    return (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, modifiers: [restrictToVerticalAxis], children: _jsxs(Paper, { elevation: 0, sx: {
                width: '100%',
                overflow: 'hidden',
                backgroundColor: themeStyles.paperBackground,
                border: themeStyles.paperBorder
            }, className: "academic-table", tabIndex: 0, onKeyDown: handleKeyDown, ref: tableContainerRef, children: [_jsxs(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        borderBottom: `1px solid ${themeStyles.toolbarBorder}`,
                        backgroundColor: themeStyles.toolbarBackground
                    }, className: "react-table-toolbar", children: [_jsxs(Box, { sx: {
                                p: 1,
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center'
                            }, children: [_jsx(Tooltip, { title: isEditMode ? "Exit Edit Mode" : "Enter Edit Mode", children: _jsx(IconButton, { size: "small", onClick: () => {
                                            setIsEditMode(!isEditMode);
                                            // 🚀 退出编辑模式时清除选择和编辑状态
                                            if (isEditMode) {
                                                setSelectedRows([]);
                                                setSelectedCells([]);
                                                setLastSelectedIndex(null);
                                                setActiveCell(null);
                                                setEditingCell(null);
                                            }
                                        }, color: isEditMode ? "primary" : "default", children: _jsx(EditIcon, {}) }) }), isEditMode && (_jsxs(_Fragment, { children: [_jsxs(Box, { sx: { display: 'flex', gap: 0.5, ml: 1 }, children: [_jsx(Tooltip, { title: "Add Row", children: _jsx(IconButton, { size: "small", onClick: addRow, children: _jsx(AddIcon, {}) }) }), _jsx(Tooltip, { title: "Add Column", children: _jsx(IconButton, { size: "small", onClick: addColumn, children: _jsx(AddIcon, { sx: { transform: 'rotate(90deg)' } }) }) })] }), _jsx(Box, { sx: { width: '1px', height: '20px', backgroundColor: themeStyles.toolbarBorder, mx: 1 } }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx("span", { style: { fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.7 }, children: "\u5217:" }), _jsx(Box, { sx: { display: 'flex', gap: 0.5 }, children: data.headers.map((header, colIndex) => (_jsx(Tooltip, { title: `Delete "${header}" column`, children: _jsx(IconButton, { size: "small", onClick: () => deleteColumn(colIndex), disabled: data.headers.length <= 1, sx: {
                                                                p: 0.25,
                                                                fontSize: '0.75rem',
                                                                minWidth: 'auto',
                                                                color: data.headers.length <= 1 ? '#ccc' : '#d32f2f',
                                                                '&:hover': {
                                                                    backgroundColor: data.headers.length <= 1 ? 'transparent' : alpha('#d32f2f', 0.08)
                                                                }
                                                            }, children: _jsx(DeleteIcon, { fontSize: "inherit" }) }) }, colIndex))) })] }), _jsx(Box, { sx: { width: '1px', height: '20px', backgroundColor: themeStyles.toolbarBorder, mx: 1 } }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx("span", { style: { fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.7 }, children: "\u6392\u5E8F:" }), sortConfig.orderBy && (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 0.5 }, children: [_jsx("span", { style: { fontSize: '0.75rem', fontWeight: 500, color: themeStyles.cellText }, children: sortConfig.orderBy }), _jsx("span", { style: { fontSize: '0.75rem', color: '#1976d2' }, children: sortConfig.order === 'asc' ? '↑' : '↓' }), _jsx(Tooltip, { title: "Clear Sort", children: _jsx(IconButton, { size: "small", onClick: () => {
                                                                    setSortConfig({ order: 'asc', orderBy: '' });
                                                                }, sx: { p: 0.25 }, children: _jsx(CloseIcon, { fontSize: "inherit" }) }) })] })), !sortConfig.orderBy && (_jsx("span", { style: { fontSize: '0.75rem', color: themeStyles.cellText, opacity: 0.5, fontStyle: 'italic' }, children: "\u70B9\u51FB\u8868\u5934\u6392\u5E8F" }))] })] })), _jsxs(Box, { sx: { ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }, children: [isEditMode && (_jsx(Tooltip, { title: _jsxs(Box, { sx: { fontSize: '0.75rem', lineHeight: 1.2 }, children: [_jsx("div", { children: "\u5FEB\u6377\u952E:" }), _jsx("div", { children: "\u2022 Ctrl+A: \u5168\u9009" }), _jsx("div", { children: "\u2022 Ctrl+D: \u53D6\u6D88\u9009\u62E9" }), _jsx("div", { children: "\u2022 Ctrl+B: \u52A0\u7C97\u9009\u4E2D\u5355\u5143\u683C" }), _jsx("div", { children: "\u2022 Ctrl+I: \u659C\u4F53\u9009\u4E2D\u5355\u5143\u683C" }), _jsx("div", { children: "\u2022 Ctrl+C: \u590D\u5236\u9009\u4E2D\u5355\u5143\u683C" }), _jsx("div", { children: "\u2022 Ctrl+X: \u526A\u5207\u9009\u4E2D\u5355\u5143\u683C" }), _jsx("div", { children: "\u2022 Ctrl+V: \u7C98\u8D34\u5230\u6D3B\u52A8\u5355\u5143\u683C" }), _jsx("div", { children: "\u2022 Delete: \u5220\u9664\u9009\u4E2D\u884C" }), _jsx("div", { children: "\u2022 Ctrl+\u70B9\u51FB: \u591A\u9009" }), _jsx("div", { children: "\u2022 Shift+\u70B9\u51FB: \u8303\u56F4\u9009\u62E9" }), _jsx("div", { children: "\u2022 \u65B9\u5411\u952E: \u79FB\u52A8\u9009\u62E9" }), _jsx("div", { children: "\u2022 Shift+\u65B9\u5411\u952E: \u6269\u5C55\u9009\u62E9" }), _jsx("div", { children: "\u2022 \u62D6\u62FD\u884C\u9996\u56FE\u6807: \u91CD\u65B0\u6392\u5E8F" })] }), children: _jsx(IconButton, { size: "small", children: _jsx(HelpIcon, { fontSize: "small" }) }) })), tableId && (_jsxs(Box, { sx: { fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center' }, children: ["Table ID: ", tableId, standardData && (_jsxs("span", { style: { marginLeft: '8px' }, children: [standardData.schema.columnCount, "\u00D7", standardData.schema.rowCount] }))] }))] })] }), isEditMode && selectedRows.length > 0 && (_jsxs(Box, { sx: {
                                px: 1,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: alpha('#1976d2', 0.04),
                                borderTop: `1px solid ${themeStyles.toolbarBorder}`
                            }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Checkbox, { size: "small", indeterminate: selectedRows.length > 0 && selectedRows.length < data.rows.length, checked: data.rows.length > 0 && selectedRows.length === data.rows.length, onChange: handleSelectAllClick }), _jsxs("span", { style: { fontWeight: 500, color: '#1976d2', fontSize: '0.875rem' }, children: [selectedRows.length, " row", selectedRows.length > 1 ? 's' : '', " selected"] })] }), _jsxs(Box, { sx: { display: 'flex', gap: 0.5, ml: 2 }, children: [_jsx(Tooltip, { title: "Delete Selected Rows", children: _jsx(IconButton, { size: "small", onClick: () => {
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
                                                }, color: "error", children: _jsx(DeleteIcon, {}) }) }), _jsx(Tooltip, { title: "Clear Selection", children: _jsx(IconButton, { size: "small", onClick: () => {
                                                    setSelectedRows([]);
                                                    setSelectedCells([]);
                                                    setLastSelectedIndex(null);
                                                }, children: _jsx(CloseIcon, {}) }) })] })] }))] }), _jsx(TableContainer, { sx: {
                        width: '100%',
                        overflowX: 'hidden', // 不允许横向溢出
                        overflowY: 'visible', // 纵向不限制
                        maxWidth: '100%', // 确保容器不会超出父元素
                        display: 'block' // 确保是块级元素
                    }, className: "uniform-scroller", children: _jsxs(Table, { size: "small", stickyHeader: true, sx: {
                            width: '100%', // 表格占满容器宽度
                            tableLayout: 'fixed', // 固定表格布局，允许单元格换行
                            borderCollapse: 'collapse',
                            '& .MuiTableCell-root': {
                                wordWrap: 'break-word', // 允许单词断行
                                wordBreak: 'break-word', // 在必要时断开单词
                                overflowWrap: 'break-word', // 确保长单词能够换行
                                whiteSpace: 'normal', // 允许正常换行
                                verticalAlign: 'top', // 垂直对齐到顶部
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: `1px solid ${themeStyles.cellBorder}`,
                                color: themeStyles.cellText
                            }
                        }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: {
                                        backgroundColor: themeStyles.headerBackground,
                                        '& .MuiTableCell-head': {
                                            fontWeight: 600,
                                            borderBottom: `2px solid ${themeStyles.cellBorder}`,
                                            color: themeStyles.headerText,
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: themeStyles.headerBackground,
                                            zIndex: 10
                                        }
                                    }, children: [isEditMode && (_jsx(TableCell, { padding: "checkbox", sx: { width: 80 }, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Checkbox, { color: "primary", indeterminate: selectedRows.length > 0 && selectedRows.length < data.rows.length, checked: data.rows.length > 0 && selectedRows.length === data.rows.length, onChange: handleSelectAllClick, inputProps: {
                                                            'aria-label': 'select all rows',
                                                        } }), _jsx(DragIndicatorIcon, { fontSize: "small", sx: { opacity: 0.5, cursor: 'default' } })] }) })), data.headers.map((header, colIndex) => (_jsx(TableCell, { sx: {
                                                width: `${100 / data.headers.length}%`, // 平均分配列宽
                                                minWidth: 0, // 允许缩小到内容大小
                                                maxWidth: `${100 / data.headers.length}%`, // 限制最大宽度
                                                padding: '4px 8px',
                                                '& > *': {
                                                    width: '100%',
                                                    maxWidth: '100%'
                                                }
                                            }, children: _jsxs(TableSortLabel, { active: isEditMode && sortConfig.orderBy === header, direction: sortConfig.orderBy === header ? sortConfig.order : 'asc', onClick: () => {
                                                    if (isEditMode) {
                                                        handleRequestSort(header);
                                                    }
                                                }, disabled: !isEditMode, sx: {
                                                    width: '100%',
                                                    '& .MuiTableSortLabel-root': {
                                                        flexDirection: 'row'
                                                    },
                                                    '&.Mui-disabled': {
                                                        opacity: 1,
                                                        color: 'inherit'
                                                    }
                                                }, children: [_jsx(Box, { sx: {
                                                            display: 'flex',
                                                            alignItems: 'flex-start', // 顶部对齐
                                                            minHeight: '32px',
                                                            cursor: isEditMode ? 'text' : 'default',
                                                            padding: '6px 8px',
                                                            width: '100%',
                                                            wordBreak: 'break-word', // 允许换行
                                                            whiteSpace: 'normal', // 允许正常换行
                                                            '&:hover': {
                                                                backgroundColor: isEditMode ? themeStyles.headerHoverBackground : 'transparent'
                                                            }
                                                        }, onClick: (e) => {
                                                            if (isEditMode) {
                                                                e.stopPropagation(); // 阻止排序
                                                                startEdit(-1, colIndex);
                                                            }
                                                        }, children: editingCell?.rowIndex === -1 && editingCell?.colIndex === colIndex ? (renderEditor(header, -1, colIndex)) : (_jsx("span", { style: {
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'normal',
                                                                display: 'block',
                                                                color: themeStyles.headerText,
                                                                width: '100%'
                                                            }, children: header || `Header ${colIndex + 1}` })) }), isEditMode && sortConfig.orderBy === header ? (_jsx(Box, { component: "span", sx: visuallyHidden, children: sortConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending' })) : null] }) }, colIndex)))] }) }), _jsx(TableBody, { children: _jsx(SortableContext, { items: sortedRows.map((_, index) => `row-${index}`), strategy: verticalListSortingStrategy, children: sortedRows.map((row, rowIndex) => {
                                        // 🚀 修复：排序后直接使用rowIndex，因为数据已经真正排序
                                        const isRowSelectedValue = isRowSelected(rowIndex);
                                        const rowId = `row-${rowIndex}`;
                                        // 🚀 Part 3: 在编辑模式下使用可拖拽行，否则使用普通行
                                        if (isEditMode) {
                                            return (_jsx(DraggableTableRow, { rowId: rowId, rowIndex: rowIndex, row: row, isEditMode: isEditMode, isSelected: isRowSelectedValue, lastSelectedIndex: lastSelectedIndex, editingCell: editingCell, onRowClick: handleRowClick, renderCellContent: renderCellContent, setSelectedRows: setSelectedRows, setLastSelectedIndex: setLastSelectedIndex, totalColumns: data.headers.length, themeStyles: themeStyles }, rowId));
                                        }
                                        else {
                                            // 普通模式下的静态行
                                            return (_jsx(TableRow, { hover: true, sx: {
                                                    '&:nth-of-type(even)': {
                                                        backgroundColor: themeStyles.cellBackground
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: themeStyles.cellHoverBackground
                                                    }
                                                }, children: row.map((cell, colIndex) => (_jsx(TableCell, { sx: {
                                                        width: `${100 / data.headers.length}%`, // 平均分配列宽
                                                        minWidth: 0, // 允许缩小
                                                        maxWidth: `${100 / data.headers.length}%`, // 限制最大宽度
                                                        padding: 0,
                                                        '& > *': {
                                                            width: '100%',
                                                            maxWidth: '100%'
                                                        }
                                                    }, children: renderCellContent(cell, rowIndex, colIndex) }, colIndex))) }, rowId));
                                        }
                                    }) }) })] }) })] }) }));
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
        Object.defineProperty(this, "pendingRoots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        }); // 🚀 新增：跟踪正在创建的 root
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
            const isPending = this.pendingRoots.has(tableId); // 🚀 检查是否正在创建中
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
            // 🚀 如果正在创建中，跳过
            if (isPending) {
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
        // 🚀 防止重复创建：立即标记为 pending
        if (this.pendingRoots.has(tableId)) {
            return;
        }
        this.pendingRoots.add(tableId);
        try {
            // 🚀 清空占位符内容，避免 React 警告
            placeholder.innerHTML = '';
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
                    this.pendingRoots.delete(tableId); // 🚀 清理 pending 状态
                    return;
                }
                // 🚀 再次检查是否已经有 root（防止竞态条件）
                if (this.mountedRoots.has(tableId)) {
                    this.pendingRoots.delete(tableId);
                    return;
                }
                const root = createRoot(placeholder);
                root.render(React.createElement(ReactTable, { tableId }));
                // 保存根节点和状态
                this.mountedRoots.set(tableId, root);
                if (tableHash) {
                    this.lastTableStates.set(tableId, tableHash);
                }
                // 🚀 移除 pending 状态
                this.pendingRoots.delete(tableId);
            }).catch(e => {
                console.error(`创建表格 ${tableId} 根节点失败:`, e);
                this.pendingRoots.delete(tableId); // 🚀 清理 pending 状态
            });
        }
        catch (e) {
            console.error(`为表格 ${tableId} 创建根节点时发生错误:`, e);
            this.pendingRoots.delete(tableId); // 🚀 清理 pending 状态
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
            this.pendingRoots.delete(tableId); // 🚀 同时清理 pending 状态
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
        this.pendingRoots.clear(); // 🚀 清理所有 pending 状态
        // 🚀 清理所有同步监听器
        tableSyncManager.clearAllListeners();
    }
    // 获取调试信息
    getDebugInfo() {
        return {
            mountedRootsCount: this.mountedRoots.size,
            tableStatesCount: this.lastTableStates.size,
            pendingRootsCount: this.pendingRoots.size, // 🚀 新增
            mountedTableIds: Array.from(this.mountedRoots.keys()),
            pendingTableIds: Array.from(this.pendingRoots), // 🚀 新增
            tableStates: Object.fromEntries(this.lastTableStates),
            syncListenersCount: tableSyncManager.syncListeners?.size || 0
        };
    }
}
export { ReactTable, TableManager };
export default ReactTable;
