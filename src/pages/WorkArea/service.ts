import {request} from "umi";  // 导入umi的request方法，等同于ajax
import {WorkAreaDataType, WorkAreaQueryParamsDataType} from "@/pages/WorkArea/data";    // 导入数据结构定义

// 异步方法

/**
 * 根据登录用户的companyId获取工区分页信息
 * @param params  分页查询条件
 */
export async function getWorkAreaPageByCompanyId(params: WorkAreaQueryParamsDataType) {
  return request("/api/warehouse/workAreas/page", {
    method: 'get',
    params: params,
  })
}

/**
 * 根据主键id查询单个工区信息
 * @param id  主键id
 */
export async function getWorkAreaById(id: string) {
  return request<Partial<WorkAreaDataType>>("/api/warehouse/workAreas/" + id, {
    method: 'get',
  })
}

export async function getWorkAreaListByCompanyId() {
  return request<WorkAreaDataType[]>("/api/warehouse/workAreas", {
    method: 'get',
  })
}

/**
 * 根据主键id删除工区信息
 * @param id 主键id
 */
export async function deleteWorkAreaById(id: string) {
  return request("/api/warehouse/workAreas/" + id, {
    method: 'delete',
  })
}

/**
 * 根据主键id更新工区信息
 * @param id 主键id
 * @param data  要更新的工区数据
 */
export async function updateWorkAreaById(id: string, data: Partial<WorkAreaDataType>) {
  return request("/api/warehouse/workAreas/" + id, {
    method: 'put',
    data: data
  })
}

/**
 * 根据主键id新增工区信息
 * @param data  要新增的工区数据
 */
export async function insertWorkArea(data: Partial<WorkAreaDataType>) {
  return request("/api/warehouse/workAreas", {
    method: 'post',
    data: data
  })
}
