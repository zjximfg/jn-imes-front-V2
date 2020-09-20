export interface DeviceSupplierDataType {
  id: string;
  name: string;
  shortName: string;
  code: string;
  liaisonName: string;
  phone: string;
  description: string;
  companyId: string;
}

export interface DeviceSupplierQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}
