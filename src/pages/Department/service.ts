import {request} from 'umi';
import {DepartmentDataType} from "@/pages/Department/data";

export async function insertDepartment(department: Partial<DepartmentDataType>) {
  return request("/api/company//departments", {
    method: 'post',
    data: department,
  })
}

export async function deleteDepartmentById(id: string) {
  return request("/api/company//departments/" + id, {
    method: 'delete'
  })
}

export async function updateDepartmentById(id: string, department: Partial<DepartmentDataType>) {
  return request("/api/company//departments/" + id, {
    method: 'put',
    data: department,
  })
}

export async function getDepartmentById(id: string) {
  return request("/api/company//departments/" + id, {
    method: 'get',
  })
}

export async function getDepartmentList() {
  return request<DepartmentDataType[]>("/api/company//departments", {
    method: 'get',
  })
}
