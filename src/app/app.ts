import { Component, signal } from '@angular/core';
import { formatNumber } from '@angular/common';

import { DataTable } from "./data-table/data-table";
import { ColumnConfig } from './data-table/models/column-config';
import { DataTableRowSelectable, DataTableRowSelected, RowClickEvent } from './data-table/models/table-row';

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
    dataCellStyles: (column, row, isRowSelectable, isRowSelected, context) => {
      const value = row.status || '';
      if (value.toLowerCase() === 'inactive' && !isRowSelected) {
        return {
          color: 'var(--ColorDanger)'
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

class EmployeeRowSelect implements DataTableRowSelectable<Employee>, DataTableRowSelected<Employee> {
  compRef: App;
  constructor(parentComp: App) { 
    this.compRef = parentComp;
  }

  isRowSelectable(row: Employee, context: any): boolean {
    return true; // all rows are selectable.
  }

  isRowSelected(row: Employee, context: any): boolean {
    return false; // No row is selected. User may click on a row and select it, if it's selectable.
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
  employeeTableRowSelect = new EmployeeRowSelect(this);


  onRowClick(event: RowClickEvent<Employee>) {
    console.log(event);
    // TODO: Won't work because of isRowSelected(). Maybe just pass in TableRow[] as rows input. This
    // way we can just leave it to the parent comp to set selectable, selected and styles.
    event.gridApi.selectRow(event.row);
  }
}
