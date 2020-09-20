export interface DeviceDataType {
  id: string;
  companyId: string;
  name: string;
  code: string;
  usage: string;
  function: string;
  supplierId: string;
  templateId: string;
  gatewayId: string;
  description: string;
}

export interface DeviceQueryParamsDataType {
  current: number;
  pageSize: number;
  key?: string;
}


export interface InfluxDataType {
  host: string;
  topic: string;
  time: string;
  value: string;
}

export interface MqttResultDataType {
  id: string;
  value: string;
  time: string;
}

