import { DataTable } from "../data-table";

export class GridApi<T> {
    private compRef: DataTable<T>;
    constructor(comp: DataTable<T>) {
        this.compRef = comp;
    }

    selectRow(row: T): void {
        const rows = this.compRef.displayedRows();
        const tableRow = rows.find((tr) => {
            return tr.selectable && tr.data === row;
        });
        if (!tableRow) {
            return;
        }
        tableRow.selected = true;
        this.compRef.refreshDisplayedRows();
    }

    deselectRow(row: T): void {

    }

    isSelected(row: T): boolean {
        return false;
    }
}

