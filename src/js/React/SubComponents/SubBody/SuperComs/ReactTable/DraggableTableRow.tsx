import React from 'react';
import {
  TableCell,
  TableRow,
  IconButton,
  Box,
  Checkbox,
  alpha
} from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableTableRowProps } from './types';

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
  totalColumns,
  themeStyles
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
          backgroundColor: isDragging ? themeStyles.cellHoverBackground : themeStyles.cellBackground
        },
        '&:hover': {
          backgroundColor: isEditMode ? alpha('#1976d2', 0.08) : themeStyles.cellHoverBackground
        },
        cursor: isEditMode ? 'pointer' : 'default'
      }}
      onClick={(event) => {
        if (isEditMode) {
          onRowClick(event, rowIndex);
        }
      }}
    >
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
                    if (prev.includes(rowIndex)) return prev;
                    return [...prev, rowIndex];
                  });
                  setLastSelectedIndex(rowIndex);
                }
              }}
              inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
            />
            <IconButton
              size="small"
              {...attributes}
              {...listeners}
              sx={{
                cursor: 'grab',
                opacity: 0.6,
                '&:hover': { opacity: 1 },
                '&:active': { cursor: 'grabbing' },
                touchAction: 'none'
              }}
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
            width: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`,
            minWidth: 0,
            maxWidth: `${100 / (totalColumns + (isEditMode ? 1 : 0))}%`,
            padding: 0,
            '& > *': { width: '100%', maxWidth: '100%' }
          }}
          onClick={(event) => {
            if (isEditMode) event.stopPropagation();
          }}
        >
          {renderCellContent(cell, rowIndex, colIndex)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default DraggableTableRow;
