import { ColumnConfig } from "./column-config";

export interface TableRow<T> {
    data: T;
    styles: Record<keyof T, Partial<CSSStyleDeclaration>>;
    selectable: boolean;
    // selected: boolean; // just keep track of selected rows with a Set(). No need for checkboxes.
    // Checkboxes can be implemented by the "dataCellComponent" prop of ColumnConfig (implement later!)
}

export interface DataTableRowSelectable<T> {
    isRowSelectable(row: T, context: any): boolean;
}

export interface RowClickEvent<T> {
    column: ColumnConfig<T>;
    context: any;
    // gridApi: GridApi; // Add later!
    row: T;
    mouseEvent: MouseEvent;
}
