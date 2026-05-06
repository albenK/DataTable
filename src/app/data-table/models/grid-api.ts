import { DataTable } from "../data-table";

export class GridApi<T> {
    private compRef: DataTable<T>;
    private selectedRows = new Set<T>;
    constructor(comp: DataTable<T>) {
        this.compRef = comp;
    }

    selectRow(row: T): boolean {
        if (!this.compRef.rowSelectable) {
            return false;
        }
        const selectable = this.compRef.rowSelectable.rowSelectable(row, this.compRef.context, this);
        if (!selectable) {
            return false;
        }
        this.selectedRows.add(row);
        this.compRef.refreshDisplayedRows();
        return true;
    }

    deselectRow(row: T): boolean {
        const deleted = this.selectedRows.delete(row);
        this.compRef.refreshDisplayedRows();
        return deleted;
    }

    rowSelected(row: T): boolean {
        return this.selectedRows.has(row);
    }

    selectRowsIfSelectable(): number {
        let selectedCount: number = 0;
        if (!this.compRef.rowSelectable) {
            return selectedCount;
        }
        const allRows = this.compRef.rows();
        allRows.forEach((row) => {
            const success = this.selectRow(row);
            if (success) {
                selectedCount++;
            }
        });
        this.compRef.refreshDisplayedRows();
        return selectedCount;
    }

    deselectAllRows(): boolean {
        this.selectedRows.clear();
        this.selectedRows = new Set<T>();
        this.compRef.refreshDisplayedRows();
        return true;
    }

    getSelectedRows() {
        return Array.from(this.selectedRows);
    }
}

