// Report types based on API_DOCUMENTATION.md

export interface Report {
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  createdAt: string;
  fullPath: string;
}

export interface ReportsListResponse {
  reports: Report[];
  totalCount: number;
}

export interface GenerateReportRequest {
  month: number;
  year: number;
}

export interface GenerateReportResponse {
  success: boolean;
  fileName: string | null;
  recordCount: number;
  filePath: string | null;
  generatedAt: string;
  errorMessage?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  error?: string;
}

export interface ApiError {
  error: string;
  fileName?: string;
}

// Utility type to determine report type from filename
export type ReportType = 'monthly' | 'periodic';

export function getReportType(fileName: string): ReportType {
  return fileName.includes('21_') ? 'periodic' : 'monthly';
}

export function formatReportDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
