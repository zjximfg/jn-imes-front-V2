import {request} from 'umi';
import {FrameMemberDataType, FrameMemberQueryParamsDataType} from "@/pages/FrameMember/data";


export async function insertFrameMember(frameMember: Partial<FrameMemberDataType>) {
  return request("/api/project/frameMembers", {
    method: 'post',
    data: frameMember
  })
}

export async function updateFrameMemberById(id: string, frameMember: Partial<FrameMemberDataType>) {
  return request("/api/project/frameMembers/" + id, {
    method: 'put',
    data: frameMember
  })
}

export async function deleteFrameMemberById(id: string) {
  return request("/api/project/frameMembers/" + id, {
    method: 'delete',
  })
}

export async function getFrameMemberById(id: string) {
  return request<Partial<FrameMemberDataType>>("/api/project/frameMembers/" + id, {
    method: 'get',
  })
}

export async function getFrameMemberPageByCompanyId(params: FrameMemberQueryParamsDataType) {
  return request("/api/project/frameMembers/page", {
    method: 'get',
    params: params
  })
}
