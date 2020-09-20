import {request} from 'umi';
import {DeviceSupplierDataType, DeviceSupplierQueryParamsDataType} from "@/pages/DeviceSupplier/data";

export async function getDeviceSupplierListByCompanyId() {
  return request<Array<DeviceSupplierDataType>>("/api/device/deviceSuppliers", {
    method: 'get',
  })
}

export async function insertDeviceSupplier(deviceSupplier: Partial<DeviceSupplierDataType>) {
  return request("/api/device/deviceSuppliers", {
    method: 'post',
    data: deviceSupplier
  })
}

export async function updateDeviceSupplierById(id: string, deviceSupplier: Partial<DeviceSupplierDataType>) {
  return request("/api/device/deviceSuppliers/" + id, {
    method: 'put',
    data: deviceSupplier
  })
}

export async function deleteDeviceSupplierById(id: string) {
  return request("/api/device/deviceSuppliers/" + id, {
    method: 'delete',
  })
}

export async function getDeviceSupplierById(id: string) {
  return request<Partial<DeviceSupplierDataType>>("/api/device/deviceSuppliers/" + id, {
    method: 'get',
  })
}

export async function getDeviceSupplierPageByCompanyId(params: DeviceSupplierQueryParamsDataType) {
  return request("/api/device/deviceSuppliers/page", {
    method: 'get',
    params: params
  })
}
