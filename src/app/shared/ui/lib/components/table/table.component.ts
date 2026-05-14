import {
  Component,
  input,
  output,
  computed,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng0ButtonComponent } from '../button/button.component';
import { Ng0InputComponent } from '../input/input.component';
import { Ng0PaginationComponent } from '../pagination/pagination.component';
import { Ng0CheckboxComponent } from '../checkbox/checkbox.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { Ng0IconComponent } from '../icon/icon.component';
import { TableColumn, TableAction, TableConfig, SortState } from './table.types';

@Component({
  selector: 'ng0-table',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    Ng0ButtonComponent,
    Ng0InputComponent,
    Ng0PaginationComponent,
    Ng0CheckboxComponent,
    SafeHtmlPipe,
    Ng0IconComponent,
  ],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ng0TableComponent<T> {
  readonly data = input<T[]>([]);
  readonly columns = input<TableColumn<T>[]>([]);
  readonly actions = input<TableAction<T>[]>([]);
  readonly config = input<TableConfig>({});

  readonly selectionChange = output<T[]>();

  searchQuery = signal('');
  sortState = signal<SortState<T>>({ column: null, direction: 'asc' });
  currentPage = signal(1);
  selectedKeys = signal<Set<string>>(new Set());

  constructor() {
    effect(() => { this.searchQuery(); this.currentPage.set(1); });
  }

  private getRowKey(row: T): string {
    const selectKey = this.config().selectKey;
    if (selectKey) return String((row as any)[selectKey]);
    const firstCol = this.columns()[0];
    return firstCol ? String(row[firstCol.key]) : String(row);
  }

  isRowSelected(row: T): boolean { return this.selectedKeys().has(this.getRowKey(row)); }

  isAllSelected = computed(() => {
    const data = this.paginatedData();
    if (data.length === 0) return false;
    return data.every((row) => this.selectedKeys().has(this.getRowKey(row)));
  });

  isIndeterminate = computed(() => {
    const data = this.paginatedData();
    if (data.length === 0) return false;
    const count = data.filter((row) => this.selectedKeys().has(this.getRowKey(row))).length;
    return count > 0 && count < data.length;
  });

  toggleRow(row: T): void {
    const key = this.getRowKey(row);
    const current = new Set(this.selectedKeys());
    current.has(key) ? current.delete(key) : current.add(key);
    this.selectedKeys.set(current);
    this.emitSelection();
  }

  toggleAll(checked: boolean): void {
    const current = new Set(this.selectedKeys());
    for (const row of this.paginatedData()) {
      const key = this.getRowKey(row);
      checked ? current.add(key) : current.delete(key);
    }
    this.selectedKeys.set(current);
    this.emitSelection();
  }

  private emitSelection(): void {
    const selected = this.data().filter((row) => this.selectedKeys().has(this.getRowKey(row)));
    this.selectionChange.emit(selected);
  }

  filteredData = computed(() => {
    let result = [...this.data()];
    const query = this.searchQuery().toLowerCase();
    const sort = this.sortState();
    if (query) {
      result = result.filter((row) =>
        Object.values(row as any).some((val) => String(val).toLowerCase().includes(query))
      );
    }
    if (sort.column) {
      result.sort((a, b) => {
        const valA = a[sort.column!] as any;
        const valB = b[sort.column!] as any;
        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  });

  paginatedData = computed(() => {
    const data = this.filteredData();
    const pageSize = this.config().pageSize;
    if (!pageSize) return data;
    const start = (this.currentPage() - 1) * pageSize;
    return data.slice(start, start + pageSize);
  });

  totalPages = computed(() => {
    const pageSize = this.config().pageSize;
    if (!pageSize) return 1;
    return Math.ceil(this.filteredData().length / pageSize);
  });

  handleSort(column: TableColumn<T>): void {
    if (!column.sortable) return;
    const current = this.sortState();
    if (current.column === column.key) {
      this.sortState.set({ column: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      this.sortState.set({ column: column.key, direction: 'asc' });
    }
  }

  getValue(row: T, col: TableColumn<T>): string {
    const val = row[col.key];
    if (col.format) return col.format(val, row);
    return String(val ?? '');
  }

  getActionBtnClass(action: TableAction<T>): string {
    const colorMap: Record<string, string> = {
      success: 'text-success hover:text-success',
      danger: 'text-error hover:text-error',
      primary: 'text-primary hover:text-primary',
      warning: 'text-warning hover:text-warning',
    };
    return action.color ? (colorMap[action.color] ?? '') : '';
  }
}
