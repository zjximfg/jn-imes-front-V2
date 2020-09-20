export interface DevicePropertyDataType {
  id: string;
  templateId: string;
  name: string;
  variableAddress: string;
  variableType: 'string' | 'integer' | 'unsigned' | 'boolean' | 'float';
  category: 1 | 2;
  description: string;
  value?: string;
  time?: string;
}


export interface DevicePropertyQueryParamsDataType {
  templateId: string;
  category: number;
  current: number;
  pageSize: number;
}
