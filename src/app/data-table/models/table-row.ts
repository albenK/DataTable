import { ColumnConfig } from "./column-config";
import { GridApi } from "./grid-api";

export interface TableRow<T> {
    data: T;
    styles: Record<keyof T, Partial<CSSStyleDeclaration>>;
}

export interface DataTableRowSelectable<T> {
    rowSelectable(row: T, context: any, gridApi: GridApi<T>): boolean;
}

export interface RowClickEvent<T> {
    column: ColumnConfig<T>;
    context: any;
    gridApi: GridApi<T>;
    row: T;
    mouseEvent: MouseEvent;
}
