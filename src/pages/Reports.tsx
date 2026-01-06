import { useMemo } from 'react';
import { FileSpreadsheet, Calendar, HardDrive } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingState } from '@/components/reports/LoadingState';
import { EmptyState } from '@/components/reports/EmptyState';
import { ErrorState } from '@/components/reports/ErrorState';
import { DownloadButton } from '@/components/reports/DownloadButton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReportsList } from '@/hooks/useReports';
import { getReportType, formatReportDate } from '@/types/reports';

export default function Reports() {
  const { data, isLoading, isError, refetch } = useReportsList();

  const reports = data?.reports ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Sort reports by date (newest first)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reports]);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="mt-2 text-muted-foreground">
            Lista de todos os relatórios disponíveis para download.
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
        ) : reports.length === 0 ? (
          <EmptyState
            title="Nenhum relatório disponível"
            description="Não há relatórios gerados no momento. Acesse o Dashboard para gerar novos relatórios."
          />
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileSpreadsheet className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCount}</p>
                <p className="text-sm text-muted-foreground">
                  {totalCount === 1 ? 'relatório disponível' : 'relatórios disponíveis'}
                </p>
              </div>
            </div>

            {/* Reports Table */}
            <div className="rounded-lg border bg-card shadow-sm animate-slide-up">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Nome do Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        Data de Criação
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="h-4 w-4" aria-hidden="true" />
                        Tamanho
                      </span>
                    </TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReports.map((report) => {
                    const reportType = getReportType(report.fileName);
                    const formattedDate = formatReportDate(report.createdAt);

                    return (
                      <TableRow key={report.fileName}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet 
                              className="h-5 w-5 shrink-0 text-primary" 
                              aria-hidden="true" 
                            />
                            <span className="truncate">{report.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={reportType === 'periodic' ? 'default' : 'secondary'}
                          >
                            {reportType === 'periodic' ? 'Periódico' : 'Mensal'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formattedDate}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {report.fileSizeFormatted}
                        </TableCell>
                        <TableCell className="text-right">
                          <DownloadButton fileName={report.fileName} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
