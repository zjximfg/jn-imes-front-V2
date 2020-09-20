import {request} from 'umi';
import {RoleDataType, RolePermissionDataType, RoleQueryParamsDataType} from "@/pages/Role/data";

export async function insertRole(role: Partial<RoleDataType>) {
  return request("/api/system/roles", {
    method: 'post',
    data: role
  })
}

export async function updateRoleById(id: string, role: Partial<RoleDataType>) {
  return request("/api/system/roles/" + id, {
    method: 'put',
    data: role
  })
}

export async function deleteRoleById(id: string) {
  return request("/api/system/roles/" + id, {
    method: 'delete'
  })
}

export async function getRolePage(params: RoleQueryParamsDataType) {
  return request("/api/system/roles/page", {
    method: 'get',
    params: params
  })
}

export async function getRoleById(id: string) {
  return request<Partial<RoleDataType>>("/api/system/roles/" + id, {
    method: 'get',
  })
}

export async function getRoleList() {
  return request<RoleDataType[]>("/api/system/roles", {
    method: 'get',
  })
}

export async function getRolePermissionByRoleId(roleId: string) {
  return request<RolePermissionDataType[]>("/api/system/roles/" + roleId + "/rolePermissions", {
    method: 'get',
  })
}

export async function updateRolePermissionsByRoleId(roleId: string, values: string[]) {
  return request("/api/system/roles/" + roleId + "/rolePermissions", {
    method: 'put',
    data: values
  })
}
