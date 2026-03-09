import React from 'react';
import {
  TableHead as MuiTableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  Box
} from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { TableData } from '@Func/Parser/mdItPlugin/table';
import { SortConfig, EditingCell } from './types';
import { getTableThemeStyles } from './theme';

interface TableHeadProps {
  data: TableData;
  isEditMode: boolean;
  selectedRows: number[];
  sortConfig: SortConfig;
  editingCell: EditingCell | null;
  themeStyles: ReturnType<typeof getTableThemeStyles>;
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (property: string) => void;
  startEdit: (rowIndex: number, colIndex: number) => void;
  renderEditor: (currentValue: string, rowIndex: number, colIndex: number) => React.ReactNode;
}

const TableHeadSection: React.FC<TableHeadProps> = ({
  data,
  isEditMode,
  selectedRows,
  sortConfig,
  editingCell,
  themeStyles,
  handleSelectAllClick,
  handleRequestSort,
  startEdit,
  renderEditor,
}) => {
  return (
    <MuiTableHead>
      <TableRow sx={{
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
      }}>
        {isEditMode && (
          <TableCell padding="checkbox" sx={{ width: 80 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                color="primary"
                indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
                checked={data.rows.length > 0 && selectedRows.length === data.rows.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all rows' }}
              />
              <DragIndicatorIcon fontSize="small" sx={{ opacity: 0.5, cursor: 'default' }} />
            </Box>
          </TableCell>
        )}

        {data.headers.map((header, colIndex) => (
          <TableCell key={colIndex} sx={{
            width: `${100 / data.headers.length}%`,
            minWidth: 0,
            maxWidth: `${100 / data.headers.length}%`,
            padding: '4px 8px',
            '& > *': { width: '100%', maxWidth: '100%' }
          }}>
            <TableSortLabel
              active={isEditMode && sortConfig.orderBy === header}
              direction={sortConfig.orderBy === header ? sortConfig.order : 'asc'}
              onClick={() => { if (isEditMode) handleRequestSort(header); }}
              disabled={!isEditMode}
              sx={{
                width: '100%',
                '&.Mui-disabled': { opacity: 1, color: 'inherit' }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  minHeight: '32px',
                  cursor: isEditMode ? 'text' : 'default',
                  padding: '6px 8px',
                  width: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  '&:hover': {
                    backgroundColor: isEditMode ? themeStyles.headerHoverBackground : 'transparent'
                  }
                }}
                onClick={(e) => {
                  if (isEditMode) {
                    e.stopPropagation();
                    startEdit(-1, colIndex);
                  }
                }}
              >
                {editingCell?.rowIndex === -1 && editingCell?.colIndex === colIndex ? (
                  renderEditor(header, -1, colIndex)
                ) : (
                  <span style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    display: 'block',
                    color: themeStyles.headerText,
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
    </MuiTableHead>
  );
};

export default TableHeadSection;
