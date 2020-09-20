export interface ProjectDataType {
  id: string;
  name: string;
  companyId: string;
  description: string;
  frameMemberQuantity: number;
  progress: number;
}

export interface ProjectQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}
