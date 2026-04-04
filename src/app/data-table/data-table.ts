import { Component, input } from '@angular/core';
import { ColumnConfig } from './models/column-config';

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T> {
  columns = input<ColumnConfig<T>[]>([]);
  rows = input<T[]>([]);


  trackCol(col: ColumnConfig<T>, index: number) {
    return `${String(col.key)} ${index}`;
  }

  trackRow(row: T, index: number) {
    return `${index}`;
  }
}
