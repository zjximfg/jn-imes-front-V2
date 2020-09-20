import {request} from 'umi';
import {CompanyDataType, DeviceConnectionDataType} from "@/pages/Company/data";

export async function insertCompany(company: Partial<CompanyDataType>) {
  return request("/api/company/companies", {
    method: 'post',
    data: company,
  })
}

export async function deleteCompanyById(id: string) {
  return request("/api/company/companies/" + id, {
    method: 'delete',
  })
}

export async function updateCompanyById(id: string, company: Partial<CompanyDataType>) {
  return request("/api/company/companies/" + id, {
    method: 'put',
    data: company
  })
}

export async function getCompanyById(id: string) {
  return request<Partial<CompanyDataType>>("/api/company/companies/" + id, {
    method: 'get'
  })
}

export async function getCompanyList() {
  return request<CompanyDataType[]>("/api/company/companies", {
    method: 'get'
  })
}

export async function getCurrentCompany() {
  return request<Partial<CompanyDataType>>("/api/company/companies/current", {
    method: 'get',
  })
}

export async function updateDeviceConnectionByCompanyId(companyId: string, deviceConnection: Partial<DeviceConnectionDataType>) {
  return request("/api/company/deviceConnections/" + companyId, {
    method: 'put',
    data: deviceConnection
  })
}

export async function getDeviceConnectionByCompanyId(companyId: string) {
  return request<Partial<DeviceConnectionDataType>>("/api/company/deviceConnections/" + companyId, {
    method: 'get',
  })
}

export async function getCurrentCompanyDeviceConnection() {
  return request<Partial<DeviceConnectionDataType>>("/api/company/deviceConnections/currentCompany", {
    method: 'get',
  })
}
