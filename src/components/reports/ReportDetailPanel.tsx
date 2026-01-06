import { useMemo } from 'react';
import { X, FileSpreadsheet, Users, AlertTriangle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Report, getReportType, formatReportDate } from '@/types/reports';
import { Badge } from '@/components/ui/badge';
import { DownloadButton } from '@/components/reports/DownloadButton';
import { WorkModeChart } from '@/components/charts/WorkModeChart';
import { DailyAccessChart } from '@/components/charts/DailyAccessChart';
import { UserAccessChart } from '@/components/charts/UserAccessChart';
import { ValidationStatusChart } from '@/components/charts/ValidationStatusChart';
import { NetworkClassificationChart } from '@/components/charts/NetworkClassificationChart';
import {
  getReportData,
  getWorkModeDistribution,
  getDailyAccessTrend,
  getUserAccessRanking,
  getValidationStatusDistribution,
  getNetworkClassificationDistribution,
} from '@/services/reportDataService';

interface ReportDetailPanelProps {
  report: Report;
  onClose: () => void;
}

export function ReportDetailPanel({ report, onClose }: ReportDetailPanelProps) {
  const reportType = getReportType(report.fileName);
  const formattedDate = formatReportDate(report.createdAt);
  
  // Generate report data (in real app, this would come from an API)
  const reportData = useMemo(() => getReportData(report.fileName), [report.fileName]);
  
  // Prepare chart data
  const workModeData = useMemo(() => getWorkModeDistribution(reportData), [reportData]);
  const dailyAccessData = useMemo(() => getDailyAccessTrend(reportData), [reportData]);
  const userAccessData = useMemo(() => getUserAccessRanking(reportData), [reportData]);
  const validationData = useMemo(() => getValidationStatusDistribution(reportData), [reportData]);
  const networkData = useMemo(() => getNetworkClassificationDistribution(reportData), [reportData]);

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
