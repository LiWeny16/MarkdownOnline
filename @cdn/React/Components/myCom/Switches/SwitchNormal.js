import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import Switch from '@mui/material/Switch';
export default function ControlledSwitches() {
    const [checked, setChecked] = React.useState(true);
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    return (_jsx(Switch, { checked: checked, onChange: handleChange, inputProps: { 'aria-label': 'controlled' } }));
}
