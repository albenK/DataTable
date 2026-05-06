import { Component, signal } from '@angular/core';
import { formatNumber } from '@angular/common';

import { DataTable } from "./data-table/data-table";
import { ColumnConfig } from './data-table/models/column-config';
import { DataTableRowSelectable, RowClickEvent } from './data-table/models/table-row';
import { GridApi } from './data-table/models/grid-api';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
}

const EMPLOYEE_TABLE_COLUMNS: Array<ColumnConfig<Employee>> = [
  { key: 'name', label: 'Name', },
  { key: 'department', label: 'Department' },
  {
    key: 'salary',
    label: 'Salary',
    valueFormatter: (column, row, context) => {
      const value: number = Number(row[column.key]) || 0;
      return formatNumber(value, 'en-US');
    }
  },
  {
    dataCellStyles: (column, row, rowSelectable, rowSelected, context, gridApi) => {
      const value = row.status || '';
      if (value.toLowerCase() === 'inactive' && !rowSelected) {
        return {
          color: 'var(--ColorDanger)'
        };
      }
      else if (value.toLowerCase() === 'inactive' && rowSelected) {
        return {
          color: 'var(--ColorPrimaryTint)'
        };
      }
      return {};
    },
    key: 'status',
    label: 'Status'
  },
];

const EMPLOYEE_TABLE_ROWS: Employee[] = [
  { id: 4, name: 'David Park', department: 'Marketing', salary: 87000, status: 'active' },
  { id: 2, name: 'Bob Martínez', department: 'Design', salary: 95000, status: 'active' },
  { id: 3, name: 'Carol Smith', department: 'Engineering', salary: 135000, status: 'inactive' },
  { id: 1, name: 'Alice Nguyen', department: 'Engineering', salary: 120000, status: 'active' },
];

class EmployeeRowSelectable implements DataTableRowSelectable<Employee> {
  compRef: App;
  constructor(parentComp: App) { 
    this.compRef = parentComp;
  }

  rowSelectable(row: Employee, context: any, gridApi: GridApi<Employee>): boolean {
    // We can write whatever logic we want.
    // if (row.status === 'active') {
    //   return true;
    // }
    // return false;
    return true; // All rows are clickable/selectable.
  }
}

@Component({
  selector: 'app-root',
  imports: [DataTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  columns = signal<ColumnConfig<Employee>[]>(EMPLOYEE_TABLE_COLUMNS);
  rows = signal<Employee[]>(EMPLOYEE_TABLE_ROWS);
  defaultColumnConfig = signal<Partial<ColumnConfig<Employee>>>({
    maxWidth: 250,
    minWidth: 60
  });
  employessRowSelectable = new EmployeeRowSelectable(this);
  employeeGridApi!: GridApi<Employee>;


  onRowClick(event: RowClickEvent<Employee>) {
    this.employeeGridApi = event.gridApi;
    if (this.employeeGridApi.rowSelected(event.row)) {
      this.employeeGridApi.deselectRow(event.row);
      return;
    }
    this.employeeGridApi.selectRow(event.row);
  }
}
