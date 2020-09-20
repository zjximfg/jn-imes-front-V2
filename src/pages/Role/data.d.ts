export interface RoleDataType {
  id: string;
  name: string;
  description: string;
}

export interface RoleQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}

export interface RolePermissionDataType {
  id: string;
  roleId: string;
  permissionId: string;
}
