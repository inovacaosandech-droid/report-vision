import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/services/api';
import { GenerateReportRequest } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';

export function useReportsList() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.listReports(),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useGenerateMonthlyReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: GenerateReportRequest) => 
      reportsApi.generateMonthlyReport(params),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Relatório gerado com sucesso!',
          description: `${data.recordCount} registros processados.`,
        });
        queryClient.invalidateQueries({ queryKey: ['reports'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao gerar relatório',
          description: data.errorMessage || 'Ocorreu um erro inesperado.',
        });
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar relatório',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
      });
    },
  });
}

export function useGeneratePeriodicReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => reportsApi.generatePeriodicReport(),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Relatório periódico gerado!',
          description: `${data.recordCount} registros processados.`,
        });
        queryClient.invalidateQueries({ queryKey: ['reports'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao gerar relatório',
          description: data.errorMessage || 'Ocorreu um erro inesperado.',
        });
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar relatório',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
      });
    },
  });
}

export function useDownloadReport() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fileName: string) => reportsApi.downloadReport(fileName),
    onSuccess: () => {
      toast({
        title: 'Download iniciado',
        description: 'O arquivo está sendo baixado.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: error instanceof Error ? error.message : 'Não foi possível baixar o arquivo.',
      });
    },
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => reportsApi.healthCheck(),
    staleTime: 60000, // 1 minute
    retry: 1,
  });
}
