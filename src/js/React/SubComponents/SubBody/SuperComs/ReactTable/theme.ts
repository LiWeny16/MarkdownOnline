import { alpha } from '@mui/material';
import { getTheme } from '@App/config/change';

export const restrictToVerticalAxis = ({ transform }: any) => {
  return {
    ...transform,
    x: 0,
  };
};

export const getTableThemeStyles = () => {
  const isDark = getTheme() === 'dark';

  return {
    paperBackground: isDark ? '#1e1e1e' : '#ffffff',
    paperBorder: isDark ? '1px solid #808080' : 'none',

    cellBackground: isDark ? '#1e1e1e' : '#ffffff',
    cellHoverBackground: isDark ? '#2d2d30' : '#f5f5f5',
    cellSelectedBackground: isDark ? alpha('#569cd6', 0.2) : alpha('#1976d2', 0.12),
    cellActiveBackground: isDark ? alpha('#569cd6', 0.15) : alpha('#1976d2', 0.08),
    cellBorder: isDark ? '#3e3e42' : '#e0e0e0',
    cellText: isDark ? '#d8d8d8ff' : '#000000',

    headerBackground: isDark ? '#1e1e1e' : '#f5f5f5',
    headerText: isDark ? '#cdcdcdff' : '#000000',
    headerHoverBackground: isDark ? '#2d2d30' : '#eeeeee',

    toolbarBackground: isDark ? '#1e1e1e' : 'transparent',
    toolbarBorder: isDark ? '#808080' : '#e0e0e0',

    buttonColor: isDark ? '#cccccc' : '#1976d2',
    buttonHoverBackground: isDark ? '#2d2d30' : alpha('#1976d2', 0.04),

    editorBackground: isDark ? '#1e1e1e' : '#ffffff',
    editorBorder: isDark ? '1px solid #569cd6' : '1px solid #1976d2',
    editorFocusBorder: isDark ? '2px solid #569cd6' : '2px solid #1976d2',

    selectedRowBackground: isDark ? alpha('#569cd6', 0.2) : alpha('#1976d2', 0.08),
    selectedRowHoverBackground: isDark ? alpha('#569cd6', 0.25) : alpha('#1976d2', 0.12),
  };
};
