import { request } from 'umi';
import {CurrentUserDataType} from "@/pages/user/data";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<CurrentUserDataType>('/api/system/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
