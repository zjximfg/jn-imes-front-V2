import {request} from 'umi';
import {
  RebarMemberStorageDataType,
  RebarMemberStorageQueryParamsDataType,
  RebarStorageDataType,
  RebarStorageQueryParamsDataType,
  WarehouseStorageDataType,
  WarehouseStorageQueryParamsDataType
} from "@/pages/WarehouseStorage/data";

export async function getWarehouseStoragePageByCompanyId(params: Partial<WarehouseStorageQueryParamsDataType>) {
  return request("/api/warehouse/warehouseStorage/page", {
    method: 'get',
    params
  })
}

export async function getWarehouseStorageListByCompanyId() {
  return request("/api/warehouse/warehouseStorage", {
    method: 'get',
  })
}

export async function getWarehouseStorageById(id: string) {
  return request<Partial<WarehouseStorageDataType>>("/api/warehouse/warehouseStorage/" + id, {
    method: 'get',
  })
}

export async function getRebarStoragePageByWarehouseStorageId(params: Partial<RebarStorageQueryParamsDataType>) {
  return request("/api/warehouse/rebarStorage/page", {
    method: 'get',
    params
  })
}

export async function getRebarStorageStorageById(id: string) {
  return request<Partial<RebarStorageDataType>>("/api/warehouse/rebarStorage/" + id, {
    method: 'get',
  })
}

export async function getRebarMemberStoragePageByRebarStorageId(params: Partial<RebarMemberStorageQueryParamsDataType>) {
  return request("/api/warehouse/rebarMemberStorage/page", {
    method: 'get',
    params
  })
}

export async function getBatchNumberListByWarehouseStorageId(id: string) {
  return request<string[]>("/api/warehouse/rebarStorage/batchNumberList", {
    method: 'get',
    params: {id}
  })
}

export async function getBatchNumberListByConditions(rebarCategory:number, specification:string, diameter: number, length: number) {
  return request<string[]>("/api/warehouse/rebarStorage/batchNumberList/conditions", {
    method: 'get',
    params: {
      rebarCategory,
      specification,
      diameter,
      length
    }
  })
}

export async function getRebarStorageStorageByBatchNumber(batchNumber: string) {
  return request<RebarStorageDataType>("/api/warehouse/rebarStorage/query/batchNumber", {
    method: 'get',
    params: {
      batchNumber
    }
  })
}

export async function getRebarMemberStorageListByRebarStorageId(rebarStorageId: string) {
  return request<RebarMemberStorageDataType[]>("/api/warehouse/rebarMemberStorage/list/query/rebarStorageId", {
    method: 'get',
    params: {
      rebarStorageId
    }
  })
}


