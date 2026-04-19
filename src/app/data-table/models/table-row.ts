export interface TableRow<T> {
    data: T;
    styles: Record<keyof T, Partial<CSSStyleDeclaration>>;
    //TODO: Pass a "rowSelectable input into data table comp. Should be a function that returns boolean.
    // Function should be something like rowSelectable(row: T, context, gridApi): boolean"
    // selectable: boolean;
    // selected: boolean; // just keep track of selected rows with a Set(). No need for checkboxes.
    // Checkboxes can be implemented by the "dataCellComponent" prop of ColumnConfig (implement later!)
}
