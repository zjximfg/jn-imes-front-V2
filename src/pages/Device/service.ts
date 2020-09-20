import {request} from 'umi';
import {DeviceDataType, DeviceQueryParamsDataType, InfluxDataType} from "@/pages/Device/data";
import {DevicePropertyDataType} from "@/pages/DeviceProperty/data";

export async function getDeviceListByCompanyId() {
  return request<Array<DeviceDataType>>("/api/device/devices", {
    method: 'get',
  })
}

export async function insertDevice(device: Partial<DeviceDataType>) {
  return request("/api/device/devices", {
    method: 'post',
    data: device
  })
}

export async function updateDeviceById(id: string, device: Partial<DeviceDataType>) {
  return request("/api/device/devices/" + id, {
    method: 'put',
    data: device
  })
}

export async function deleteDeviceById(id: string) {
  return request("/api/device/devices/" + id, {
    method: 'delete',
  })
}

export async function getDeviceById(id: string) {
  return request<Partial<DeviceDataType>>("/api/device/devices/" + id, {
    method: 'get',
  })
}

export async function getDevicePageByCompanyId(params: DeviceQueryParamsDataType) {
  return request("/api/device/devices/page", {
    method: 'get',
    params: params
  })
}

export async function getInflux() {
  return request<Partial<InfluxDataType>>("/api/device/devices/influx/map", {
    method: 'get'
  })
}

export async function getReadPropertyListByDeviceId(deviceId: string) {
  return request<DevicePropertyDataType[]>("/api/device/deviceProperties/read", {
    method: 'get',
    params: {deviceId}
  })
}
