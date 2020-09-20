// 实体类的数据结构
export interface MaterialSupplierDataType {
  id: string;
  companyId: string;
  name: string;
  address: string;
  liaison: string;
  phone: string;
}

// 分页查询参数的数据结构
export interface MaterialSupplierQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}
