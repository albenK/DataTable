
export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    valueFormatter?(column: ColumnConfig<T>, row: T): string;
}

// export interface DefaultColumnConfig<T> {
//     dataCellStyles?(): { [cssProp: string]: any; };
//     headerCellStyles?(): { [cssProp: string]: any };
//     hide?: boolean;
//     sortable?: boolean;
// }
