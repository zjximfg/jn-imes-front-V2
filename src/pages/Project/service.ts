import {request} from 'umi';
import {ProjectDataType, ProjectQueryParamsDataType} from "@/pages/Project/data";

export async function getProjectListByCompanyId() {
  return request<Array<ProjectDataType>>("/api/project/projects", {
    method: 'get',
  })
}

export async function insertProject(project: Partial<ProjectDataType>) {
  return request("/api/project/projects", {
    method: 'post',
    data: project
  })
}

export async function updateProjectById(id: string, project: Partial<ProjectDataType>) {
  return request("/api/project/projects/" + id, {
    method: 'put',
    data: project
  })
}

export async function deleteProjectById(id: string) {
  return request("/api/project/projects/" + id, {
    method: 'delete',
  })
}

export async function getProjectById(id: string) {
  return request<Partial<ProjectDataType>>("/api/project/projects/" + id, {
    method: 'get',
  })
}

export async function getProjectPageByCompanyId(params: ProjectQueryParamsDataType) {
  return request("/api/project/projects/page", {
    method: 'get',
    params: params
  })
}
