export interface MenuPermission {
  permission_id: string;
  name: string;
  code: string;
  description?: string;
  resource_type: 'MENU';
  actions: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at?: string;
  children?: MenuPermission[];
  _searchText?: string;
}

export interface PermissionResponse {
  permission_id?: string;
  name?: string;
  code?: string;
  description?: string;
  resource_type?: string;
  actions?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
  updated_at?: string;
  parent_id?: string;
}

export {}; 