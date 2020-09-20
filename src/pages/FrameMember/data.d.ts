export interface FrameMemberDataType {
  id: string;
  name: string;
  projectId: string;
  progress: number;
  typeId: string;
  description: string;
}
export interface FrameMemberQueryParamsDataType {
  projectId: string;
  current: number;
  pageSize: number;
}
