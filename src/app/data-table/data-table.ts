import { Component, input, computed } from '@angular/core';
import { ColumnConfig } from './models/column-config';
import { CommonModule } from '@angular/common';

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
  context = input<any>(undefined);
  defaultColumnConfig = input(this.DEFAULT_COLUMN_CONFIG);
  rows = input<T[]>([]);

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


  constructor() {}

  getDataCellStyles(column: ColumnConfig<T>, row: T): Partial<CSSStyleDeclaration> {
    if (!column.dataCellStyles) {
      return {};
    }
    return column.dataCellStyles(column, row, this.context());
  }

  getCellValue(col: ColumnConfig<T>, row: T) {
    if (!!col.valueFormatter) {
      return col.valueFormatter(col, row, this.context());
    }
    return row[col.key];
  }

  trackCol(col: ColumnConfig<T>, index: number) {
    return `${String(col.key)} ${index}`;
  }

  trackRow(row: T, index: number) {
    return `${index}`;
  }
}
