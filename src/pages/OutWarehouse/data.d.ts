import {RebarMemberOutDataType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarMember";

export interface OutWarehouseQueryParamsDataType {
  current: number;
  pageSize: number;
  receivingTimeRange?: string[],
  key?: string;
}

export interface OutWarehouseDataType {
  id: string;
  companyId: string;
  purpose: string;//用途
  recipientsUnit: string;//领用单位
  recipient: string;//领用人
  recipientsTime: string;//领用时间
  receivingTimeRange: string[];
  outWarehouseRecordList: OutWarehouseRebarDataType[];
}

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

export interface OutWarehouseRebarDataType {
  key: string;
  id: string;
  outWarehouseId: string;
  warehouseStorageId: string;
  rebarStorageId: string;
  rebarCategory: number; //钢筋种类，0=棒材， 1=线材
  specification: string; //规格
  diameter: number; //直径
  length: number; //长度
  batchNumber: string; //批次号
  deviceId: string; //设备名称
  outboundQuantity: number; //出库数量
  outboundQuantityUnit: string; //出库单位 根
  outboundTheoreticalWeight: number; //出库理重
  outboundActualWeight: number; //出库实重
  rebarMemberOutList: RebarMemberOutDataType[];
  outWarehouseRebarMemberList: OutWarehouseRebarMemberDataType[];
  batchNumberList: string[];  // 下拉菜单的列表
}

export interface OutWarehouseRebarMemberDataType {
  id: string;
  outWarehouseRebarId: string;//出库明细表id
  rebarMemberStorageId: string;   //钢筋捆明细存储表id
  rebarStorageId: string;   //钢筋存储表id
  rebarIndex: number;   //钢筋捆序号
  outQuantity: number;  //出库根数
  outTheoreticalWeight: number;   //出库理重
  unitTheoreticalWeight: number;   //单根理重
}
