export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  format?: (value: any, row: T) => string;
  hideOnMobile?: boolean;
  html?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'danger' | 'neutral' | 'success' | 'warning';
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  iconOnly?: boolean;
}

export interface TableConfig {
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showPaginationNumbers?: boolean;
  selectable?: boolean;
  selectKey?: string;
}

export interface SortState<T> {
  column: keyof T | null;
  direction: 'asc' | 'desc';
}
