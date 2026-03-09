import { TableData, StandardTableData } from '@Func/Parser/mdItPlugin/table';
import { getTableThemeStyles } from './theme';

export interface ReactTableProps {
  tableId?: string;
  tableData?: TableData;
}

export interface EditingCell {
  rowIndex: number;
  colIndex: number;
  value: string;
  width?: number;
  height?: number;
}

export type Order = 'asc' | 'desc';

export interface SortConfig {
  order: Order;
  orderBy: string;
}

export interface SelectedCell {
  rowIndex: number;
  colIndex: number;
}

export interface ActiveCell {
  rowIndex: number;
  colIndex: number;
}

export interface DraggableTableRowProps {
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
  totalColumns: number;
  themeStyles: ReturnType<typeof getTableThemeStyles>;
}
