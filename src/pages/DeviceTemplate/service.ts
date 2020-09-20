import {request} from 'umi';
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";
import {RcFile} from "antd/lib/upload";

export async function getDeviceTemplateList() {
  return request<DeviceTemplateDataType[]>("/api/device/deviceTemplates", {
    method: 'get'
  })
}

/**
 * 上传图片
 * @param formData 图片文件
 */
export async function uploadAvatar(formData: FormData) {
  return request<RcFile>("/api/device/deviceTemplates/upload/avatar",  {
    method: 'post',
    data: formData
  })
}

export async function insertDeviceTemplate(deviceTemplate: Partial<DeviceTemplateDataType>) {
  return request("/api/device/deviceTemplates", {
    method: 'post',
    data: deviceTemplate
  })
}

export async function updateDeviceTemplateById(id: string, deviceTemplate: Partial<DeviceTemplateDataType>) {
  return request("/api/device/deviceTemplates/" + id, {
    method: 'put',
    data: deviceTemplate
  })
}

export async function deleteDeviceTemplateById(id: string) {
  return request("/api/device/deviceTemplates/" + id, {
    method: 'delete',
  })
}
