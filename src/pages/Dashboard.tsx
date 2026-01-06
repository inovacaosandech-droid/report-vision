import { useState, useMemo } from 'react';
import { FileSpreadsheet, FileText, Clock, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingState } from '@/components/reports/LoadingState';
import { EmptyState } from '@/components/reports/EmptyState';
import { ErrorState } from '@/components/reports/ErrorState';
import { ReportCard } from '@/components/reports/ReportCard';
import { StatsCard } from '@/components/reports/StatsCard';
import { GenerateReportDialog } from '@/components/reports/GenerateReportDialog';
import { ReportTypeFilter, FilterType } from '@/components/reports/ReportTypeFilter';
import { Button } from '@/components/ui/button';
import { useReportsList, useGeneratePeriodicReport } from '@/hooks/useReports';
import { getReportType, Report } from '@/types/reports';

export default function Dashboard() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const { data, isLoading, isError, refetch } = useReportsList();
  const generatePeriodicMutation = useGeneratePeriodicReport();

  const reports = data?.reports ?? [];

  // Sort reports by date (newest first)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reports]);

  // Filter reports by type
  const filteredReports = useMemo(() => {
    if (filter === 'all') return sortedReports;
    return sortedReports.filter(r => getReportType(r.fileName) === filter);
  }, [sortedReports, filter]);

  // Calculate counts for filters
  const counts = useMemo(() => {
    const monthly = reports.filter(r => getReportType(r.fileName) === 'monthly').length;
    const periodic = reports.filter(r => getReportType(r.fileName) === 'periodic').length;
    return {
      all: reports.length,
      monthly,
      periodic,
    };
  }, [reports]);

  // Get selected report details
  const selectedReportData = useMemo(() => {
    return reports.find(r => r.fileName === selectedReport);
  }, [reports, selectedReport]);

  // Get latest report date
  const latestReportDate = useMemo(() => {
    if (sortedReports.length === 0) return null;
    return new Date(sortedReports[0].createdAt).toLocaleDateString('pt-BR');
  }, [sortedReports]);

  const handleGeneratePeriodic = () => {
    generatePeriodicMutation.mutate();
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie e visualize os relatórios de acesso do WorkLocation.
          </p>
        </header>

        {isLoading ? (
          <LoadingState message="Carregando relatórios..." />
        ) : isError ? (
          <ErrorState
            title="Erro ao carregar relatórios"
            message="Não foi possível conectar ao servidor. Verifique se a API está disponível."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {/* Stats Section */}
            <section aria-label="Estatísticas" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                icon={<FileSpreadsheet className="h-6 w-6 text-primary" />}
                label="Total de Relatórios"
                value={reports.length}
                description="Relatórios disponíveis"
              />
              <StatsCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                label="Relatórios Mensais"
                value={counts.monthly}
                description={`${counts.periodic} periódicos`}
              />
              <StatsCard
                icon={<Clock className="h-6 w-6 text-primary" />}
                label="Último Relatório"
                value={latestReportDate || 'N/A'}
                description="Data de criação"
              />
            </section>

            {/* Actions Bar */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <ReportTypeFilter
                value={filter}
                onChange={setFilter}
                counts={counts}
              />
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleGeneratePeriodic}
                  disabled={generatePeriodicMutation.isPending}
                  className="gap-2"
                >
                  {generatePeriodicMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Relatório Periódico'
                  )}
                </Button>
                <GenerateReportDialog />
              </div>
            </section>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <EmptyState
                title={filter === 'all' ? 'Nenhum relatório disponível' : `Nenhum relatório ${filter === 'monthly' ? 'mensal' : 'periódico'}`}
                description={filter === 'all' 
                  ? 'Não há relatórios gerados. Clique em um dos botões acima para gerar seu primeiro relatório.'
                  : 'Não há relatórios deste tipo. Tente mudar o filtro ou gerar um novo relatório.'
                }
              />
            ) : (
              <section aria-label="Lista de relatórios">
                <h2 className="sr-only">Relatórios disponíveis</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredReports.map((report, index) => (
                    <div 
                      key={report.fileName}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ReportCard
                        report={report}
                        isSelected={selectedReport === report.fileName}
                        onClick={() => setSelectedReport(
                          selectedReport === report.fileName ? null : report.fileName
                        )}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
