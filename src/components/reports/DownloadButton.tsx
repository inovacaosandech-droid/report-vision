import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDownloadReport } from '@/hooks/useReports';

interface DownloadButtonProps {
  fileName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function DownloadButton({ 
  fileName, 
  variant = 'outline',
  size = 'sm',
  showLabel = true 
}: DownloadButtonProps) {
  const downloadMutation = useDownloadReport();
  const isDownloading = downloadMutation.isPending;

  const handleDownload = () => {
    if (!fileName.endsWith('.xlsx')) {
      console.error('Invalid file extension');
      return;
    }
    downloadMutation.mutate(fileName);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={`Baixar relatório ${fileName}`}
      className="gap-2"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {showLabel && <span>Baixando...</span>}
        </>
      ) : (
        <>
          <Download className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span>Baixar</span>}
        </>
      )}
    </Button>
  );
}
