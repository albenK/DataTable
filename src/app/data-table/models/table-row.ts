import { ColumnConfig } from "./column-config";
import { GridApi } from "./grid-api";

export interface TableRow<T> {
    data: T;
    styles: Record<keyof T, Partial<CSSStyleDeclaration>>;
    // selectedStyles: Record<keyof T, Partial<CSSStyleDeclaration>>;
    selectable: boolean;
    selected: boolean;
}

export interface DataTableRowSelectable<T> {
    isRowSelectable(row: T, context: any): boolean;
}

export interface DataTableRowSelected<T> {
    isRowSelected(row: T, context: any): boolean;
}

export interface RowClickEvent<T> {
    column: ColumnConfig<T>;
    context: any;
    gridApi: GridApi<T>;
    row: T;
    mouseEvent: MouseEvent;
}
