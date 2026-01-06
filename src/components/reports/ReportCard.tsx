import { FileSpreadsheet, Calendar, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadButton } from './DownloadButton';
import { Report, getReportType, formatReportDate } from '@/types/reports';

interface ReportCardProps {
  report: Report;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ReportCard({ report, isSelected, onClick }: ReportCardProps) {
  const reportType = getReportType(report.fileName);
  const formattedDate = formatReportDate(report.createdAt);

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 animate-slide-up
        hover:border-primary hover:shadow-md
        ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : ''}
      `}
      onClick={onClick}
      role="article"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base font-medium">
                {report.fileName}
              </CardTitle>
            </div>
          </div>
          <Badge 
            variant={reportType === 'periodic' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {reportType === 'periodic' ? 'Periódico' : 'Mensal'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Criado em: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-4 w-4" aria-hidden="true" />
            <span>Tamanho: {report.fileSizeFormatted}</span>
          </div>
        </div>
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DownloadButton fileName={report.fileName} />
        </div>
      </CardContent>
    </Card>
  );
}
