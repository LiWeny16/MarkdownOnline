import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

// 定义数据类型
interface TableRowData {
  [key: string]: string | number; // 支持字符串和数字类型
}

// 定义组件 Props 类型
interface EditableTableProps {
  initialData: TableRowData[]; // 传入的表格数据是对象数组
}

// 使用 React.FC 明确类型
const EditableTable: React.FC<EditableTableProps> = ({ initialData }) => {
  const [data, setData] = useState<TableRowData[]>(initialData);

  // 处理单元格编辑
  const handleEdit = (rowIndex: number, columnId: string, value: string) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
      return updatedData;
    });
  };

  return (
    <TableContainer data-rendered="true" className="rendered" component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {/* 确保 data 不为空，否则 data[0] 可能会导致错误 */}
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.entries(row).map(([columnId, cellValue]) => (
                <TableCell key={columnId}>
                  <TextField
                    value={cellValue}
                    onChange={(e) => handleEdit(rowIndex, columnId, e.target.value)}
                    variant="standard"
                    size="small"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableTable;
