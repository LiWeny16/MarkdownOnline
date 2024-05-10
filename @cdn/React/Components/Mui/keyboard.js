import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Typography from '@mui/material/Typography';
import KeyboardIcon from '@mui/icons-material/Keyboard';
function ShortcutExample() {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx(KeyboardIcon, {}), _jsx(Typography, { variant: "body1", component: "span", style: { margin: '0 4px' }, children: "Ctrl + C" })] }));
}
export default ShortcutExample;
