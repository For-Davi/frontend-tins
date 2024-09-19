export interface ColumnQuasar {
  name: string;
  label: string;
  field: string | ((row: unknown) => unknown);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sort?: (a: unknown, b: unknown, rowA: unknown, rowB: unknown) => number;
  headerClasses?: string;
}
