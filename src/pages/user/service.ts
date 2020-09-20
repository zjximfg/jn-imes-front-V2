import {request} from 'umi';
import {UserDataType, UserQueryParamsDataType, UserRoleDataType} from "@/pages/user/data";

export async function insertUser(user: Partial<UserDataType>) {
  return request("/api/system/users", {
    method: 'post',
    data: user,
  })
}

export async function deleteUserById(id: string) {
  return request("/api/system/users/" + id, {
    method: 'delete',
  })
}

export async function updateUserById(id: string, user: Partial<UserDataType>) {
  return request("/api/system/users/" + id, {
    method: 'put',
    data: user,
  })
}

export async function getUserById(id: string) {
  return request("/api/system/users/" + id, {
    method: 'get',
  })
}

export async function getUserPage(params: UserQueryParamsDataType) {
  return request<{data: UserDataType[], total: number}>("/api/system/users/page", {
    method: 'get',
    params: params,
  })
}

export async function getUserListByDepartmentId(departmentId: string) {
  return request("/api/system/users", {
    method: 'get',
    params: {departmentId: departmentId}
  })
}

export async function getUserRoleByUserId(userId: string) {
  return request<UserRoleDataType[]>("/api/system/users/" + userId +"/userRoles", {
    method: 'get',
  })
}

export async function updateUserRoleByUserId(userId: string, roleIds: string[]) {
  return request("/api/system/users/" + userId + "/userRoles", {
    method: 'put',
    data: roleIds
  })
}

export async function importUserExcel(formData: FormData) {
  return request("/api/system/users/files",  {
    method: 'post',
    data: formData
  })
}

export async function exportUserExcel() {
  return request("/api/system/users/files", {
    method: 'get',
    responseType: 'blob',
  })
}

export async function getUserByCurrentUser() {
  return request<Partial<UserDataType>>("/api/system/users/currentUser", {
    method: 'get',
  })
}

export async function uploadAvatar(id: string, formData: FormData) {
  return request("/api/system/users/" + id + "/avatar",  {
    method: 'post',
    data: formData
  })
}
