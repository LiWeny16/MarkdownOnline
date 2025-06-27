import React from "react";
interface TableRowData {
    [key: string]: string | number;
}
interface EditableTableProps {
    initialData: TableRowData[];
}
declare const EditableTable: React.FC<EditableTableProps>;
export default EditableTable;
