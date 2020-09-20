import {request} from 'umi';
import {PermissionDataType} from "@/pages/Permission/data";

export async function insertPermission(permission: Partial<PermissionDataType>) {
  return request("/api/system/permissions", {
    method: 'post',
    data: permission,
  })
}

export async function deletePermissionById(id: string) {
  return request("/api/system/permissions/" + id, {
    method: 'delete',
  })
}

export async function updatePermissionById(id: string, permission: Partial<PermissionDataType>) {
  return request("/api/system/permissions/" + id, {
    method: 'put',
    data: permission,
  })
}

export async function getPermissionById(id: string) {
  return request<Partial<PermissionDataType>>("/api/system/permissions/" + id, {
    method: 'get'
  })
}

export async function getPermissionList() {
  return request<PermissionDataType[]>("/api/system/permissions", {
    method: 'get'
  })
}
