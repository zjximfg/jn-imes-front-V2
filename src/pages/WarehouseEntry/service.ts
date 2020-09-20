import {request} from 'umi';
import {
  AccessoryDataType, RebarEntryDataType,
  WarehouseEntryDataType,
  WarehouseEntryQueryParamsDataType
} from "@/pages/WarehouseEntry/data";

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

export function createNewRebarEntry() {
  return {
    key: "0",
    id: '',
    warehouseEntryId: "",
    rebarCategory: 0, //钢筋种类，0=棒材， 1=线材
    manufacturer: "", //制造商
    specification: "",
    diameter: 0,
    length: 0,
    quantity: 0,  // 捆数
    quantityUnit: "",   //捆
    packageQuantity: 0,   //包装数量
    packageQuantityUnit: "",  //根
    theoreticalWeight: 0,
    actualWeight: 0,
    batch0: 0,     // 批次号
    usagePosition: "",
    experimentCode: "",   //VO  , TODO 暂不知道来源
    driver: "",
    vehicle: "",
    remarks: "",
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

export async function getWarehouseEntryPageByCompanyId(params: WarehouseEntryQueryParamsDataType) {
  return request("/api/warehouse/warehouseEntries/page", {
    method: 'get',
    params
  })
}

export async function getWarehouseEntryById(id: string) {
  return request<WarehouseEntryDataType>("/api/warehouse/warehouseEntries/" + id, {
    method: 'get',
  })
}

export async function insertWarehouseEntry(data: Partial<WarehouseEntryDataType>) {
  return request("/api/warehouse/warehouseEntries", {
    method: 'post',
    data
  })
}

export async function updateWarehouseEntry(id: string, data: Partial<WarehouseEntryDataType>) {
  return request("/api/warehouse/warehouseEntries/" + id, {
    method: 'put',
    data
  })
}

export async function deleteWarehouseEntry(id: string) {
  return request("/api/warehouse/warehouseEntries/" + id, {
    method: 'delete'
  })
}

export async function uploadAccessories(formData: FormData) {
  return request<AccessoryDataType>("/api/warehouse/accessories/upload", {
    method: 'post',
    data: formData
  })
}

export async function getRebarEntryListByWarehouseId(warehouseId: string) {
  return request<RebarEntryDataType[]>("/api/warehouse/rebarEntries", {
    method: 'get',
    params: {warehouseId}
  })
}

export async function getRebarEntryById(id: string) {
  return request<Partial<RebarEntryDataType>>("/api/warehouse/rebarEntries/" + id, {
    method: 'get',
  })
}

export async function updateRebarEntry(id: string, data: Partial<RebarEntryDataType>) {
  return request("/api/warehouse/rebarEntries/" + id, {
    method: 'put',
    data
  })
}

export async function insertRebarEntry(data: Partial<RebarEntryDataType>) {
  return request("/api/warehouse/rebarEntries", {
    method: 'post',
    data
  })
}

export async function deleteRebarEntry(id: string) {
  return request("/api/warehouse/rebarEntries/" + id, {
    method: 'delete',
  })
}

export async function getAccessoriesByParentId(parentId: string) {
  return request<AccessoryDataType[]>("/api/warehouse/accessories", {
    method: 'get',
    params: {parentId}
  })
}

export async function downloadTemplateExcel() {
  return request("/api/warehouse/rebarEntries/files/template", {
    method: 'get',
    responseType: 'blob',
  })
}

export async function importExcel(warehouseEntryId: string, formData: FormData) {
  return request("/api/warehouse/rebarEntries/files/import/" + warehouseEntryId,  {
    method: 'post',
    data: formData
  })
}

export async function printRebarEntries(data: string[]) {
  return request("/api/warehouse/rebarEntries/files/print", {
    method: 'post',
    data,
    responseType: 'blob',
  })
}
