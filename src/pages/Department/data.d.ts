export interface DepartmentDataType {
  id: string;
  companyId: string;
  parentId: string;
  name: string;
  code: string;
  category: string;
  managerId: string
  manager: string;
  city: string;
  introduce: string;
  createTime: string;
  children: DepartmentDataType[];
  key: string;
}
