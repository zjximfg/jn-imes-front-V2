// 实体类的数据结构
export interface WorkAreaDataType {
  id: string;
  companyId: string;
  name: string;
  position: string;
  liaison: string;
  phone: string;
}

// 分页查询参数的数据结构
export interface WorkAreaQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}
