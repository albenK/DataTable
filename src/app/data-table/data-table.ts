import { Component, input, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnConfig, SortDirections } from './models/column-config';
import { TableRow } from './models/table-row';

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

  // Local variables
  sortDirection: SortDirections | null = null; // asc or desc
  sortColumn: ColumnConfig<T> | null = null; // column we're sorting by.

  constructor() { }

  displayedColumns = computed(() => {
    const allColumns = this.columns();
    const defaultColConfig = this.defaultColumnConfig();
    this.sortColumn = null;
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
      this.sortColumn = sortCol;
      this.sortDirection = this.sortColumn.sortDirection || null;
    }
    return cols;
  });

  // sortedRows = computed(() => {
  //   const rows = [ ...this.rows() ];
  //   if (!this.sortColumn || !this.sortDirection) {
  //     return [ ...rows ];
  //   }

  //   return rows.sort((a, b) => {
  //     return -1;
  //   });
  // });

  displayedRows = computed(() => {
    return this.rows().map((row) => {
      const styles = Object.fromEntries(
        this.displayedColumns()
          .filter((col) => {
            return !!col.key && !!col.dataCellStyles;
          })
          .map((col) => {
            if (!!col.dataCellStyles) {
              return [
                col.key,
                col.dataCellStyles && col.dataCellStyles(col, row, this.context)
              ];
            }
            return [];
          })
      );
      const tableRow: TableRow<T> = {
        data: row,
        styles: styles
      };
      return tableRow;
    });
  });

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
