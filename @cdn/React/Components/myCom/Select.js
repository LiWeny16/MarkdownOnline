import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function BasicSelect() {
    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (_jsx(Box, { sx: { minWidth: 120 }, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "demo-simple-select-label", children: "Age" }), _jsxs(Select, { labelId: "demo-simple-select-label", id: "demo-simple-select", value: age, label: "Age", onChange: handleChange, children: [_jsx(MenuItem, { value: 10, children: "Ten" }), _jsx(MenuItem, { value: 20, children: "Twenty" }), _jsx(MenuItem, { value: 30, children: "Thirty" })] })] }) }));
}
