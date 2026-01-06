import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Nenhum relatório disponível',
  description = 'Não há relatórios gerados no momento. Gere um novo relatório para começar.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-card p-12 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
