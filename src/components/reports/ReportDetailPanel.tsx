import { X, FileSpreadsheet, Users, AlertTriangle, Wifi, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Report, getReportType, formatReportDate } from '@/types/reports';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DownloadButton } from '@/components/reports/DownloadButton';
import { WorkModeChart } from '@/components/charts/WorkModeChart';
import { DailyAccessChart } from '@/components/charts/DailyAccessChart';
import { UserAccessChart } from '@/components/charts/UserAccessChart';
import { ValidationStatusChart } from '@/components/charts/ValidationStatusChart';
import { NetworkClassificationChart } from '@/components/charts/NetworkClassificationChart';
import {
  getWorkModeDistribution,
  getDailyAccessTrend,
  getUserAccessRanking,
  getValidationStatusDistribution,
  getNetworkClassificationDistribution,
} from '@/services/reportDataService';
import { reportsApi } from '@/services/api';

interface ReportDetailPanelProps {
  report: Report;
  onClose: () => void;
}

export function ReportDetailPanel({ report, onClose }: ReportDetailPanelProps) {
  const reportType = getReportType(report.fileName);
  const formattedDate = formatReportDate(report.createdAt);

  // Fetch real report data from API
  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['reportDetails', report.fileName],
    queryFn: () => reportsApi.getReportDetails(report.fileName),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Carregando dados do relatório...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !reportData) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os dados do relatório. Tente novamente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const workModeData = getWorkModeDistribution(reportData);
  const dailyAccessData = getDailyAccessTrend(reportData);
  const userAccessData = getUserAccessRanking(reportData);
  const validationData = getValidationStatusDistribution(reportData);
  const networkData = getNetworkClassificationDistribution(reportData);

  // Calculate summary stats
  const mismatchCount = reportData.records.filter(r => r.validationStatus === 'mismatch').length;
  const uniqueUsers = new Set(reportData.records.map(r => r.username)).size;

  return (
    <div className="animate-fade-in rounded-lg border bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileSpreadsheet className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{report.fileName}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={reportType === 'periodic' ? 'default' : 'secondary'}>
                {reportType === 'periodic' ? 'Periódico' : 'Mensal'}
              </Badge>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{report.fileSizeFormatted}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DownloadButton fileName={report.fileName} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar painel de detalhes"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 border-b p-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold">{reportData.totalRecords}</p>
            <p className="text-xs text-muted-foreground">Registros</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold">{uniqueUsers}</p>
            <p className="text-xs text-muted-foreground">Usuários</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <AlertTriangle className={`h-5 w-5 ${mismatchCount > 0 ? 'text-destructive' : 'text-green-600'}`} />
          <div>
            <p className="text-2xl font-bold">{mismatchCount}</p>
            <p className="text-xs text-muted-foreground">Divergências</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Wifi className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold">
              {reportData.records.filter(r => r.networkClassification === 'vpn').length}
            </p>
            <p className="text-xs text-muted-foreground">Acessos VPN</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Daily Access Chart - spans 2 columns */}
          <DailyAccessChart data={dailyAccessData} />
          
          {/* Work Mode Distribution */}
          <WorkModeChart data={workModeData} />
          
          {/* User Access Ranking */}
          <UserAccessChart data={userAccessData} />
          
          {/* Validation Status */}
          <ValidationStatusChart data={validationData} />
          
          {/* Network Classification */}
          <NetworkClassificationChart data={networkData} />
        </div>
      </div>
    </div>
  );
}
