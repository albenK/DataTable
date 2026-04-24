

export interface ColumnConfig<T> {
    dataCellStyles?: (column: ColumnConfig<T>, row: T, context: any) => Partial<CSSStyleDeclaration>;
    headerCellStyles?: Partial<CSSStyleDeclaration>;
    hide?: boolean;
    key: keyof T;
    label: string;
    maxWidth?: number;
    minWidth?: number;
    sortable?: boolean;
    sortDirection?: SortDirections;
    sortComparator?(a: T, b: T, sortDirection: SortDirections): -1 | 0 | 1;
    valueFormatter?(column: ColumnConfig<T>, row: T, context: any): string;
}

export enum SortDirections  {
    ASC = 'asc',
    DESC = 'desc'
};
