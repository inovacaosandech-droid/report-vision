import {
  ReportsListResponse,
  GenerateReportRequest,
  GenerateReportResponse,
  HealthCheckResponse,
} from '@/types/reports';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

export const reportsApi = {
  /**
   * List all available reports
   */
  async listReports(): Promise<ReportsListResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reports/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<ReportsListResponse>(response);
  },

  /**
   * Generate a monthly report for a specific month/year
   */
  async generateMonthlyReport(params: GenerateReportRequest): Promise<GenerateReportResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return handleResponse<GenerateReportResponse>(response);
  },

  /**
   * Generate a periodic report (21st of previous month to 20th of current month)
   */
  async generatePeriodicReport(): Promise<GenerateReportResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate-periodic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    return handleResponse<GenerateReportResponse>(response);
  },

  /**
   * Download a report file
   */
  async downloadReport(fileName: string): Promise<void> {
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
   * Check API health status
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<HealthCheckResponse>(response);
  },
};

export { ApiError };
