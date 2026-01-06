import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um erro ao conectar com o servidor. Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert 
      variant="destructive" 
      className="animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-5 w-5" aria-hidden="true" />
      <AlertTitle className="text-lg">{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-fit border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
