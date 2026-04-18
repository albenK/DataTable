
export interface ColumnConfig<T> {
    dataCellStyles?: (column: ColumnConfig<T>, row: T, context: any) => Partial<CSSStyleDeclaration>;
    headerCellStyles?: Partial<CSSStyleDeclaration>;
    hide?: boolean;
    key: keyof T;
    label: string;
    maxWidth?: number;
    minWidth?: number;
    // sortable?: boolean;
    valueFormatter?(column: ColumnConfig<T>, row: T, context: any): string;
}
