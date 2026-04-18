import { Component, input, effect } from '@angular/core';
import { ColumnConfig } from './models/column-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T> {
  private styleCache = new WeakMap<object, Map<string, Partial<CSSStyleDeclaration>>>();
  private readonly DEFAULT_COLUMN_CONFIG: Partial<ColumnConfig<T>> = {
    dataCellStyles: (col, row, context) => { return {}; },
    headerCellStyles: {},
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

  constructor() {
    effect(() => {
      // Whenever the rows input changes, we need to clear the stylesCache.
      this.rows();
      this.styleCache = new WeakMap();
    });
  }

  getDataCellStyles(column: ColumnConfig<T>, row: T): Partial<CSSStyleDeclaration> {
    /* 
      This method is called automatically for every data cell "<td>" on every change detection cycle. 
      If there are alot of rows and if the styles are expensive to compute,
      this can add up and impact performance. Best to cache the results.
    */
    if (!column.dataCellStyles) {
      return {};
    }
    if (!this.styleCache.has(<object>row)) {
      this.styleCache.set(<object>row, new Map());
    }
    const rowCache = this.styleCache.get(<object>row);
    if (!rowCache?.has(<string>column.key)) {
      rowCache?.set(
        <string>column.key,
        column.dataCellStyles(column, row, this.context())
      );
    }
    return rowCache?.get(<string>column.key) || {};
  }

  getCellValue(col: ColumnConfig<T>, row: T) {
    /* TODO: May need to cache the result like we're doing with getDataCellStyles above*/
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
