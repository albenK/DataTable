import { Component, input, computed, Input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnConfig, SortDirections } from './models/column-config';
import { DataTableRowSelectable, DataTableRowSelected, RowClickEvent, TableRow } from './models/table-row';
import { GridApi } from './models/grid-api';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T> {
  private readonly DEFAULT_COLUMN_CONFIG: Partial<ColumnConfig<T>> = {
    hide: false,
    minWidth: 90,
    maxWidth: 300,
    sortable: true
  };
  // input signals
  columns = input<ColumnConfig<T>[]>([]);
  defaultColumnConfig = input<Partial<ColumnConfig<T>>>(this.DEFAULT_COLUMN_CONFIG);
  rows = input<T[]>([]);

  // Normal @Inputs()
  @Input() context: any = undefined;
  @Input() rowSelectable!: DataTableRowSelectable<T>;
  @Input() rowSelected!: DataTableRowSelected<T>;

  // Outputs
  onRowClick = output<RowClickEvent<T>>();

  // Local variables
  sortDirection: SortDirections | null = null; // asc or desc
  sortByColumn: ColumnConfig<T> | null = null; // column we're sorting by.

  private _refreshDisplayedRows = signal<boolean>(false);
  gridApi = new GridApi<T>(this);

  constructor() { }

  displayedColumns = computed(() => {
    const allColumns = this.columns();
    const defaultColConfig = this.defaultColumnConfig();
    this.sortByColumn = null;
    this.sortDirection = null;
    let sortCol!: ColumnConfig<T>;
    const cols = allColumns.map((col) => {
      const merged: ColumnConfig<T> = {
        ...this.DEFAULT_COLUMN_CONFIG,
        ...defaultColConfig,
        ...col
      };
      if (!!merged.sortDirection) {
        sortCol = merged;
      }
      return merged;
    });

    if (!!sortCol) {
      this.sortByColumn = sortCol;
      this.sortDirection = this.sortByColumn.sortDirection || null;
    }
    return cols;
  });

  displayedRows = computed(() => {
    const rows = [ ...this.rows()];
    this._refreshDisplayedRows();

    // if there is no column to sort by...
    if (!this.sortByColumn || !this.sortDirection) {
      return this.mapedRows(rows); // return all rows.
    }
    // Else, we can sort since both sortByColumn and sortDirection exist.
    const sortedRows = rows.sort((a, b) => {
      if (!!this.sortByColumn && !!this.sortByColumn.sortComparator) {
        return this.sortByColumn.sortComparator(a, b, this.sortByColumn, this.sortDirection!, this.context);
      }
      return this.defaultSortComparator(a, b, this.sortByColumn!, this.sortDirection!);
    });
    return this.mapedRows(sortedRows);
  });

  defaultSortComparator(a: T, b: T, sortByColumn: ColumnConfig<T>, sortDirection: SortDirections): number {
    const valueA: any = a[sortByColumn.key];
    const valueB: any = b[sortByColumn.key];
    const isANullOrUndefined: boolean = valueA === null || valueA === undefined;
    const isBNullOrUndefined: boolean = valueB === null || valueB === undefined;
    if (isANullOrUndefined && isBNullOrUndefined) {
      return 0;
    }
    const dir = sortDirection === SortDirections.ASC ? 1 : -1;
    if (isANullOrUndefined) {
      // row for valueB should appear first if asc. Otherwise it should be 2nd.
      return 1 * dir;
    }
    if (isBNullOrUndefined) {
      // row for valueA should appear first if asc. Otherwise it should be 2nd.
      return -1 * dir;
    }
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const localCompare: number = valueA.localeCompare(valueB);
      return localCompare * dir;
    }
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * dir;
    }
    return String(valueA).localeCompare(String(valueB)) * dir;
  }

  mapedRows(rows: T[]): TableRow<T>[] {
    const columns = this.displayedColumns();
    const columnsWithDataCellStyle = columns.filter(col => !!col.key && !!col.dataCellStyles);
    return rows.map((row) => {
      const selectable = !!this.rowSelectable ? this.rowSelectable.isRowSelectable(row, this.context): false;
      const selected: boolean = selectable && (!!this.rowSelected ? this.rowSelected.isRowSelected(row, this.context): false);
      
      const styles = Object.fromEntries(
        columnsWithDataCellStyle
          .map((col) => {
            if (!!col.dataCellStyles) {
              const cellStyles = typeof col.dataCellStyles === 'function' ? col.dataCellStyles(col, row, selectable, selected, this.context): col.dataCellStyles;
              return [
                col.key,
                cellStyles
              ];
            }
            return [];
          })
      );

      const tableRow: TableRow<T> = {
        data: row,
        selectable: selectable,
        selected: selected,
        styles: styles
      };
      return tableRow;
    });
  }

  refreshDisplayedRows() {
    this._refreshDisplayedRows.update(v => !v);
  }

  onSortClick(col: ColumnConfig<T>) {
    if (this.sortByColumn === col) {
      if (this.sortDirection === SortDirections.ASC) {
        this.sortDirection = SortDirections.DESC;
      }
      else {
        this.sortByColumn = null;
        this.sortDirection = null;
      }
    }
    else {
      this.sortByColumn = col;
      this.sortDirection = SortDirections.ASC;
    }
    this.refreshDisplayedRows();
  }

  rowClickHandler(row: TableRow<T>, col: ColumnConfig<T>, event: MouseEvent) {
    this.onRowClick.emit({
      column: col,
      context: this.context,
      gridApi: this.gridApi,
      mouseEvent: event,
      row: row.data
    });
  }

  getCellValue(col: ColumnConfig<T>, tableRow: TableRow<T>) {
    if (!!col.valueFormatter) {
      return col.valueFormatter(col, tableRow.data, this.context);
    }
    return tableRow.data[col.key];
  }

  trackCol(col: ColumnConfig<T>, index: number) {
    return `${String(col.key)} ${index}`;
  }

  trackRow(tableRow: TableRow<T>, index: number) {
    return `${index}`;
  }
}
