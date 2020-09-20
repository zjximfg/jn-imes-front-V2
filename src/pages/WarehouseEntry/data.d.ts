export interface WarehouseEntryDataType {
  id: string;
  companyId: string;
  workAreaId: string;
  materialSupplierId: string;
  receivingTime: string;
  procurementMethod: number;  // 采购方式
  receiver: string;     //签收人
  submitter: string;    // 交料人
  totalTheoreticalWeight: number;   // 总理重， VO
  totalActualWeight: number;    // 总实重，VO
  total: number;  // 共计, VO
  accessories: AccessoryDataType[],  // 附件地址，用于表单 ， 一对多
  receivingTimeRange: string[],
  // rebarEntryList: RebarEntryDataType[], // 一对多
}

export interface WarehouseEntryQueryParamsDataType {
  current: number;
  pageSize: number;
  receivingTimeRange?: string[],
  key?: string;
}

export interface RebarEntryDataType {
  key: string;
  id: string;
  warehouseEntryId: string;
  hasPrinted: boolean;
  rebarCategory: number; //钢筋种类，0=棒材， 1=线材
  manufacturer: string; //制造商
  specification: string;
  diameter: number;
  length: number;
  quantity: number;  // 捆数
  quantityUnit: string;   //捆
  packageQuantity: number;   //包装数量
  packageQuantityUnit: string;  //根
  theoreticalWeight: number;
  actualWeight: number;
  batchNumber: string;     // 批次号
  usagePosition: string;
  experimentCode: string;   //VO  , TODO 暂不知道来源
  driver: string;
  vehicle: string;
  remarks: string;
  accessories: AccessoryDataType[],  // 附件地址，用于表单 ， 一对多
}

export interface AccessoryDataType {
  uid: string;
  url: string;
  name: string;
  parentObjectId: string;
  status: string;   // VO 附件列表回显对象
}
