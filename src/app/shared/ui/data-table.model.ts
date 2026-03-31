export interface TableColumn {
  field: string;
  headerKey: string;
  filterMode?: 'text' | 'select' | 'multiselect';
  filterOptions?: { label: string; value: string }[];
  filterPlaceholderKey?: string;
  filterSelectedItemsLabelKey?: string;
  sortable?: boolean;
  filterable?: boolean;
  headerClass?: string;
  bodyClass?: string;
}

export interface CellTemplateContext<T = unknown> {
  $implicit: T;
  field: string;
}

export interface RowGroupConfig {
  groupBy: string;
  sortOrder?: 1 | -1;
  labelFn?: (value: string) => string;
}

export interface DataTableTranslations {
  columns: string;
  columnsSelected: string;
  search: string;
  addButton: string;
  actions: string;
  edit: string;
  delete: string;
  filterBy: string;
  confirmDeleteTitle: string;
  confirmDelete: string;
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  deleteError: string;
  dialogDelete: string;
  dialogCancel: string;
  clearFilters: string;
}
