import { AlertTriangle } from 'lucide-react';
import { reportsApi } from '@/services/api';

export function DemoBanner() {
  if (!reportsApi.isDemoMode()) return null;

  return (
    <div 
      role="alert"
      className="bg-amber-50 border-b border-amber-200 px-4 py-2"
    >
      <div className="container flex items-center gap-2 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <strong>Modo Demonstração:</strong> Exibindo dados simulados. 
          Configure <code className="rounded bg-amber-100 px-1">VITE_API_URL</code> para conectar à API real.
        </p>
      </div>
    </div>
  );
}
