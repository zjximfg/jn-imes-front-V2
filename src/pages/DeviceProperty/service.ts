import {request} from 'umi';
import {DevicePropertyDataType, DevicePropertyQueryParamsDataType} from "@/pages/DeviceProperty/data";

export async function getDevicePropertyPageByTemplateId(params: DevicePropertyQueryParamsDataType) {
  return request("/api/device/deviceProperties/page", {
    method: 'get',
    params: params,
  })
}

export async function getDevicePropertyById(id: string) {
  return request<DevicePropertyDataType>("/api/device/deviceProperties/" + id, {
    method: 'get',
  })
}

export async function insertDeviceProperty(deviceProperty: Partial<DevicePropertyDataType>) {
  return request("/api/device/deviceProperties", {
    method: 'post',
    data: deviceProperty
  })
}

export async function updateDevicePropertyById(id: string, deviceProperty: Partial<DevicePropertyDataType>) {
  return request("/api/device/deviceProperties/" + id, {
    method: 'put',
    data: deviceProperty
  })
}

export async function deleteDevicePropertyById(id: string) {
  return request("/api/device/deviceProperties/" + id, {
    method: 'delete',
  })
}
