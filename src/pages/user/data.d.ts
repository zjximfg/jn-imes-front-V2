export interface UserDataType {
  id: string;
  username: string;
  mobile: string;
  password: string;
  enableState: boolean;
  createTime: string;
  departmentId: string;
  workNumber: string;
  companyId: string;
  description: string;
  avatar: string;
}


export interface UserQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}

export interface UserRoleDataType {
  id: string;
  userId: string;
  roleId: string;
}

export interface CurrentUserDataType {
  username: string;
  mobile: string;
  companyId: string;
  avatar: string;
  permissionCodeMap: {
    menus: string[],
    points: string[],
    apis: string[]
  }
}
