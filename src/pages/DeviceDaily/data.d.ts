export interface DeviceDailyDataType {
  id: string;
  deviceId: string;
  statusStopHour: number;
  statusAwaitHour: number;
  statusFaultHour: number;
  statusRunHour: number;
  yieldSummary: number;
  date: string;
}

