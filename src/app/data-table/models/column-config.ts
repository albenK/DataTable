

export interface ColumnConfig<T> {
    dataCellStyles?: Partial<CSSStyleDeclaration> | ((column: ColumnConfig<T>, row: T, context: any) => Partial<CSSStyleDeclaration>);
    headerCellStyles?: Partial<CSSStyleDeclaration>;
    hide?: boolean;
    key: keyof T;
    label: string;
    maxWidth?: number;
    minWidth?: number;
    sortable?: boolean;
    sortDirection?: SortDirections;
    sortComparator?(a: T, b: T, sortByColumn: ColumnConfig<T>, sortDirection: SortDirections, context: any): number;
    valueFormatter?(column: ColumnConfig<T>, row: T, context: any): string;
}

export enum SortDirections  {
    ASC = 'asc',
    DESC = 'desc'
};
