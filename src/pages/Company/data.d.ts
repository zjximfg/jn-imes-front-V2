export interface CompanyDataType {
  id: string;
  name: string;  //公司名称
  managerId: string; //企业登录账号ID
  liaison: string;
  version: string; //当前版本
  renewalDate: string;  //续期时间
  expirationDate: string //到期时间
  companyArea: string;  //公司地区
  businessLicenseId: string; // 营业执照-图片ID
  legalRepresentative: string;   //法人代表
  companyPhone: string;  //公司电话
  mailbox: string;  // 邮箱
  companySize: string;    // 公司规模
  industry: string;     //所属行业
  remarks: string;      //备注
  auditState: string;  //审核状态
  state: number;    //状态 激活不激活
  balance: number;    //当前余额
  createTime: string    //创建时间
}


export interface DeviceConnectionDataType {
  companyId: string;
  influxIp: string;
  influxPort: number;
  influxRetentionPolicy: string;
  influxDataBase: string;
  mqttServiceIp: string;
  mqttServicePort: number;
}
