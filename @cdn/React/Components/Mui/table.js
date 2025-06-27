import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, } from "@mui/material";
// 使用 React.FC 明确类型
const EditableTable = ({ initialData }) => {
    const [data, setData] = useState(initialData);
    // 处理单元格编辑
    const handleEdit = (rowIndex, columnId, value) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
            return updatedData;
        });
    };
    return (_jsx(TableContainer, { "data-rendered": "true", className: "rendered", component: Paper, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsx(TableRow, { children: data.length > 0 &&
                            Object.keys(data[0]).map((key) => (_jsx(TableCell, { children: key }, key))) }) }), _jsx(TableBody, { children: data.map((row, rowIndex) => (_jsx(TableRow, { children: Object.entries(row).map(([columnId, cellValue]) => (_jsx(TableCell, { children: _jsx(TextField, { value: cellValue, onChange: (e) => handleEdit(rowIndex, columnId, e.target.value), variant: "standard", size: "small" }) }, columnId))) }, rowIndex))) })] }) }));
};
export default EditableTable;
