export interface WarehouseStorageDataType {
  id: string;       // id
  companyId: string;    // 企业id
  rebarCategory: number;    // 钢筋种类，0=棒材， 1=线材
  specification: string;    // 规格
  diameter: number;         // 直径
  length: number;           // 长度
  totalTheoreticalWeight: number;   // 总理重
  alarmInfo: string;            // 报警信息
}

export interface RebarStorageDataType {
  id: string;
  warehouseStorageId: string;   // 一对多 库存分类id
  rebarEntryId: string;         // 钢材入库明细 一对一
  manufacturer: string;         // 生产商
  quantity: number;             // 捆数
  totalQuantity: number;        // 总根数
  theoreticalWeight: number;    // 总理重
  receivingTime: string;        // 收货时间
  batchNumber: string;          // 批次号
  experimentCode: string;       // 实验代码
  usagePosition: string;        // 使用位置
  alarmInfo: string;            // 报警信息
}

export interface RebarMemberStorageDataType {
  id: string;                   // 对应料牌id
  rebarStorageId: string;       // 一对多 钢筋库存id
  rebarIndex: number;           // 钢筋捆序号
  quantity: number;             // 每捆的实际剩余数量
  theoreticalWeight: number;    // 每捆实际剩余理重
  unitTheoreticalWeight: number;  // 每根理重
}

export interface WarehouseStorageQueryParamsDataType {
  current: number;
  pageSize: number;
  sortName: string;
  sortOrder: string;
  rebarCategory?: string,
  specification?: string;
  diameter?: number;
  length?: number;
  key?: string;
}

export interface RebarStorageQueryParamsDataType {
  current: number;
  pageSize: number;
  warehouseStorageId: string;
  key?: string;
}
// RebarMemberStorageQueryParamsDataType
export interface RebarMemberStorageQueryParamsDataType {
  current: number;
  pageSize: number;
  rebarStorageId: string;
  key?: string;
}
