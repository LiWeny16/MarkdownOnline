import React from 'react';
import { getTableMetadata } from '@App/text/tableEditor';
import { tableSyncManager } from '@App/text/tableEditor';

// TableManager is imported lazily to avoid circular deps
// ReactTable is imported dynamically inside createTableRoot

class TableManager {
  private static instance: TableManager;
  private mountedRoots = new Map<string, any>();
  private lastTableStates = new Map<string, string>();
  private pendingRoots = new Set<string>();

  static getInstance(): TableManager {
    if (!TableManager.instance) {
      TableManager.instance = new TableManager();
    }
    return TableManager.instance;
  }

  mountTables() {
    const placeholders = document.querySelectorAll('[data-react-table]') as NodeListOf<HTMLElement>;
    const currentTableIds = new Set<string>();

    placeholders.forEach((placeholder, index) => {
      const tableId = placeholder.getAttribute('data-table-id');
      if (!tableId) {
        console.warn(`表格占位符 ${index} 缺少 data-table-id`);
        return;
      }

      currentTableIds.add(tableId);

      const registryMetadata = getTableMetadata(tableId);
      const currentTableHash = registryMetadata?.tableHash || null;
      const lastHash = this.lastTableStates.get(tableId);
      const existingRoot = this.mountedRoots.get(tableId);
      const hasContent = placeholder.children.length > 0;
      const isPending = this.pendingRoots.has(tableId);

      if (!currentTableHash) {
        console.warn(`表格 ${tableId} 在注册表中未找到，跳过处理`);
        return;
      }

      if (isPending) return;

      if (existingRoot && currentTableHash === lastHash && hasContent) return;

      if (existingRoot && (!hasContent || currentTableHash !== lastHash)) {
        this.updateTable(tableId, currentTableHash);
        return;
      }

      if (!existingRoot) {
        this.createTableRoot(placeholder, tableId, currentTableHash);
      }
    });

    this.cleanupUnusedRoots(currentTableIds);
  }

  private createTableRoot(placeholder: HTMLElement, tableId: string, tableHash: string | null) {
    if (this.pendingRoots.has(tableId)) return;
    this.pendingRoots.add(tableId);

    try {
      placeholder.innerHTML = '';
      placeholder.style.border = 'none';
      placeholder.style.background = 'transparent';
      placeholder.style.minHeight = 'auto';
      placeholder.style.padding = '0';
      placeholder.style.margin = '16px 0';

      import('react-dom/client').then(({ createRoot }) => {
        if (!document.contains(placeholder)) {
          console.warn(`表格 ${tableId} 的占位符已被移除`);
          this.pendingRoots.delete(tableId);
          return;
        }

        if (this.mountedRoots.has(tableId)) {
          this.pendingRoots.delete(tableId);
          return;
        }

        import('./ReactTable').then(({ ReactTable }) => {
          const root = createRoot(placeholder);
          root.render(React.createElement(ReactTable, { tableId }));
          this.mountedRoots.set(tableId, root);
          if (tableHash) this.lastTableStates.set(tableId, tableHash);
          this.pendingRoots.delete(tableId);
        }).catch(e => {
          console.error(`加载 ReactTable 失败:`, e);
          this.pendingRoots.delete(tableId);
        });
      }).catch(e => {
        console.error(`创建表格 ${tableId} 根节点失败:`, e);
        this.pendingRoots.delete(tableId);
      });
    } catch (e) {
      console.error(`为表格 ${tableId} 创建根节点时发生错误:`, e);
      this.pendingRoots.delete(tableId);
    }
  }

  private updateTable(tableId: string, tableHash: string | null) {
    const root = this.mountedRoots.get(tableId);
    if (root && tableHash) {
      try {
        import('./ReactTable').then(({ ReactTable }) => {
          root.render(React.createElement(ReactTable, {
            tableId,
            key: `${tableId}-${tableHash}`
          }));
          this.lastTableStates.set(tableId, tableHash);
        }).catch(e => console.error(`更新表格 ${tableId} 失败:`, e));
      } catch (e) {
        console.error(`更新表格 ${tableId} 失败:`, e);
      }
    }
  }

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
    toDelete.forEach(tableId => {
      this.mountedRoots.delete(tableId);
      this.lastTableStates.delete(tableId);
      this.pendingRoots.delete(tableId);
      tableSyncManager.clearTableListeners(tableId);
    });
  }

  forceRemountAllTables() {
    this.unmountAllTables();
    this.mountTables();
  }

  unmountAllTables() {
    this.mountedRoots.forEach((root, tableId) => {
      try {
        root.unmount();
        tableSyncManager.clearTableListeners(tableId);
      } catch (e) {
        console.warn(`卸载表格 ${tableId} 失败:`, e);
      }
    });
    this.mountedRoots.clear();
    this.lastTableStates.clear();
    this.pendingRoots.clear();
    tableSyncManager.clearAllListeners();
  }

  getDebugInfo() {
    return {
      mountedRootsCount: this.mountedRoots.size,
      tableStatesCount: this.lastTableStates.size,
      pendingRootsCount: this.pendingRoots.size,
      mountedTableIds: Array.from(this.mountedRoots.keys()),
      pendingTableIds: Array.from(this.pendingRoots),
      tableStates: Object.fromEntries(this.lastTableStates),
      syncListenersCount: (tableSyncManager as any).syncListeners?.size || 0
    };
  }
}

export { TableManager };
