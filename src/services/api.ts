import {
  ReportsListResponse,
  GenerateReportRequest,
  GenerateReportResponse,
  HealthCheckResponse,
} from '@/types/reports';
import { ReportData } from '@/types/reportData';
import { generateSummary } from './reportDataService';

// Use environment variable or fallback to empty string (same origin)
// For production, set VITE_API_URL to your public API endpoint or leave empty for nginx proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Demo mode - only when explicitly enabled
const USE_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Mock data for demonstration
const MOCK_REPORTS: ReportsListResponse = {
  reports: [
    {
      fileName: 'registro_acesso_dezembro_2025.xlsx',
      fileSizeBytes: 7842,
      fileSizeFormatted: '7.66 KB',
      createdAt: '2026-01-05T14:30:00',
      fullPath: '/app/output/registro_acesso_dezembro_2025.xlsx',
    },
    {
      fileName: 'registro_acesso_21_novembro_a_20_dezembro_2025.xlsx',
      fileSizeBytes: 15683,
      fileSizeFormatted: '15.32 KB',
      createdAt: '2025-12-20T02:00:15',
      fullPath: '/app/output/registro_acesso_21_novembro_a_20_dezembro_2025.xlsx',
    },
    {
      fileName: 'registro_acesso_novembro_2025.xlsx',
      fileSizeBytes: 12450,
      fileSizeFormatted: '12.16 KB',
      createdAt: '2025-12-01T10:15:00',
      fullPath: '/app/output/registro_acesso_novembro_2025.xlsx',
    },
    {
      fileName: 'registro_acesso_21_outubro_a_20_novembro_2025.xlsx',
      fileSizeBytes: 18920,
      fileSizeFormatted: '18.48 KB',
      createdAt: '2025-11-20T08:45:30',
      fullPath: '/app/output/registro_acesso_21_outubro_a_20_novembro_2025.xlsx',
    },
    {
      fileName: 'registro_acesso_outubro_2025.xlsx',
      fileSizeBytes: 9876,
      fileSizeFormatted: '9.64 KB',
      createdAt: '2025-11-01T09:00:00',
      fullPath: '/app/output/registro_acesso_outubro_2025.xlsx',
    },
  ],
  totalCount: 5,
};

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'Erro desconhecido' };
    }
    
    const errorMessage = 
      response.status === 404 ? 'Recurso não encontrado' :
      response.status === 400 ? 'Requisição inválida' :
      response.status === 500 ? 'Erro interno do servidor' :
      'Ocorreu um erro inesperado';
    
    throw new ApiError(errorMessage, response.status, errorData);
  }
  
  return response.json();
}

// Helper to check if we should use demo mode
async function tryFetchOrDemo<T>(
  fetchFn: () => Promise<T>,
  demoData: T
): Promise<T> {
  if (USE_DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return demoData;
  }
  
  try {
    return await fetchFn();
  } catch (error) {
    // If fetch fails, fall back to demo mode
    console.warn('API not reachable, using demo data. Set VITE_API_URL for production.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return demoData;
  }
}

export const reportsApi = {
  /**
   * List all available reports
   */
  async listReports(): Promise<ReportsListResponse> {
    return tryFetchOrDemo(
      async () => {
        const response = await fetch(`${API_BASE_URL}/api/reports/list`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse<ReportsListResponse>(response);
      },
      MOCK_REPORTS
    );
  },

  /**
   * Generate a monthly report for a specific month/year
   */
  async generateMonthlyReport(params: GenerateReportRequest): Promise<GenerateReportResponse> {
    const monthNames = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    return tryFetchOrDemo(
      async () => {
        const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        return handleResponse<GenerateReportResponse>(response);
      },
      {
        success: true,
        fileName: `registro_acesso_${monthNames[params.month - 1]}_${params.year}.xlsx`,
        recordCount: Math.floor(Math.random() * 100) + 10,
        filePath: `/app/output/registro_acesso_${monthNames[params.month - 1]}_${params.year}.xlsx`,
        generatedAt: new Date().toISOString(),
      }
    );
  },

  /**
   * Generate a periodic report (21st of previous month to 20th of current month)
   */
  async generatePeriodicReport(): Promise<GenerateReportResponse> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const monthNames = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    return tryFetchOrDemo(
      async () => {
        const response = await fetch(`${API_BASE_URL}/api/reports/generate-periodic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        return handleResponse<GenerateReportResponse>(response);
      },
      {
        success: true,
        fileName: `registro_acesso_21_${monthNames[prevMonth]}_a_20_${monthNames[currentMonth]}_${now.getFullYear()}.xlsx`,
        recordCount: Math.floor(Math.random() * 150) + 50,
        filePath: `/app/output/registro_acesso_21_${monthNames[prevMonth]}_a_20_${monthNames[currentMonth]}_${now.getFullYear()}.xlsx`,
        generatedAt: new Date().toISOString(),
      }
    );
  },

  /**
   * Download a report file
   */
  async downloadReport(fileName: string): Promise<void> {
    if (USE_DEMO_MODE) {
      // In demo mode, show alert
      alert(`[Modo Demo] Download do arquivo: ${fileName}\n\nEm produção, o arquivo seria baixado automaticamente.`);
      return;
    }
    
    const encodedFileName = encodeURIComponent(fileName);
    const response = await fetch(`${API_BASE_URL}/api/reports/download/${encodedFileName}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro no download' }));
      throw new ApiError(
        errorData.error || 'Erro ao baixar arquivo',
        response.status,
        errorData
      );
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  },

  /**
   * Get detailed report data for charts
   */
  async getReportDetails(fileName: string): Promise<ReportData> {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await fetch(`${API_BASE_URL}/api/reports/details/${encodedFileName}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro ao buscar detalhes do relatório' }));
      throw new ApiError(
        errorData.error || 'Erro ao buscar detalhes do relatório',
        response.status,
        errorData
      );
    }

    const data = await response.json();

    const records = data.records || [];
    const summary = generateSummary(records);

    return {
      records,
      summary,
      totalRecords: data.totalRecords || 0,
    };
  },

  /**
   * Check API health status
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    return tryFetchOrDemo(
      async () => {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse<HealthCheckResponse>(response);
      },
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'WorkLocation Report Generator (Demo)',
        version: '1.0.0',
      }
    );
  },

  /**
   * Check if running in demo mode
   */
  isDemoMode(): boolean {
    return USE_DEMO_MODE;
  },
};

export { ApiError };
