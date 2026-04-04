
export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
}


// export interface DefaultColumnConfig<T> {
//     hide?: boolean;
//     sortable?: boolean;
// }
