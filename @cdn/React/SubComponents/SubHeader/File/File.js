import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeFileManagerState, changeSettings, getFileManagerState, getSettings, } from "@App/config/change";
import { FileFolderManager, FileManager } from "@App/fileSystem/file";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import { replaceMonacoAll } from "@App/text/replaceText";
import { mdConverter } from "@Root/js";
import { Backdrop, Box, Button, Stack, Tooltip, Typography, } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { observer } from "mobx-react";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import alertUseArco from "@App/message/alert";
import FileExplorer from "./SubFile.tsx/FileManager";
import FolderIcon from "@mui/icons-material/Folder";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Zoom from "@mui/material/Zoom";
import ScrollableBox from "@Root/js/React/Components/myCom/Layout/ScrollBox";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PushPin as PushPinIcon, PushPinOutlined as PushPinOutlinedIcon, } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
// 懒加载配置常量
const MAX_EAGER_DEPTH = 3; // 超过此深度的目录将使用懒加载
// 路径标准化工具函数
const normalizePath = (path) => {
    if (!path)
        return "";
    // 移除多余的斜杠并标准化路径分隔符
    return path
        .replace(/[\/\\]+/g, '/') // 将多个斜杠或反斜杠替换为单个正斜杠
        .replace(/^\/+|\/+$/g, '') // 移除开头和结尾的斜杠
        .trim();
};
// 生成基于路径的稳定ID
const generateStableId = (path, fileType) => {
    const normalizedPath = normalizePath(path);
    return `${fileType}:${normalizedPath}`; // 使用文件类型和路径作为稳定ID
};
// 计算路径深度
const getPathDepth = (path) => {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath)
        return 0;
    return normalizedPath.split('/').length;
};
// 检查是否应该懒加载
const shouldLazyLoad = (path, fileType) => {
    if (fileType !== 'folder')
        return false;
    const depth = getPathDepth(path);
    return depth >= MAX_EAGER_DEPTH;
};
const fileManager = new FileManager();
const folderManager = new FileFolderManager();
let _t;
const FileDrawer = observer(function FileDrawer() {
    const { t } = useTranslation();
    const [fileDirectoryArr, setFileDirectoryArr] = React.useState([]);
    const [editingFileName, setEditingFileName] = React.useState("");
    const [currentEditingFilePath, setCurrentEditingFilePath] = React.useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [isLazyLoading, setIsLazyLoading] = useState(false);
    // 改进的操作状态管理 - 参考VSCode的事件系统
    const [operationQueue, setOperationQueue] = useState([]);
    const [isProcessingUserOperation, setIsProcessingUserOperation] = useState(false);
    const [lastUserOperationTime, setLastUserOperationTime] = useState(0);
    // 动态监听频率管理 - 更智能的频率控制
    const [watchInterval, setWatchInterval] = useState(1500);
    const [consecutiveNoChanges, setConsecutiveNoChanges] = useState(0);
    const [lastChangeTime, setLastChangeTime] = useState(Date.now()); // 最后变化时间
    window._setIsDragging = setIsDragging;
    const theme = useTheme();
    // 分离的刷新引用，避免冲突
    const systemRefreshRef = React.useRef();
    const userOperationRef = React.useRef();
    // 监听器健康检查
    const watcherHealthCheckRef = React.useRef();
    const [watcherHealthy, setWatcherHealthy] = useState(true);
    // 提前定义helper函数
    const checkFileExistsInTree = React.useCallback((tree, filePath) => {
        if (!tree || tree.length === 0)
            return false;
        const normalizedTargetPath = normalizePath(filePath);
        for (const item of tree) {
            if (normalizePath(item.path) === normalizedTargetPath) {
                return true;
            }
            if (item.children && Array.isArray(item.children)) {
                if (checkFileExistsInTree(item.children, filePath)) {
                    return true;
                }
            }
        }
        return false;
    }, []);
    const fillText = (content, fileName) => {
        // 使用 Monaco 编辑器显示文件内容
        replaceMonacoAll(window.monaco, window.editor, content);
        alertUseArco(`${t("t-file-manager-open-success")}${fileName}！😀`);
    };
    const toggleDrawer = (newOpen) => () => {
        if (!isPinned) {
            changeFileManagerState(newOpen);
        }
        else {
        }
    };
    const handleOnChangeFileEditLocalSwitch = (_e, i) => {
        changeSettings({
            basic: { fileEditLocal: i },
        });
    };
    // 改进的智能监听回调 - 参考VSCode的文件监听机制
    const intelligentWatchCallback = React.useCallback(async () => {
        const now = Date.now();
        // 如果正在处理用户操作，但不是长时间阻塞，允许监听继续
        if (isProcessingUserOperation) {
            const operationDuration = now - lastUserOperationTime;
            if (operationDuration < 200) {
                if (systemRefreshRef.current) {
                    clearTimeout(systemRefreshRef.current);
                }
                systemRefreshRef.current = setTimeout(() => {
                    intelligentWatchCallback();
                }, 200 - operationDuration);
                return;
            }
        }
        // 缩短用户操作后的等待时间，提高响应性
        if (now - lastUserOperationTime < 300) {
            if (systemRefreshRef.current) {
                clearTimeout(systemRefreshRef.current);
            }
            systemRefreshRef.current = setTimeout(() => {
                intelligentWatchCallback();
            }, 300 - (now - lastUserOperationTime));
            return;
        }
        // 如果正在懒加载，跳过
        if (isLazyLoading) {
            return;
        }
        // 清除之前的系统刷新定时器
        if (systemRefreshRef.current) {
            clearTimeout(systemRefreshRef.current);
        }
        // 缩短系统监听防抖时间，提高对本地变化的响应速度
        systemRefreshRef.current = setTimeout(async () => {
            try {
                // 添加到操作队列
                setOperationQueue(prev => [...prev.slice(-9), {
                        type: 'system',
                        timestamp: now,
                        operation: 'file_system_change'
                    }]);
                const currentTree = folderManager.topDirectoryArray || [];
                const directoryHandle = folderManager.getTopDirectoryHandle();
                if (!directoryHandle)
                    return;
                // 系统监听读取真实文件结构进行对比
                const realFileStructure = await folderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 3);
                const processedRealStructure = processTreeWithLazyLoading(realFileStructure);
                const smartRefresh = performSmartDiffUpdate(currentTree, processedRealStructure, expandedFolders);
                if (smartRefresh.hasChanges) {
                    // 检测到变化，更新树和频率
                    folderManager.topDirectoryArray = smartRefresh.updatedTree;
                    setFileDirectoryArr(smartRefresh.updatedTree);
                    setExpandedFolders(smartRefresh.updatedExpandedFolders);
                    setLastChangeTime(now);
                    setConsecutiveNoChanges(0);
                    // 有变化时提高到1秒高频
                    const newInterval = 1000;
                    if (newInterval !== watchInterval) {
                        setWatchInterval(newInterval);
                        folderManager.stopWatching();
                        folderManager.watchDirectory(intelligentWatchCallback, newInterval);
                    }
                    // 检查当前编辑的文件是否还存在
                    if (currentEditingFilePath) {
                        const normalizedCurrentPath = normalizePath(currentEditingFilePath);
                        const fileExists = checkFileExistsInTree(smartRefresh.updatedTree, normalizedCurrentPath);
                        if (!fileExists) {
                            setCurrentEditingFilePath("");
                            setEditingFileName("");
                        }
                    }
                    setWatcherHealthy(true);
                }
                else {
                    // 无变化，智能调整频率
                    const timeSinceLastChange = now - lastChangeTime;
                    setConsecutiveNoChanges(prev => {
                        const newCount = prev + 1;
                        let newInterval = watchInterval;
                        if (timeSinceLastChange > 30000) { // 超过30秒无变化 → 5秒检测
                            newInterval = 5000;
                        }
                        else if (timeSinceLastChange > 10000) { // 超过10秒无变化 → 3秒检测
                            newInterval = 3000;
                        }
                        else if (newCount >= 3) { // 连续3次无变化但10秒内 → 1秒检测
                            newInterval = 1000;
                        }
                        if (newInterval !== watchInterval) {
                            setWatchInterval(newInterval);
                            setTimeout(() => {
                                folderManager.stopWatching();
                                folderManager.watchDirectory(intelligentWatchCallback, newInterval);
                            }, 100);
                        }
                        return newCount > 10 ? 0 : newCount; // 防止计数器过大
                    });
                }
            }
            catch (error) {
                console.error("Error during system watch refresh:", error);
                setWatcherHealthy(false);
                // 尝试重启监听器
                setTimeout(() => {
                    try {
                        folderManager.stopWatching();
                        folderManager.watchDirectory(intelligentWatchCallback, watchInterval);
                        setWatcherHealthy(true);
                    }
                    catch (error) {
                        console.error('Health check: failed to restart watcher:', error);
                    }
                }, 1000);
            }
        }, 400);
    }, [folderManager, expandedFolders, isLazyLoading, currentEditingFilePath, isProcessingUserOperation, lastUserOperationTime, watchInterval, consecutiveNoChanges, lastChangeTime, checkFileExistsInTree]);
    // 专门的用户操作刷新函数 - 直接读取真实文件结构，然后智能对比更新
    const userOperationRefresh = React.useCallback(async (operationType) => {
        const now = Date.now();
        // 立即设置用户操作状态，确保系统监听被正确阻塞
        setIsProcessingUserOperation(true);
        setLastUserOperationTime(now);
        // 清除所有待处理的系统刷新，确保不会有竞争
        if (systemRefreshRef.current) {
            clearTimeout(systemRefreshRef.current);
            systemRefreshRef.current = undefined;
        }
        // 添加到操作队列用于调试
        setOperationQueue(prev => [...prev.slice(-9), {
                type: 'user',
                timestamp: now,
                operation: operationType
            }]);
        try {
            const directoryHandle = folderManager.getTopDirectoryHandle();
            if (!directoryHandle)
                return;
            // 直接读取真实的文件目录结构
            const realFileStructure = await folderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 3);
            // 处理懒加载和稳定ID
            const processedRealStructure = processTreeWithLazyLoading(realFileStructure);
            // 获取当前UI树结构
            const currentUITree = folderManager.topDirectoryArray || [];
            // 进行智能差异对比和增量更新
            const smartUpdate = performSmartDiffUpdate(currentUITree, processedRealStructure, expandedFolders);
            // 更新文件树和状态
            folderManager.topDirectoryArray = smartUpdate.updatedTree;
            setFileDirectoryArr(smartUpdate.updatedTree);
            setExpandedFolders(smartUpdate.updatedExpandedFolders);
            // 重置动态监听频率，因为用户操作后可能会有更多变化
            setWatchInterval(1000); // 重置为高频
            setConsecutiveNoChanges(0);
            setLastChangeTime(now);
            // 检查当前编辑的文件
            if (currentEditingFilePath) {
                const normalizedCurrentPath = normalizePath(currentEditingFilePath);
                const fileExists = checkFileExistsInTree(smartUpdate.updatedTree, normalizedCurrentPath);
                if (!fileExists) {
                    setCurrentEditingFilePath("");
                    setEditingFileName("");
                }
            }
            // 确保监听器保持健康
            setWatcherHealthy(true);
        }
        catch (error) {
            console.error("Error during user operation refresh:", error);
        }
        finally {
            // 缩短用户操作状态重置时间，减少对系统监听的阻塞
            setTimeout(() => {
                setIsProcessingUserOperation(false);
            }, 100);
        }
    }, [folderManager, expandedFolders, currentEditingFilePath, checkFileExistsInTree]);
    // 智能差异对比和增量更新函数
    const performSmartDiffUpdate = React.useCallback((currentTree, realTree, currentExpandedFolders) => {
        const updatedExpandedFolders = new Set(currentExpandedFolders);
        // 递归对比和更新函数
        const diffAndUpdate = (currentItems, realItems, parentPath = "") => {
            let hasChanges = false;
            const updatedItems = [];
            // 创建映射以便快速查找
            const currentItemsMap = new Map(currentItems.map(item => [item.label, item]));
            const realItemsMap = new Map(realItems.map(item => [item.label, item]));
            // 处理真实存在的项目
            for (const realItem of realItems) {
                const currentItem = currentItemsMap.get(realItem.label);
                const itemPath = parentPath ? `${parentPath}/${realItem.label}` : realItem.label;
                const normalizedPath = normalizePath(itemPath);
                if (!currentItem) {
                    // 新增项目
                    hasChanges = true;
                    updatedItems.push({
                        ...realItem,
                        id: generateStableId(normalizedPath, realItem.fileType),
                        path: normalizedPath
                    });
                }
                else if (realItem.fileType === 'file') {
                    // 文件项目，保持当前状态但更新路径和ID
                    updatedItems.push({
                        ...currentItem,
                        path: normalizedPath,
                        id: generateStableId(normalizedPath, 'file')
                    });
                }
                else if (realItem.fileType === 'folder') {
                    // 文件夹项目需要递归处理
                    const isExpanded = currentExpandedFolders.has(normalizedPath) || currentExpandedFolders.has(currentItem.path);
                    let updatedChildren = currentItem.children || [];
                    let childrenChanged = false;
                    if (isExpanded && realItem.children && !realItem.children.some((child) => child.fileType === 'lazy-placeholder')) {
                        // 已展开且有真实子项的文件夹，递归对比
                        const childDiff = diffAndUpdate(currentItem.children || [], realItem.children, normalizedPath);
                        updatedChildren = childDiff.items;
                        childrenChanged = childDiff.hasChanges;
                        if (childrenChanged) {
                            hasChanges = true;
                        }
                    }
                    else if (shouldLazyLoad(normalizedPath, 'folder') && (!currentItem.children || currentItem.children.length === 0)) {
                        // 需要懒加载占位符的文件夹
                        updatedChildren = [{
                                id: generateStableId(`${normalizedPath}/[lazy-placeholder]`, 'lazy-placeholder'),
                                label: "...",
                                fileType: "lazy-placeholder",
                                path: `${normalizedPath}/[lazy-placeholder]`,
                            }];
                    }
                    else {
                        // 保持原有子项结构
                        updatedChildren = currentItem.children || [];
                    }
                    updatedItems.push({
                        ...currentItem,
                        path: normalizedPath,
                        id: generateStableId(normalizedPath, 'folder'),
                        children: updatedChildren.length > 0 ? updatedChildren : undefined
                    });
                    // 更新展开状态路径
                    if (isExpanded && currentItem.path !== normalizedPath) {
                        updatedExpandedFolders.delete(currentItem.path);
                        updatedExpandedFolders.add(normalizedPath);
                    }
                }
            }
            // 检测删除的项目
            for (const [itemName, currentItem] of currentItemsMap) {
                if (!realItemsMap.has(itemName)) {
                    hasChanges = true;
                    // 如果是文件夹，从展开状态中移除
                    if (currentItem.fileType === 'folder') {
                        updatedExpandedFolders.delete(currentItem.path);
                    }
                }
            }
            return { items: updatedItems, hasChanges };
        };
        const result = diffAndUpdate(currentTree, realTree);
        // 清理不存在的展开路径
        const existingPaths = new Set();
        const collectExistingPaths = (items) => {
            for (const item of items) {
                if (item.fileType === 'folder') {
                    existingPaths.add(normalizePath(item.path));
                    if (item.children && !item.children.some((child) => child.fileType === 'lazy-placeholder')) {
                        collectExistingPaths(item.children);
                    }
                }
            }
        };
        collectExistingPaths(result.items);
        const cleanedExpandedFolders = new Set([...updatedExpandedFolders].filter(path => existingPaths.has(normalizePath(path))));
        return {
            hasChanges: result.hasChanges,
            updatedTree: result.items,
            updatedExpandedFolders: cleanedExpandedFolders
        };
    }, []);
    // 处理懒加载和稳定ID的函数（从之前的代码中提取）
    const processTreeWithLazyLoading = React.useCallback((items, basePath = "", depth = 0) => {
        return items.map((item) => {
            const itemPath = basePath ? normalizePath(`${basePath}/${item.label}`) : normalizePath(item.label);
            const processedItem = {
                ...item,
                id: generateStableId(itemPath, item.fileType),
                path: itemPath
            };
            if (item.fileType === 'folder') {
                if (shouldLazyLoad(itemPath, 'folder')) {
                    // 为深层文件夹添加懒加载占位符
                    processedItem.children = [{
                            id: generateStableId(`${itemPath}/[lazy-placeholder]`, 'lazy-placeholder'),
                            label: "...",
                            fileType: "lazy-placeholder",
                            path: `${itemPath}/[lazy-placeholder]`,
                        }];
                }
                else if (item.children && Array.isArray(item.children)) {
                    // 递归处理子项
                    processedItem.children = processTreeWithLazyLoading(item.children, itemPath, depth + 1);
                }
            }
            return processedItem;
        });
    }, []);
    // 监听器健康检查机制
    React.useEffect(() => {
        const healthCheck = () => {
            if (folderManager.getTopDirectoryHandle() && !watcherHealthy) {
                try {
                    folderManager.stopWatching();
                    folderManager.watchDirectory(intelligentWatchCallback, watchInterval);
                    setWatcherHealthy(true);
                }
                catch (error) {
                    console.error('Health check: failed to restart watcher:', error);
                }
            }
        };
        watcherHealthCheckRef.current = setInterval(healthCheck, 10000); // 10秒健康检查
        return () => {
            if (watcherHealthCheckRef.current) {
                clearInterval(watcherHealthCheckRef.current);
            }
        };
    }, [watcherHealthy, folderManager, intelligentWatchCallback, watchInterval]);
    const onClickOpenSingleFile = async () => {
        try {
            const fileHandle = await fileManager.openSingleFile();
            if (!fileHandle) {
                alertUseArco(t("t-no-file-selected"), 2500, {
                    kind: "warning",
                });
                return;
            }
            setEditingFileName(fileHandle.name);
            setCurrentEditingFilePath(fileHandle.name);
            setFileDirectoryArr([
                {
                    id: "1." + fileHandle.name,
                    label: fileHandle.name,
                    path: fileHandle.name,
                    fileType: fileHandle.kind,
                },
            ]);
            alertUseArco(t("t-opening-file"));
            const content = await fileManager.readFile(fileHandle);
            fillText(content, fileHandle.name);
        }
        catch (error) {
            console.error("Error opening file:", error);
            alertUseArco(t("t-error-opening-file"), 2000, { kind: "error" });
        }
    };
    const onClickOpenFolder = async () => {
        try {
            setIsLoading(true);
            let fileFolderManager = folderManager;
            fileFolderManager.stopWatching();
            const directoryHandle = await fileFolderManager.openDirectory();
            if (directoryHandle) {
                alertUseArco(t("t-file-manager-loading"), 1000, { kind: "info" });
                // 重置操作状态和监听器状态，为用户操作做好准备
                setIsProcessingUserOperation(false);
                setLastUserOperationTime(0);
                setOperationQueue([]);
                setWatcherHealthy(true);
                setWatchInterval(1500); // 初始化监听频率
                setConsecutiveNoChanges(0);
                setExpandedFolders(new Set());
                // 使用现有API并手动处理懒加载
                let folderTopStackArray = await fileFolderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 1);
                // 手动处理懒加载占位符和稳定ID
                const processTreeWithLazyLoading = (items, basePath = "", depth = 0) => {
                    return items.map((item) => {
                        const itemPath = basePath ? normalizePath(`${basePath}/${item.label}`) : normalizePath(item.label);
                        const processedItem = {
                            ...item,
                            id: generateStableId(itemPath, item.fileType),
                            path: itemPath
                        };
                        if (item.fileType === 'folder') {
                            if (shouldLazyLoad(itemPath, 'folder')) {
                                // 为深层文件夹添加懒加载占位符
                                processedItem.children = [{
                                        id: generateStableId(`${itemPath}/[lazy-placeholder]`, 'lazy-placeholder'),
                                        label: "...",
                                        fileType: "lazy-placeholder",
                                        path: `${itemPath}/[lazy-placeholder]`,
                                    }];
                            }
                            else if (item.children && Array.isArray(item.children)) {
                                // 递归处理子项
                                processedItem.children = processTreeWithLazyLoading(item.children, itemPath, depth + 1);
                            }
                        }
                        return processedItem;
                    });
                };
                folderTopStackArray = processTreeWithLazyLoading(folderTopStackArray);
                // 重新启动监听器 - 使用更短的监听间隔提高响应速度
                fileFolderManager.watchDirectory(intelligentWatchCallback, 1500);
                fileFolderManager.topDirectoryArray = folderTopStackArray;
                setFileDirectoryArr(folderTopStackArray);
                if (!folderTopStackArray || folderTopStackArray.length === 0) {
                    alertUseArco(t("t-file-manager-empty-folder"), 2000, { kind: "info" });
                }
                setTimeout(async () => {
                    try {
                        const requiredElements = {
                            monaco: window.monaco,
                            editor: window.editor,
                            body: document.body,
                            editorContainer: document.getElementById('monaco-editor-container'),
                            previewContainer: document.getElementById('preview')
                        };
                        const missingElements = Object.entries(requiredElements)
                            .filter(([key, element]) => !element)
                            .map(([key]) => key);
                        if (missingElements.length > 0) {
                            return;
                        }
                        if (window.editor && typeof window.editor.getModel === 'function' && window.editor.getModel()) {
                            await mdConverter(false);
                        }
                    }
                    catch (error) {
                        console.error('Error re-rendering markdown:', error);
                        if (error instanceof Error && error.message?.includes('ownerDocument')) {
                            // DOM ownership error - usually temporary
                        }
                    }
                }, 200);
            }
        }
        catch (error) {
            console.error("Error opening folder:", error);
            alertUseArco(t("t-error-opening-folder"), 2000, { kind: "error" });
        }
        finally {
            setIsLoading(false);
        }
    };
    const refreshDirectory = async () => {
        await userOperationRefresh('manual_refresh');
    };
    // 手动操作刷新函数，用于移动、删除、创建等操作后的立即同步
    const manualRefreshDirectory = React.useCallback(async (operationType = 'manual_operation') => {
        await userOperationRefresh(operationType);
    }, [userOperationRefresh]);
    const handleLazyLoad = React.useCallback(async (itemId, folderPath) => {
        setIsLazyLoading(true);
        try {
            const topDirHandle = folderManager.getTopDirectoryHandle();
            if (!topDirHandle)
                return;
            // 标准化路径并移除懒加载占位符
            const actualFolderPath = normalizePath(folderPath.replace('/[lazy-placeholder]', ''));
            // 更新懒加载时间戳，防止监听冲突
            folderManager.lastLazyLoadTime = Date.now();
            // 获取文件夹的实际内容
            try {
                const targetDirHandle = await folderManager.getDirectoryHandleByPath(topDirHandle, actualFolderPath);
                const actualChildren = [];
                const childEntries = [];
                for await (const [childName, childHandle] of targetDirHandle.entries()) {
                    childEntries.push([childName, childHandle]);
                }
                childEntries.sort((a, b) => a[0].localeCompare(b[0]));
                for (const [childName, childHandle] of childEntries) {
                    const childPath = normalizePath(`${actualFolderPath}/${childName}`);
                    const id = generateStableId(childPath, childHandle.kind);
                    if (childHandle.kind === 'file') {
                        actualChildren.push({
                            id,
                            label: childName,
                            fileType: 'file',
                            path: childPath
                        });
                    }
                    else {
                        // 文件夹根据深度决定是否添加懒加载占位符
                        const folderChildren = shouldLazyLoad(childPath, 'folder') ? [{
                                id: generateStableId(`${childPath}/[lazy-placeholder]`, 'lazy-placeholder'),
                                label: "...",
                                fileType: "lazy-placeholder",
                                path: `${childPath}/[lazy-placeholder]`,
                            }] : undefined;
                        actualChildren.push({
                            id,
                            label: childName,
                            fileType: 'folder',
                            path: childPath,
                            children: folderChildren
                        });
                    }
                }
                const updateFileTree = (items) => {
                    return items.map(item => {
                        if (normalizePath(item.path) === actualFolderPath && item.fileType === 'folder') {
                            return {
                                ...item,
                                children: actualChildren
                            };
                        }
                        if (item.children && Array.isArray(item.children)) {
                            return {
                                ...item,
                                children: updateFileTree(item.children)
                            };
                        }
                        return item;
                    });
                };
                const currentTree = Array.isArray(fileDirectoryArr) ? fileDirectoryArr : [];
                const updatedTree = updateFileTree(currentTree);
                folderManager.topDirectoryArray = updatedTree;
                setFileDirectoryArr(updatedTree);
                // 标记文件夹为已展开
                setExpandedFolders(prev => new Set([...prev, actualFolderPath]));
            }
            catch (error) {
                console.error('懒加载文件夹失败:', error);
            }
        }
        catch (error) {
            console.error('懒加载出错:', error);
        }
        finally {
            // 延迟重置懒加载状态，给智能监听一些缓冲时间
            setTimeout(() => {
                setIsLazyLoading(false);
            }, 1000);
        }
    }, [folderManager, fileDirectoryArr]);
    React.useEffect(() => {
        return () => {
            // 清理所有定时器
            if (systemRefreshRef.current) {
                clearTimeout(systemRefreshRef.current);
            }
            if (userOperationRef.current) {
                clearTimeout(userOperationRef.current);
            }
            if (watcherHealthCheckRef.current) {
                clearInterval(watcherHealthCheckRef.current);
            }
            folderManager.stopWatching();
        };
    }, []);
    React.useEffect(() => {
        if (folderManager.watchInterval !== null) {
            console.log('Watcher active, health status:', watcherHealthy);
        }
    }, [expandedFolders, watcherHealthy]);
    const startButtonStyle = { width: "53%", height: "6svh", mb: "10px" };
    const TransparentBackdrop = styled(Backdrop)({
        backgroundColor: "transparent",
    });
    const handleFileSelect = React.useCallback((filePath) => {
        setCurrentEditingFilePath(filePath);
        // 如果路径为空，清理相关状态
        if (!filePath || filePath.trim() === '') {
            setEditingFileName("");
            // 清理文件句柄，恢复到未打开本地文件状态
            if (fileManager.fileHandle) {
                fileManager.fileHandle = null;
            }
            console.log('Cleared current editing file state due to file move/rename');
        }
    }, [fileManager]);
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        ` }), _jsx(Drawer, { PaperProps: {
                    style: {
                        pointerEvents: "all",
                        zIndex: 99999,
                    },
                }, keepMounted: true, ModalProps: {
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    disableRestoreFocus: true,
                    style: {
                        pointerEvents: isPinned || isDragging ? "none" : "all",
                    },
                    BackdropComponent: (props) => (_jsx(TransparentBackdrop, { onDrop: () => {
                            setTimeout(() => {
                                window._setIsDragging(false);
                            }, 30);
                        }, ...props, className: "pointed-through-backdrop" })),
                }, anchor: "right", autoFocus: false, open: getFileManagerState(), onClose: toggleDrawer(false), children: _jsxs(Box, { sx: {
                        overflow: "hidden",
                        background: theme.palette.mode === "light" ? "#F9F9F9" : "dark",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        height: "100svh",
                    }, children: [_jsx(Box, { sx: {
                                width: "4.6svw",
                                height: "100svh",
                                display: "flex",
                                background: theme.palette.mode === "light" ? "#eeeeee" : "#414141",
                                alignItems: "center",
                                justifyContent: "center",
                            }, children: _jsxs(Stack, { sx: {
                                    width: 60,
                                    height: "100vh",
                                    alignItems: "center",
                                    paddingTop: 2,
                                }, children: [_jsx(SquareClickIconButton, { icon: _jsx(ArrowForwardIosIcon, {}), onClick: () => changeFileManagerState(false) }), _jsx(SquareClickIconButton, { icon: isPinned ? (_jsx(PushPinIcon, { sx: { transform: "rotate(45deg)" } })) : (_jsx(PushPinOutlinedIcon, { sx: { transform: "rotate(45deg)" } })), onClick: () => setIsPinned(!isPinned), tooltipText: "🧷" + t("t-file-manager-pinned") }), _jsx(SquareClickIconButton, { icon: _jsx(FileCopyIcon, {}), onClick: onClickOpenSingleFile, tooltipText: "📁" + t("t-file-manager-open-file") }), _jsx(SquareClickIconButton, { tooltipText: "📁" + t("t-file-manager-open-folder"), icon: _jsx(FolderIcon, {}), onClick: onClickOpenFolder }), _jsx(SquareClickIconButton, { tooltipText: "📑" + t("t-file-manager-saveAs"), icon: _jsx(SaveAltIcon, {}), onClick: () => fileManager.saveAsFile(getMdTextFromMonaco()) })] }) }), _jsxs(Box, { sx: {
                                width: "23svw",
                                height: "100svh",
                                display: "flex",
                                flexDirection: "column",
                            }, children: [_jsxs(Box, { sx: {
                                        width: "23svw",
                                        height: "10svh",
                                        alignItems: "center",
                                        mt: "4px",
                                        justifyContent: "center",
                                    }, className: "FLEX COW ALI-CEN JUS-CEN", children: [_jsx(Typography, { sx: { mr: "10px", fontSize: "17px" }, color: theme.palette.info.contrastText, children: t("t-file-manager-syncLocal") }), _jsx(SwitchIOS, { checked: getSettings().basic.fileEditLocal, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeFileEditLocalSwitch })] }), _jsx(Box, { className: "FLEX ALI-CEN JUS-CEN", sx: {
                                        display: "flex",
                                        height: "98%",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        marginBottom: "20svh",
                                    }, children: fileDirectoryArr.length != 0 ? (_jsx(_Fragment, { children: _jsx(ScrollableBox, { sx: { width: "100%", height: "100%" }, children: _jsx(FileExplorer, { folderManager: folderManager, fillText: fillText, setIsDragging: setIsDragging, fileDirectoryArr: fileDirectoryArr, onRefresh: refreshDirectory, onManualRefresh: manualRefreshDirectory, currentEditingFile: currentEditingFilePath, onFileSelect: handleFileSelect, onLoadLazily: handleLazyLoad }) }) })) : (_jsx(_Fragment, { children: _jsxs(Box, { className: "FLEX COL ALI-CEN JUS-CEN", sx: {
                                                width: "100%",
                                            }, children: [isLoading && (_jsxs(Box, { sx: { mb: 2, display: "flex", alignItems: "center", gap: 1 }, children: [_jsx("div", { style: {
                                                                animation: 'spin 1s linear infinite',
                                                                fontSize: '1.2rem',
                                                                color: theme.palette.primary.main
                                                            }, children: "\u27F3" }), _jsx(Typography, { variant: "body2", color: "primary", children: t("t-file-manager-loading") })] })), _jsx(Typography, { children: getSettings().basic.fileEditLocal ? editingFileName : "" }), _jsx(Button, { sx: startButtonStyle, onClick: onClickOpenSingleFile, variant: "contained", color: "primary", disabled: isLoading, children: t("t-file-manager-open-file") }), _jsx(Button, { sx: startButtonStyle, variant: "contained", color: "primary", onClick: onClickOpenFolder, disabled: isLoading, children: t("t-file-manager-open-folder") }), _jsx(Button, { sx: startButtonStyle, variant: "contained", onClick: () => {
                                                        fileManager.saveAsFile(getMdTextFromMonaco());
                                                    }, disabled: isLoading, children: t("t-file-manager-saveAs") })] }) })) })] })] }) })] }));
});
export default FileDrawer;
function SquareClickIconButton({ icon, onClick, tooltipText, }) {
    const theme = useTheme();
    const button = (_jsx(Button, { sx: {
            width: "4.6svw",
            height: "4.6svw",
            backgroundColor: "transparent",
            "&:hover": {
                backgroundColor: theme.palette.action.hover,
                borderRadius: "0",
            },
            "& .MuiTouchRipple-rippleVisible": {
                animation: "MuiTouchRipple-keyframes-enter 550ms cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "scale(3)",
            },
            "& .MuiTouchRipple-child": {
                backgroundColor: theme.palette.primary.main,
            },
        }, onClick: onClick, color: "inherit", children: icon }));
    return tooltipText ? (_jsx(Tooltip, { sx: { whiteSpace: "normal" }, TransitionComponent: Zoom, enterDelay: 200, placement: "left", title: tooltipText, children: button })) : (button);
}
