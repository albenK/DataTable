import { Component, input, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnConfig } from './models/column-config';
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
    maxWidth: 300
    // sortable: true
  };
  // inputs
  columns = input<ColumnConfig<T>[]>([]);
  @Input() context: any = undefined;
  defaultColumnConfig = input(this.DEFAULT_COLUMN_CONFIG);
  rows = input<T[]>([]);

  constructor() { }

  displayedColumns = computed(() => {
    const allColumns = this.columns();
    const defaultColConfig = this.defaultColumnConfig();
    return allColumns.map((col) => {
      const merged: ColumnConfig<T> = {
        ...this.DEFAULT_COLUMN_CONFIG,
        ...defaultColConfig,
        ...col
      };
      return merged;
    });
  });

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
