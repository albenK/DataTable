import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { DataTable } from "./data-table/data-table";
import { ColumnConfig } from './data-table/models/column-config';
import { formatNumber } from '@angular/common';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
}

const EMPLOYEE_TABLE_COLUMNS: Array<ColumnConfig<Employee>> = [
  { key: 'name', label: 'Name' },
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
    dataCellStyles: (column, row, context) => {
      const value = row.status || '';
      if (value.toLowerCase() === 'inactive') {
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
  { id: 1, name: 'Alice Nguyen', department: 'Engineering', salary: 120000, status: 'active' },
  { id: 2, name: 'Bob Martínez', department: 'Design', salary: 95000, status: 'active' },
  { id: 3, name: 'Carol Smith', department: 'Engineering', salary: 135000, status: 'inactive' },
  { id: 4, name: 'David Park', department: 'Marketing', salary: 87000, status: 'active' },
];

@Component({
  selector: 'app-root',
  imports: [DataTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  columns = signal<ColumnConfig<Employee>[]>(EMPLOYEE_TABLE_COLUMNS);
  rows = signal<Employee[]>(EMPLOYEE_TABLE_ROWS);
  defaultColumnConfig = {
    minWidth: 90,
    maxWidth: 300
  };
}
