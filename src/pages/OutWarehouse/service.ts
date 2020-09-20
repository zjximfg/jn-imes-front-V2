import {request} from 'umi';
import {
  OutWarehouseQueryParamsDataType,
  OutWarehouseDataType,
  WarehouseStorageDataType,
  OutWarehouseRebarDataType
} from "@/pages/OutWarehouse/data";

export function getProcurementMethods() {
  return [
    {
      id: 0,
      type: '采购入库'
    },
    {
      id: 1,
      type: '调拨入库'
    },
  ];
}

export function createNewOutWarehouseRecord() {
  return {
    key: "0",
    id: '',
    outWarehouseId: "",
    warehouseStorageId: "",
    rebarStorageId: "",
    rebarCategory: 0, //钢筋种类，0=棒材， 1=线材
    specification: "", //规格
    diameter: 0, //直径
    length: 0, //长度
    batchNumber: 0, //批次号
    deviceName: "", //设备名称
    outboundQuantity: 0, //出库数量
    outboundQuantityUnit: "", //出库单位 根
    outboundTheoreticalWeight: 0, //出库理重
    outboundActualWeight: 0, //出库实重
  }
}

export function getRebarCategories() {
  return [
    {
      id: 0,
      type: '棒材'
    },
    {
      id: 1,
      type: '线材'
    },
  ];
}

///要再确认
export async function echo(data: Array<WarehouseStorageDataType>) {
  return request("/api/warehouse/outWarehouse/echo", {
    method: 'post',
    data
  })
}

/**
 * 新增一个带所有属性的出库单
 * @param data 出库单信息
 */
export async function insertOutWarehouse(data: Partial<OutWarehouseDataType>) {
  return request("/api/warehouse/outWarehouse/", {
    method: 'post',
    data
  })
}

export async function insertOutWarehouseCascade(data: Partial<OutWarehouseDataType>) {
  return request("/api/warehouse/outWarehouse/cascade", {
    method: 'post',
    data
  })
}

export async function getOutWarehousePageByCompanyId(params: OutWarehouseQueryParamsDataType) {
  return request("/api/warehouse/outWarehouse/page", {
    method: 'get',
    params
  })
}

export async function getOutWarehouseById(id: string) {
  return request<OutWarehouseDataType>("/api/warehouse/outWarehouse/" + id, {
    method: 'get',
  })
}

export async function updateOutWarehouse(id: string, data: Partial<OutWarehouseDataType>) {
  return request("/api/warehouse/outWarehouse/" + id, {
    method: 'put',
    data
  })
}

export async function deleteById(id: string) {
  return request("/api/warehouse/outWarehouse/" + id, {
    method: 'delete',
  })
}

export async function getOutWarehouseRebarByOutWarehouseId(outWarehouseId: string) {
  return request<OutWarehouseRebarDataType[]>("/api/warehouse/outWarehouseRebar/list", {
    method: 'get',
    params: {outWarehouseId}
  })
}

export async function getOutWarehouseRebarById(id: string) {
  return request<Partial<OutWarehouseRebarDataType>>("/api/warehouse/outWarehouseRebar/" + id, {
    method: 'get',
  })
}


export async function insertOutWarehouseRebar(data: Partial<OutWarehouseRebarDataType>) {
  return request("/api/warehouse/outWarehouseRebar", {
    method: 'post',
    data
  })
}


export async function updateOutWarehouseRebar(id: string, data: Partial<OutWarehouseRebarDataType>) {
  return request("/api/warehouse/outWarehouseRebar/" + id, {
    method: 'put',
    data
  })
}

export async function deleteOutWareHouseRebarById(id: string) {
  return request("/api/warehouse/outWarehouseRebar/" + id, {
    method: 'delete',
  })
}

export async function querySpecificationListInWarehouseStorages(params: Partial<OutWarehouseRebarDataType>) {
  return request<string[]>("/api/warehouse/outWarehouseRebar/specification/list", {
    method: 'get',
    params: params
  })
}

export async function queryDiameterListInWarehouseStorages(params: Partial<OutWarehouseRebarDataType>) {
  return request<number[]>("/api/warehouse/outWarehouseRebar/diameter/list", {
    method: 'get',
    params: params
  })
}

export async function queryLengthListInWarehouseStorages(params: Partial<OutWarehouseRebarDataType>) {
  return request<number[]>("/api/warehouse/outWarehouseRebar/length/list", {
    method: 'get',
    params: params
  })
}
