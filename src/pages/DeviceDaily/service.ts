import {request} from 'umi';
import {DeviceDailyDataType} from "@/pages/DeviceDaily/data";

export async function getDeviceDailyList(deviceId: string, year: number, month: number) {
  return request<DeviceDailyDataType[]>("/api/device/deviceDailies", {
    method: 'get',
    params: {deviceId, year, month}
  })
}

export async function getDeviceDailyByDeviceIdAndDate(deviceId: string, date: string) {
  return request<DeviceDailyDataType>("/api/device/deviceDailies/one", {
    method: 'get',
    params: {deviceId, date}
  })
}

export async function updateDeviceDailyById(id: string, values: Partial<DeviceDailyDataType>) {
  return request("/api/device/deviceDailies/" + id, {
    method: 'put',
    data: values
  })
}

export async function insertDeviceDaily(values: Partial<DeviceDailyDataType>) {
  return request("/api/device/deviceDailies", {
    method: 'post',
    data: values
  })
}
