import {request} from "umi";  // 导入umi的request方法，等同于ajax
import {MaterialSupplierDataType, MaterialSupplierQueryParamsDataType} from "@/pages/MaterialSupplier/data";    // 导入数据结构定义

// 异步方法

export async function getMaterialSupplierPageByCompanyId(params: MaterialSupplierQueryParamsDataType) {
  return request("/api/warehouse/materialSuppliers/page", {
    method: 'get',
    params,
  })
}

export async function getMaterialSupplierListByCompanyId() {
  return request<MaterialSupplierDataType[]>("/api/warehouse/materialSuppliers", {
    method: 'get',
  })
}

export async function getMaterialSupplierById(id: string) {
  return request<Partial<MaterialSupplierDataType>>("/api/warehouse/materialSuppliers/" + id, {
    method: 'get',
  })
}

export async function deleteMaterialSupplierById(id: string) {
  return request("/api/warehouse/materialSuppliers/" + id, {
    method: 'delete',
  })
}

export async function updateMaterialSupplierById(id: string, data: Partial<MaterialSupplierDataType>) {
  return request("/api/warehouse/materialSuppliers/" + id, {
    method: 'put',
    data
  })
}

export async function insertMaterialSupplier(data: Partial<MaterialSupplierDataType>) {
  return request("/api/warehouse/materialSuppliers", {
    method: 'post',
    data
  })
}
