// Extended types for report data visualization

export interface ReportRecord {
  username: string;
  workMode: 'home' | 'presencial';
  networkClassification: 'internal' | 'external' | 'vpn';
  validationStatus: 'ok' | 'mismatch';
  sourceIP: string;
  machineName: string;
  createdAt: string;
}

export interface ReportSummary {
  username: string;
  homeCount: number;
  presencialCount: number;
  total: number;
}

export interface ReportData {
  records: ReportRecord[];
  summary: ReportSummary[];
  totalRecords: number;
}

// Chart data types
export interface WorkModeChartData {
  name: string;
  value: number;
  fill: string;
}

export interface DailyAccessData {
  date: string;
  acessos: number;
  home: number;
  presencial: number;
}

export interface UserAccessData {
  username: string;
  total: number;
  home: number;
  presencial: number;
}

export interface ValidationStatusData {
  name: string;
  value: number;
  fill: string;
}

export interface NetworkClassificationData {
  name: string;
  value: number;
  fill: string;
}
