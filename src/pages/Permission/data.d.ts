export interface PermissionDataType {
  id: string;
  name: string;
  type: number;
  code: string;
  description: string;
  parentId: string;
  systemVisible: boolean;
  permissionMenu: Partial<PermissionMenuDataType>;
  permissionPoint: Partial<PermissionPointDataType>;
  permissionApi: Partial<PermissionApiDataType>;
  children: PermissionDataType[];
  key: string;
}

export interface PermissionMenuDataType {
  id: string;
  menuIcon: string;
  menuOrder: string;
}

export interface PermissionPointDataType {
  id: string;
  pointClass: string;
  pointIcon: string;
  pointStatus: string;
}

export interface PermissionApiDataType {
  id: string;
  apiUrl: string;
  apiMethod: string;
  apiLevel: string;
}

export interface PermissionTypeDataType {
  id: number;
  name: string;
}

export const PermissionType: PermissionTypeDataType[] = [
  // MENU
  {
    id: 1,
    name: '菜单权限'
  },
  // POINT
  {
    id: 2,
    name: '权限点'
  },
  // API
  {
    id: 3,
    name: 'API接口权限'
  }
];
