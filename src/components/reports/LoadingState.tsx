import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 
        className="h-10 w-10 animate-spin text-primary" 
        aria-hidden="true"
      />
      <p className="text-muted-foreground">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
